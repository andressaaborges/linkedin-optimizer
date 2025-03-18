import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import { Profile } from "./profile";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export interface CareerTipGeneration {
  title: string;
  content: string;
  category: string;
  tags: string[];
}

export interface CommunityRecommendation {
  name: string;
  description: string;
  focus_area: string;
  join_url: string;
  tags: string[];
}

export interface LearningResourceRecommendation {
  title: string;
  description: string;
  type: string;
  url: string;
  tags: string[];
  difficulty_level: string;
}

export async function generateCareerTips(userProfile: Profile): Promise<CareerTipGeneration[]> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    const prompt = `Como especialista em desenvolvimento de carreira em tecnologia, gere 3 dicas de carreira personalizadas com base no seguinte perfil:

Perfil do usuário:
${JSON.stringify(userProfile, null, 2)}

Para cada dica, forneça:
- Título
- Conteúdo detalhado
- Categoria (ex: Networking, Habilidades Técnicas, Soft Skills, etc.)
- Tags relevantes (array de strings)

Retorne a resposta em formato JSON seguindo exatamente esta estrutura:
[
  {
    "title": string,
    "content": string,
    "category": string,
    "tags": string[]
  }
]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().replace(/```json\n?|\n?```/g, '').trim();
    const tips = JSON.parse(text) as CareerTipGeneration[];

console.log('Prompt:', prompt);
console.log('Result:', result);
console.log('Response:', response);
console.log('Text:', text);
console.log('Tips:', tips);



    // Persist tips in Supabase
    for (const tip of tips) {
      const { error } = await supabase
        .from('career_tips')
        .insert([tip]);

      if (error) throw error;
    }

    return tips;
  } catch (error) {
    console.error('Error generating career tips:', error);
    toast.error('Erro ao gerar dicas de carreira');
    return [];
  }
}

export async function generateCommunityRecommendations(userProfile: Profile): Promise<CommunityRecommendation[]> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    const prompt = `Como especialista em comunidades de tecnologia, recomende 3 comunidades relevantes com base no seguinte perfil:

Perfil do usuário:
${JSON.stringify(userProfile, null, 2)}

Para cada comunidade, forneça:
- Nome
- Descrição
- Área de foco
- URL para participar
- Tags relevantes (array de strings)

Retorne a resposta em formato JSON seguindo exatamente esta estrutura:
[
  {
    "name": string,
    "description": string,
    "focus_area": string,
    "join_url": string,
    "tags": string[]
  }
]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().replace(/```json\n?|\n?```/g, '').trim();
    const communities = JSON.parse(text) as CommunityRecommendation[];

    console.log('Generating community recommendations...');
    console.log('Prompt:', prompt);
console.log('Result:', result);
console.log('Response:', response);
console.log('Text:', text);
console.log('Communities:', communities);

    // Persist communities in Supabase
    for (const community of communities) {
      const { error } = await supabase
        .from('communities')
        .insert([community]);

      if (error) throw error;
    }

    return communities;
  } catch (error) {
    console.error('Error generating community recommendations:', error);
    toast.error('Erro ao gerar recomendações de comunidades');
    return [];
  }
}

export async function generateLearningResources(userProfile: Profile): Promise<LearningResourceRecommendation[]> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    const prompt = `Como especialista em educação em tecnologia, recomende 3 recursos de aprendizado com base no seguinte perfil:

Perfil do usuário:
${JSON.stringify(userProfile, null, 2)}

Para cada recurso, forneça:
- Título
- Descrição
- Tipo (Curso, Artigo, Livro, Vídeo)
- URL
- Tags relevantes
- Nível de dificuldade (Iniciante, Intermediário, Avançado)

Retorne a resposta em formato JSON seguindo exatamente esta estrutura:
[
  {
    "title": string,
    "description": string,
    "type": string,
    "url": string,
    "tags": string[],
    "difficulty_level": string
  }
]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().replace(/```json\n?|\n?```/g, '').trim();
    const resources = JSON.parse(text) as LearningResourceRecommendation[];

    console.log('Generating learning resources...');
console.log('Prompt:', prompt);
console.log('Result:', result);
console.log('Response:', response);
console.log('Text:', text);
console.log('Resources:', resources);

    // Persist resources in Supabase
    for (const resource of resources) {
      const { error } = await supabase
        .from('learning_resources')
        .insert([resource]);

      if (error) throw error;
    }

    return resources;
  } catch (error) {
    console.error('Error generating learning resources:', error);
    toast.error('Erro ao gerar recomendações de conteúdo');
    return [];
  }
}