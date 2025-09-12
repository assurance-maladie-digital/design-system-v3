# Consigne pour la rédaction et la mise à jour des Stories des composants Amelipro

## Objectif

Garantir que chaque composant Amelipro dispose de stories Storybook exhaustives, cohérentes et utiles pour la documentation, la démonstration et les tests.

## Règles à suivre

1. **Couverture des cas d’usage**
   - Créer une story pour chaque prop principale et chaque état significatif du composant (défaut, désactivé, lecture seule, obligatoire, validation, largeur personnalisée, affichage horizontal, etc.).
   - Illustrer les comportements spécifiques (accessibilité, responsive, gestion des erreurs, etc.).

2. **Clarté et pédagogie**
   - Ajouter un texte explicatif au-dessus de chaque exemple pour décrire le cas d’usage ou la prop illustrée.
   - Fournir le code source (template + script) dans les paramètres de la story pour faciliter la prise en main.

3. **Synchronisation des valeurs**
   - Utiliser le v-model synchronisé avec les args Storybook pour permettre la modification dynamique des valeurs dans l’UI Storybook.

4. **Respect de la structure**
   - Utiliser le format Storybook officiel (Meta, StoryObj, args, parameters, render).
   - Harmoniser la présentation et les libellés avec les autres composants du design system.

5. **Accessibilité et responsive**
   - Vérifier que chaque story respecte les critères d’accessibilité (A11y linter, Tanaguru).
   - Tester l’affichage sur mobile, tablette et desktop.

6. **Validation**
   - Ajouter des exemples de validation personnalisée si le composant le permet (prop `rules`).

7. **Documentation**
   - Décrire chaque prop dans `argTypes` avec une explication claire et concise.

## Exemple de structure à suivre

```typescript
export const Default: Story = {
  args: { ... },
  parameters: {
    sourceCode: [
      { name: 'Template', code: `...` },
      { name: 'Script', code: `...` },
    ],
  },
  render: args => ({
    components: { ... },
    setup() { ... },
    template: `...`,
  }),
}
```

## À ne pas oublier

- Mettre à jour la documentation associée si besoin.
- Vérifier l’absence de warnings et le passage des tests unitaires.
- Relire et commenter le code si nécessaire.

---

Ce fichier sert de référence pour toute personne amenée à travailler sur les stories des composants Amelipro du design system.
