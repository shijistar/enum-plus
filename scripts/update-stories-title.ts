import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

interface StoryTitle {
  fileName: string;
  title?: string;
  titleCN?: string;
}

const rootDir = path.resolve(__dirname, '../');
const storiesDir = path.join(rootDir, '.storybook/stories');
const outputFile = path.join(storiesDir, 'titles.json');

function getAllStoryFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) {
    return [];
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      return getAllStoryFiles(fullPath);
    }

    return entry.isFile() && /\.stories\.[cm]?[jt]sx?$/.test(fullPath) ? [fullPath] : [];
  });
}

function getStringProperty(node: ts.ObjectLiteralExpression, propertyName: string): string | undefined {
  for (const property of node.properties) {
    if (!ts.isPropertyAssignment(property)) {
      continue;
    }

    const name = property.name;
    if (!ts.isIdentifier(name) && !ts.isStringLiteral(name)) {
      continue;
    }

    if (name.text !== propertyName) {
      continue;
    }

    const initializer = property.initializer;
    if (ts.isStringLiteral(initializer) || ts.isNoSubstitutionTemplateLiteral(initializer)) {
      return initializer.text;
    }
  }

  return undefined;
}

function formatExportName(name: string) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .trim();
}

function getTitles(content: string, file: string): StoryTitle[] {
  const sourceFile = ts.createSourceFile(file, content, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const fileName = file.replace(rootDir, '').replace(/^[/\\]/, '');
  const titles: StoryTitle[] = [];

  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement)) {
      continue;
    }

    const isExported = statement.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword) ?? false;

    for (const declaration of statement.declarationList.declarations) {
      if (
        !ts.isIdentifier(declaration.name) ||
        !declaration.initializer ||
        !ts.isObjectLiteralExpression(declaration.initializer)
      ) {
        continue;
      }

      const objectLiteral = declaration.initializer;
      const title = getStringProperty(objectLiteral, 'title');
      const titleCN = getStringProperty(objectLiteral, 'titleCN');

      if (declaration.name.text === 'meta' && title) {
        titles.push({ fileName, title, titleCN });
        continue;
      }

      if (!isExported) {
        continue;
      }

      const storyTitle = getStringProperty(objectLiteral, 'name') ?? formatExportName(declaration.name.text);
      const storyTitleCN = getStringProperty(objectLiteral, 'nameCN');

      if (storyTitle) {
        titles.push({ fileName, title: storyTitle, titleCN: storyTitleCN });
      }
    }
  }

  return titles;
}

function main() {
  const files = getAllStoryFiles(storiesDir);
  const titles: StoryTitle[] = [];

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    titles.push(...getTitles(content, file));
  }

  fs.writeFileSync(outputFile, JSON.stringify(titles, null, 2), 'utf8');
}

main();
