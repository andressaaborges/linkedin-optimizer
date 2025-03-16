import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { ChatInterface } from '@/components/chat/chat-interface';

export default function ChatPage() {
  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Chat com IA</h1>
          <p className="mt-2 text-gray-600">
            Use nosso assistente virtual para receber dicas personalizadas sobre como melhorar seu perfil do LinkedIn
          </p>
        </div>
        
        <ChatInterface />
      </div>
    </DashboardLayout>
  );
}