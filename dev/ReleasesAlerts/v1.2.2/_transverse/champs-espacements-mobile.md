# Champs de formulaire — espacements réduits sous 600 px de large (changement visuel, non cassant)

Sous 600 px de large (mobile, ou zoom texte à 200 % qui réduit la largeur effective), les champs de formulaire basés sur `v-field` affichent désormais des espacements compacts pour laisser toute la place au libellé (RGAA 10.4) :

- le libellé peut occuper toute la largeur du champ (`max-width: 100%`) ;
- les icônes des zones prepend, append et du bouton d'effacement passent à `1.25rem` sans marge interne ;
- le padding horizontal de la zone de saisie passe à `8 px`.

Avant, les espacements desktop (icônes `1.5rem`, marges internes plus larges) s'appliquaient aussi sur mobile, ce qui rognait le libellé.

Seuls les champs du design system sont concernés : `SyTextField` et ses dérivés (`PhoneField`, `NirField`, `PasswordField`, `DatePicker`, `RangeField`, `SearchListField`, `PeriodField`), `SySelect`, `SyInputSelect`, `SyTextArea`, `TableToolbar`, ainsi que les champs Amelipro (`AmeliproTextField`, `AmeliproSelect`, `AmeliproTextArea`, `AmeliproAutoCompleteField`, `AmeliproPostalAddressField`, `AmeliproUpload`). Les `VTextField`/`VSelect` Vuetify utilisés directement dans vos écrans ne sont **pas** touchés.

L'API ne change pas ; au-delà de 599 px, le rendu est identique.

## Conduite à tenir

- Si vos tests visuels capturent un champ de formulaire dans un viewport de moins de 600 px de large, mettez à jour vos baselines.
- Si vous surchargiez ces espacements pour le mobile, vous pouvez retirer ces surcharges.
