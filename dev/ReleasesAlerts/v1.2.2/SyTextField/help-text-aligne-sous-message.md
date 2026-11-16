# SyTextField, SySelect — texte d'aide aligné sous le champ en cas de message (changement visuel, non cassant)

Quand un message (erreur, avertissement, succès) est affiché, le `helpText` passe sous ce message. Il était rendu après tout le champ, avec un retrait fixe : sur un champ qui a une icône à gauche (`prependIcon`, `prependTooltip`, slot `prepend`), il commençait sous l'icône, environ 40 px à gauche du message et du champ. C'est le cas par défaut du `DatePicker` en mode saisie, qui affiche une icône calendrier à gauche.

Le texte d'aide est désormais rendu dans la zone de détails du champ (`.v-input__details`), sur la ligne qui suit le message (et le compteur éventuel). Il est aligné sur le champ et sur le message quelle que soit l'icône à gauche, la densité ou le sens d'écriture. Sans icône à gauche, la position est inchangée.

Le bloc garde la classe `help-text-below` (et, pour `SyTextField`, son `id` associé au champ via `aria-describedby`).

## Conduite à tenir

- Aucune pour un usage standard.
- Si vos styles ou vos tests ciblent `.help-text-below` par sa position dans le DOM (frère du champ), ciblez-le désormais dans `.v-input__details`.
- Si vos tests visuels capturent un `SyTextField` ou un `SySelect` avec `helpText`, une icône à gauche et un message, mettez à jour vos baselines.
