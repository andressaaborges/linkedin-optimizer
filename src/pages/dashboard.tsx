import { DashboardLayout } from '@/components/layout/dashboard-layout';

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Bem-vindo ao LinkedIn Optimizer
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Análise Rápida
            </h2>
            <p className="text-gray-600 mb-4">
              Comece otimizando seu perfil do LinkedIn com nossa análise inteligente.
            </p>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
              Iniciar Análise
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Chat com IA
            </h2>
            <p className="text-gray-600 mb-4">
              Receba dicas personalizadas para melhorar cada seção do seu perfil.
            </p>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
              Iniciar Chat
            </button>
          </div>
        </div>

        <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Progresso de Otimização
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Perfil Completo</span>
                <span className="text-sm font-medium text-gray-700">70%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '70%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Otimização SEO</span>
                <span className="text-sm font-medium text-gray-700">85%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}