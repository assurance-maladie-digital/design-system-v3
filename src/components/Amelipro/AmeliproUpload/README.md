# AmeliproUpload

Composant Vue destiné à la sélection et à la gestion de fichiers à téléverser (upload) dans un formulaire.

## Principes de fonctionnement

- **Stockage local** : Le composant ne réalise pas le téléversement lui-même. Il se contente de stocker les fichiers sélectionnés, qui seront ensuite transmis au formulaire parent pour traitement.
- **Événements** : Un événement `update:model-value` est émis à chaque modification de la liste interne des fichiers (ajout ou suppression). Lors d’un ajout multiple, un seul événement est émis pour l’ensemble des fichiers importés.
- **Validation à l’import** : Tout fichier ajouté doit respecter l’ensemble des règles de validation définies (type, taille, nombre maximum, non-duplication, etc.). La non-duplication s’applique aussi bien vis-à-vis des fichiers déjà présents que des fichiers ajoutés en double lors d’une même importation.
- **Suppression** : La suppression d’un fichier retire simplement ce fichier de la liste interne et émet l’événement `update:model-value`. Elle ne déclenche pas de revalidation des fichiers restants.
- **Pas de revalidation globale** : Les fichiers déjà présents et validés ne sont jamais revalidés lors d’une suppression ou d’une modification qui ne les concerne pas.

## Résumé du cycle de vie

1. **Ajout de fichiers**  
   - Chaque fichier ajouté est validé individuellement selon les règles définies.
   - Les fichiers déjà présents ou en doublon dans l’import sont rejetés avec un message adapté.
   - Les fichiers valides sont ajoutés à la liste interne.
   - Un seul événement `update:model-value` est émis avec la nouvelle liste complète.

2. **Suppression de fichiers**  
   - Le fichier sélectionné est retiré de la liste interne.
   - Aucun autre fichier n’est revalidé.
   - Un événement `update:model-value` est émis avec la nouvelle liste.

## Bonnes pratiques

- Utiliser ce composant dans un formulaire parent qui gère le téléversement effectif des fichiers.
- Définir clairement les règles de validation attendues via les props du composant.
- Ne pas manipuler directement la liste interne de fichiers depuis l’extérieur : passer par les événements et le v-model.
