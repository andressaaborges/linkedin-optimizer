import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { getProfile, updateProfile, type Profile } from '@/services/profile';

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const data = await getProfile();
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateProfile(updates: Partial<Profile>) {
    try {
      const updatedProfile = await updateProfile(updates);
      if (updatedProfile) {
        setProfile(updatedProfile);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  }

  return {
    profile,
    loading,
    updateProfile: handleUpdateProfile,
    refreshProfile: fetchProfile,
  };
}