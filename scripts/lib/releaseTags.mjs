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
