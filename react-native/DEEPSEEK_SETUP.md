# DeepSeek API Setup

This app is pre-configured to use DeepSeek API only. To set up your API key:

## Steps:

1. Get your DeepSeek API key from [https://platform.deepseek.com/](https://platform.deepseek.com/)

2. Open the file: `src/storage/Constants.ts`

3. Replace `YOUR_DEEPSEEK_API_KEY_HERE` with your actual API key:

```typescript
export const HARDCODED_DEEPSEEK_API_KEY = 'sk-your-actual-deepseek-api-key-here';

