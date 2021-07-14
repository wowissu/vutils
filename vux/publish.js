#!/usr/bin/env node
const yargs = require('yargs/yargs');
const chalk = require('chalk');
const { hideBin } = require('yargs/helpers')
const { execSync } = require('child_process');

// --patch ... --prerelease
let action = ""

const opts = {
  major: { type: 'boolean', desc: '1.0.0 => 1.0.1', coerce(val) { action = val ? '--major' : action; return val; } },
  minor: { type: 'boolean', desc: '1.0.0 => 1.1.0', coerce(val) { action = val ? '--minor' : action; return val; } },
  patch: { type: 'boolean', desc: '1.0.0 => 1.0.1', coerce(val) { action = val ? '--patch' : action; return val; } },
  premajor: { type: 'boolean', desc: '1.0.0-0 => 1.0.1-0', coerce(val) { action = val ? '--premajor' : action; return val; } },
  preminor: { type: 'boolean', desc: '1.0.0-0 => 1.1.0-0', coerce(val) { action = val ? '--preminor' : action; return val; } },
  prepatch: { type: 'boolean', desc: '1.0.0-0 => 1.0.1-0', coerce(val) { action = val ? '--prepatch' : action; return val; } },
  prerelease: { type: 'boolean', desc: '1.0.0-0 => 1.0.0-1', coerce(val) { action = val ? '--prerelease' : action; return val; } }
}

yargs(hideBin(process.argv))
  .usage('--patch ... --prerelease to update the version. and gen git commit & tag.')
  .options(opts)
  .showHelpOnFail(true)
  // .conflicts('major', 'minor', 'patch', 'premajor', 'preminor', 'prepatch', 'prerelease')
  .check((argv) => {
    return Object.keys(opts).some((optKey) => {
      return argv[optKey] === true
    }) || chalk.redBright`Please pick one version option. \n`;
  })
  .argv

const stdout = execSync(`yarn version ${action} --no-git-tag-version --no-commit-hooks`);
const pkg = require('./package.json');
const tagLabel = `${pkg.name}-v${pkg.version}`;

process.stdin.setEncoding('utf-8');

process.stdout.write(chalk`\n{bold.yellow Confirm！} 再次輸入版本號碼 {bold.green ${pkg.version}} 以繼續動作 \n[輸入{bold.green ${pkg.version}}]:`);

process.stdin.on('readable', () => {
  const input = process.stdin.read().trim();

  if (input !== null) {
    if (input === pkg.version) {
      const stdout = execSync(`yarn publish --access public --no-git-tag-version --no-commit-hooks --new-version ${pkg.version}`);

      console.log(`publish: ${stdout}`);
      gitHandler();

    } else {
      process.exit(1);
    }
  }
});

function gitHandler() {
  execSync(`git add .`);
  execSync(`git ci -m "${tagLabel}"`);
  execSync(`git tag -a "${tagLabel}" -m "${tagLabel}"`);

  console.log(`git add commit & tag "${tagLabel}"`);
}