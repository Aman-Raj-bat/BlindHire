import fs from 'fs';
import path from 'path';

try {
  const src = path.resolve('public/managed');
  const dest = path.resolve('dist/managed');
  if (fs.existsSync(src)) {
    fs.mkdirSync(dest, { recursive: true });
    fs.cpSync(src, dest, { recursive: true });
    console.log('[BlindHire Frontend] Successfully copied public/managed to dist/managed for production runtime.');
  }
} catch (error) {
  console.error('[BlindHire Frontend] Failed to copy managed artifacts to dist:', error);
  process.exit(1);
}
