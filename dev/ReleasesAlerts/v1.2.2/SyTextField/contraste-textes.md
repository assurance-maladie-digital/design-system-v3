# SyTextField — contraste du texte d'aide, du préfixe, du suffixe et du libellé flottant (changement visuel)

Plusieurs textes de `SyTextField` étaient affichés avec l'opacité « medium emphasis » de Vuetify (60 %) et n'atteignaient pas le contraste de 4,5:1 exigé pour un texte de moins de 24 px (RGAA 3.2, WCAG 1.4.3), même sur fond blanc :

- texte d'aide (`helpText`), sous le champ ou à la place du message : 4,24:1 sur blanc, 3,99:1 sur `#e7ecf5` ;
- préfixe et suffixe (`prefix`, `suffix`), à l'état neutre et en erreur : 4,24:1 sur blanc ;
- libellé flottant d'un champ rempli à l'état neutre (valeur initiale, champ réinitialisé, etc.) : 2,80:1 sur blanc.

Ces textes sont désormais affichés sans opacité réduite :

- texte d'aide, préfixe et suffixe en couleur `on-surface` du thème ;
- libellé flottant en couleur de bordure du thème (`#545859` pour les thèmes CNAM, PA et AmeliPro), soit 7,2:1 sur blanc.

L'API ne change pas. En dehors du préfixe et du suffixe d'un champ en erreur, les états erreur, avertissement, succès et désactivé ne changent pas. Tous les composants construits sur `SyTextField` sont concernés (`PhoneField`, `NirField`, `PasswordField`, `DatePicker`, etc.).

Le libellé affiché à l'intérieur d'un champ vide ne change pas (5,74:1 sur blanc, conforme).

## Conduite à tenir

- Si vos tests visuels capturent un `SyTextField` avec un texte d'aide, un préfixe, un suffixe ou un champ rempli à l'état neutre, mettez à jour vos baselines.
- Si vous surchargiez ces couleurs pour corriger le contraste, vous pouvez retirer ces surcharges.
