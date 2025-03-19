import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useProfile } from '@/lib/hooks/use-profile';
import { useProgress } from '@/lib/hooks/use-progress';
import { Link } from 'react-router-dom';
import {
  UserCheck,
  MessageSquare,
  Users,
  BookOpen,
  GraduationCap,
  ArrowRight,
  Target
} from 'lucide-react';

export default function DashboardPage() {
  const { profile, loading: profileLoading } = useProfile();
  const { progress, loading: progressLoading } = useProgress();

  if (profileLoading || progressLoading) {
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Boas vindas{profile?.full_name ? `, ${profile.full_name}` : ''}!
          </h1>
          <p className="mt-2 text-gray-600">
            Acompanhe seu progresso e continue otimizando seu perfil profissional
          </p>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex flex-col-reverse gap-2 items-start justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Perfil</h3>
              <UserCheck className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="mb-2">
              <div className="flex justify-between text-sm mb-1">
                <span>Completude</span>
                <span>{progress?.profile_completion_percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full"
                  style={{ width: `${progress?.profile_completion_percentage}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex flex-col-reverse gap-2 items-start justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Chat IA</h3>
              <MessageSquare className="w-6 h-6 text-indigo-600" />
            </div>
            <p className="text-2xl font-semibold text-gray-900">
              {progress?.chat_interactions || 0}
            </p>
            <p className="text-sm text-gray-600">interações realizadas</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex flex-col-reverse gap-2 items-start justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Comunidades</h3>
              <Users className="w-6 h-6 text-indigo-600" />
            </div>
            <p className="text-2xl font-semibold text-gray-900">
              {progress?.joined_communities || 0}
            </p>
            <p className="text-sm text-gray-600">comunidades participando</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex flex-col-reverse gap-2 items-start justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Aprendizado</h3>
              <BookOpen className="w-6 h-6 text-indigo-600" />
            </div>
            <p className="text-2xl font-semibold text-gray-900">
              {progress?.completed_resources || 0}
            </p>
            <p className="text-sm text-gray-600">recursos completados</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex flex-col-reverse gap-2 items-start justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Carreira</h3>
              <Target className="w-6 h-6 text-indigo-600" />
            </div>
            <p className="text-2xl font-semibold text-gray-900">
              {progress?.implemented_suggestions || 0}
            </p>
            <p className="text-sm text-gray-600">dicas implementadas</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link
            to="/profile"
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:border-indigo-300 transition-colors group"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Complete seu Perfil</h3>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
            </div>
            <p className="text-gray-600">
              Mantenha seu perfil atualizado para receber recomendações mais precisas
            </p>
          </Link>

          <Link
            to="/chat"
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:border-indigo-300 transition-colors group"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Converse com a IA</h3>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
            </div>
            <p className="text-gray-600">
              Receba dicas personalizadas para otimizar seu perfil do LinkedIn
            </p>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Atividade Recente</h2>
          <div className="space-y-4">
            {progress?.chat_interactions ? (
              <div className="flex items-center text-gray-600">
                <MessageSquare className="w-5 h-5 mr-3 text-indigo-600" />
                <span>Você teve {progress.chat_interactions} interações com a IA</span>
              </div>
            ) : null}

            {progress?.completed_resources ? (
              <div className="flex items-center text-gray-600">
                <BookOpen className="w-5 h-5 mr-3 text-indigo-600" />
                <span>Você completou {progress.completed_resources} recursos de aprendizado</span>
              </div>
            ) : null}

            {progress?.joined_communities ? (
              <div className="flex items-center text-gray-600">
                <Users className="w-5 h-5 mr-3 text-indigo-600" />
                <span>Você participa de {progress.joined_communities} comunidades</span>
              </div>
            ) : null}

            {progress?.implemented_suggestions ? (
              <div className="flex items-center text-gray-600">
                <GraduationCap className="w-5 h-5 mr-3 text-indigo-600" />
                <span>Você implementou {progress.implemented_suggestions} sugestões de melhoria</span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}