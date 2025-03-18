import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import {
  generateCareerTips,
  generateCommunityRecommendations,
  generateLearningResources,
  type CareerTipGeneration,
  type CommunityRecommendation,
  type LearningResourceRecommendation
} from './ai';
import { getProfile } from './profile';

export async function getPersonalizedCareerTips(): Promise<CareerTipGeneration[]> {
  try {
    const profile = await getProfile();
    if (!profile) {
      throw new Error('Profile not found');
    }

    // First try to get existing tips from Supabase
    const { data: existingTips, error: fetchError } = await supabase
      .from('career_tips')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(3);

    if (fetchError) throw fetchError;

    // If we have tips, return them
    if (existingTips && existingTips.length > 0) {
      return existingTips;
    }

    // If no tips exist, generate new ones
    return await generateCareerTips(profile);
  } catch (error) {
    console.error('Error getting career tips:', error);
    toast.error('Erro ao obter dicas de carreira');
    return [];
  }
}

export async function getPersonalizedCommunities(): Promise<CommunityRecommendation[]> {
  try {
    const profile = await getProfile();
    if (!profile) {
      throw new Error('Profile not found');
    }

    // First try to get existing communities from Supabase
    const { data: existingCommunities, error: fetchError } = await supabase
      .from('communities')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(3);

    if (fetchError) throw fetchError;

    // If we have communities, return them
    if (existingCommunities && existingCommunities.length > 0) {
      return existingCommunities;
    }

    // If no communities exist, generate new ones
    return await generateCommunityRecommendations(profile);
  } catch (error) {
    console.error('Error getting communities:', error);
    toast.error('Erro ao obter recomendações de comunidades');
    return [];
  }
}

export async function getPersonalizedLearningResources(): Promise<LearningResourceRecommendation[]> {
  try {
    const profile = await getProfile();
    if (!profile) {
      throw new Error('Profile not found');
    }

    // First try to get existing resources from Supabase
    const { data: existingResources, error: fetchError } = await supabase
      .from('learning_resources')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(3);

    if (fetchError) throw fetchError;

    // If we have resources, return them
    if (existingResources && existingResources.length > 0) {
      return existingResources;
    }

    // If no resources exist, generate new ones
    return await generateLearningResources(profile);
  } catch (error) {
    console.error('Error getting learning resources:', error);
    toast.error('Erro ao obter recomendações de conteúdo');
    return [];
  }
}