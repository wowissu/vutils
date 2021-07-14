#!/usr/bin/env node
const yargs = require('yargs/yargs');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
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
  .command('vux', "Publish @wowissu/vux", (argv) => {
    argv
      .positional('cwd', { default: path.resolve(__dirname, 'vux') })
      .options(opts)
  })
  .showHelpOnFail(true)
  .demandCommand(1)
  .check((argv) => {

    // check cwd path
    if (!argv.cwd || !fs.existsSync(argv.cwd)) {
      return chalk.yellow`<!> Working dir "${argv.cwd}" is not exists. \n`;
    }

    // check version option
    const hasVersionOpt = Object.keys(opts).some((optKey) => {
      return argv[optKey] === true
    })

    if (hasVersionOpt === false) {
      return chalk.yellow`<!> Please pick one version option. \n`;
    }

    return true;
  })
  .argv

const execCommonOpt = { cwd: argv.cwd }
const packageJsonPath = path.join(argv.cwd, 'package.json');

execSync(`yarn version ${action} --no-git-tag-version --no-commit-hooks`, execCommonOpt);

const pkg = require(packageJsonPath);
const tagLabel = `${pkg.name}-v${pkg.version}`;

process.stdin.setEncoding('utf-8');

process.stdout.write(chalk`\n{bold.yellow Confirm！} 再次輸入版本號碼 {bold.green ${pkg.version}} 以繼續動作 \n[輸入{bold.green ${pkg.version}}]:`);

process.stdin.on('readable', () => {
  const input = process.stdin.read().trim();

  if (input !== null && input === pkg.version) {
    gitHandler(execCommonOpt);

    const stdout = execSync(`yarn publish --access public --no-git-tag-version --no-commit-hooks --new-version ${pkg.version}`, execCommonOpt);

    console.log(`${stdout}`);
  } else {
    process.exit(1);
  }
});

function gitHandler(execOpts) {
  execSync(`git add .`, execOpts);
  execSync(`git ci -m "${tagLabel}"`, execOpts);
  execSync(`git tag -a "${tagLabel}" -m "${tagLabel}"`, execOpts);

  console.log(`git add commit & tag "${tagLabel}"`);
}