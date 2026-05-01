import 'dotenv/config';

import { createApp } from './app.js';
import { loadConfig } from './config.js';
import { createProviderRegistry } from './providers/index.js';

const config = loadConfig();
const providers = createProviderRegistry({ config });
const app = createApp({ providers, config });

const server = app.listen(config.port, () => {
  console.log(`Caricature app listening on http://localhost:${config.port}`);
});

process.on('SIGTERM', () => {
  server.close(() => {
    process.exit(0);
  });
});
