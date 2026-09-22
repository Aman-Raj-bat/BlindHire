const { spawnSync } = require('child_process');

const contractPath = 'contracts/blindhire.compact';
const outputPath = 'contracts/managed/blindhire';

let cmd;
let args;

if (process.platform === 'win32') {
  // On Windows, use bash / wsl where compact 0.5.2 is installed in ~/.local/bin/compact
  const cwdUnix = process.cwd().replace(/\\/g, '/').replace(/^([A-Za-z]):/, (_, drive) => `/mnt/${drive.toLowerCase()}`);
  cmd = 'bash';
  args = ['-c', `cd "${cwdUnix}" && ~/.local/bin/compact compile ${contractPath} ${outputPath}`];
} else {
  // On Linux / GitHub Actions CI, compact is installed in PATH
  cmd = 'compact';
  args = ['compile', contractPath, outputPath];
}

console.log(`[BlindHire Compile] Executing: ${cmd} ${args.join(' ')}`);
const result = spawnSync(cmd, args, { stdio: 'inherit', shell: false });

if (result.error) {
  console.error('[BlindHire Compile] Failed to start compile process:', result.error);
  process.exit(1);
}

process.exit(result.status ?? 0);
