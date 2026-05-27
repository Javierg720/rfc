#!/usr/bin/env node
/**
 * Image Optimization Script for RFC Frontend
 * 
 * Optimizes PNG and GIF assets for production deployment.
 * Run with: node scripts/optimize-images.js
 */

import { readdirSync, statSync, existsSync } from 'fs';
import { join, extname, basename } from 'path';
import { execSync } from 'child_process';

const ASSET_DIRS = [
  'symbols',
  'assets/fighter-select',
  'assets/fighter-animations',
  'art',
];

const MAX_GIF_SIZE_MB = 5;
const MAX_PNG_SIZE_MB = 0.5;

function getFileSizeMB(filePath) {
  return statSync(filePath).size / (1024 * 1024);
}

function scanDirectory(dir) {
  const results = [];
  const fullPath = join(process.cwd(), dir);
  if (!existsSync(fullPath)) return results;
  
  const files = readdirSync(fullPath, { withFileTypes: true });
  for (const file of files) {
    if (file.isFile()) {
      const ext = extname(file.name).toLowerCase();
      if (ext === '.png' || ext === '.gif') {
        const filePath = join(fullPath, file.name);
        const sizeMB = getFileSizeMB(filePath);
        results.push({ path: filePath, name: file.name, ext, sizeMB, dir });
      }
    }
  }
  return results;
}

function checkTools() {
  const tools = ['python3'];
  const missing = [];
  for (const tool of tools) {
    try {
      execSync(`which ${tool}`, { stdio: 'ignore' });
    } catch {
      missing.push(tool);
    }
  }
  if (missing.length > 0) {
    console.warn(`⚠️  Missing tools: ${missing.join(', ')}`);
    console.warn('   Install them for full optimization capabilities.');
  }
  return missing.length === 0;
}

function main() {
  console.log('🔍 RFC Image Optimization Audit\n');
  
  let totalOriginal = 0;
  let oversizedGifs = 0;
  let oversizedPngs = 0;
  const allFiles = [];
  
  for (const dir of ASSET_DIRS) {
    const files = scanDirectory(dir);
    allFiles.push(...files);
    for (const file of files) {
      totalOriginal += file.sizeMB;
      if (file.ext === '.gif' && file.sizeMB > MAX_GIF_SIZE_MB) {
        oversizedGifs++;
        console.log(`⚠️  OVERSIZED GIF: ${join(dir, file.name)} (${file.sizeMB.toFixed(2)} MB > ${MAX_GIF_SIZE_MB} MB limit)`);
      }
      if (file.ext === '.png' && file.sizeMB > MAX_PNG_SIZE_MB) {
        oversizedPngs++;
        console.log(`⚠️  OVERSIZED PNG: ${join(dir, file.name)} (${file.sizeMB.toFixed(2)} MB > ${MAX_PNG_SIZE_MB} MB limit)`);
      }
    }
  }
  
  console.log(`\n📊 Summary:`);
  console.log(`   Total image assets: ${allFiles.length}`);
  console.log(`   Total size: ${totalOriginal.toFixed(2)} MB`);
  console.log(`   Oversized GIFs: ${oversizedGifs}`);
  console.log(`   Oversized PNGs: ${oversizedPngs}`);
  
  if (oversizedGifs === 0 && oversizedPngs === 0) {
    console.log('\n✅ All images within size limits!');
  } else {
    console.log('\n💡 Recommendations:');
    console.log('   - Use Python/Pillow to reduce GIF palette and dimensions');
    console.log('   - Use pngquant or oxipng for PNG compression');
    console.log('   - Consider WebP/AVIF fallbacks for modern browsers');
  }
  
  // Check if Python optimization script exists
  const pyScript = join(process.cwd(), 'scripts', 'optimize_gifs.py');
  if (existsSync(pyScript)) {
    console.log(`\n🐍 Python optimizer found at: ${pyScript}`);
    console.log('   Run: python3 scripts/optimize_gifs.py');
  }
  
  process.exit(oversizedGifs + oversizedPngs > 0 ? 1 : 0);
}

main();
