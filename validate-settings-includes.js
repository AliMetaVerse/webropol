#!/usr/bin/env node

/**
 * Validate presence and order of canonical Settings includes on Header-enabled pages
 * Order must be:
 *  - components/modals/Modal.js
 *  - components/modals/SettingsModal.js
 *  - utils/theme-manager.js
 *  - utils/global-settings-manager.js
 */

const fs = require('fs');
const path = require('path');

const WORKSPACE_ROOT = process.cwd();
const WEBROPOL_DIR = WORKSPACE_ROOT; // this script is intended to run from the webropol folder

function findHtmlFiles(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === 'design-system') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findHtmlFiles(full, files);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(full);
    }
  }
  return files;
}

function hasHeader(content) {
  return content.includes('components/navigation/Header.js');
}

function validateOrder(content, basePrefix) {
  const required = [
    `${basePrefix}design-system/components/modals/Modal.js`,
    `${basePrefix}design-system/components/modals/SettingsModal.js`,
    `${basePrefix}design-system/utils/theme-manager.js`,
    `${basePrefix}design-system/utils/global-settings-manager.js`,
  ];
  const requiredCss = [
    `${basePrefix}design-system/styles/animations.css`,
  ];

  const indices = required.map((src) => content.indexOf(src));
  const missing = required.filter((src, i) => indices[i] === -1);

  // CSS presence (not order-sensitive)
  const missingCss = requiredCss.filter((href) => content.indexOf(href) === -1);

  const duplicates = required
    .map((src) => ({ src, count: (content.match(new RegExp(src.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length }))
    .filter((x) => x.count > 1);

  // Ensure strict order when present
  let orderOk = true;
  if (missing.length === 0) {
    orderOk = indices.every((idx, i) => i === 0 || idx > indices[i - 1]);
  }

  return { missing, missingCss, duplicates, orderOk };
}

function expectedBasePrefix(filePath) {
  // root-level files under webropol/ should use '' ; subfolders use '../'
  const rel = path.relative(WEBROPOL_DIR, filePath);
  const depth = rel.split(path.sep).length - 1; // folders deep from webropol root
  return depth === 0 ? '' : '../';
}

function validateFile(filePath) {
  const html = fs.readFileSync(filePath, 'utf8');
  if (!hasHeader(html)) return null; // Only validate Header-enabled pages

  const basePrefix = expectedBasePrefix(filePath);
  const { missing, missingCss, duplicates, orderOk } = validateOrder(html, basePrefix);

  const issues = [];
  if (missing.length) issues.push(`Missing: ${missing.join(', ')}`);
  if (missingCss.length) issues.push(`Missing CSS: ${missingCss.join(', ')}`);
  if (duplicates.length) issues.push(`Duplicates: ${duplicates.map((d) => `${d.src} x${d.count}`).join('; ')}`);
  if (!orderOk) issues.push('Incorrect include order');

  return {
    file: path.relative(WEBROPOL_DIR, filePath),
    basePrefix,
    issues,
    valid: issues.length === 0,
  };
}

function main() {
  console.log('🔍 Validating canonical Settings includes on Header-enabled pages...\n');
  const files = findHtmlFiles(WEBROPOL_DIR);
  const results = files.map(validateFile).filter(Boolean);

  const invalid = results.filter((r) => !r.valid);
  const valid = results.filter((r) => r.valid);

  console.log(`📊 Summary:`);
  console.log(`  Checked pages: ${results.length}`);
  console.log(`  ✅ Valid: ${valid.length}`);
  console.log(`  ❌ Invalid: ${invalid.length}\n`);

  if (invalid.length) {
    console.log('❌ Pages needing updates:');
    for (const r of invalid) {
      console.log(`  - ${r.file}`);
      r.issues.forEach((i) => console.log(`     • ${i}`));
    }
    console.log();
  }

  if (valid.length) {
    console.log('✅ Pages with correct includes:');
    valid.forEach((r) => console.log(`  • ${r.file}`));
  }

  process.exit(invalid.length ? 1 : 0);
}

if (require.main === module) main();
