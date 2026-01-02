#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';

const POSTS_DIR = path.resolve(process.cwd(), 'content/posts');

async function findFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const res = path.resolve(dir, entry.name);
    if (entry.isDirectory()) {
      const nested = await findFiles(res);
      files.push(...nested);
    } else if (entry.isFile() && /\.mdx?$|\.md$/.test(entry.name)) {
      files.push(res);
    }
  }
  return files;
}

const slugify = (str) => String(str || '')
  .toLowerCase()
  .trim()
  .replace(/\s+/g, '-')
  .replace(/[^a-z0-9\-\/]+/g, '')
  .replace(/--+/g, '-')
  .replace(/^[-\/]+|[-\/]+$/g, '');

async function extractSlug(filePath) {
  const content = await fs.readFile(filePath, 'utf8');
  const fm = content.match(/^---\s*\n([\s\S]*?)\n---/);
  if (fm) {
    const fmBody = fm[1];
    const m = fmBody.match(/^\s*slug:\s*['\"]?(.+?)['\"]?\s*$/m);
    if (m) return slugify(m[1]);
  }
  // fallback to filename without extension
  const name = path.basename(filePath, path.extname(filePath));
  return slugify(name);
}

(async function main() {
  try {
    let files = [];
    try {
      files = await findFiles(POSTS_DIR);
    } catch (e) {
      console.log('No posts directory found.');
      return;
    }

    const results = [];
    for (const f of files) {
      const slug = await extractSlug(f);
      results.push({ slug, file: path.relative(process.cwd(), f) });
    }

    if (!results.length) {
      console.log('No posts found.');
      return;
    }

    console.log('Found posts:');
    results.sort((a,b) => a.slug.localeCompare(b.slug)).forEach(r => {
      console.log(`- ${r.slug}  (${r.file})`);
    });
  } catch (err) {
    console.error('Error listing post slugs:', err);
    process.exitCode = 1;
  }
})();
