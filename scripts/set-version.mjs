import { execSync } from 'child_process';
import { writeFileSync } from 'fs';

const raw = execSync('git log -1 --format=%ci').toString().trim();
// raw is like "2026-06-23 17:26:16 -0400" — keep date + time, drop timezone
const version = raw.slice(0, 16);
writeFileSync('src/app/version.ts', `export const VERSION = '${version}';\n`);
