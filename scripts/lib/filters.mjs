/**
 * filters.mjs
 *
 * Périmètre commun aux scripts qui datent les modifications fonctionnelles d'un composant
 * (badge fonctionnel via functional-history-report.mjs, suivi des composants via
 * generate-component-info.mjs) : quels messages de commit compter, et quels fichiers
 * considérer comme du code source du composant.
 *
 * Les deux scripts doivent répondre la même chose sur les mêmes entrées — d'où ce module :
 * dupliquées, ces règles avaient déjà divergé sur l'exclusion de `__tests__`.
 */

// Commit d'accessibilité : il alimente déjà l'historique a11y, on ne le compte pas deux fois.
// Couvre les formulations rencontrées dans l'historique du dépôt — « a11y », « accessibilité »
// (sans accent final pour attraper le mot sous toutes ses formes), « WCAG », « aria-label »
// ou « aria label » (d'où `[-\s]`, qui évite de matcher « arial »), « contraste », « audit
// accessibilité » (le `.` couvre l'espace, le tiret ou les deux-points) et « RGAA ».
export const a11yOnlyRegex = /a11y|accessibilit|wcag|aria[-\s]|contraste|audit.access|rgaa/i;

// Commit de release, d'outillage ou de doc, reconnu à son PRÉFIXE de type conventionnel
// (`^`) : « chore: », « docs(readme): », « ci! », « build », « release », « bump »,
// « renovate », et les messages automatiques de Renovate (« update dependency X »,
// « update pnpm monorepo »). Le groupe `(\([^)]+\))?` accepte la portée optionnelle
// `(scope)`, et `[!:\s]` le `!` d'un breaking change, le `:` ou une simple espace.
export const releaseOrDocRegex = /^(chore|docs?|ci|build|release|bump|renovate|update dependency|update .* monorepo)(\([^)]+\))?[!:\s]/i;

// Commit sans préfixe conventionnel mais sans impact fonctionnel : mise à jour d'un badge
// de version, du changelog, passage de lint ou retouche de doc / de tokens. Recherché
// n'importe où dans le message, ces commits n'étant pas préfixés.
export const docOnlyMessageRegex = /version badge|add.*badge|badge.*version|update.*changelog|run lint|improve.*doc|improve.*token/i;

/**
 * Vrai si le message décrit une modification fonctionnelle du composant.
 *
 * @param {string} message - Sujet du commit.
 * @returns {boolean}
 */
export function isFunctionalMessage(message) {
  const msg = message.trim();
  return !a11yOnlyRegex.test(msg) && !releaseOrDocRegex.test(msg) && !docOnlyMessageRegex.test(msg);
}

/** Extensions du code d'un composant. Les `.d.ts` en font partie : ils sont réexportés par `src/components/index.ts`, c'est du contrat public. */
export const SOURCE_EXTENSIONS = ['vue', 'ts', 'js', 'scss', 'css'];

/** Fragments de nom qui désignent une story ou un test plutôt que du code de production. */
const NON_SOURCE_SUFFIXES = ['.stories.', '.spec.', '.cy.'];

/** Dossier de tests colocalisé : son contenu n'est pas du code de production non plus. */
const TEST_DIR = '__tests__';

/**
 * Vrai si le chemin désigne du code source d'un composant — ni doc (`.mdx`), ni story,
 * ni test. Accepte un chemin absolu ou relatif, séparateurs Windows compris.
 *
 * @param {string} filePath
 * @returns {boolean}
 */
export function isComponentSourceFile(filePath) {
  const normalized = filePath.split('\\').join('/');
  if (!SOURCE_EXTENSIONS.some((ext) => normalized.endsWith(`.${ext}`))) return false;
  if (normalized.split('/').includes(TEST_DIR)) return false;
  return !NON_SOURCE_SUFFIXES.some((suffix) => normalized.includes(suffix));
}

/**
 * Le même périmètre, exprimé en pathspecs git : à passer après `--` à `git log` pour ne
 * lire que les commits touchant le code du composant.
 *
 * @param {string} componentPath - Chemin du dossier du composant, relatif à la racine.
 * @returns {string[]}
 */
export function sourcePathspecs(componentPath) {
  return [
    ...SOURCE_EXTENSIONS.map((ext) => `:(glob)${componentPath}/**/*.${ext}`),
    ...NON_SOURCE_SUFFIXES.map((suffix) => `:(exclude,glob)${componentPath}/**/*${suffix}*`),
    `:(exclude,glob)${componentPath}/**/${TEST_DIR}/**`,
  ];
}
