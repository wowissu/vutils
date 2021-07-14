#!/usr/bin/env node
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const { exec, execSync } = require('child_process');
const { EOL } = require('os');

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

const yarnVersionCmd = `yarn version ${v} --no-git-tag-version --no-commit-hooks`


yarnVersion().then(({ tagLabel }) => gitHandler(tagLabel))


function yarnVersion() {
  return new Promise((resolve, reject) => {
    console.log(`exec: ${yarnVersionCmd}`);
    // yarn version
    exec(yarnVersionCmd, (err, stdout, stderr) => {
      if (err) {
        reject(err);
        return;
      }

      if (stderr) {
        reject(new Error(stderr));
        return;
      }

      console.log(`${stdout}`);

      const pkg = require('./package.json')

      resolve({ tagLabel: `${pkg.name}-v${pkg.version}` });
    })
  })
}

function gitHandler(tagLabel) {
  return new Promise((resolve) => {
    execSync(`git add .`);
    execSync(`git ci -m "${tagLabel}"`);
    execSync(`git tag -a "${tagLabel}" -m "${tagLabel}"`);
  })
}