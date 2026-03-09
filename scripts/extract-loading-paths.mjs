#!/usr/bin/env node
/**
 * 从 loading 的 SVG 中提取所有顶层 <path d="..."> 的 d 值（忽略 <mask> 内的 path），
 * 并生成 loadingMotionPaths.ts 的 LOADING_PATH_DATA 与 LOADING_VIEWBOX。
 * 用法: node scripts/extract-loading-paths.mjs < path-to-loading.svg
 * 或: node scripts/extract-loading-paths.mjs path-to-loading.svg
 */
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const svgPath = process.argv[2];
const svg = svgPath
  ? readFileSync(svgPath, 'utf8')
  : await new Promise((res, rej) => {
      let data = '';
      process.stdin.setEncoding('utf8');
      process.stdin.on('data', (chunk) => (data += chunk));
      process.stdin.on('end', () => res(data));
      process.stdin.on('error', rej);
    });

// 移除 mask 块，只保留顶层 path（避免取到 mask 内的 path）
const withoutMasks = svg.replace(/<mask[^>]*>[\s\S]*?<\/mask>/gi, '');
// 匹配顶层 <path d="..."> 的 d 属性（d 内无未转义引号）
const pathDRe = /<path\s+d="([^"]*)"/g;
const paths = [];
let m;
while ((m = pathDRe.exec(withoutMasks)) !== null) {
  paths.push(m[1]);
}

let viewBox = '0 0 83 28';
const vbMatch = svg.match(/viewBox\s*=\s*["']([^"']+)["']/i);
if (vbMatch) viewBox = vbMatch[1].trim();

if (paths.length === 0) {
  console.error('未提取到任何 path，请检查 SVG 文件：');
  console.error('  1. 文件是否为空？请把完整 SVG（从 <svg> 到 </svg>）粘贴进 public/loading-source.svg');
  console.error('  2. 是否包含 <path d="...">？');
  process.exit(1);
}

const outPath = join(root, 'src/components/ui/loadingMotionPaths.ts');
const pathStrings = paths.map((d) => '  ' + JSON.stringify(d)).join(',\n');
const content = `/**
 * 由 scripts/extract-loading-paths.mjs 从 SVG 自动生成，请勿手改 path 顺序。
 * viewBox 与 path 顺序与源 SVG 一致（忽略 mask，仅顶层 path）。
 */
export const LOADING_VIEWBOX = ${JSON.stringify(viewBox)};

export const LOADING_PATH_DATA: string[] = [\n${pathStrings}\n];
`;

writeFileSync(outPath, content, 'utf8');
console.log(`已写入 ${paths.length} 条 path，viewBox ${viewBox} → ${outPath}`);
process.exit(0);
