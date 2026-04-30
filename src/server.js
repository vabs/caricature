import 'dotenv/config';

import { createApp } from './app.js';
import { loadConfig } from './config.js';
import { createOpenAIProvider } from './providers/openaiProvider.js';

const config = loadConfig();
const provider = createOpenAIProvider({
  apiKey: config.openAIAPIKey,
  model: config.openAIImageModel
});
const app = createApp({ provider, config });

app.listen(config.port, () => {
  console.log(`Caricature app listening on http://localhost:${config.port}`);
});
