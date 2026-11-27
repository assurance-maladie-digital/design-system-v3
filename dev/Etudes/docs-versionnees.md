# Étude — Documentation par version

## Problème

**Demande client :** « Est-il possible d'accéder à la documentation d'une version précédente depuis https://cnam-design-system.netlify.app ? »

**Branche :** `chore/etude-docs-versionnees`.

**Constat :** la documentation en ligne ne montre que la dernière version publiée.

- `netlify.toml` construit et publie un seul Storybook (`pnpm run build-storybook`, dossier `storybook-static`) : pas de déploiement par version.
- `.storybook/main.ts` ne déclare aucune `refs` et la doc ne propose aucun sélecteur de version.
- Les versions sont taguées dans Git (`v1.1.5` … `v1.2.2`).
- `.github/workflows/chromatic.yml` publie le Storybook sur Chromatic à chaque push sur `prod`. Les builds Chromatic ont des permaliens par commit, mais ils ne sont accessibles au client que si le projet Chromatic est public (non vérifié).

**Contournements actuels :**

| Moyen | Limite |
|---|---|
| Storybook en local (`git checkout v1.x.x`, `pnpm install`, `pnpm storybook`) | Demande un clone et un environnement de dev |
| Permalien d'un déploiement Netlify (`https://<id-du-deploy>--cnam-design-system.netlify.app`) | Identifiant visible seulement dans le tableau de bord Netlify. Les anciens déploiements peuvent être purgés selon l'offre (durée de conservation non vérifiée) |
| Permalien Chromatic | Accès conditionné à la visibilité du projet Chromatic |

## Contrainte

Aucun breaking : la doc actuelle, son URL, `netlify.toml`, le build de la librairie et le paquet npm restent inchangés.

## Solution proposée

Ajouter à côté de la doc actuelle une **archive par version**, alimentée automatiquement à chaque tag et servie par **GitHub Pages**.

1. Au push d'un tag `v*`, un workflow GitHub Actions lance `pnpm build-storybook`.
2. Le résultat est publié dans le sous-dossier `/<tag>/` de la branche `gh-pages`.
3. Les versions s'accumulent : `https://assurance-maladie-digital.github.io/design-system-v3/v1.2.2/`, `…/v1.2.1/`, etc.
4. Une page « Versions » dans la section Démarrer de la doc actuelle liste les liens.

**Pourquoi GitHub Pages plutôt que des alias Netlify :** la branche `gh-pages` conserve tout indéfiniment, alors que la conservation des déploiements Netlify dépend de l'offre. Le build Storybook utilise des chemins relatifs et fonctionne dans un sous-dossier sans configuration.

### Workflow : `.github/workflows/docs-versions.yml`

```yaml
name: 'Docs versionnées'

on:
  push:
    tags:
      - 'v*'
  workflow_dispatch:
    inputs:
      tag:
        description: 'Tag à (re)publier, ex. v1.2.0'
        required: true

jobs:
  publish:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v7
        with:
          ref: ${{ inputs.tag || github.ref_name }}
      - name: Install pnpm
        uses: pnpm/action-setup@v6
      - uses: actions/setup-node@v7
        with:
          node-version-file: '.nvmrc'
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm build-storybook
      - name: Publish to gh-pages/<tag>
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./storybook-static
          destination_dir: ${{ inputs.tag || github.ref_name }}
          keep_files: true
```

- `keep_files: true` : les versions déjà publiées ne sont pas écrasées.
- `workflow_dispatch` : republier un ancien tag à la main depuis l'onglet Actions.
- Même schéma que `chromatic.yml` (pnpm, `.nvmrc`, `--frozen-lockfile`).
- Si l'organisation n'autorise pas `peaceiris/actions-gh-pages`, le push vers `gh-pages` peut se faire avec quelques lignes de `git`, sans action tierce.

### Page « Versions »

Une page dans `src/stories/Demarrer/`, sur le modèle des pages existantes de la section, avec un lien par version. Une ligne à ajouter à chaque release ; génération automatique possible plus tard.

## Prérequis (une seule fois)

- [ ] Activer GitHub Pages sur la branche `gh-pages` (Settings > Pages) : admin du dépôt.
- [ ] Valider l'usage de `peaceiris/actions-gh-pages` si l'organisation filtre les actions.

## Effort et risques

| Élément | Estimation |
|---|---|
| Workflow + test sur un tag | 1 à 2 h |
| Page « Versions » | 1 h |
| Republication des anciens tags | Temps de build, sans garantie |

- **Anciens tags :** ils peuvent ne plus se construire (dépendances, versions de Node ou de pnpm). Commencer par `v1.2.x` et `v1.1.6`.
- **CI :** un build Storybook supplémentaire par release.
- **Contenu publié :** chaque archive est un Storybook complet et public, comme la doc actuelle.

## Impact

Aucun changement de contrat de la librairie : pas de note dans `dev/ReleasesAlerts/`.
