import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';

export interface LearningResource {
  id: string;
  title: string;
  description: string;
  type: string;
  url: string;
  tags: string[];
  difficulty_level: string;
  created_at: string;
}

export interface UserLearningProgress {
  resource_id: string;
  status: string;
  progress: number;
  completed_at: string | null;
  last_interaction_at: string;
}

export function useLearning() {
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [userProgress, setUserProgress] = useState<Record<string, UserLearningProgress>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLearningResources();
  }, []);

  async function fetchLearningResources() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }

      // Fetch all learning resources
      const { data: resourcesData, error: resourcesError } = await supabase
        .from('learning_resources')
        .select('*')
        .order('created_at', { ascending: false });

      if (resourcesError) throw resourcesError;

      // Fetch user's learning progress
      const { data: progressData, error: progressError } = await supabase
        .from('user_learning_progress')
        .select('*')
        .eq('user_id', user.id);

      if (progressError) throw progressError;

      setResources(resourcesData);
      
      // Convert progress array to record for easier lookup
      const progressRecord = progressData.reduce((acc, progress) => ({
        ...acc,
        [progress.resource_id]: progress
      }), {});
      
      setUserProgress(progressRecord);
    } catch (error) {
      console.error('Error fetching learning resources:', error);
      toast.error('Failed to load learning resources');
    } finally {
      setLoading(false);
    }
  }

  async function updateLearningProgress(resourceId: string, updates: Partial<UserLearningProgress>) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('No user logged in');
      }

      const { error } = await supabase
        .from('user_learning_progress')
        .upsert({
          user_id: user.id,
          resource_id: resourceId,
          last_interaction_at: new Date().toISOString(),
          ...updates
        });

      if (error) throw error;

      setUserProgress(prev => ({
        ...prev,
        [resourceId]: {
          ...prev[resourceId],
          ...updates,
          resource_id: resourceId,
          last_interaction_at: new Date().toISOString()
        }
      }));

      toast.success('Atualizado com sucesso');
    } catch (error) {
      console.error('Error updating learning progress:', error);
      toast.error('Falha ao atualizar');
    }
  }

  return {
    resources,
    userProgress,
    loading,
    updateLearningProgress,
  };
}