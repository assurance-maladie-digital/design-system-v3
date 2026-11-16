# SyInputSelect — rôles ARIA, nom accessible, bouton d'effacement et clavier (non cassant)

Le `SyInputSelect` exposait un rôle `menu` sur le `VInput` et sur le déclencheur, alors que la liste contenait des éléments `role="option"` : `menu` attend des `menuitem`, axe signalait une violation critique (`aria-required-children`). Les options portaient en outre des `tabindex` positifs (`1`, `2`…), qui les plaçaient en tête de l'ordre de tabulation de la page.

Désormais :

- le `VInput` ne porte plus de rôle ;
- le déclencheur porte `role="button"`, `aria-haspopup="listbox"`, `aria-expanded` et, liste ouverte, `aria-controls` vers la liste ;
- la liste porte `role="listbox"` et un `id` ;
- les options portent `tabindex="0"` : elles suivent l'ordre du document. Le conteneur de la liste n'est plus un arrêt de tabulation (`tabindex="-1"`) ;
- le déclencheur porte un `aria-label` qui reprend le libellé du champ, suivi de la valeur sélectionnée (« Régime : Régime général ») : le libellé n'était plus restitué une fois une valeur choisie. Le format est personnalisable via `locales.triggerLabel` ;
- le bouton d'effacement (`clearable`) est un véritable `<button>`, placé à côté du déclencheur au lieu d'une icône `role="button"` imbriquée dedans. Il n'est plus affiché tant qu'aucune valeur n'est sélectionnée ;
- la touche Échap ferme la liste aussi depuis le déclencheur ; à la fermeture par Échap, après le choix d'une option ou après l'effacement, le focus revient sur le déclencheur.

## Conduite à tenir

- Aucune pour un usage standard.
- Si vos tests ciblent `[role="menu"]` ou `role="list"` sur ce composant, ciblez `[role="button"]` (déclencheur) et `[role="listbox"]` (liste).
- Si vos tests ciblent l'icône d'effacement (`.sy-input-select .v-icon[aria-label="Supprimer"]`), ciblez `button[aria-label="Supprimer"]`.
- Si vos tests d'accessibilité ou vos snapshots capturent ce composant, mettez à jour vos baselines.
