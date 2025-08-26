import { Model, ModelTag, SystemPrompt } from '../types/Chat.ts';
import { getDeepSeekApiKey, getOpenAIApiKey } from './StorageUtils.ts';

// Hardcoded DeepSeek API Key - Replace with your actual API key
export const HARDCODED_DEEPSEEK_API_KEY = 'sk-b9067f0295ac48d5bc7cfd4674fea812';

// AWS credentials - empty by default, to be filled by user
const RegionList = [
  'us-west-2',
  'us-east-1',
  'us-east-2',
  'ap-south-1',
  'ap-southeast-1',
  'ap-southeast-2',
  'ap-northeast-1',
  'ap-northeast-2',
  'ap-northeast-3',
  'ca-central-1',
  'eu-central-1',
  'eu-west-1',
  'eu-west-2',
  'eu-west-3',
  'eu-north-1',
  'sa-east-1',
];

export const DefaultRegion = 'ap-southeast-1';

export const GPTModels = [
  { modelName: 'GPT-4.1', modelId: 'gpt-4.1', modelTag: ModelTag.OpenAI },
  {
    modelName: 'GPT-4.1-mini',
    modelId: 'gpt-4.1-mini',
    modelTag: ModelTag.OpenAI,
  },
  {
    modelName: 'GPT-4.1-nano',
    modelId: 'gpt-4.1-nano',
    modelTag: ModelTag.OpenAI,
  },
  { modelName: 'GPT-4o', modelId: 'gpt-4o', modelTag: ModelTag.OpenAI },
  {
    modelName: 'GPT-4o mini',
    modelId: 'gpt-4o-mini',
    modelTag: ModelTag.OpenAI,
  },
];

export const DeepSeekModels = [
  {
    modelName: 'DeepSeek-V3',
    modelId: 'deepseek-chat',
    modelTag: ModelTag.Broperty,
  },
  {
    modelName: 'DeepSeek-R1',
    modelId: 'deepseek-reasoner',
    modelTag: ModelTag.Broperty,
  },
];

export const BedrockThinkingModels = [
  'Claude 3.7 Sonnet',
  'Claude Sonnet 4',
  'Claude Opus 4',
];
export const BedrockVoiceModels = ['Nova Sonic'];

export const DefaultTextModel = [
  {
    modelName: 'DeepSeek-V3',
    modelId: 'deepseek-chat',
    modelTag: ModelTag.Broperty,
  },
];

const DefaultImageModel = {
  modelName: 'Stable Diffusion 3.5 Large',
  modelId: 'stability.sd3-5-large-v1:0',
  modelTag: ModelTag.Bedrock,
};

export const VoiceIDList = [
  {
    voiceName: 'Matthew (American English)',
    voiceId: 'matthew',
  },
  {
    voiceName: 'Tiffany (American English)',
    voiceId: 'tiffany',
  },
  {
    voiceName: 'Amy (British English)',
    voiceId: 'amy',
  },
  {
    voiceName: 'Lupe (Spanish)',
    voiceId: 'lupe',
  },
  {
    voiceName: 'Carlos (Spanish)',
    voiceId: 'carlos',
  },
];

export const DefaultVoiceSystemPrompts = [
  {
    id: -4,
    name: 'LearnWords',
    prompt: `Please act as an English vocabulary coach. In each response, follow this exact format:

1. If the user has spoken: Score their speaking from 1-10
2. If score < 7: Provide brief correction tips and ask them to repeat the same word
3. If score ≥ 7: ask user to read a new English word

Keep all responses under 5 sentences. Begin by introducing yourself and providing the first practice word.

Remember: ALWAYS start with a score after the user speaks`,
    includeHistory: true,
    promptType: 'voice',
    allowInterruption: false,
  },
  {
    id: -5,
    name: 'LearnSentences',
    prompt: `Please act as an English pronunciation coach. In each response, follow this exact format:

1. If the user has spoken: Score their pronunciation from 1-10
2. If score < 7: Provide brief correction tips and ask them to repeat the same sentence
3. If score ≥ 7: Introduce a new common English phrase for practice

Keep all responses under 5 sentences. Begin by introducing yourself and providing the first practice sentence.

Remember: ALWAYS start with a score after the user speaks`,
    includeHistory: true,
    promptType: 'voice',
    allowInterruption: false,
  },
  {
    id: -6,
    name: 'Story',
    prompt:
      'You are a storytelling expert. Please first ask the user what type of story they would like to hear, and then tell that story with emotion and expressiveness.',
    includeHistory: true,
    promptType: 'voice',
    allowInterruption: true,
  },
];

const DefaultSystemPrompts = [
  {
    id: -7,
    name: 'MENU',
    prompt: 'Anda memberikan info properti lainnya. Semua pertanyaan prompt bisa dijawab disini',
    includeHistory: false,
  },
  ...DefaultVoiceSystemPrompts,
];
export const DefaultVoicePrompt =
  'You are a friendly assistant. The user and you will engage in a spoken dialog exchanging the transcripts of a natural real-time conversation. Keep your responses short, generally within five sentences for chatty scenarios.';

export function getAllRegions() {
  return RegionList;
}

export function getDefaultTextModels() {
  return [...DefaultTextModel, ...getDefaultApiKeyModels()] as Model[];
}

export function getDefaultApiKeyModels() {
  return [
    // Always include DeepSeek models - hardcoded
    ...DeepSeekModels,
    // Remove conditional logic for other providers
  ] as Model[];
}

export function getDefaultImageModels() {
  return [DefaultImageModel] as Model[];
}

export function getDefaultSystemPrompts(): SystemPrompt[] {
  return DefaultSystemPrompts;
}
