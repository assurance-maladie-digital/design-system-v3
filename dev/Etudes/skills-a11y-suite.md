# Étude — Suite des skills et agents d'accessibilité

Fait suite à [skills-a11y.md](./skills-a11y.md) et à sa vérification [skills-a11y-verification.md](./skills-a11y-verification.md).

## Objectif

Lister, par priorité, les travaux révélés par la réalisation et les bancs de mesure : défauts de code découverts, corrections reportées, validations restantes. Chaque piste fera l'objet d'une PR dédiée.

## Constats de départ

- Les skills améliorent surtout la **création** (livrables a11y, tests de contraste et de régression, plus de commandes inventées) : 59/60 contre 54/60 sans skills.
- En **revue**, `review`, `AGENTS.md` et `doc/` suffisent déjà ; les skills n'apportent que de la précision (ratios mesurés, critères RGAA).
- Les agents ont mis au jour, dans des worktrees jetables, des défauts réels encore présents dans `dev`.

## Pistes

### 1. Corriger les défauts réels trouvés (code)

| Piste | Constat | Correctif attendu |
|---|---|---|
| 1a. `SySelect` : ARIA posé trop tard | 9 passages S3 sur 9 aboutissent au même diagnostic : au montage, l'`<input>` porte `aria-expanded` (posé par `VMenu`) sans `role="combobox"`, ajouté seulement en `nextTick` / `setTimeout`. Concerne tous les consommateurs de `SySelect` et le rendu SSR. | Appel synchrone de `setupAriaAttributes()` dans `onMounted` (ou neutralisation des attributs de `VMenu`), test de régression dans `SySelect.a11y.spec.ts`, puis retrait de `aria-allowed-attr` des `ignoreRules` de `PhoneField.a11y.spec.ts`. |
| 1b. `ignoreRules` non justifiés | 6 specs ignorent des règles sensibles sans commentaire : `SyTable`, `SyServerTable`, `SelectFilter`, `AutocompleteFilter`, `PhoneField`, `PeriodField`. | Pour chaque règle : corriger le composant, ou justifier le faux positif en commentaire (`doc/Accessibilite/README.md` §2). |
| 1c. `aria-label` en dur | 91 fichiers `.vue` contiennent un `aria-label="…"` littéral. | Migration progressive vers `locales.ts` (prop `locales` surchargeable), par lot de composants. |

### 2. Points mineurs reportés de la revue finale (skills et doc)

- `a11y-contrast` : seuil du grand texte à 18,5 px (valeur RGAA) au lieu de 18,66 px.
- Références `rgaa` : `class="sr-only"` → `d-sr-only` (classe Vuetify disponible).
- ~~`a11y-testing`, `rgaa`, agents : chemin de spec pour couvrir `Customs/`, `Tables/`, `HeaderBar/`.~~ **Fait** : filtre par sous-chaîne `pnpm vitest run /<Nom>.a11y.spec.ts` (Vitest n'accepte pas de glob en filtre, `src/components/**/…` renvoie « No test files found »).
- `rgaa/README.md` : « 4 étapes » → 7 ; avertir que `npx skills add etalab-ia/skills` écrase l'adaptation Synapse.
- Agent Copilot `a11y-dev` : ajouter la consigne « ne jamais committer ni pousser sans accord ».
- `SKILL.md` au-delà de ~500 mots (`a11y-fixes`, `a11y-aria-patterns`, `rgaa`) : déplacer exemples et tableaux dans `references/`.
- `doc/Accessibilite/README.md` : chemin réel du rapport (`scripts/data/a11y-report.md`) ; préciser que `DialogBox` gère son propre piège de focus (pas de `v-lock-focus`).

### 3. Écarts entre motifs APG et composants de référence

| Composant | Écart | Décision |
|---|---|---|
| `Accordion` | `<div role="button">` qui **contient** le titre `<hN>`, là où l'APG attend `<hN><button>`. Les enfants d'un `role="button"` étant présentationnels, le titre n'est pas exposé (RGAA 9.1, 7.1) | Écart documenté dans `a11y-aria-patterns` (⚠️). Corriger le composant dans une PR dédiée : changement de markup observable, note `ReleasesAlerts` |
| `RatingPicker` | Les flèches déplacent le focus sans changer la sélection (`Entrée` / `Espace` cochent) | Écart documenté dans `a11y-aria-patterns` (⚠️). Corriger dans une PR dédiée : changement de comportement clavier, note `ReleasesAlerts` |

Écarts documentés : `a11y-aria-patterns` marque ces composants ⚠️, précise que l'APG fait foi pour tout nouveau code, et liste le comportement réel dans `references/patterns.md` (section « Écarts connus »). Priorité remontée : à traiter juste après la piste 1a.

### 4. Valider les autres outils

Toutes les mesures ont été faites avec opencode. À vérifier :

| Outil | Vérification |
|---|---|
| Claude Code | Déclenchement des skills `a11y-*` ; chargement de `.claude/agents/a11y-*.md` ; restriction effective de `a11y-audit` |
| GitHub Copilot | Prise en compte de `.github/agents/*.agent.md` ; lecture des skills depuis `.agents/skills/` |
| Windsurf | Lecture des skills via `.windsurf/skills/` |

Protocole : rejouer S1 et S6 (tâches les plus discriminantes) une fois par outil.

### 5. Rendre le banc reproductible

- Versionner les scripts de préparation et la grille de notation (ex. `dev/Etudes/skills-a11y-bench/`) pour relancer la mesure à chaque modification d'un skill.
- Isoler correctement le côté « sans » : la liste des skills dépend de la branche ouverte dans la session ; le script doit le garantir.
- Remplacer S5 (revue), qui ne discrimine pas, par des tâches de création : nouveau composant interactif, changement de style, correctif urgent.

### 6. Vérifications que les agents ne font pas

- **Lecteur d'écran** : dérouler la checklist de `a11y-testing/references/lecteur-ecran.md` (NVDA + Firefox, VoiceOver + Safari) sur 2 ou 3 composants (`SyAlert`, `SyInputSelect`, `ChipList`) pour valider son contenu.
- **Thème sombre** : plusieurs passages S6 signalent que les thèmes sombres ne définissent pas `on-background-variant`. Vérifier les tokens `*DarkTheme.ts` et les contrastes associés.

### 7. Intégration

PR `feat/skills-a11y` → `dev`, avec en description le bilan de [skills-a11y-verification.md](./skills-a11y-verification.md).

## Ordre de réalisation

1. Piste 7 (PR de la branche actuelle).
2. Piste 1a (`SySelect`) : bug réel, diagnostic et correctif déjà validés.
3. Piste 3 (`Accordion`, `RatingPicker`) : écarts déjà documentés dans le skill, correction des composants.
4. Piste 2 (mineurs), en un commit.
5. Piste 1b.
6. Pistes 4, 5 et 6, avant toute nouvelle évolution des skills.
7. Piste 1c, en continu, par lots.

## Changement de contrat

Aucun pour cette étude. Les pistes 1a et 1c modifieront du markup (attributs ARIA, libellés surchargeables) : à évaluer dans leurs PR respectives.
