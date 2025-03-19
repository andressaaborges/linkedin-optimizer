import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useLearning } from '@/lib/hooks/use-learning';
import { ExternalLink, BookOpen, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export default function LearningPage() {
  const { resources, userProgress, loading, updateLearningProgress } =
    useLearning();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  const types = Array.from(new Set(resources.map(resource => resource.type)));
  const levels = Array.from(
    new Set(resources.map(resource => resource.difficulty_level))
  );

  const filteredResources = resources.filter(resource => {
    if (selectedType && resource.type !== selectedType) return false;
    if (selectedLevel && resource.difficulty_level !== selectedLevel) return false;
    return true;
  });

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Conteúdo Recomendado
          </h1>
          <p className="mt-2 text-gray-600">
            Recursos selecionados para aprimorar suas habilidades
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Tipo</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedType(null)}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  !selectedType
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Todos
              </button>
              {types.map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    selectedType === type
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Nível</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedLevel(null)}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  !selectedLevel
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Todos
              </button>
              {levels.map(level => (
                <button
                  key={level}
                  onClick={() => setSelectedLevel(level)}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    selectedLevel === level
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredResources.map(resource => {
              const progress = userProgress[resource.id];
              return (
                <div
                  key={resource.id}
                  className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
                >
                  <div className="flex flex-wrap justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800 mb-2">
                        {resource.title}
                      </h2>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          {resource.type}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {resource.difficulty_level}
                        </span>
                        {resource.tags.map(tag => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    {progress?.status === 'completed' && (
                      <span className="inline-flex items-center text-green-600">
                        <CheckCircle className="w-5 h-5 mr-1" />
                        Concluído
                      </span>
                    )}
                  </div>

                  <p className="text-gray-600 mb-6">{resource.description}</p>

                  {progress && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Progresso</span>
                        <span>{progress.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-indigo-600 h-2 rounded-full"
                          style={{ width: `${progress.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-4 items-center justify-between pt-4 border-t border-gray-200">
                    <button
                      onClick={() =>
                        updateLearningProgress(resource.id, {
                          status:
                            progress?.status === 'completed'
                              ? 'in_progress'
                              : 'completed',
                          progress:
                            progress?.status === 'completed' ? 0 : 100,
                          completed_at:
                            progress?.status === 'completed'
                              ? null
                              : new Date().toISOString(),
                        })
                      }
                      className={`inline-flex items-center ${
                        progress?.status === 'completed'
                          ? 'text-gray-500 hover:text-gray-700'
                          : 'text-indigo-600 hover:text-indigo-700'
                      }`}
                    >
                      <BookOpen className="w-5 h-5 mr-1" />
                      {progress?.status === 'completed'
                        ? 'Marcar como Não Concluído'
                        : 'Marcar como Concluído'}
                    </button>

                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-indigo-600 hover:text-indigo-700"
                      onClick={() => {
                        if (!progress) {
                          updateLearningProgress(resource.id, {
                            status: 'in_progress',
                            progress: 0,
                          });
                        }
                      }}
                    >
                      <ExternalLink className="w-5 h-5 mr-1" />
                      Acessar Conteúdo
                    </a>
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