#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

const green = (s) => `\x1b[32m${s}\x1b[0m`;
const yellow = (s) => `\x1b[33m${s}\x1b[0m`;
const bold = (s) => `\x1b[1m${s}\x1b[0m`;

const backendEnv = path.join(root, 'source/backend/.env');
const backendExample = path.join(root, 'source/backend/.env.example');
const frontendEnv = path.join(root, 'source/frontend/.env.local');

let created = [];

// Backend .env
if (!fs.existsSync(backendEnv)) {
  const example = fs.existsSync(backendExample) ? fs.readFileSync(backendExample, 'utf8') : '';
  const content = example.includes('ANTHROPIC_API_KEY')
    ? example
    : example + '\nANTHROPIC_API_KEY=\n';
  fs.writeFileSync(backendEnv, content);
  created.push('source/backend/.env');
}

// Frontend .env.local
if (!fs.existsSync(frontendEnv)) {
  fs.writeFileSync(frontendEnv, 'VITE_API_URL=http://localhost:3000\n');
  created.push('source/frontend/.env.local');
}

console.log('');
if (created.length > 0) {
  console.log(green('✓ Created env files:'));
  created.forEach((f) => console.log(`  ${f}`));
} else {
  console.log(green('✓ Env files already exist, skipping'));
}

console.log('');
console.log(bold('Next steps:'));
console.log(`  1. Edit ${yellow('source/backend/.env')} and set ${yellow('ANTHROPIC_API_KEY=sk-ant-...')}`);
console.log(`  2. Run ${yellow('npm run dev:backend')} (port 3000)`);
console.log(`  3. Run ${yellow('npm run dev:frontend')} (port 5173)`);
console.log('');
