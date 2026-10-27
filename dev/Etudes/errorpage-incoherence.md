# Étude — ErrorPage : import de VBtn manquant dans la story SlotAction

## Description du problème

**Branche étudiée :** `fix/incoherrence-errorpage`.

**Périmètre :** comparaison avec `dev`, commit `a677079ec` (« import du vbtn »). Un seul fichier modifié : `src/components/ErrorPage/ErrorPage.stories.ts`.

**Attendu :** la story `SlotAction` déclare les composants utilisés dans son template et fournit un exemple copiable avec les imports nécessaires.

**Avant correction :** le template de la story et l'extrait Template utilisent deux `VBtn` (« Retour à l'accueil » et « Déconnexion »), mais :

- le fichier de stories n'importe pas `VBtn` ;
- le `render` enregistre uniquement `ErrorPage` ;
- l'extrait Script affiché importe uniquement `ErrorPage`.

Le code affiché dépend donc d'un enregistrement global ou d'un mécanisme d'import automatique chez le consommateur. Sans ce mécanisme, `VBtn` ne peut pas être résolu. Le défaut de déclaration est confirmé par le diff ; son effet visuel dans Storybook avant correction n'a pas été reproduit.

## Cause racine

La dépendance Vuetify utilisée dans le slot `action` n'est pas déclarée explicitement dans la story ni dans l'exemple Script. L'extrait affiché et le template ne constituent pas un exemple autonome.

## Correction apportée

Trois ajouts dans `ErrorPage.stories.ts` :

| Emplacement | Modification | Effet |
|---|---|---|
| Ligne 3 | `import { VBtn } from 'vuetify/components'` | Rend le composant disponible dans le fichier. |
| Ligne 153 | Même import dans l'extrait Script | Fournit l'import nécessaire au code copié. |
| Ligne 160 | `components: { ErrorPage, VBtn }` | Enregistre explicitement le bouton pour le template du `render`. |

## Impact et limites

- **Sévérité :** moyenne pour la documentation : l'exemple copié peut ne pas fonctionner sans configuration supplémentaire.
- **Utilisateurs concernés :** développeurs consultant la story `Templates/ErrorPage/SlotAction` ou copiant son exemple.
- **Production :** aucun changement dans `ErrorPage.vue`, ses props, événements ou slots ; aucun changement de dépendance.
- **Risque résiduel :** les tests du composant ne montent pas directement la story et ne vérifient pas les extraits affichés.

## Vérifications effectuées

- [x] Vérification visuelle de `SlotAction` dans Storybook et absence d'avertissement de résolution de `VBtn` dans la console.
- [x] Copie des extraits Template et Script dans un composant Vue avec Vuetify configuré : vérifier le rendu des deux boutons.

## Procédure de validation manuelle

1. Lancer `pnpm storybook` et ouvrir `Templates/ErrorPage`, story `SlotAction`.
2. Vérifier que les deux actions apparaissent comme des boutons Vuetify et que la console ne signale pas de composant `VBtn` non résolu.
3. Vérifier que l'onglet Script affiche l'import de `VBtn` depuis `vuetify/components`.
4. Copier les extraits Template et Script dans un composant Vue d'un projet consommateur configuré avec Vuetify, puis vérifier le rendu des deux actions.
