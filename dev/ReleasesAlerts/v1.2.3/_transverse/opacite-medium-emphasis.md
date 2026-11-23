# Thèmes CNAM, PA et AmeliPro — opacité « medium emphasis » portée de 60 % à 75 % (changement visuel, non cassant)

Les thèmes `cnam`, `pa` et `ap` définissent désormais la variable Vuetify `--v-medium-emphasis-opacity` à `0.75`. Ils utilisaient jusque-là la valeur par défaut de Vuetify, `0.6`.

Avec cette opacité, le texte secondaire en couleur `on-surface` (`#222324`) n'atteignait pas le contraste de 4,5:1 exigé pour un texte de moins de 24 px (RGAA 3.2, WCAG 1.4.3) : 4,24:1 sur blanc et 3,99:1 sur `#e7ecf5`. À 75 %, il atteint 6,91:1 sur blanc et 6,28:1 sur `#e7ecf5`.

Le changement ne se limite pas aux champs de formulaire. La variable est lue par Vuetify et par la classe utilitaire `text-medium-emphasis`, donc tout texte secondaire devient plus foncé :

- libellés, textes d'aide et messages des champs (`SyTextField`, `SySelect`, `SyCheckbox`, `SyCheckBoxGroup`, `SyRadioGroup`, `NirField`, `PhoneField`, `SelectBtnField`, `MonthPickerInput`, etc.) ;
- composants Vuetify comme `VCard` (sous-titres), `VList` (sous-titres), `VStepper`, `VCounter`, `VEmptyState`, `VAvatar` ou `VTimePicker` ;
- éléments qui utilisent `text-medium-emphasis`, comme les liens non actifs de `ContextualMenu`, y compris dans les projets consommateurs.

Les champs de formulaire listés ci-dessus remplacent aussi leurs couleurs `rgba(…)` codées en dur par la couleur pleine du thème, combinée aux variables `--v-medium-emphasis-opacity` et `--v-disabled-opacity`.

Le thème `ap2026` n'est pas modifié et reste à 60 %.

L'API ne change pas.

## Conduite à tenir

- Si vos tests visuels capturent du texte secondaire (libellés, textes d'aide, sous-titres de cartes ou de listes, menus), mettez à jour vos baselines.
- Si vous surchargiez `--v-medium-emphasis-opacity` ou ces couleurs pour corriger le contraste, vous pouvez retirer ces surcharges.
- Pour conserver l'ancien rendu, redéfinissez `'medium-emphasis-opacity': 0.6` dans les `variables` de votre thème.
