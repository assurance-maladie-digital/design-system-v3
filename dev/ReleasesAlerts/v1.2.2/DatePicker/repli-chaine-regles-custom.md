# DatePicker — repli chaîne pour les règles `custom` et nouveaux avertissements en dev

Selon le chemin de validation, les règles `custom` (`customRules`, `customWarningRules`, `customSuccessRules`) ne recevaient pas le même type de valeur : une chaîne pour la saisie texte, un objet `Date` pour les validations des dates retenues (sélection calendrier, `validateOnSubmit` en `useCombinedMode`…). Une règle écrite pour une chaîne — par exemple `value.includes('2025')` — levait alors une exception sur le `Date`, convertie silencieusement en échec de validation : une date valide pouvait être refusée à la soumission alors qu'elle passait au blur.

Désormais, quand la valeur validée est un `Date`, une règle qui lève une **`TypeError`** (ou rejette une promesse avec une `TypeError`) est rappelée avec la **chaîne formatée** (`dateFormatReturn` sinon `format`, `toISOString()` si aucun) et le résultat de ce rappel est adopté. Les règles écrites pour un `Date` (`value.getFullYear()`, `instanceof`…) sont inchangées : elles reçoivent toujours le `Date`.

Le repli ne s'applique **qu'aux erreurs de type** : les autres exceptions et rejets (échec métier, erreur réseau, refus serveur…) sont propagés sans rappel, afin de ne pas doubler d'éventuels effets de bord (ex. un appel HTTP) en production.

En développement uniquement, deux avertissements `console.warn` préfixés `[DatePicker]` peuvent apparaître :

- la règle a **levé une `TypeError`** sur un `Date` et a été rappelée avec la chaîne formatée ;
- la règle renvoie un résultat **invalide sur le `Date` mais valide sur la chaîne** : elle attend probablement une chaîne. Le résultat n'est pas modifié dans ce cas, l'avertissement signale l'incohérence.

Chaque avertissement n'est émis qu'une seule fois par règle. En production, rien ne change hormis le repli sur `TypeError` décrit ci-dessus.

## Conduite à tenir

- **Vérifiez votre console en environnement de développement** : tout message `[DatePicker]` indique une règle qui ne gère pas les deux types de valeur. Ces règles fonctionnent encore grâce au repli, mais ce repli est transitoire.
- **Adaptez ces règles pour gérer `Date` et chaîne**, par exemple en normalisant l'entrée avec `parseDate` :

```ts
{
	type: 'custom',
	options: {
		validate: (value: unknown) => {
			const date = parseDate(value) // accepte Date et chaîne
			return date === null || date.getFullYear() !== 2025
		},
		message: 'Pas de 2025',
	},
}
```

- Si votre règle gère déjà les deux types (`instanceof`, `parseDate`…), aucun changement n'est nécessaire et aucun avertissement n'apparaîtra.
