/**
 * generate-component-info.mjs
 *
 * Génère src/stories/Demarrer/component-info.json :
 * pour chaque composant (set de a11y-status.json), son titre Storybook (pour le lien),
 * sa dernière mise à jour fonctionnelle (functional-history-data.json) et ses 10 derniers
 * commits git.
 *
 * Usage : node generate-component-info.mjs
 */

import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = __dirname;

const a11yStatusPath = path.join(root, 'src/stories/Accessibilite/DesignSystem/a11y-status.json');
const funcHistoryPath = path.join(root, 'functional-history-data.json');
const outputPath = path.join(root, 'src/stories/Demarrer/component-info.json');

const a11yStatus = JSON.parse(fs.readFileSync(a11yStatusPath, 'utf8'));
const funcHistory = fs.existsSync(funcHistoryPath)
  ? JSON.parse(fs.readFileSync(funcHistoryPath, 'utf8'))
  : {};

function getLast10Commits(componentPath) {
  if (!fs.existsSync(path.join(root, componentPath))) return [];
  try {
    const out = execFileSync(
      'git',
      ['log', '-10', '--date=short', '--pretty=format:%ad%s', '--', componentPath],
      { cwd: root, encoding: 'utf8' },
    );
    // --date=short : la date fait toujours 10 caracteres (YYYY-MM-DD), le reste est le message.
    return out
      .split('\n')
      .filter(Boolean)
      .map((line) => ({ date: line.slice(0, 10), message: line.slice(10) }));
  } catch {
    return [];
  }
}

const results = a11yStatus.results.map((r) => {
  const leaf = r.componentName.split('/').pop();
  const func = funcHistory[leaf] || funcHistory[r.componentName] || null;
  const componentPath = `src/components/${r.componentName}`;
  return {
    componentName: r.componentName,
    storybookTitle: r.storybookTitle || null,
    functionalVersion: func ? func.version : null,
    functionalDate: func ? func.date : null,
    commits: getLast10Commits(componentPath),
  };
});

results.sort((a, b) => a.componentName.localeCompare(b.componentName, 'fr'));

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(
  outputPath,
  `${JSON.stringify({ date: new Date().toISOString(), totalCount: results.length, results }, null, 2)}\n`,
);
console.log(`component-info.json genere : ${results.length} composants -> ${outputPath}`);
