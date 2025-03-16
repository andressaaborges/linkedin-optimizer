import { AuthForm } from '@/components/auth/auth-form';
import { Briefcase } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full mb-4">
          <Briefcase className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          LinkedIn Profile Optimizer
        </h1>
        <p className="text-gray-600 max-w-md mx-auto">
          Maximize your professional presence with AI-powered insights and recommendations
        </p>
      </div>
      <AuthForm />
    </div>
  );
}