import { ChatMode, SystemPrompt } from './Chat.ts';
import { PresetPrompt } from '../prompt/PresetPrompts';

export type DrawerParamList = {
  Bedrock: {
    sessionId?: number;
    tapIndex?: number;
    mode?: ChatMode;
    presetPrompt?: PresetPrompt;
  };
}; 
  
  export type RouteParamList = {
    Drawer: {
    screen?: keyof DrawerParamList;
    params?: DrawerParamList[keyof DrawerParamList];
  } | undefined;
  TokenUsage: NonNullable<unknown>;
  Prompt: {
    prompt?: SystemPrompt;
  };
  PresetPrompts: NonNullable<unknown>;
};
