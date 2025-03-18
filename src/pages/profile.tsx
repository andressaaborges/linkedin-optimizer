import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useProfile } from '@/lib/hooks/use-profile';
import { X, Plus, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { supabase } from '@/lib/supabase';
import type { Profile } from '@/services/profile';

export default function ProfilePage() {
  const { profile, loading, updateProfile } = useProfile();
  const [newSkill, setNewSkill] = useState('');
  const [newGoal, setNewGoal] = useState('');
  const [newInterest, setNewInterest] = useState('');
  const [formData, setFormData] = useState<Omit<Profile, 'id' | 'updated_at' | 'profile_completion_score' | 'seo_optimization_score'>>({
    full_name: '',
    linkedin_url: '',
    job_role: '',
    career_goals: [],
    skills: [],
    interests: []
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        linkedin_url: profile.linkedin_url || '',
        job_role: profile.job_role || '',
        career_goals: profile.career_goals || [],
        skills: profile.skills || [],
        interests: profile.interests || []
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('Usuário não autenticado');
        return;
      }

      // Check if profile exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!existingProfile) {
        // Create new profile with form data
        const { error: createError } = await supabase
          .from('profiles')
          .insert([{
            id: user.id,
            ...formData,
            profile_completion_score: 0,
            seo_optimization_score: 0,
            updated_at: new Date().toISOString()
          }]);

        if (createError) {
          throw createError;
        }

        toast.success('Perfil criado com sucesso');
      } else {
        // Update existing profile
        await updateProfile(formData);
      }
    } catch (error) {
      console.error('Error handling profile submission:', error);
      toast.error('Erro ao salvar perfil');
    }
  };

  const addItem = (field: 'skills' | 'career_goals' | 'interests', value: string) => {
    if (!value.trim()) return;
    
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], value.trim()]
    }));

    // Reset the corresponding input
    switch (field) {
      case 'skills':
        setNewSkill('');
        break;
      case 'career_goals':
        setNewGoal('');
        break;
      case 'interests':
        setNewInterest('');
        break;
    }
  };

  const removeItem = (field: 'skills' | 'career_goals' | 'interests', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Seu Perfil</h1>
          <p className="mt-2 text-gray-600">
            Mantenha seu perfil atualizado para receber recomendações mais precisas
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                Nome Completo
              </label>
              <input
                type="text"
                id="full_name"
                value={formData.full_name || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="linkedin_url" className="block text-sm font-medium text-gray-700">
                URL do LinkedIn
              </label>
              <input
                type="url"
                id="linkedin_url"
                value={formData.linkedin_url || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, linkedin_url: e.target.value }))}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="job_role" className="block text-sm font-medium text-gray-700">
                Cargo Atual
              </label>
              <input
                type="text"
                id="job_role"
                value={formData.job_role || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, job_role: e.target.value }))}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Habilidades
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeItem('skills', index)}
                    className="ml-2 text-indigo-600 hover:text-indigo-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Adicionar habilidade"
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addItem('skills', newSkill);
                  }
                }}
              />
              <button
                type="button"
                onClick={() => addItem('skills', newSkill)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Career Goals */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Objetivos de Carreira
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.career_goals.map((goal, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                >
                  {goal}
                  <button
                    type="button"
                    onClick={() => removeItem('career_goals', index)}
                    className="ml-2 text-green-600 hover:text-green-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                placeholder="Adicionar objetivo"
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addItem('career_goals', newGoal);
                  }
                }}
              />
              <button
                type="button"
                onClick={() => addItem('career_goals', newGoal)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Interests */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interesses
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.interests.map((interest, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800"
                >
                  {interest}
                  <button
                    type="button"
                    onClick={() => removeItem('interests', index)}
                    className="ml-2 text-purple-600 hover:text-purple-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                placeholder="Adicionar interesse"
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addItem('interests', newInterest);
                  }
                }}
              />
              <button
                type="button"
                onClick={() => addItem('interests', newInterest)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <button
              type="submit"
              className="w-full flex justify-center items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <Save className="w-5 h-5 mr-2" />
              Salvar Perfil
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}