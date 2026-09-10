/**
 * releaseTags.mjs
 *
 * Résolution de la version de publication d'un commit, partagée par les scripts qui
 * datent les changements (badges fonctionnels, suivi des composants).
 *
 * Convention du dépôt : un commit appartient à la **première release publiée après lui**.
 * Un commit sans tag postérieur n'est pas encore publié — c'est à l'appelant de décider
 * du repli (version courante de `package.json`, `null`…).
 */

import { execFileSync } from 'child_process';

const tagsCache = new Map();

/**
 * Tags de release (semver) triés du plus ancien au plus récent, avec la date du commit
 * qu'ils pointent. Mémoïsé par dépôt : `git tag` + un `git log` par tag, ce n'est pas
 * gratuit et les scripts appelants l'utilisent pour chaque commit.
 *
 * @param {string} rootDir - Racine du dépôt git.
 * @returns {Array<{ tag: string, date: string, hash: string }>}
 */
export function getReleaseTags(rootDir) {
  const cached = tagsCache.get(rootDir);
  if (cached) return cached;

  let tagInfos = [];
  try {
    const stdout = execFileSync('git', ['tag', '-l', '--sort=creatordate'], {
      cwd: rootDir,
      encoding: 'utf8',
    });
    const semverTags = stdout.split('\n').filter((tag) => /^v?\d+\.\d+\.\d+/.test(tag));

    for (const tag of semverTags) {
      try {
        const out = execFileSync('git', ['log', '-1', '--format=%ad|%H', '--date=iso', `${tag}^{}`], {
          cwd: rootDir,
          encoding: 'utf8',
        });
        const [date, hash] = out.trim().split('|');
        if (date && hash) tagInfos.push({ tag, date, hash });
      } catch {
        // tag illisible (objet manquant après un clone partiel) : ignoré
      }
    }
    tagInfos = tagInfos.sort((a, b) => new Date(a.date) - new Date(b.date));
  } catch {
    tagInfos = [];
  }

  tagsCache.set(rootDir, tagInfos);
  return tagInfos;
}

/**
 * Premier tag de release créé après `commitDate`, c'est-à-dire la version dans laquelle
 * le commit a été publié. `null` si le commit n'est pas encore publié.
 *
 * @param {string} commitDate - Date du commit, parsable par `new Date()`.
 * @param {Array<{ tag: string, date: string }>} tagInfos - Sortie de `getReleaseTags`.
 * @returns {string | null}
 */
export function getNextReleaseTag(commitDate, tagInfos) {
  const commitTime = new Date(commitDate).getTime();
  for (const tag of tagInfos) {
    if (new Date(tag.date).getTime() > commitTime) {
      return tag.tag;
    }
  }
  return null;
}

function compareSemver(a, b) {
  const parse = (v) => v.replace(/^v/i, '').split('.').map((n) => Number.parseInt(n, 10) || 0);
  const [aMajor, aMinor, aPatch] = parse(a);
  const [bMajor, bMinor, bPatch] = parse(b);
  return aMajor - bMajor || aMinor - bMinor || aPatch - bPatch;
}

/**
 * Repli pour un commit sans tag postérieur, à partir de la version de `package.json`.
 *
 * Elle n'est retenue que si elle dépasse le dernier tag : entre deux releases,
 * `package.json` contient encore la version **déjà publiée**, et s'y fier attribuerait le
 * commit à une release antérieure à lui. `null` signifie « pas encore publié ».
 *
 * @param {string | null} packageVersion - Version lue dans `package.json`.
 * @param {Array<{ tag: string }>} tagInfos - Sortie de `getReleaseTags`.
 * @returns {string | null}
 */
export function getPendingVersion(packageVersion, tagInfos) {
  if (!packageVersion) return null;
  const latest = tagInfos.at(-1);
  if (!latest) return packageVersion;
  return compareSemver(packageVersion, latest.tag) > 0 ? packageVersion : null;
}
