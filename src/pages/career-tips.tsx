import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useCareerTips } from '@/lib/hooks/use-career-tips';
import { ThumbsUp, ThumbsDown, CheckCircle, Clock } from 'lucide-react';
import { useState } from 'react';

export default function CareerTipsPage() {
  const { tips, userTips, loading, updateTipInteraction } = useCareerTips();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(tips.map(tip => tip.category)));

  const filteredTips = selectedCategory
    ? tips.filter(tip => tip.category === selectedCategory)
    : tips;

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dicas de Carreira</h1>
          <p className="mt-2 text-gray-600">
            Dicas personalizadas para impulsionar sua carreira em tecnologia
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              !selectedCategory
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todas
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                selectedCategory === category
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredTips.map(tip => {
              const userTip = userTips[tip.id];
              return (
                <div
                  key={tip.id}
                  className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
                >
                  <div className="flex flex-wrap justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800 mb-2">
                        {tip.title}
                      </h2>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          {tip.category}
                        </span>
                        {tip.tags.map(tag => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {userTip?.is_implemented ? (
                        <span className="inline-flex items-center text-green-600">
                          <CheckCircle className="w-5 h-5 mr-1" />
                          Implementado
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-gray-500">
                          <Clock className="w-5 h-5 mr-1" />
                          Pendente
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-600 mb-6 whitespace-pre-wrap">
                    {tip.content}
                  </p>

                  <div className="flex flex-wrap gap-4 items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex gap-4">
                      <button
                        onClick={() =>
                          updateTipInteraction(tip.id, {
                            is_helpful: true,
                          })
                        }
                        className={`inline-flex items-center ${
                          userTip?.is_helpful === true
                            ? 'text-green-600'
                            : 'text-gray-500 hover:text-green-600'
                        }`}
                      >
                        <ThumbsUp className="w-5 h-5 mr-1" />
                        Útil
                      </button>
                      <button
                        onClick={() =>
                          updateTipInteraction(tip.id, {
                            is_helpful: false,
                          })
                        }
                        className={`inline-flex items-center ${
                          userTip?.is_helpful === false
                            ? 'text-red-600'
                            : 'text-gray-500 hover:text-red-600'
                        }`}
                      >
                        <ThumbsDown className="w-5 h-5 mr-1" />
                        Não Útil
                      </button>
                    </div>
                    <button
                      onClick={() =>
                        updateTipInteraction(tip.id, {
                          is_implemented: !userTip?.is_implemented,
                        })
                      }
                      className={`px-4 py-2 rounded-md text-sm font-medium ${
                        userTip?.is_implemented
                          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700'
                      }`}
                    >
                      {userTip?.is_implemented
                        ? 'Marcar como Pendente'
                        : 'Marcar como Implementado'}
                    </button>
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