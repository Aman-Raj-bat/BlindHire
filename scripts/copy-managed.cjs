const fs = require('fs');
const path = require('path');

const srcManagedContract = path.resolve(__dirname, '../contracts/managed/blindhire/contract');
const destFrontendSrcManagedContract = path.resolve(__dirname, '../frontend/src/managed/contract');

const srcManagedRoot = path.resolve(__dirname, '../contracts/managed/blindhire');
const destFrontendPublicManaged = path.resolve(__dirname, '../frontend/public/managed');

try {
  if (fs.existsSync(srcManagedContract)) {
    fs.mkdirSync(destFrontendSrcManagedContract, { recursive: true });
    fs.cpSync(srcManagedContract, destFrontendSrcManagedContract, { recursive: true });
    console.log('[BlindHire copy-managed] Copied contract types to frontend/src/managed/contract');
  }

  if (fs.existsSync(srcManagedRoot)) {
    fs.mkdirSync(destFrontendPublicManaged, { recursive: true });
    fs.cpSync(srcManagedRoot, destFrontendPublicManaged, { recursive: true });
    console.log('[BlindHire copy-managed] Copied proving keys/zkir to frontend/public/managed');
  }
} catch (err) {
  console.error('[BlindHire copy-managed] Error copying managed artifacts:', err);
  process.exit(1);
}
