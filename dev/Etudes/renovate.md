# Priorisation des mises à jour Renovate — Synapse v3

Date de l’analyse : **4 novembre 2026**.

Périmètre : les **10 PR Renovate ouvertes** lors de l’analyse sur le [dépôt design-system-v3](https://github.com/assurance-maladie-digital/design-system-v3/pulls).

Ce document formalise un ordre de traitement fondé sur les diffs des PR, l’usage des dépendances dans Synapse et les informations officielles disponibles. Il ne constitue pas une autorisation de fusion : les contrôles CI et les validations propres à chaque mise à jour restent nécessaires. Les versions cibles et l’état des PR peuvent évoluer après cette date.

## Critères de priorité

1. Corriger les vulnérabilités identifiées dans les versions utilisées.
2. Maintenir les dépendances exécutées chez les consommateurs du DS.
3. Finaliser les migrations déjà validées sur un périmètre ciblé.
4. Entretenir l’outillage en limitant les risques de régression.
5. Coordonner les migrations structurantes et nettoyer les règles devenues inutiles.

Une priorité élevée peut nécessiter un chantier préparatoire : elle ne signifie pas que la PR est immédiatement fusionnable.

## Matrice d’Eisenhower

Le classement oppose les mises à jour **réalisables rapidement**, car simples et sans risque identifié, à celles qui exigent de **prévoir une étude ou un chantier dédié**, en raison d’une version majeure, d’un impact consommateur ou d’un risque de régression. La colonne « Décideur » est laissée vide : elle est à remplir par l’équipe lors de l’arbitrage.

### À faire rapidement — simple et sans risque

| PR | Mise à jour | Justification | Vérifications avant fusion | Décideur |
| --- | --- | --- | --- | --- |
| [#2391](https://github.com/assurance-maladie-digital/design-system-v3/pull/2391) | **pnpm 10.33.4 → 10.34.9** | **Sécurité.** La version utilisée est concernée par un avis de sécurité sur l’exposition de secrets via une configuration de registre malveillante. Correctif de patch, application directe. | Installation avec lockfile figé, CI et processus de publication. Vérifier les éventuelles interpolations de variables d’environnement dans les fichiers `.npmrc`. | |
| [#2392](https://github.com/assurance-maladie-digital/design-system-v3/pull/2392) | **Storybook 10.6.3 → 10.6.5** | **Entretien courant.** Mise à jour corrective de l’outillage de documentation. Le regroupement maintient les packages Storybook alignés. | Build Storybook, ouverture des pages MDX, Controls et addon a11y. | |
| [#2712](https://github.com/assurance-maladie-digital/design-system-v3/pull/2712) | **sass-embedded 1.105.1 → 1.107.1** | **Entretien courant.** Corrections du compilateur et rapprochement avec `sass`, déjà résolu en 1.107.1 dans le lockfile examiné. Certaines corrections peuvent modifier le CSS généré. | Build de la librairie et de Storybook ; comparaison visuelle des thèmes CNAM, PA et AmeliPro. | |
| [#2734](https://github.com/assurance-maladie-digital/design-system-v3/pull/2734) | **@cypress/request>uuid v14** | **Nettoyage plutôt que mise à jour.** Le diff ne change aucune dépendance installée : il modifie seulement une règle `override`. `@cypress/request` ne dépend plus de `uuid` dans le lockfile examiné. | Envisager la suppression de l’exception obsolète, puis vérifier la résolution du lockfile et les tests Cypress. | |

### À prévoir en étude — risqué ou migration majeure

| PR | Mise à jour | Justification | Vérifications avant fusion | Décideur |
| --- | --- | --- | --- | --- |
| [#2713](https://github.com/assurance-maladie-digital/design-system-v3/pull/2713) | **Vuetify 3.12.2 → 3.13.7** | **Chantier à préparer.** Dépendance centrale du DS. Les versions intermédiaires comportent des corrections sur les tableaux, overlays, validations et focus. Le changement modifie aussi la `peerDependency` exigée des consommateurs et un patch local doit être réévalué. La PR examinée ne met à jour que `package.json`. | Réévaluer le patch local, régénérer le lockfile, vérifier le starter kit, lancer les tests unitaires, a11y et visuels. Vérifier manuellement clavier, focus, overlays et thèmes. Documenter le changement de contrat. | |
| [#2733](https://github.com/assurance-maladie-digital/design-system-v3/pull/2733) | **pdfjs-dist 6.2.108 → 6.5.438** | **Impact consommateur.** Dépendance livrée aux consommateurs et utilisée par `FilePreview`. Les nouvelles versions améliorent notamment le rendu et la gestion des images. Ce classement repose sur son impact à l’exécution, sans affirmer qu’une vulnérabilité de la version actuelle a été établie. | Tester de vrais PDF dans le navigateur : multipage, scans, caractères accentués, gros fichiers, chargement du worker et gestion des erreurs. Les tests existants simulent PDF.js. | |
| [#2745](https://github.com/assurance-maladie-digital/design-system-v3/pull/2745) | **Cypress 15.21.1 → 16.2.1** | **Migration majeure.** Cypress pilote toute la suite de tests visuels. La compatibilité de la commande personnalisée `matchImageSnapshot` et du plugin image-snapshot, tout juste monté en v11, doit être revérifiée. | Revoir le changelog des versions majeures, lancer toute la suite visuelle sous Electron headless, vérifier la lecture des options via `cy.env()` et la CI dédiée aux tests visuels. | |
| [#2744](https://github.com/assurance-maladie-digital/design-system-v3/pull/2744) | **@stylistic/stylelint-config 3.0.1 → 6.0.0** | **Migration majeure.** Trois versions majeures franchies sur la configuration de lint des styles. Risque de modifications nombreuses sans bénéfice fonctionnel direct. | Revoir les changelogs des versions 4, 5 et 6, adapter `.stylelintrc.json`, lancer `pnpm lint:style` sur l’ensemble du dépôt. Éviter de mêler reformatage et modifications fonctionnelles. | |
| [#851](https://github.com/assurance-maladie-digital/design-system-v3/pull/851) | **@vitejs/plugin-vue v6** | **Migration majeure.** La version cible est compatible avec Vite 6 et Node 22.23.4. Elle entretient la chaîne de compilation Vue, sans blocage actuel identifié imposant une migration immédiate. | Build, déclarations TypeScript, Storybook, Cypress et HMR. | |
| [#2619](https://github.com/assurance-maladie-digital/design-system-v3/pull/2619) | **@tsconfig/node22 → @tsconfig/node24** | **Migration coordonnée.** `.nvmrc` et `@types/node` ciblent encore Node 22. Changer seulement la base TypeScript désalignerait les hypothèses de compilation et l’environnement prévu. | Coordonner la version de Node, les types, la configuration TypeScript, la CI et l’hébergement. | |

## Points de vigilance propres au dépôt

### pnpm : vérifier les usages de configuration

L’avis [GHSA-3qhv-2rgh-x77r](https://github.com/pnpm/pnpm/security/advisories/GHSA-3qhv-2rgh-x77r) concerne notamment pnpm `<10.34.2`, ce qui inclut la version 10.33.4 déclarée dans le dépôt.

Le correctif change le traitement des interpolations de variables issues de configurations contrôlées par un dépôt. Vérifier les processus d’installation et de publication qui s’appuient sur ces configurations ; la présence d’une vulnérabilité dans l’outil ne démontre pas une exploitation dans Synapse.

### Vuetify : traiter le patch et le contrat consommateur

Le dépôt contient la configuration suivante dans `pnpm-workspace.yaml` :

```yaml
patchedDependencies:
  vuetify@3.12.2: patches/vuetify@3.12.2.patch
```

Le patch corrige la syntaxe Sass de `VOtpInput`. Avant de changer de version, vérifier si le correctif existe déjà en amont : retirer le patch s’il n’est plus nécessaire, ou le reporter sur la nouvelle version.

La version de Vuetify est déclarée exactement en `peerDependencies`. Sa modification doit donc être coordonnée avec les applications consommatrices et documentée selon les conventions de `releasesAlerts/`.

Les vérifications de focus, de navigation clavier et de rendu restent nécessaires. Aucune conformité RGAA ne peut être déduite de la seule mise à jour d’une dépendance ou d’un résultat axe.

### Cypress : montée v11 fusionnée, majeure v16 à préparer

La montée de version de `@simonsmith/cypress-image-snapshot` en v11 a été fusionnée via la [PR #2741](https://github.com/assurance-maladie-digital/design-system-v3/pull/2741). La PR Renovate équivalente #2735 a été fermée automatiquement.

La [CI de validation](https://github.com/assurance-maladie-digital/design-system-v3/actions/runs/41718895441) avait confirmé, sur `SyHeading`, sous Ubuntu 24.04 et Electron :

- La comparaison réussie des trois références existantes.
- L’échec attendu après une modification volontaire des couleurs, avec génération d’un diff.
- La réécriture effective d’une référence, puis une comparaison réussie sans mode de mise à jour.
- La restauration du test et des références d’origine à la fin du contrôle.

Cette validation était ciblée : elle ne remplace pas une exécution de toute la suite visuelle.

Le dépôt utilise sa propre commande `matchImageSnapshot`, qui lit les options avec `cy.env()`. Avant la migration vers Cypress 16 proposée par la PR #2745, vérifier que ce fonctionnement reste pris en charge : ne pas remplacer uniquement `--env` par `--expose`, une telle migration doit aussi adapter la lecture des options.

### UUID : supprimer une exception devenue inutile

La configuration examinée contient :

```yaml
overrides:
  uuid: ">=14.0.0"
  "@cypress/request>uuid": "8.3.2"
```

La PR #2734 ne fait évoluer que la seconde règle et sa copie dans le lockfile. Le graphe installé examiné ne contient plus de dépendance `uuid` sous `@cypress/request`.

L’action utile est donc de vérifier que cette exception peut être supprimée. L’avis de sécurité cité dans les notes UUID concerne les API `v3()`, `v5()` et `v6()` avec un buffer fourni par l’appelant ; il ne justifie pas à lui seul de forcer une nouvelle version sur un chemin de dépendance qui n’existe plus.

## Références officielles

- [pnpm — avis GHSA-3qhv-2rgh-x77r](https://github.com/pnpm/pnpm/security/advisories/GHSA-3qhv-2rgh-x77r).
- [pnpm — version 10.34.9](https://github.com/pnpm/pnpm/releases/tag/v10.34.9).
- [PDF.js — version 6.5.438](https://github.com/mozilla/pdf.js/releases/tag/v6.5.438).
- [Vuetify — version 3.13.7](https://github.com/vuetifyjs/vuetify/releases/tag/v3.13.7).
- [Cypress Image Snapshot — notes de version](https://github.com/simonsmith/cypress-image-snapshot/releases).
- [Cypress — configuration publique avec `Cypress.expose()`](https://docs.cypress.io/api/cypress-api/expose).
- [Cypress — version 16.2.1](https://github.com/cypress-io/cypress/releases/tag/v16.2.1).
- [Storybook — version 10.6.5](https://github.com/storybookjs/storybook/releases/tag/v10.6.5).
- [Sass Embedded — changelog](https://github.com/sass/embedded-host-node/blob/main/CHANGELOG.md).
- [Plugin Vue 6.0.10 — compatibilité Node, Vite et Vue](https://github.com/vitejs/vite-plugin-vue/blob/plugin-vue%406.0.10/packages/plugin-vue/package.json).
- [@stylistic/stylelint-config — changelog](https://github.com/stylelint-stylistic/stylelint-config/blob/HEAD/CHANGELOG.md).
- [UUID — avis GHSA-w5hq-g745-h8pq](https://github.com/uuidjs/uuid/security/advisories/GHSA-w5hq-g745-h8pq).
