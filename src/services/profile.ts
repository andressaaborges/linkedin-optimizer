import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import { generateCareerTips, generateCommunityRecommendations, generateLearningResources } from './ai';

export interface Profile {
  id: string;
  full_name: string | null;
  linkedin_url: string | null;
  job_role: string | null;
  career_goals: string[] | null;
  skills: string[] | null;
  interests: string[] | null;
  profile_completion_score: number;
  seo_optimization_score: number;
  updated_at: string;
}

export async function getProfile(): Promise<Profile | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.log('No user found');
      return null;
    }

    console.log('Fetching profile for user:', user.id);

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.log('Error fetching profile:', error);
      return null;
    }

    console.log('Profile found:', profile);
    return profile;
  } catch (error) {
    console.error('Error in getProfile:', error);
    toast.error('Erro ao carregar perfil');
    return null;
  }
}

async function createProfile(userId: string, initialData?: Partial<Profile>): Promise<Profile | null> {
  try {
    console.log('Creating new profile for user:', userId);

    const initialProfile = {
      id: userId,
      full_name: initialData?.full_name || null,
      linkedin_url: initialData?.linkedin_url || null,
      job_role: initialData?.job_role || null,
      career_goals: initialData?.career_goals || [],
      skills: initialData?.skills || [],
      interests: initialData?.interests || [],
      profile_completion_score: 0,
      seo_optimization_score: 0,
      updated_at: new Date().toISOString()
    };

    // Create profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert([initialProfile])
      .select()
      .single();

    if (profileError) {
      console.error('Error creating profile:', profileError);
      throw profileError;
    }

    if (!profile) {
      throw new Error('Profile creation returned no data');
    }

    console.log('Profile created successfully:', profile);

    // Initialize user progress
    const { error: progressError } = await supabase
      .from('user_progress')
      .insert([{
        user_id: userId,
        profile_completion_percentage: calculateProfileCompleteness(profile),
        implemented_suggestions: 0,
        completed_resources: 0,
        joined_communities: 0,
        chat_interactions: 0,
        last_activity: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }]);

    if (progressError) {
      console.error('Error creating user progress:', progressError);
      throw progressError;
    }

    // Generate and store initial AI content
    await generateInitialAIContent(profile);

    return profile;
  } catch (error) {
    console.error('Error in createProfile:', error);
    toast.error('Erro ao criar perfil');
    return null;
  }
}

async function generateInitialAIContent(profile: Profile) {
  try {
    console.log('Generating initial AI content for profile:', profile.id);

    const [careerTips, communities, learningResources] = await Promise.all([
      generateCareerTips(profile),
      generateCommunityRecommendations(profile),
      generateLearningResources(profile)
    ]);

    const timestamp = new Date().toISOString();

    // Store career tips with user association
    if (careerTips.length > 0) {
      const { error: tipsError } = await supabase
        .from('career_tips')
        .insert(careerTips.map(tip => ({
          ...tip,
          user_id: profile.id,
          created_at: timestamp,
          updated_at: timestamp
        })));

      if (tipsError) {
        console.error('Error storing career tips:', tipsError);
        throw tipsError;
      }
    }

    // Store communities with user association
    if (communities.length > 0) {
      const { error: communitiesError } = await supabase
        .from('communities')
        .insert(communities.map(community => ({
          ...community,
          user_id: profile.id,
          created_at: timestamp,
          updated_at: timestamp
        })));

      if (communitiesError) {
        console.error('Error storing communities:', communitiesError);
        throw communitiesError;
      }
    }

    // Store learning resources with user association
    if (learningResources.length > 0) {
      const { error: resourcesError } = await supabase
        .from('learning_resources')
        .insert(learningResources.map(resource => ({
          ...resource,
          user_id: profile.id,
          created_at: timestamp,
          updated_at: timestamp
        })));

      if (resourcesError) {
        console.error('Error storing learning resources:', resourcesError);
        throw resourcesError;
      }
    }

    console.log('Initial AI content generated and stored successfully');
  } catch (error) {
    console.error('Error in generateInitialAIContent:', error);
    toast.error('Erro ao gerar recomendações iniciais');
  }
}

async function regenerateAIContent(profile: Profile) {
  try {
    console.log('Regenerating AI content for profile:', profile.id);

    const [careerTips, communities, learningResources] = await Promise.all([
      generateCareerTips(profile),
      generateCommunityRecommendations(profile),
      generateLearningResources(profile)
    ]);

    const timestamp = new Date().toISOString();

    // Update career tips
    if (careerTips.length > 0) {
      // First, delete existing tips for this user
      await supabase
        .from('career_tips')
        .delete()
        .eq('user_id', profile.id);

      // Then insert new ones
      const { error: tipsError } = await supabase
        .from('career_tips')
        .insert(careerTips.map(tip => ({
          ...tip,
          user_id: profile.id,
          created_at: timestamp,
          updated_at: timestamp
        })));

      if (tipsError) throw tipsError;
    }

    // Update communities
    if (communities.length > 0) {
      // First, delete existing communities for this user
      await supabase
        .from('communities')
        .delete()
        .eq('user_id', profile.id);

      // Then insert new ones
      const { error: communitiesError } = await supabase
        .from('communities')
        .insert(communities.map(community => ({
          ...community,
          user_id: profile.id,
          created_at: timestamp,
          updated_at: timestamp
        })));

      if (communitiesError) throw communitiesError;
    }

    // Update learning resources
    if (learningResources.length > 0) {
      // First, delete existing resources for this user
      await supabase
        .from('learning_resources')
        .delete()
        .eq('user_id', profile.id);

      // Then insert new ones
      const { error: resourcesError } = await supabase
        .from('learning_resources')
        .insert(learningResources.map(resource => ({
          ...resource,
          user_id: profile.id,
          created_at: timestamp,
          updated_at: timestamp
        })));

      if (resourcesError) throw resourcesError;
    }

    console.log('AI content regenerated successfully');
  } catch (error) {
    console.error('Error in regenerateAIContent:', error);
    toast.error('Erro ao atualizar recomendações');
  }
}

export async function updateProfile(updates: Partial<Profile>): Promise<Profile | null> {
  try {
    console.log('Starting profile update');

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('No user logged in');
    }

    // First, check if profile exists
    let profile = await getProfile();
    
    if (!profile) {
      // Create new profile with the provided updates
      console.log('No profile found, creating new one with data:', updates);
      profile = await createProfile(user.id, updates);
      if (!profile) throw new Error('Failed to create profile');
      return profile;
    }

    // Calculate completion score
    const completionScore = calculateProfileCompleteness({
      ...profile,
      ...updates
    });

    console.log('Updating profile with completion score:', completionScore);

    // Update profile with new data and completion score
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        profile_completion_score: completionScore,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      throw error;
    }

    // Update user progress
    const { error: progressError } = await supabase
      .from('user_progress')
      .upsert({
        user_id: user.id,
        profile_completion_percentage: completionScore,
        updated_at: new Date().toISOString()
      });

    if (progressError) {
      console.error('Error updating user progress:', progressError);
      throw progressError;
    }

    // Regenerate AI content based on updated profile
    await regenerateAIContent(data);

    console.log('Profile updated successfully');
    toast.success('Perfil atualizado com sucesso');
    return data;
  } catch (error) {
    console.error('Error in updateProfile:', error);
    toast.error('Erro ao atualizar perfil');
    return null;
  }
}

export function calculateProfileCompleteness(profile: Profile): number {
  const fields = [
    'full_name',
    'linkedin_url',
    'job_role',
    'career_goals',
    'skills',
    'interests'
  ];

  const filledFields = fields.filter(field => {
    const value = profile[field as keyof Profile];
    if (Array.isArray(value)) {
      return value && value.length > 0;
    }
    return value !== null && value !== '';
  });

  return Math.round((filledFields.length / fields.length) * 100);
}