/**
 * check-package-files.mjs
 *
 * Vérifie le contenu du tarball npm tel que `npm publish` le produirait.
 *
 * Le périmètre de publication est décrit par le champ `files` de package.json,
 * sous forme de motifs de négation. Une erreur dans cette liste passe
 * inaperçue : un motif trop large emporte un fichier nécessaire, un motif trop
 * étroit laisse fuiter tests et documentation. Ce script échoue dans les deux
 * cas, à partir de la sortie de `npm pack --dry-run`.
 *
 * Il vérifie aussi que l'entrée `vuetifyOptions` reste sans `vuetify/components`
 * ni `vuetify/directives` : ces imports annuleraient le tree-shaking de Vuetify
 * chez les consommateurs qui utilisent vite-plugin-vuetify.
 *
 * Usage : pnpm pack:check   (nécessite un `dist/` à jour)
 */

import { execFileSync } from 'child_process';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** Ce qui ne doit jamais être publié : tests, stories, documentation. */
const forbidden = [
  { label: 'tests unitaires', re: /\.spec\.[cm]?[jt]sx?$/ },
  { label: 'tests (convention .test)', re: /\.test\.[cm]?[jt]sx?$/ },
  { label: 'tests Cypress', re: /\.cy\.[cm]?[jt]sx?$/ },
  { label: 'dossiers de tests', re: /(^|\/)(tests|__tests__|__snapshots__)\// },
  { label: 'stories Storybook', re: /\.stories\./ },
  { label: 'documentation MDX', re: /\.mdx$/ },
  { label: 'documentation Markdown de src/', re: /^src\/.*\.md$/i },
  { label: 'fichiers obsolètes', re: /\.old$/ },
];

/**
 * Ce qui doit toujours être publié. `exports` de package.json pointe vers ces
 * chemins : les omettre casse la résolution chez les consommateurs.
 */
const required = [
  'package.json',
  'dist/main.d.ts',
  'dist/design-system-v3.js',
  'dist/vuetifyConfig.js',
  'dist/vuetifyConfig.d.ts',
  'dist/vuetifyOptions.js',
  'dist/vuetifyOptions.d.ts',
  'dist/synapse.css',
  'src/assets/settings.scss',
];

/** Répertoires dont l'absence complète trahit une exclusion trop large. */
const requiredDirs = [
  'dist/components/',
  'src/components/',
  'src/composables/',
  'src/designTokens/',
];

const out = execFileSync('npm', ['pack', '--dry-run', '--json'], {
  cwd: root,
  encoding: 'utf8',
  maxBuffer: 32 * 1024 * 1024,
});
const files = JSON.parse(out)[0].files.map((f) => f.path);

const problems = [];

for (const { label, re } of forbidden) {
  const hits = files.filter((f) => re.test(f));
  if (hits.length) {
    problems.push(
      `${hits.length} fichier(s) à ne pas publier — ${label}\n`
      + hits.slice(0, 5).map((f) => `      ${f}`).join('\n')
      + (hits.length > 5 ? `\n      … et ${hits.length - 5} autre(s)` : ''),
    );
  }
}

for (const file of required) {
  if (!files.includes(file)) problems.push(`fichier requis absent du paquet : ${file}`);
}

for (const dir of requiredDirs) {
  if (!files.some((f) => f.startsWith(dir))) {
    problems.push(`répertoire requis absent du paquet : ${dir}`);
  }
}

/**
 * Entrées qui ne doivent pas importer tous les composants ou toutes les
 * directives Vuetify, y compris par les chunks partagés qu'elles chargent.
 */
const treeShakableEntries = ['dist/vuetifyOptions.js'];
const fullVuetifyImport = /^vuetify\/(components|directives)$/;

/** Suit les imports relatifs (statiques et dynamiques) d'un fichier de `dist/` et renvoie les imports externes rencontrés. */
const collectExternalImports = (entry) => {
  const seen = new Set();
  const external = new Map();
  const visit = (file) => {
    if (seen.has(file)) return;
    seen.add(file);
    const code = readFileSync(path.join(root, file), 'utf8');
    for (const [, specifier] of code.matchAll(/\b(?:from|import)\s*\(?\s*["']([^"']+)["']/g)) {
      if (specifier.startsWith('.')) visit(path.posix.join(path.posix.dirname(file), specifier));
      else if (!external.has(specifier)) external.set(specifier, file);
    }
  };
  visit(entry);
  return external;
};

for (const entry of treeShakableEntries) {
  if (!files.includes(entry)) continue;
  for (const [specifier, file] of collectExternalImports(entry)) {
    if (fullVuetifyImport.test(specifier)) {
      problems.push(`${entry} importe \`${specifier}\` (via ${file}) : le tree-shaking de Vuetify est perdu pour les consommateurs`);
    }
  }
}

if (problems.length) {
  console.error('\n✖ Contenu du paquet npm invalide :\n');
  problems.forEach((p) => console.error(`  - ${p}`));
  console.error('');
  process.exit(1);
}

console.log(`✓ Paquet npm conforme : ${files.length} fichiers, aucun test ni documentation publié.`);
