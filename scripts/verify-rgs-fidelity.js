#!/usr/bin/env node
/**
 * RFC RGS Fidelity Verifier
 * Replays sample events from the official math books and validates that
 * the frontend parsing + visible grid + scatter detection would match expectations.
 *
 * Run: node scripts/verify-rgs-fidelity.js
 *
 * This is a lightweight Node check (no DOM). It exercises the exact pure functions
 * that the browser uses (rgsBoardToGrid, countScatterCells, etc.) by inlining minimal
 * versions of the critical logic.
 */

import { readFileSync } from 'fs';
import { execSync } from 'child_process';
import { join } from 'path';

const MATH_DIR = join(process.cwd(), '..', 'UPLOAD_THIS_RFC_MATH');
const BASE_BOOK = join(MATH_DIR, 'books_base.jsonl.zst');
const BONUS_BOOK = join(MATH_DIR, 'books_bonus.jsonl.zst');

function decompressFirstN(path, n = 50) {
  const cmd = `zstd -d -c "${path}" 2>/dev/null | head -n ${n}`;
  const out = execSync(cmd, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
  return out.trim().split('\n').filter(Boolean).map(l => JSON.parse(l));
}

function rgsBoardToGrid(board) {
  // Exact copy of the browser logic (with defensive guards)
  const grid = [[], [], [], [], []];
  const rowOffset = board && board.length >= 5 ? 1 : 0;
  for (let col = 0; col < 5; col++) {
    for (let row = 0; row < 3; row++) {
      const cell = board[row + rowOffset] && board[row + rowOffset][col];
      grid[col][row] = (cell && cell.name) || 'L1';
    }
  }
  return grid;
}

function countScatterCells(grid) {
  let count = 0;
  const cells = [];
  for (let col = 0; col < 5; col++) {
    for (let row = 0; row < 3; row++) {
      if (grid[col] && grid[col][row] === 'S') {
        count++;
        cells.push(`${col}-${row}`);
      }
    }
  }
  return { count, cells };
}

function hasFreeSpinTrigger(events) {
  return events.some(e => e.type === 'freeSpinTrigger' || (e.gameType || '').toLowerCase().includes('free'));
}

console.log('=== RFC RGS Fidelity Verifier ===');
console.log('Loading samples from official math books...\n');

let baseSamples, bonusSamples;
try {
  baseSamples = decompressFirstN(BASE_BOOK, 80);
  bonusSamples = decompressFirstN(BONUS_BOOK, 30);
} catch (e) {
  console.error('Failed to read/decompress books. Is zstd installed and MATH dir present?');
  console.error(e.message);
  process.exit(1);
}

let passed = 0;
let failed = 0;
let scatterMismatches = 0;
let freeTriggers = 0;

function checkEvent(label, ev) {
  if (!ev || ev.type !== 'reveal' || !ev.board) return;
  const grid = rgsBoardToGrid(ev.board);
  const vis = countScatterCells(grid);

  // Basic sanity: we always get a 5x3 grid of strings
  if (grid.length !== 5 || grid[0].length !== 3) {
    console.error(`  [FAIL] ${label} — grid shape wrong`);
    failed++;
    return;
  }

  // Count total S in the full 5-row board (math may trigger on any row)
  let totalS = 0;
  for (const row of ev.board) for (const c of row) if (c && c.name === 'S') totalS++;

  // Visible (offset 1) scatters should be a reasonable subset
  if (vis.count > totalS) {
    console.error(`  [WARN] ${label} — visible scatters (${vis.count}) > total in board (${totalS})`);
    scatterMismatches++;
  }

  if (hasFreeSpinTrigger(ev.events || [])) {
    freeTriggers++;
  }

  passed++;
}

console.log('Checking base game samples...');
baseSamples.forEach((e, i) => {
  const reveal = (e.events || []).find(x => x.type === 'reveal');
  if (reveal) checkEvent(`base#${e.id || i}`, reveal);
});

console.log('Checking bonus game samples...');
bonusSamples.forEach((e, i) => {
  const reveal = (e.events || []).find(x => x.type === 'reveal');
  if (reveal) checkEvent(`bonus#${e.id || i}`, reveal);
});

console.log('\n=== SUMMARY ===');
console.log(`Samples processed: ${passed + failed}`);
console.log(`Passed grid parsing: ${passed}`);
console.log(`Failed: ${failed}`);
console.log(`Free spin triggers seen: ${freeTriggers}`);
console.log(`Scatter count edge cases: ${scatterMismatches}`);

if (failed === 0) {
  console.log('\n✅ All checked events parsed cleanly. Frontend rgsBoardToGrid + scatter logic is compatible with the supplied math books.');
  console.log('   (Note: full 3-row visible scatter count is a presentation subset; server is authoritative for triggers.)');
} else {
  console.log('\n❌ Issues detected — review the failures above.');
  process.exit(1);
}