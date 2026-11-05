# SyTable / SyPagination — nouvelles props et pagination en boutons

## Nouvelles props publiques

| Composant | Prop | Type | Valeur par défaut | Utilisation |
|---|---|---|---|---|
| `SyTable` | `hideCaption` | `boolean` | `false` | Masque visuellement la légende `caption`, tout en la conservant pour les lecteurs d’écran et le nom de la pagination. |
| `SyPagination` | `buttonMode` | `boolean` | `false` | Utilise des boutons pour changer les données affichées. Avec `ariaControls`, chaque bouton référence la zone mise à jour. Les points de suspension sont des `span` non interactifs. |

Ces props sont optionnelles. Pour masquer une légende sans perdre son nom accessible :

```vue
<SyTable
  suffix="contacts"
  :headers="headers"
  :items="items"
  caption="Liste des contacts"
  hide-caption
/>
```

Avec plusieurs tableaux, renseigner une légende différente pour chacun. Le nom de la pagination reprend `caption` ; sans légende, il reste « Navigation de pagination ».

## Changement du HTML de pagination de SyTable

`SyTable` active désormais le mode boutons pour sa pagination : les actions passent de liens `<a href="#">` à des `<button type="button">`. Les boutons référencent les résultats via `aria-controls` et les pages numériques ont des noms accessibles comme « Page 2 ».

`SyPagination` utilisé seul conserve les liens par défaut. Il faut activer `buttonMode` pour utiliser les boutons. L’alignement de `SyServerTable` sera traité dans une autre PR.

## Annonces de statut

La zone de statut de `SyTable` annonce uniquement les changements : compteur de sélection, page et plage de résultats, filtres ou tri. Elle ne lit plus la liste des numéros de lignes sélectionnées ni l’état complet à chaque interaction.

## Conduite à tenir

- Adapter les tests E2E qui ciblent les liens de pagination de `SyTable` (`a[href]`, `getByRole('link')`) pour cibler les boutons et leurs noms accessibles, par exemple `getByRole('button', { name: 'Page 2', exact: true })`.
- Adapter les surcharges CSS `.sy-pagination a` si elles doivent aussi s’appliquer aux boutons : utiliser `.sy-pagination button` ou cibler les deux éléments lorsque le style est partagé avec une pagination en liens.
- Garder une `caption` descriptive, même avec `hideCaption`, et des légendes distinctes lorsque plusieurs tableaux sont présents.
