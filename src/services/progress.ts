import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';

export interface UserProgress {
  user_id: string;
  profile_completion_percentage: number;
  implemented_suggestions: number;
  completed_resources: number;
  joined_communities: number;
  chat_interactions: number;
  last_activity: string;
  created_at: string;
  updated_at: string;
}

export async function getUserProgress(): Promise<UserProgress | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return null;
    }

    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error fetching user progress:', error);
    toast.error('Erro ao carregar progresso');
    return null;
  }
}

export async function updateUserProgress(updates: Partial<UserProgress>): Promise<UserProgress | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('No user logged in');
    }

    const { data, error } = await supabase
      .from('user_progress')
      .update(updates)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error updating user progress:', error);
    toast.error('Erro ao atualizar progresso');
    return null;
  }
}

export async function initializeUserProgress(userId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('user_progress')
      .insert([
        {
          user_id: userId,
          profile_completion_percentage: 0,
          implemented_suggestions: 0,
          completed_resources: 0,
          joined_communities: 0,
          chat_interactions: 0
        }
      ]);

    if (error) throw error;
  } catch (error) {
    console.error('Error initializing user progress:', error);
    toast.error('Erro ao inicializar progresso');
  }
}