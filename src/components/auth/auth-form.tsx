import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/lib/supabase';

export function AuthForm() {
  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        providers={['google']}
        redirectTo={`${window.location.origin}/dashboard`}
        theme="light"
        localization={{
          variables: {
            sign_in: {
              email_label: 'Endereço de e-mail',
              password_label: 'Senha',
              email_input_placeholder: 'Seu e-mail',
              password_input_placeholder: 'Sua senha',
              button_label: 'Entrar',
              loading_button_label: 'Entrando...',
              social_provider_text: 'Entrar com {{provider}}',
              link_text: 'Já tem uma conta? Faça login',
            },
            sign_up: {
              email_label: 'Endereço de e-mail',
              password_label: 'Senha',
              email_input_placeholder: 'Seu e-mail',
              password_input_placeholder: 'Crie uma senha',
              button_label: 'Criar conta',
              loading_button_label: 'Criando conta...',
              social_provider_text: 'Registrar com {{provider}}',
              link_text: 'Ainda não tem conta? Registre-se',
            },
            forgotten_password: {
              email_label: 'Endereço de e-mail',
              password_label: 'Nova senha',
              email_input_placeholder: 'Seu e-mail',
              button_label: 'Redefinir senha',
              loading_button_label: 'Enviando link...',
              link_text: 'Esqueceu sua senha?',
              confirmation_text: 'Se este e-mail estiver cadastrado, você receberá um link para redefinir sua senha.',
            },
            magic_link: {
              email_input_label: 'Endereço de e-mail',
              email_input_placeholder: 'Seu e-mail',
              button_label: 'Enviar link mágico',
              loading_button_label: 'Enviando link...',
              link_text: 'Entrar com link mágico',
            },
          },
        }}
      />
    </div>
  );
}