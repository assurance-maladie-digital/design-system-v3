## Validation : les règles sont réévaluées à chaque frappe

Constaté sur `SyTextArea` puis vérifié sur `SyTextField` : le problème est transverse aux 17 composants qui utilisent `useValidation`.

Suivi : [#2699](https://github.com/assurance-maladie-digital/design-system-v3/issues/2699).

### Constat

Un consommateur écrit naturellement ses règles **inline dans le template** :

```vue
<SyTextArea
	v-model="value"
	:is-validate-on-blur="true"
	:custom-rules="[{ type: 'custom', options: { validate: v => v !== 'interdit', message: '…' } }]"
/>
```

Scénario : saisir « interdit », quitter le champ (l'erreur s'affiche), puis corriger la valeur au clavier. **L'erreur disparaît dès la première frappe**, sans attendre le blur : `isValidateOnBlur` (défaut : `true`) n'est pas respecté.

### Cause

À chaque frappe :

1. la saisie met à jour le `v-model` → le composant parent re-render ;
2. le tableau de règles inline est **recréé** (nouvelle référence, contenu identique) ;
3. `useCustomValidation` (`src/composables/unifyValidation/useCustomValidation.ts`) surveille les règles **par référence** et croit qu'elles ont changé ;
4. il revalide le champ, à chaque caractère.

### Proposition

Supprimer le watch des règles dans `useCustomValidation` : les règles cessent d'être « observées » et sont simplement **relues à chaque validation** (blur, saisie en mode `isValidateOnBlur: false`, soumission).

Cette solution permetterait de supprimer le problème a sa source tout en simplifiant le fonctionnement et en s'alignant sur le fonctionnement de Vuetify qui lui non plus ne réexecute pas les règles qui elles sont mise a jours.
De plus cela corrigerai un incohérence puisque lorsque le V-model est mis a jour en aucun cas les règles sont reéxécutés.

### Impacts

- cinqs tests à modifier
- un changement du fonctionnement de la réévaluation des tests mais facilement réadaptable au besoin en appelant la méthode validate exposé par les champs de formulaires.

### Alternative envisagée

Serialiser les règles pour comparé leurs comtenue plutot que la référence. (unifyValidation/useCustumvalidation.ts, ligne 238). Cette solution garderait le comportement attendu mais serait un peut lourde (opération de sérialisation a chaque frappe)

