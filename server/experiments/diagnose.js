require('dotenv').config();

const KEY = process.env.GEMINI_API_KEY;
const CONFIGURED = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
const BASE = 'https://generativelanguage.googleapis.com/v1beta';

process.on('exit', (code) => console.log('[process ended with code ' + code + ']'));

// One small helper for every request: JSON in, JSON out, with a timeout
async function call(path, options = {}, timeoutMs = 20000) {
  const started = Date.now();
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': KEY },
    signal: AbortSignal.timeout(timeoutMs),
  });
  const body = await res.json().catch(() => ({}));
  return { status: res.status, ms: Date.now() - started, body };
}

async function main() {
  if (!KEY) {
    console.error('Missing GEMINI_API_KEY in server/.env');
    return;
  }

  // 1) Can we reach Google, and is the key accepted? (no AI model involved)
  console.log('1) Listing the models your key can use...');
  const list = await call('/models?pageSize=200', {}, 15000);
  console.log(`   HTTP status ${list.status} (${list.ms} ms)`);
  if (list.status !== 200) {
    console.log(JSON.stringify(list.body, null, 2));
    return;
  }

  // 2) Keep text-capable Flash models, and put the configured one first
  const found = (list.body.models || [])
    .filter((m) => {
      const methods = m.supportedGenerationMethods || m.supportedActions || [];
      const canGenerate = methods.length === 0 || methods.includes('generateContent');
      return canGenerate && /flash/i.test(m.name) && !/tts|image|live|transcribe|embedding/i.test(m.name);
    })
    .map((m) => m.name.replace('models/', ''));
  const candidates = [CONFIGURED, ...found.filter((n) => n !== CONFIGURED)].slice(0, 5);
  console.log('   Flash models found:', found.join(', ') || '(none)');

  // 3) Send a tiny text prompt to each candidate
  for (const model of candidates) {
    process.stdout.write(`3) Trying ${model} ... `);
    try {
      const r = await call(
        `/models/${model}:generateContent`,
        { method: 'POST', body: JSON.stringify({ contents: [{ parts: [{ text: 'Say hello in five words.' }] }] }) },
        20000
      );
      const text = r.body.candidates?.[0]?.content?.parts?.[0]?.text;
      console.log(`status ${r.status} (${r.ms} ms)`, text ? '-> ' + text.trim() : (r.body.error?.message || '').slice(0, 120));
    } catch (e) {
      console.log(e.name === 'TimeoutError' ? 'no answer after 20 s' : 'failed: ' + e.message);
    }
  }
}

main().catch((e) => {
  console.error('Failed:', e.name, e.message);
  process.exitCode = 1;
});