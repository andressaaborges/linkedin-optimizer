import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';

export interface Community {
  id: string;
  name: string;
  description: string;
  focus_area: string;
  join_url: string;
  tags: string[];
  created_at: string;
}

export interface UserCommunity {
  community_id: string;
  is_interested: boolean;
  has_joined: boolean;
  status: string;
  last_interaction_at: string;
}

export function useCommunities() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [userCommunities, setUserCommunities] = useState<Record<string, UserCommunity>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCommunities();
  }, []);

  async function fetchCommunities() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }

      // Fetch all communities
      const { data: communitiesData, error: communitiesError } = await supabase
        .from('communities')
        .select('*')
        .order('created_at', { ascending: false });

      if (communitiesError) throw communitiesError;

      // Fetch user's community interactions
      const { data: userCommunitiesData, error: userCommunitiesError } = await supabase
        .from('user_communities')
        .select('*')
        .eq('user_id', user.id);

      if (userCommunitiesError) throw userCommunitiesError;

      setCommunities(communitiesData);
      
      // Convert user communities array to record for easier lookup
      const userCommunitiesRecord = userCommunitiesData.reduce((acc, community) => ({
        ...acc,
        [community.community_id]: community
      }), {});
      
      setUserCommunities(userCommunitiesRecord);
    } catch (error) {
      console.error('Error fetching communities:', error);
      toast.error('Failed to load communities');
    } finally {
      setLoading(false);
    }
  }

  async function updateCommunityInteraction(communityId: string, updates: Partial<UserCommunity>) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('No user logged in');
      }

      const { error } = await supabase
        .from('user_communities')
        .upsert({
          user_id: user.id,
          community_id: communityId,
          last_interaction_at: new Date().toISOString(),
          ...updates
        });

      if (error) throw error;

      setUserCommunities(prev => ({
        ...prev,
        [communityId]: {
          ...prev[communityId],
          ...updates,
          community_id: communityId,
          last_interaction_at: new Date().toISOString()
        }
      }));

      toast.success('Status de comunidade atualizado com sucesso');
    } catch (error) {
      console.error('Error updating community interaction:', error);
      toast.error('Falha ao atualizar status de comunidade');
    }
  }

  return {
    communities,
    userCommunities,
    loading,
    updateCommunityInteraction,
  };
}