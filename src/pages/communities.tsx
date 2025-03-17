import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useCommunities } from '@/lib/hooks/use-communities';
import { ExternalLink, Users, Star, CheckCircle } from 'lucide-react';

export default function CommunitiesPage() {
  const { communities, userCommunities, loading, updateCommunityInteraction } =
    useCommunities();

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Comunidades</h1>
          <p className="mt-2 text-gray-600">
            Conecte-se com outros profissionais e expanda sua rede
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {communities.map(community => {
              const userCommunity = userCommunities[community.id];
              return (
                <div
                  key={community.id}
                  className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                      {community.name}
                    </h2>
                    <div className="flex items-center">
                      <Users className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4">{community.description}</p>

                  <div className="flex gap-2 mb-6">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {community.focus_area}
                    </span>
                    {community.tags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <button
                      onClick={() =>
                        updateCommunityInteraction(community.id, {
                          is_interested: !userCommunity?.is_interested,
                        })
                      }
                      className={`inline-flex items-center ${
                        userCommunity?.is_interested
                          ? 'text-yellow-500'
                          : 'text-gray-500 hover:text-yellow-500'
                      }`}
                    >
                      <Star className="w-5 h-5 mr-1" />
                      Interessado
                    </button>

                    <div className="flex gap-4">
                      <a
                        href={community.join_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-indigo-600 hover:text-indigo-700"
                        onClick={() =>
                          updateCommunityInteraction(community.id, {
                            has_joined: true,
                          })
                        }
                      >
                        <ExternalLink className="w-5 h-5 mr-1" />
                        Participar
                      </a>
                      {userCommunity?.has_joined && (
                        <span className="inline-flex items-center text-green-600">
                          <CheckCircle className="w-5 h-5 mr-1" />
                          Participando
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}