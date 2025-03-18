import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function generateLinkedInAdvice(userMessage: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    const prompt = `Você é um especialista em LinkedIn e desenvolvimento de carreira em tecnologia. Seu objetivo é ajudar profissionais a otimizarem seus perfis no LinkedIn e desenvolverem suas carreiras. Siga estas regras rigorosamente:

    Aceitar apenas perguntas relacionadas a:
      - Otimização de perfil do LinkedIn (ex.: headline, resumo, experiência, habilidades, recomendações).
      - Desenvolvimento de carreira em tecnologia (ex.: transição de carreira, networking, preparação para entrevistas, construção de marca pessoal, estudos).

    Se a pergunta do usuário não estiver relacionada ao tema acima:
      - Não responda à pergunta diretamente.
      - Forneça uma lista de perguntas relevantes que o usuário pode fazer dentro do tema de otimização de LinkedIn e carreira em tecnologia.

    Forneça conselhos práticos, específicos e acionáveis:
      - Suas respostas devem ser claras, diretas e focadas em ações que o usuário possa implementar imediatamente.

Exemplos de perguntas aceitas:
      - "Como posso melhorar meu headline no LinkedIn para atrair recrutadores de tecnologia?"
      - "Quais habilidades devo destacar no meu perfil para uma transição de carreira para análise de dados?"
      - "Como posso usar o LinkedIn para expandir minha rede de contatos na área de desenvolvimento de software?"
      - "Como me tornar uma especialista em análise de dados?"

Exemplos de perguntas não aceitas:
    - "Como cozinhar um bolo?"
    - "Qual é a capital da França?"
    - "Como está o clima hoje?"

Sua resposta deve seguir este formato:
    - Se a pergunta for relevante:
      [Forneça conselhos práticos e acionáveis relacionados à pergunta.]

    Se a pergunta não for relevante:
    Perguntas relevantes que você pode fazer:
      - [Pergunta relevante 1]
      - [Pergunta relevante 2]
      - [Pergunta relevante 3]

Agora, aguardo sua pergunta:
${userMessage}`;

    console.log(prompt);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
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
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    const prompt = `Você é um especialista em análise de perfis do LinkedIn. Analise o URL do perfil fornecido e gere uma análise detalhada com pontuações e feedback específico.
    
    Perfil para análise: ${profileUrl}
    
    Forneça uma resposta estruturada com as seguintes seções:
    - Pontuação geral (0-100)
    - Análise por seção:
      - Foto e Headline
      - Resumo Profissional
      - Experiência
      - Formação
      - Habilidades e Recomendações
      - Atividade e Engajamento
    
    Para cada seção, inclua:
    - Pontuação (0-100)
    - Feedback detalhado
    
    Retorne a resposta em formato JSON seguindo exatamente esta estrutura:
    {
      "overall": number,
      "sections": [
        {
          "title": string,
          "score": number,
          "feedback": string
        }
      ]
    }`;

    const result = await model.generateContent(prompt);

    console.log('Analisando perfil:', profileUrl);
    console.log('Prompt:', prompt);

    const response = await result.response;
    console.log('Resultado JSON:', response.text());

    // remove os blocos Markdown (```)
    let textResponse = response.text();
    textResponse = textResponse.replace(/^```json\n/, '').replace(/\n```$/, '').trim();

    console.log('Resultado JSON limpo:', textResponse);

    // const jsonResponse = JSON.parse(response.text()) as ProfileScore;
    const jsonResponse = JSON.parse(textResponse) as ProfileScore;

    return jsonResponse;
  } catch (error) {
    console.error('Erro ao analisar perfil:', error);
    throw new Error('Falha ao analisar o perfil');
  }
}