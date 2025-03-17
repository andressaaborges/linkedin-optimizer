import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';

export interface UserProgress {
  profile_completion_percentage: number;
  implemented_suggestions: number;
  completed_resources: number;
  joined_communities: number;
  chat_interactions: number;
  last_activity: string;
}

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
  }, []);

  async function fetchProgress() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      setProgress(data);
    } catch (error) {
      console.error('Error fetching progress:', error);
      toast.error('Failed to load progress data');
    } finally {
      setLoading(false);
    }
  }

  return {
    progress,
    loading,
    refreshProgress: fetchProgress,
  };
}