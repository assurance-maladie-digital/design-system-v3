# SyInputSelect — rôles ARIA du déclencheur et de la liste (non cassant)

Le `SyInputSelect` exposait un rôle `menu` sur le `VInput` et sur le déclencheur, alors que la liste contenait des éléments `role="option"` : `menu` attend des `menuitem`, axe signalait une violation critique (`aria-required-children`). Les options portaient en outre des `tabindex` positifs (`1`, `2`…), qui les plaçaient en tête de l'ordre de tabulation de la page.

Désormais :

- le `VInput` ne porte plus de rôle ;
- le déclencheur porte `role="button"`, `aria-haspopup="listbox"`, `aria-expanded` et, liste ouverte, `aria-controls` vers la liste ;
- la liste porte `role="listbox"` et un `id` ;
- les options portent `tabindex="0"` : elles suivent l'ordre du document.

## Conduite à tenir

- Aucune pour un usage standard.
- Si vos tests ciblent `[role="menu"]` ou `role="list"` sur ce composant, ciblez `[role="button"]` (déclencheur) et `[role="listbox"]` (liste).
- Si vos tests d'accessibilité ou vos snapshots capturent ce composant, mettez à jour vos baselines.
