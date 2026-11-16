# SyTextField — `helpText` associé au champ en cas d'erreur (non cassant)

Quand un message d'erreur, d'avertissement ou de succès est affiché, le `helpText` passe sous le champ. Il n'était alors plus associé au champ : les technologies d'assistance ne l'annonçaient plus, alors qu'il reste visible.

Il porte désormais un `id` et figure dans le `aria-describedby` du champ, après le message. Sans message, il reste affiché et associé dans la zone de messages, comme avant. Le changement profite à tous les composants qui s'appuient sur `SyTextField` (dont `DateTextInput` et le `DatePicker` en saisie).

## Conduite à tenir

- Aucune pour un usage standard.
- Si vos tests vérifient la valeur exacte de `aria-describedby` d'un champ en erreur avec un `helpText`, ajoutez l'identifiant du texte d'aide.
