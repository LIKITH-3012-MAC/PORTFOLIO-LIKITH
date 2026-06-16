import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Root repository directory path
const rootDir = path.resolve(__dirname, '../..');

// Source paths to check
const srcPaths = [
  path.join(rootDir, 'knowledge'),
  path.join(rootDir, 'frontend', 'knowledge')
];

let srcDir = null;
for (const p of srcPaths) {
  if (fs.existsSync(p) && fs.statSync(p).isDirectory()) {
    srcDir = p;
    break;
  }
}

if (!srcDir) {
  console.error('CRITICAL ERROR: Knowledge source directory not found!');
  process.exit(1);
}

// Destination public folder path
const destDir = path.join(rootDir, 'frontend', 'public', 'knowledge');

// Ensure destination public directory exists
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

console.log(`Syncing knowledge files from: ${srcDir} to ${destDir}`);

const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.json'));

if (files.length === 0) {
  console.error('CRITICAL ERROR: No JSON files found in knowledge source directory!');
  process.exit(1);
}

for (const file of files) {
  const srcFile = path.join(srcDir, file);
  const destFile = path.join(destDir, file);
  
  try {
    const content = fs.readFileSync(srcFile, 'utf8');
    // Schema validate: Ensure it parses as correct JSON format
    JSON.parse(content);
    
    // Copy the file securely
    fs.writeFileSync(destFile, content, 'utf8');
    console.log(`✓ Synced and validated: ${file}`);
  } catch (err) {
    console.error(`✕ Failed to sync or validate ${file}: ${err.message}`);
    process.exit(1);
  }
}

console.log('Knowledge sync completed successfully.');
process.exit(0);
