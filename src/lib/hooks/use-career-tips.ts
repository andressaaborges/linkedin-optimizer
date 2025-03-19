import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';

export interface CareerTip {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  created_at: string;
}

export interface UserCareerTip {
  tip_id: string;
  is_helpful: boolean | null;
  is_implemented: boolean;
  feedback: string | null;
}

export function useCareerTips() {
  const [tips, setTips] = useState<CareerTip[]>([]);
  const [userTips, setUserTips] = useState<Record<string, UserCareerTip>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCareerTips();
  }, []);

  async function fetchCareerTips() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }

      // Fetch all career tips
      const { data: tipsData, error: tipsError } = await supabase
        .from('career_tips')
        .select('*')
        .order('created_at', { ascending: false });

      if (tipsError) throw tipsError;

      // Fetch user's interactions with tips
      const { data: userTipsData, error: userTipsError } = await supabase
        .from('user_career_tips')
        .select('*')
        .eq('user_id', user.id);

      if (userTipsError) throw userTipsError;

      setTips(tipsData);
      
      // Convert user tips array to record for easier lookup
      const userTipsRecord = userTipsData.reduce((acc, tip) => ({
        ...acc,
        [tip.tip_id]: tip
      }), {});
      
      setUserTips(userTipsRecord);
    } catch (error) {
      console.error('Error fetching career tips:', error);
      toast.error('Failed to load career tips');
    } finally {
      setLoading(false);
    }
  }

  async function updateTipInteraction(tipId: string, updates: Partial<UserCareerTip>) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('No user logged in');
      }

      const { error } = await supabase
        .from('user_career_tips')
        .upsert({
          user_id: user.id,
          tip_id: tipId,
          ...updates
        });

      if (error) throw error;

      setUserTips(prev => ({
        ...prev,
        [tipId]: {
          ...prev[tipId],
          ...updates,
          tip_id: tipId
        }
      }));

      toast.success('Atualizado com sucesso');
    } catch (error) {
      console.error('Error updating tip interaction:', error);
      toast.error('Falha ao atualizar');
    }
  }

  return {
    tips,
    userTips,
    loading,
    updateTipInteraction,
  };
}