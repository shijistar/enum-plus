import { readdirSync, readFileSync, statSync, writeFileSync } from 'fs';
import { join } from 'path';

/*
 * This script adds .js extensions to `import` paths in output javascript files.
 *
 * Have tried the babel-plugin-add-import-extension plugin, but encountered "Maximum call stack size exceeded" error.
 * So changed to a post-build processing approach instead.
 */

processDir('./es');
processDir('./es-legacy');

function processDir(dir: string) {
  for (const file of readdirSync(dir)) {
    const fullPath = join(dir, file);
    if (statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (file.endsWith('.js')) {
      let content = readFileSync(fullPath, 'utf8');
      content = content.replace(/from\s+(['"])([./][^'"]+)['"]/g, (match, quote, importPath) => {
        if (!importPath.endsWith('.js')) {
          return `from ${quote}${importPath}.js${quote}`;
        }
        return match;
      });
      writeFileSync(fullPath, content);
    }
  }
}
