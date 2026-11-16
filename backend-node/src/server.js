const app = require('./app');
const { connectDb } = require('./db');
const { seedIfEmpty } = require('./seed');

const PORT = Number(process.env.PORT) || 4000;

async function main() {
  await connectDb();
  if (process.env.SEED_ON_STARTUP !== 'false') {
    await seedIfEmpty();
  }
  app.listen(PORT, () => console.log(`[api] Listening on http://localhost:${PORT}`));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
