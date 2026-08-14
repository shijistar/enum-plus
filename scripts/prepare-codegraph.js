#!/usr/bin/env node

const { spawnSync } = require('node:child_process');
const { existsSync } = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');
const localCodegraphBin = path.join(
  repoRoot,
  'node_modules',
  '.bin',
  process.platform === 'win32' ? 'codegraph.cmd' : 'codegraph',
);
const codegraphCommand = existsSync(localCodegraphBin) ? localCodegraphBin : 'codegraph';

function log(message) {
  console.log(`[prepare-codegraph] ${message}`);
}

function warn(message) {
  console.warn(`[prepare-codegraph] ${message}`);
}

function runCodegraph(args) {
  const result = spawnSync(codegraphCommand, args, {
    cwd: repoRoot,
    stdio: 'inherit',
    shell: true,
  });

  if (result.error) {
    if (result.error.code === 'ENOENT') {
      log('codegraph CLI not found locally or on PATH; skipping initialization.');
      return 'missing';
    }

    warn(`failed to run \`codegraph ${args.join(' ')}\`: ${result.error.message}`);
    return 'failed';
  }

  if (result.status !== 0) {
    warn(`\`codegraph ${args.join(' ')}\` exited with status ${result.status}; continuing install.`);
    return 'failed';
  }

  return 'ok';
}

const hasCodegraphIndex = existsSync(path.join(repoRoot, '.codegraph'));
const action = hasCodegraphIndex ? 'sync' : 'init';
const result = runCodegraph([action]);

if (result === 'missing') {
  process.exit(0);
}
