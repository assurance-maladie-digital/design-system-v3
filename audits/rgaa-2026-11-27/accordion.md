# Audit RGAA 4.1.2 — Composant `Accordion` (`src/components/Accordion/`)

Date : 27/11/2026 · Réf : branche `fix/locales-hardcoded-strings`, commit `586976034` · Auditeur : agent

Périmètre : `Accordion.vue`, `config.ts`, `composables/useAccordionState.ts`,
`composables/useAccordionKeyboardNavigation.ts`, `composables/useAccordionGroupCommunication.ts`,
`tests/Accordion.a11y.spec.ts`, déclaration `accessibilite/Accessibility.mdx`.
Les variantes Amelipro (`AmeliproAccordion*`) sont **hors périmètre**.

## Synthèse

- Taux de conformité : **82 %** — 22 critères applicables : 18 C, 4 NC, 84 NA
- Criticités : 🔴 x1 · 🟠 x2 · 🟡 x1
- axe/vitest : `Accordion.a11y.spec.ts` ✅ 0 violation (couverture estimée ~30-40 % des critères RGAA)

## Non-conformités

| # | Critère RGAA | Sévérité | Élément | Constat | Piste de correction |
|---|--------------|----------|---------|---------|---------------------|
| 1 | 10.8 | 🔴 | `Accordion.vue:333-343` | Panneau fermé masqué uniquement en visuel (`max-height: 0; overflow: hidden`) : le contenu reste dans l'arbre d'accessibilité **et les éléments interactifs du slot restent tabulables invisibles** (focus perdu). | Appliquer `hidden`/`display: none` ou `visibility: hidden` sur `.sy-accordion-content` non ouvert (avec `v-show`/classe), en gardant la transition si souhaitée via `max-height` + `visibility`. |
| 2 | 7.1 | 🟠 | `Accordion.vue:106-175` | Structure inversée par rapport au pattern APG : le `role="button"` enveloppe le `<h*>` au lieu d'être enveloppé par lui. Un titre à l'intérieur d'un élément interactif est invalide et perturbe la navigation par titres des lecteurs d'écran. | Refactorer en `<h*><button type="button" aria-expanded aria-controls>…</button></h*>` (pattern APG natif, un `<button>` réel supprime aussi le besoin de `role="button"`/`tabindex`/gestion Space). |
| 3 | 8.2 | 🟠 | `Accordion.vue:107,110,179-181` + `useAccordionKeyboardNavigation.ts:102` | Les `id` (`accordion-button-${item.id}`, `accordion-content-${item.id}`) dépendent de `item.id` fourni par le consommateur : deux accordéons sur la page avec les mêmes ids → doublons d'`id` (invalidité HTML, `aria-controls`/`aria-labelledby` ambigus, `getElementById` cible la mauvaise instance). `instanceId` est généré mais non utilisé dans les ids du DOM. | Préfixer les ids par `instanceId` : `` `${instanceId}-button-${item.id}` ``. |
| 4 | 9.1 | 🟡 | `Accordion.vue:126-175` | Conséquence de la NC #2 : les titres sont présents mais leur position à l'intérieur du déclencheur fragilise la structure de titres restituée par les TA. | Corrigé par la même refonte (bouton dans le titre). |

## Détail par thématique

| Thème | C | NC | NA | Commentaire |
|-------|---|----|----|-------------|
| 1. Images | 1 | 0 | 4 | Icône chevron `decorative` (SyIcon, `aria-hidden`) → 1.2 C |
| 2. Cadres | 0 | 0 | 2 | Aucun cadre |
| 3. Couleurs | 3 | 0 | 1 | 3.1 : état porté aussi par `aria-expanded` + rotation icône ; contrastes via `--v-theme-*` — voir vigilance |
| 4. Multimédia | 0 | 0 | 6 | Aucun média |
| 5. Tableaux | 0 | 0 | 7 | Aucun tableau |
| 6. Liens | 0 | 0 | 2 | Le composant n'émet pas de liens (les liens en slot relèvent du consommateur) |
| 7. Scripts | 2 | 1 | 4 | 7.3 C (clavier APG complet : Space/Enter/flèches/Home/End) ; **7.1 NC** (rôle/structure) |
| 8. Éléments obligatoires | 2 | 1 | 3 | **8.2 NC** (unicité des `id` non garantie) |
| 9. Structuration | 2 | 1 | 3 | 9.2/9.3 C ; **9.1 NC** (titre à l'intérieur du déclencheur) |
| 10. Présentation | 5 | 1 | 7 | 10.4/10.5/10.7 (focus visible)/10.11/10.12 C ; **10.8 NC** (contenu masqué non ignoré des TA) |
| 11. Formulaires | 0 | 0 | 12 | Pas de champs |
| 12. Navigation | 2 | 0 | 13 | 12.8 ordre de tabulation cohérent ; 12.9 pas de piège |
| 13. Consultation | 1 | 0 | 6 | 13.8 : transitions 0.3 s < 5 s ; pas de `prefers-reduced-motion` (vigilance) |
| **Total** | **18** | **4** | **84** | |

## Points de vigilance / dette d'accessibilité

- **`role="region"` systématique** : l'APG recommande ce rôle uniquement pour ≤ 6 accordéons au total ; au-delà il surcharge la navigation par repères. Envisager de le rendre optionnel.
- **Contrastes** : `titleColor`/`activeColor`/`focusColor` sont des tokens Vuetify configurables par le consommateur (`vuetifyOptions.accordion`) — le DS ne peut garantir le ratio ; documenter l'exigence ≥ 4,5:1. Non NC car les valeurs par défaut (`primary`/`white`) satisfont le ratio sur les thèmes CNAM.
- **`aria-disabled="false"` rendu explicitement** et `tabindex="0"` conservé sur item désactivé : conforme au pattern APG (item désactivé restant découvrable), mais les clés fléchées sur un item désactivé ne déclenchent pas la navigation (`@keydown` gardé par `!item.disabled`) — un utilisateur clavier ne peut pas quitter un item désactivé aux flèches depuis cet item. Mineur, car les voisins restent atteignables ; à considérer (retirer le guard sur les touches de navigation).
- **Pas de `prefers-reduced-motion`** sur les transitions `max-height`/rotation d'icône (0,3 s — conforme RGAA mais bonne pratique éco/a11y).
- **`emitFocusChange` dispatché sur `window`** : fonctionne, mais fragile en SSR (accès `window` non guardé à l'appel — guardé dans `onMounted` uniquement pour l'écoute).
- **Déclaration `Accessibility.mdx`** : affirme « rôles ARIA appropriés » et « focus visible » ; ne mentionne pas que le contenu fermé reste exposé aux TA → **drift** entre statut déclaré et observé. `a11y-report.md` ne liste pas le composant.
- **Test axe** : ne teste que l'état ouvert ; ajouter un run axe sur l'état fermé + un test d'invisibilité du panneau fermé pour la TA (protection contre régression de la NC #1).

## Limites de l'audit

- Audit automatisé = lecture statique + axe (vitest-axe, jsdom) ; **pas de session lecteur d'écran réel** (NVDA/VoiceOver) — les constats 7.1/9.1 sont fondés sur la validité du markup et le pattern APG, à confirmer en écoute réelle.
- Contrastes évalués sur les valeurs de tokens par défaut ; écarts par marque (CNAM/PA/AmeliPro) et thème sombre à vérifier via `cypress/support/contrast.ts`.
