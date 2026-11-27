# Vérification manuelle au lecteur d'écran

À faire pour tout nouveau composant interactif et toute modification de motif ARIA, sur la story Storybook du composant. Consigner le résultat dans `accessibilite/Accessibility.mdx` ou dans la PR.

## Environnements

| Lecteur | Navigateur | Démarrer | Raccourcis utiles |
|---|---|---|---|
| NVDA (Windows) | Firefox | `Ctrl+Alt+N` | `Insert+F7` liste des éléments, `Insert+Espace` mode focus/navigation, `H` / `B` / `F` titre / bouton / champ suivant |
| VoiceOver (macOS) | Safari | `Cmd+F5` | `VO` = `Ctrl+Option` ; `VO+U` rotor, `VO+→` élément suivant, `VO+Espace` activer |

## Checklist

- [ ] Chaque contrôle annonce son **nom**, son **rôle** et son **état** (`réduit`/`développé`, `sélectionné`, `coché`, `désactivé`, `invalide`).
- [ ] Le nom annoncé contient le texte visible.
- [ ] Un champ en erreur annonce son message d'erreur à la prise de focus.
- [ ] L'ouverture d'un overlay annonce son titre ; le focus ne s'échappe pas ; la fermeture ramène sur le déclencheur, qui est annoncé.
- [ ] Les messages dynamiques (`role="status"`) sont lus sans déplacer le focus ; `role="alert"` interrompt seulement pour une erreur.
- [ ] Les icônes décoratives ne sont pas annoncées ; les icônes informatives le sont.
- [ ] Le parcours au `Tab` suit l'ordre visuel, sans élément invisible focalisable.
