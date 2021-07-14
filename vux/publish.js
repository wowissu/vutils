#!/usr/bin/env node
const yargs = require('yargs/yargs');
const chalk = require('chalk');
const { hideBin } = require('yargs/helpers')
const { execSync } = require('child_process');

// --patch ... --prerelease
let action = ""

const argv = yargs(hideBin(process.argv))
  .option('major', { desc: '1.0.0 => 1.0.1', coerce(val) { action = val ? '--major' : action; return val; } })
  .option('minor', { desc: '1.0.0 => 1.1.0', coerce(val) { action = val ? '--minor' : action; return val; } })
  .option('patch', { desc: '1.0.0 => 1.0.1', coerce(val) { action = val ? '--patch' : action; return val; } })
  .option('premajor', { desc: '1.0.0-0 => 1.0.1-0', coerce(val) { action = val ? '--premajor' : action; return val; } })
  .option('preminor', { desc: '1.0.0-0 => 1.1.0-0', coerce(val) { action = val ? '--preminor' : action; return val; } })
  .option('prepatch', { desc: '1.0.0-0 => 1.0.1-0', coerce(val) { action = val ? '--prepatch' : action; return val; } })
  .option('prerelease', { desc: '1.0.0-0 => 1.0.0-1', coerce(val) { action = val ? '--prerelease' : action; return val; } })
  .argv

const stdout = execSync(`yarn version ${action} --no-git-tag-version --no-commit-hooks`);
const pkg = require('./package.json');
const tagLabel = `${pkg.name}-v${pkg.version}`;

console.log(`stdout: ${stdout}`);


process.stdin.setEncoding('utf-8');

process.stdout.write(chalk`\n{bold.yellow Confirm！} 再次輸入版本號碼 {bold.green ${pkg.version}} 以繼續動作 \n[輸入{bold.green ${pkg.version}}]:`);

process.stdin.on('readable', () => {
  const input = process.stdin.read().trim();

  if (input !== null) {
    if (input === pkg.version) {
      const stdout = execSync(`yarn publish --access public --no-git-tag-version --no-commit-hooks --new-version ${pkg.version}`);

      console.log(stdout);

    } else {
      process.exit(1);
    }
  }
});

function gitHandler() {


  execSync(`git add .`);
  execSync(`git ci -m "${tagLabel}"`);
  execSync(`git tag -a "${tagLabel}" -m "${tagLabel}"`);

  console.log(`tagLabel: ${tagLabel}`);
}