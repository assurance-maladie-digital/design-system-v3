
# AmeliproUpload

Composant Vue destiné à la sélection et à la gestion de fichiers à téléverser (upload) dans un formulaire.

## Principes de fonctionnement

- **Stockage local** : Le composant ne réalise pas le téléversement lui-même. Il se contente de stocker les fichiers sélectionnés, qui seront ensuite transmis au formulaire parent pour traitement.
- **Événements** : Un événement `update:model-value` est émis à chaque modification de la liste interne des fichiers (ajout ou suppression). Lors d’un ajout multiple, un seul événement est émis pour l’ensemble des fichiers importés.
- **Validation à l’import** : Tout fichier ajouté doit respecter l’ensemble des règles de validation définies (type, taille, nombre maximum, non-duplication, etc.). La non-duplication s’applique aussi bien vis-à-vis des fichiers déjà présents que des fichiers ajoutés en double lors d’une même importation.
- **Suppression** : La suppression d’un fichier retire simplement ce fichier de la liste interne et émet l’événement `update:model-value`. Elle ne déclenche pas de revalidation des fichiers restants.
- **Pas de revalidation globale** : Les fichiers déjà présents et validés ne sont jamais revalidés lors d’une suppression ou d’une modification qui ne les concerne pas.
- **Gestion des erreurs et messages** : Les messages d’erreur affichés lors de l’import ou du rejet de fichiers sont personnalisables via la prop `errorMessages` et l’utilisation des règles (rules) fournies dans `src/utils/amelipro/rules/uploadFile`. Il est recommandé d’utiliser ces règles pour garantir la cohérence des messages et la personnalisation attendue.

## Résumé du cycle de vie

1. **Ajout de fichiers**
   - Chaque fichier ajouté est validé individuellement selon les règles définies (voir limitation ci-dessous).
   - Les fichiers déjà présents ou en doublon dans l’import sont rejetés avec un message adapté (voir limitation ci-dessous).
   - Les fichiers valides sont ajoutés à la liste interne.
   - Un seul événement `update:model-value` est émis avec la nouvelle liste complète.

2. **Suppression de fichiers**
   - Le fichier sélectionné est retiré de la liste interne.
   - Aucun autre fichier n’est revalidé.
   - Un événement `update:model-value` est émis avec la nouvelle liste.

## Bonnes pratiques

- Utiliser ce composant dans un formulaire parent qui gère le téléversement effectif des fichiers.
- Définir clairement les règles de validation attendues via les props du composant, en utilisant de préférence les règles utilitaires fournies (`fileUploadMaxFileNumberRule`, `fileUploadDuplicationRule`, etc.) pour bénéficier de la personnalisation des messages d’erreur.
- Ne pas manipuler directement la liste interne de fichiers depuis l’extérieur : passer par les événements et le v-model.

## Limitations connues et points d’attention

- **Absence de message d’avertissement lors de l’ajout d’un fichier déjà chargé** : Actuellement, si l’utilisateur tente d’ajouter un fichier déjà présent dans la liste, aucun message d’avertissement n’est affiché. Ce comportement est à corriger pour garantir un retour utilisateur cohérent.
- **Personnalisation des messages d’erreur** : Si la logique d’import ne s’appuie pas sur les règles utilitaires (ex : `fileUploadMaxFileNumberRule`), la personnalisation des messages via la prop `errorMessages` ne sera pas effective. Il est donc essentiel de toujours utiliser ces règles pour la validation.
- **Aucune revalidation sur suppression** : La suppression d’un fichier ne déclenche jamais de revalidation des autres fichiers déjà présents.
- **Un seul événement par action** : L’événement `update:model-value` n’est émis qu’en cas de modification effective de la liste (ajout ou suppression réelle).
