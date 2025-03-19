import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Search, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { generateProfileAnalysis } from '@/lib/gemini';

interface ProfileScore {
  overall: number;
  sections: {
    title: string;
    score: number;
    feedback: string;
  }[];
}

export default function ProfileAnalysisPage() {
  const [profileUrl, setProfileUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ProfileScore | null>(null);

  const handleAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileUrl.includes('linkedin.com/in/')) {
      toast.error('Por favor, insira um URL válido do LinkedIn');
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await generateProfileAnalysis(profileUrl);
      setAnalysis(result);
      toast.success('Análise concluída com sucesso!');
    } catch (error) {
      console.error('Erro na análise:', error);
      toast.error('Erro ao analisar o perfil. Tente novamente.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Análise de Perfil</h1>
          <p className="mt-2 text-gray-600">
            Receba uma análise detalhada do seu perfil do LinkedIn com recomendações personalizadas
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
          <form onSubmit={handleAnalysis} className="space-y-4">
            <div>
              <label htmlFor="profileUrl" className="block text-sm font-medium text-gray-700 mb-2">
                URL do Perfil LinkedIn
              </label>
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="url"
                  id="profileUrl"
                  value={profileUrl}
                  onChange={(e) => setProfileUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/seu-perfil"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  disabled={isAnalyzing}
                />
                <button
                  type="submit"
                  disabled={isAnalyzing}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 justify-center"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                      Analisando...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      Analisar Perfil
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {analysis && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Pontuação Geral</h2>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-indigo-600">{analysis.overall}</span>
                  <span className="text-gray-500">/100</span>
                </div>
              </div>

              <div className="space-y-6">
                {analysis.sections.map((section, index) => (
                  <div key={index} className="border-t pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-medium text-gray-800">{section.title}</h3>
                      <div className="flex items-center gap-2">
                        {section.score >= 70 ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-yellow-500" />
                        )}
                        <span className="font-semibold">{section.score}/100</span>
                      </div>
                    </div>
                    <p className="text-gray-600">{section.feedback}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}