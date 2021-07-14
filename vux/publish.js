#!/usr/bin/env node
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const { execSync } = require('child_process');

// --patch ... --prerelease
let v = ""

const argv = yargs(hideBin(process.argv))
  .option('major', { desc: '1.0.0 => 1.0.1', coerce(val) { v = val ? '--major' : v; return val; } })
  .option('minor', { desc: '1.0.0 => 1.1.0', coerce(val) { v = val ? '--minor' : v; return val; } })
  .option('patch', { desc: '1.0.0 => 1.0.1', coerce(val) { v = val ? '--patch' : v; return val; } })
  .option('premajor', { desc: '1.0.0-0 => 1.0.1-0', coerce(val) { v = val ? '--premajor' : v; return val; } })
  .option('preminor', { desc: '1.0.0-0 => 1.1.0-0', coerce(val) { v = val ? '--preminor' : v; return val; } })
  .option('prepatch', { desc: '1.0.0-0 => 1.0.1-0', coerce(val) { v = val ? '--prepatch' : v; return val; } })
  .option('prerelease', { desc: '1.0.0-0 => 1.0.0-1', coerce(val) { v = val ? '--prerelease' : v; return val; } })
  .argv

const stdout = execSync(`yarn publish --access public ${v} --no-git-tag-version --no-commit-hooks`);
const pkg = require('./package.json');
const tagLabel = `${pkg.name}-v${pkg.version}`;

console.log(`stdout: ${stdout}`);
console.log(`tagLabel: ${tagLabel}`);

execSync(`git add .`);
execSync(`git ci -m "${tagLabel}"`);
execSync(`git tag -a "${tagLabel}" -m "${tagLabel}"`);

