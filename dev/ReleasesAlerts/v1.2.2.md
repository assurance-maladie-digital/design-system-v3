# SyTextField — prop `direction` supprimée

La prop `direction` de `SyTextField` n'a jamais eu d'effet : `VTextField` ne la prend pas en charge, et la valeur finissait en attribut HTML invalide `direction="horizontal"` sur l'`<input>` (RGAA 8.2, code source valide). La prop est supprimée : elle n'est plus déclarée dans les props, les types (`SyTextFieldProps`) ni la documentation. Tous les composants construits sur `SyTextField` sont concernés (`PhoneField`, `NirField`, `PasswordField`, `DatePicker`, etc.).

Le rendu ne change pas. Un `direction="…"` encore passé à `SyTextField` est ignoré : il n'est pas transmis à l'`<input>`.

## Conduite à tenir

- Retirez `direction` de vos usages de `SyTextField`. Si vos templates sont vérifiés en mode strict (`strictTemplates`), ou si vous construisez les props en TypeScript à partir de `SyTextFieldProps`, la propriété `direction` y est désormais signalée comme inconnue.
- Si vos tests ou snapshots attendaient l'attribut `direction` sur l'`<input>`, mettez-les à jour.
