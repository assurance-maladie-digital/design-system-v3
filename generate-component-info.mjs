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

// Filtres identiques au badge fonctionnel (functional-history-report.mjs) : on ne garde que
// les modifications FONCTIONNELLES en excluant l'a11y, les release/ci/doc et les commits doc-only.
const a11yOnlyRegex = /a11y|accessibilit|wcag|aria[-\s]|contraste|audit.access|rgaa/i;
const releaseOrDocRegex = /^(chore|docs?|ci|build|release|bump|renovate|update dependency|update .* monorepo)(\([^)]+\))?[!:\s]/i;
const docOnlyMessageRegex = /version badge|add.*badge|badge.*version|update.*changelog|run lint|improve.*doc|improve.*token/i;

const isFunctional = (msg) =>
  !a11yOnlyRegex.test(msg) && !releaseOrDocRegex.test(msg) && !docOnlyMessageRegex.test(msg);

// Détection des composants dépréciés : convention du Design System = story `DeprecationNotice`
// créée via `createDeprecationNotice(...)` dans les .stories.ts/.mdx du composant
// (cf. PaginatedTable, SyInputSelect). Source de vérité = la doc, pas une liste à maintenir.
const DEPRECATION_MARKER = /createDeprecationNotice|DeprecationNotice/;

function findSourceFiles(dir, acc = []) {
  try {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) findSourceFiles(full, acc);
      else if (entry.name.endsWith('.stories.ts') || entry.name.endsWith('.mdx')) acc.push(full);
    }
  } catch {
    // ignore
  }
  return acc;
}

function isDeprecated(componentPath) {
  return findSourceFiles(path.join(root, componentPath)).some((f) =>
    DEPRECATION_MARKER.test(fs.readFileSync(f, 'utf8')),
  );
}

function getLast10FunctionalCommits(componentPath) {
  if (!fs.existsSync(path.join(root, componentPath))) return [];
  try {
    // On récupère un large historique puis on filtre, pour obtenir 10 commits fonctionnels.
    const out = execFileSync(
      'git',
      ['log', '-60', '--date=short', '--pretty=format:%ad%s', '--', componentPath],
      { cwd: root, encoding: 'utf8' },
    );
    // --date=short : la date fait toujours 10 caracteres (YYYY-MM-DD), le reste est le message.
    return out
      .split('\n')
      .filter(Boolean)
      .map((line) => ({ date: line.slice(0, 10), message: line.slice(10) }))
      .filter((c) => isFunctional(c.message.trim()))
      .slice(0, 10);
  } catch {
    return [];
  }
}

// Nom du .vue principal du dossier (l'historique est clé par basename de .vue :
// ex. dossier DatePicker/CalendarMode -> DatePicker.vue -> clé "DatePicker").
function getMainVue(componentPath, leaf) {
  try {
    const vues = fs.readdirSync(path.join(root, componentPath)).filter((f) => f.endsWith('.vue'));
    const picked = vues.find((f) => f.replace('.vue', '') === leaf) || vues[0];
    return picked ? picked.replace('.vue', '') : null;
  } catch {
    return null;
  }
}

const results = a11yStatus.results.map((r) => {
  const leaf = r.componentName.split('/').pop();
  const componentPath = `src/components/${r.componentName}`;
  const mainVue = getMainVue(componentPath, leaf);
  const func =
    funcHistory[leaf] || funcHistory[r.componentName] || (mainVue ? funcHistory[mainVue] : null) || null;
  return {
    componentName: r.componentName,
    storybookTitle: r.storybookTitle || null,
    status: isDeprecated(componentPath) ? 'déprécié' : 'actif',
    functionalVersion: func ? func.version : null,
    functionalDate: func ? func.date : null,
    commits: getLast10FunctionalCommits(componentPath),
  };
});

results.sort((a, b) => a.componentName.localeCompare(b.componentName, 'fr'));

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(
  outputPath,
  `${JSON.stringify({ date: new Date().toISOString(), totalCount: results.length, results }, null, 2)}\n`,
);
console.log(`component-info.json genere : ${results.length} composants -> ${outputPath}`);
