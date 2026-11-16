# Captcha — la prop `required` est respectée, `true` par défaut (non cassant)

La règle de validation `required` du `Captcha` testait l'objet `Ref` au lieu de sa valeur : le captcha était donc toujours obligatoire, même avec `:required="false"`. En revanche, le champ portait `aria-required="false"` tant que `required` n'était pas passé explicitement : les technologies d'assistance n'annonçaient pas un champ pourtant obligatoire.

La prop `required` est désormais respectée et vaut `true` par défaut :

- sans la prop, le captcha reste obligatoire comme avant, et le champ porte maintenant `aria-required="true"` (au lieu de `"false"`) ;
- avec `:required="false"`, le captcha n'est plus obligatoire : un captcha vide ne bloque plus la soumission du `SyForm`.

## Conduite à tenir

- Aucune si le captcha doit rester obligatoire.
- Si vous passiez `:required="false"` en comptant sur le fait que le captcha restait bloquant, retirez cette prop.
- Si vos tests visuels ou d'accessibilité capturent un `Captcha` sans `required`, mettez à jour vos baselines (`aria-required` passe de `"false"` à `"true"`).
