# Étude — SyTextField : attribut HTML invalide `direction` sur l'`<input>`

## Description du bug

**Issue :** #2711

**Périmètre :** `src/components/Customs/SyTextField/SyTextField.vue`, et tous les composants construits sur `SyTextField` (`PhoneField`, `NirField`, `PasswordField`, `DatePicker`, `Captcha`, `MonthPicker`, etc.).

**Constat d'audit :** le champ numéro de `PhoneField` est invalidé :

```html
<input autocomplete="tel-national" type="tel" aria-labelledby="input-bbdwv-10-label" id="input-bbdwv-10"
  aria-describedby="input-bbdwv-10-messages" title="Numéro de téléphone sans indicatif"
  aria-label="Numéro de téléphone sans indicatif" aria-required="false" direction="horizontal"
  inputmode="tel" class="v-field__input" value="">
```

**Attendu :** le code généré est valide (RGAA 8.2, code source valide) : l'`<input>` ne porte que des attributs HTML ou ARIA valides.

**Réel (vérifié sur le dépôt) :** `direction="horizontal"` n'est pas un attribut HTML valide sur `<input>`. Je reproduis le défaut en montant un `SyTextField` seul : il ne vient donc pas de `PhoneField`.

**Autres attributs du constat, vérifiés et conformes :**

- `aria-required="false"` : `PhoneField` passe `:aria-required="props.required"` (`PhoneField.vue:212`). Valeur ARIA valide, simplement redondante.
- `aria-labelledby`, `aria-label` et `title` donnent le même texte, cohérent avec le libellé visible (RGAA 11.2).

## Cause racine

- `SyTextField` transmet sa prop à Vuetify : `:direction="props.direction"`, avec `'horizontal'` pour défaut (`SyTextField.vue:49`).
- Vuetify 3.12.2 exclut volontairement `direction` des props de `VTextField` : `...omit(makeVInputProps(), ['direction'])` (`node_modules/vuetify/lib/components/VTextField/VTextField.js:34`). Seul `VInput` déclare cette prop.
- Comme `VTextField` ne la déclare pas, Vue la range dans les attributs. `filterInputAttrs(attrs)` (`VTextField.js:134`) la transfère alors sur l'`<input>` natif.
- La prop `direction` de `SyTextField` n'a donc jamais eu d'effet visuel. Son seul effet est cet attribut invalide. Aucun style ne cible `[direction]` dans `src/`.
- **Introduit dans :** commit `336e12639` « Feat/dape picker v1 (#365) » (janvier 2025).

## Correction

- **`SyTextField.vue`** : la ligne `:direction="props.direction"` est supprimée. C'était la seule à transmettre `direction` dans tout le code.
- **Prop supprimée** (décision prise en revue de PR, à la place d'une dépréciation) : `direction` est retirée de `types.ts`, de `withDefaults` (`SyTextField.vue`) et des argTypes de `SyTextField.stories.ts`. Elle n'a jamais eu d'effet.
- **Attribut filtré** : `direction` est exclu de `forwardedAttrs` (`SyTextField.vue`). Sans ce filtre, un consommateur qui passe encore `direction="…"` verrait l'attribut, devenu non déclaré, repasser par `VTextField` jusqu'à l'`<input>` : le défaut RGAA 8.2 reviendrait. Vérifié : sans le filtre, le test de régression échoue pour `horizontal` et `vertical`.
- **`dev/ReleasesAlerts/v1.2.2.md`** : la note signale la suppression de la prop, sans effet sur le rendu. Seuls les templates vérifiés en mode strict et les usages TypeScript de `SyTextFieldProps` peuvent la signaler comme inconnue.
- **Snapshots** : `Captcha.spec.ts.snap` (×2) et `MonthPicker.spec.ts.snap` (×1) sont mis à jour. Leur seule différence est la ligne `direction="horizontal"` retirée.

**Alternative écartée :** appliquer nous-mêmes la classe `v-input--vertical`. Vuetify exclut volontairement `direction` de `VTextField`, et aucun composant du dépôt ne passe `direction="vertical"` à `SyTextField`.

## Reproduction / vérification

1. Monter `PhoneField` avec `withCountryCode` : l'`<input type="tel">` porte `direction="horizontal"`. Monter `SyTextField` seul : même résultat.
2. Test de régression ajouté dans `SyTextField.spec.ts` : aucun attribut `direction` sur l'`<input>`, qu'il soit absent, `horizontal` ou `vertical`. **Avant correction : 3 échecs sur 3 ; après : 3/3.** Depuis la suppression de la prop, le test passe `direction` en attribut (`attrs`), comme le ferait un consommateur.
3. Après la suppression : `pnpm vitest run` sur SyTextField, PhoneField, NirField, PasswordField, DatePicker, Captcha et MonthPicker donne 65 fichiers et 945 tests, tous passent, sans modification de snapshot.
4. `pnpm test:unit` (avant la suppression) : 407 fichiers, 7752 tests, tous passent.
5. Tests a11y de `SyTextField` et `PhoneField` : OK. `pnpm exec eslint` (SyTextField, Captcha, MonthPicker) : 0 erreur. `pnpm vue-tsc -p tsconfig.app.json --noEmit` : 0 erreur.

## Impact

- **Sévérité :** faible à moyenne. Non-conformité RGAA 8.2 sur tous les champs texte du DS, sans gêne directe pour les technologies d'assistance.
- **Introduit dans :** `336e12639` (#365).
- **Utilisateurs concernés :** tous les projets qui utilisent `SyTextField` ou un composant construit dessus, ainsi que leurs audits RGAA.
- **Zones à risque :** les snapshots des projets consommateurs qui contiendraient l'attribut. Les projets qui typent leurs props avec `SyTextFieldProps` ou vérifient leurs templates en mode strict et passent `direction` verront la propriété signalée comme inconnue. Le rendu ne change pas, puisque Vuetify ignorait déjà la valeur.

## Checklist

- [x] Cause racine traitée : la prop est supprimée et l'attribut n'est plus transmis à `VTextField`.
- [x] Test de régression ajouté, en échec avant la correction.
- [x] Changement de contrat documenté : suppression de la prop dans `dev/ReleasesAlerts/v1.2.2.md`, sans effet au runtime (attribut filtré).
- [x] `pnpm test:unit` complet : 407 fichiers, 7752 tests, tous passent.
- [x] Tests a11y passés (SyTextField, PhoneField).
- [x] Snapshots mis à jour (seule différence : l'attribut retiré).
- [ ] `pnpm test:visual` : non relancé. Le rendu ne change pas, mais la vérification reste à faire si on veut la preuve.
