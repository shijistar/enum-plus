import fs from 'node:fs';
import path from 'node:path';

interface DocTitle {
  fileName: string;
  title?: string;
  titleCN?: string;
}

const rootDir = path.resolve(__dirname, '../');
const docsDir = path.join(rootDir, '.storybook/docs');
const outputFile = path.join(docsDir, 'titles.json');

function getAllMdxFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) {
    return [];
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      return getAllMdxFiles(fullPath);
    }

    return entry.isFile() && fullPath.endsWith('.mdx') ? [fullPath] : [];
  });
}

function getMetaTitles(content: string, file: string): DocTitle | null {
  const metaMatch = content.match(/<Meta\b[\s\S]*?\/>/);

  if (!metaMatch) {
    return null;
  }

  const metaTag = metaMatch[0];
  const fileName = file.replace(rootDir, '').replace(/^[/\\]/, '');
  const titleMatch = metaTag.match(/\btitle\s*=\s*["']([^"']+)["']/);
  const titleCNMatch = metaTag.match(/\btitleCN\s*=\s*["']([^"']+)["']/);

  if (!titleMatch) {
    return null;
  }

  return {
    fileName,
    title: titleMatch?.[1],
    titleCN: titleCNMatch?.[1],
  };
}

function main() {
  const files = getAllMdxFiles(docsDir);
  const titles: DocTitle[] = [];

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const metaTitles = getMetaTitles(content, file);

    if (metaTitles) {
      titles.push(metaTitles);
    }
  }

  fs.writeFileSync(outputFile, JSON.stringify(titles, null, 2), 'utf8');
}

main();
