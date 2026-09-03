/**
 * generate-component-info.mjs
 *
 * Génère src/stories/Demarrer/component-info.json :
 * pour chaque composant (set de a11y-status.json), son titre Storybook (pour le lien),
 * son statut, sa dernière mise à jour fonctionnelle (functional-history-data.json),
 * sa dernière mise à jour accessibilité (a11y-history-data.json), ses derniers
 * commits fonctionnels et ses commits accessibilité (a11y-commits-data.json).
 *
 * Usage : node generate-component-info.mjs
 */

import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';
import { getNextReleaseTag, getReleaseTags } from './lib/releaseTags.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const dataDir = path.join(root, 'scripts/data');

const a11yStatusPath = path.join(root, 'src/stories/Accessibilite/DesignSystem/a11y-status.json');
const funcHistoryPath = path.join(dataDir, 'functional-history-data.json');
const a11yHistoryPath = path.join(dataDir, 'a11y-history-data.json');
const a11yCommitsPath = path.join(dataDir, 'a11y-commits-data.json');
const outputPath = path.join(root, 'src/stories/Demarrer/component-info.json');

const a11yStatus = JSON.parse(fs.readFileSync(a11yStatusPath, 'utf8'));
const currentPackageVersion = JSON.parse(
  fs.readFileSync(path.join(root, 'package.json'), 'utf8'),
).version.replace(/^v/i, '');
const funcHistory = fs.existsSync(funcHistoryPath)
  ? JSON.parse(fs.readFileSync(funcHistoryPath, 'utf8'))
  : {};
const a11yHistory = fs.existsSync(a11yHistoryPath)
  ? JSON.parse(fs.readFileSync(a11yHistoryPath, 'utf8'))
  : {};
const a11yCommits = fs.existsSync(a11yCommitsPath)
  ? JSON.parse(fs.readFileSync(a11yCommitsPath, 'utf8'))
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

// Version publiee dans laquelle un commit est sorti. Meme convention que le badge
// fonctionnel (functional-history-report.mjs) : premiere release posterieure au commit,
// sinon version courante de package.json (changement en attente de publication).
function getCommitVersion(commitDate) {
  const tag = getNextReleaseTag(commitDate, getReleaseTags(root));
  if (tag) return tag.replace(/^v/i, '');
  return currentPackageVersion;
}

// Nombre de commits fonctionnels conservés par composant. Le suivi des composants filtre
// par version : un plafond trop bas amputait les versions anciennes, dont les commits
// sortaient de la fenêtre pour les composants les plus actifs.
const MAX_COMMITS_PER_COMPONENT = 25;

// Fenêtre d'historique brute a lire avant filtrage : les commits a11y, release et doc en
// sont ecartes, il en faut donc bien plus que le plafond conserve.
const RAW_HISTORY_WINDOW = 150;

function getRecentFunctionalCommits(componentPath) {
  if (!fs.existsSync(path.join(root, componentPath))) return [];
  try {
    const out = execFileSync(
      'git',
      ['log', `-${RAW_HISTORY_WINDOW}`, '--date=iso', '--pretty=format:%ad|%s', '--', componentPath],
      { cwd: root, encoding: 'utf8' },
    );
    return out
      .split('\n')
      .filter(Boolean)
      .map((line) => {
        const separator = line.indexOf('|');
        const date = line.slice(0, separator);
        return {
          // La date affichee reste au format court ; la date iso complete sert a departager
          // les commits et les tags publies le meme jour.
          date: date.slice(0, 10),
          message: line.slice(separator + 1),
          version: getCommitVersion(date),
        };
      })
      .filter((c) => isFunctional(c.message.trim()))
      .slice(0, MAX_COMMITS_PER_COMPONENT);
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

// Résout une entrée d'historique (fonctionnelle, a11y ou liste de commits) par nom de composant
// ou par nom du .vue principal, avec fallback sur le chemin complet.
function resolveHistory(data, leaf, fullName, mainVue) {
  return data[leaf] || data[fullName] || (mainVue ? data[mainVue] : null) || null;
}

const results = a11yStatus.results.map((r) => {
  const leaf = r.componentName.split('/').pop();
  const componentPath = `src/components/${r.componentName}`;
  const mainVue = getMainVue(componentPath, leaf);
  const func = resolveHistory(funcHistory, leaf, r.componentName, mainVue);
  const a11y = resolveHistory(a11yHistory, leaf, r.componentName, mainVue);
  const a11yCommitList = resolveHistory(a11yCommits, leaf, r.componentName, mainVue);
  return {
    componentName: r.componentName,
    storybookTitle: r.storybookTitle || null,
    status: isDeprecated(componentPath) ? 'déprécié' : 'actif',
    functionalVersion: func ? func.version : null,
    functionalDate: func ? func.date : null,
    a11yVersion: a11y ? a11y.version : null,
    a11yDate: a11y ? a11y.date : null,
    commits: getRecentFunctionalCommits(componentPath),
    a11yCommits: a11yCommitList || [],
  };
});

results.sort((a, b) => a.componentName.localeCompare(b.componentName, 'fr'));

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(
  outputPath,
  `${JSON.stringify({ date: new Date().toISOString(), totalCount: results.length, results }, null, 2)}\n`,
);
console.log(`component-info.json genere : ${results.length} composants -> ${outputPath}`);
