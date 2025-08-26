import { Model, ModelTag } from '../types/Chat.ts';
import { DeepSeekModels } from '../storage/Constants.ts';
import { getTextModel } from '../storage/StorageUtils.ts';

export function getModelTag(model: Model): string {
  if (model.modelTag) {
    return model?.modelTag;
  }
  const isDeepSeek = DeepSeekModels.some(
    deepseekModel => deepseekModel.modelId === model.modelId
  );
  if (isDeepSeek) {
    return ModelTag.Broperty; // Changed from DeepSeek to Broperty
  }
  if (model.modelId.includes('gpt')) {
    return ModelTag.OpenAI;
  }
  if (getTextModel().modelId.startsWith('ollama-')) {
    return ModelTag.Ollama;
  }
  return ModelTag.Bedrock;
}

export const getModelIcon = (
  modelTag: string,
  modelId: string | undefined,
  isDark: boolean
) => {
  let isDeepSeek = modelTag === ModelTag.Broperty; // Changed from DeepSeek to Broperty
  if (modelId) {
    isDeepSeek = DeepSeekModels.some(m => m.modelId === modelId);
  }
  const isOpenAICompatible = modelTag === ModelTag.OpenAICompatible;
  const isOpenAI = modelTag === ModelTag.OpenAI || modelTag.includes('gpt');
  const isOllama =
    modelTag === ModelTag.Ollama || modelTag.startsWith('ollama-');

  return isDeepSeek
    ? isDark
    ? require('../assets/broperty_dark.png') // Keep using deepseek logo
    : require('../assets/broperty.png') // Keep using deepseek logo
    : isOpenAICompatible
    ? require('../assets/openai_api.png')
    : isOpenAI
    ? isDark
      ? require('../assets/openai_dark.png')
      : require('../assets/openai.png')
    : isOllama
    ? require('../assets/ollama_white.png')
    : isDark
    ? require('../assets/bedrock_dark.png')
    : require('../assets/bedrock.png');
};

export function getModelTagByUserName(
  modelTag: string | undefined,
  userName: string
): string {
  if (modelTag) {
    return modelTag;
  }
  const isDeepSeek = DeepSeekModels.some(
    deepseekModel => deepseekModel.modelId === userName
  );
  if (isDeepSeek) {
  return ModelTag.Broperty; // Changed from DeepSeek to Broperty
  }
  if (userName.includes('GPT')) {
    return ModelTag.OpenAI;
  }
  if (userName.includes(':')) {
    return ModelTag.Ollama;
  }
  return ModelTag.Bedrock;
}

