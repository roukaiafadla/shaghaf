require('dotenv').config();

const MODEL = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
const KEY = process.env.GEMINI_API_KEY;

// These two lines make a silent exit visible
process.on('exit', (code) => console.log('[process ended with code ' + code + ']'));
process.on('unhandledRejection', (e) => console.error('Unhandled rejection:', e));

async function main() {
  if (!KEY) {
    console.error('Missing GEMINI_API_KEY in server/.env');
    return;
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;
  console.log('Calling', MODEL, '...');
  const started = Date.now();

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': KEY },
    body: JSON.stringify({ contents: [{ parts: [{ text: 'Say hello in five words.' }] }] }),
    signal: AbortSignal.timeout(30000), // give up after 30 seconds instead of hanging
  });

  const body = await res.json();
  console.log('HTTP status:', res.status, `(${Date.now() - started} ms)`);
  console.log(body.candidates?.[0]?.content?.parts?.[0]?.text ?? JSON.stringify(body, null, 2));
}

main().catch((e) => {
  console.error('Failed:', e.name, e.message);
  process.exitCode = 1;
});