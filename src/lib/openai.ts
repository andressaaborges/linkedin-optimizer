import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function generateLinkedInAdvice(userMessage: string): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "Você é um especialista em LinkedIn e desenvolvimento de carreira em tecnologia. Seu objetivo é ajudar profissionais a otimizarem seus perfis no LinkedIn e desenvolverem suas carreiras. Forneça conselhos práticos, específicos e acionáveis."
        },
        {
          role: "user",
          content: userMessage
        }
      ],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      max_tokens: 500
    });

    return completion.choices[0]?.message?.content || "Desculpe, não consegui gerar uma resposta. Por favor, tente novamente.";
  } catch (error) {
    console.error('Erro ao gerar conselho:', error);
    return "Desculpe, ocorreu um erro ao processar sua solicitação. Por favor, tente novamente mais tarde.";
  }
}

interface ProfileScore {
  overall: number;
  sections: {
    title: string;
    score: number;
    feedback: string;
  }[];
}

export async function generateProfileAnalysis(profileUrl: string): Promise<ProfileScore> {
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Você é um especialista em análise de perfis do LinkedIn. Analise o URL do perfil fornecido e gere uma análise detalhada com pontuações e feedback específico.
          
          Formato da resposta deve ser em JSON com a seguinte estrutura:
          {
            "overall": número de 0 a 100,
            "sections": [
              {
                "title": "nome da seção",
                "score": número de 0 a 100,
                "feedback": "feedback detalhado"
              }
            ]
          }
          
          Seções a serem analisadas:
          - Foto e Headline
          - Resumo Profissional
          - Experiência
          - Formação
          - Habilidades e Recomendações
          - Atividade e Engajamento`
        },
        {
          role: "user",
          content: `Analise este perfil do LinkedIn: ${profileUrl}`
        }
      ],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      max_tokens: 1000,
      response_format: { type: "json_object" }
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('Resposta vazia da API');
    }

    return JSON.parse(response) as ProfileScore;
  } catch (error) {
    console.error('Erro ao analisar perfil:', error);
    throw new Error('Falha ao analisar o perfil');
  }
}