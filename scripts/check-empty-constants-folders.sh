#!/bin/bash

# Script pour vérifier les dossiers constants vides ou ne contenant que ExpertiseLevelEnum.ts
# et les supprimer si nécessaire

# Répertoire racine des composants
COMPONENTS_DIR="/Users/vivi/Dev/Cnam/design-system-v3/src/components"

# Trouver tous les dossiers constants
CONSTANTS_DIRS=$(find "$COMPONENTS_DIR" -type d -name "constants")

echo "Vérification des dossiers constants vides..."

for dir in $CONSTANTS_DIRS; do
  # Compter le nombre de fichiers dans le dossier
  file_count=$(find "$dir" -type f | wc -l | tr -d ' ')
  
  # Vérifier si le dossier est vide
  if [ "$file_count" -eq 0 ]; then
    echo "Dossier vide trouvé: $dir"
    echo "Suppression du dossier vide: $dir"
    rm -rf "$dir"
    continue
  fi
  
  # Vérifier si le dossier ne contient que ExpertiseLevelEnum.ts
  if [ "$file_count" -eq 1 ] && [ -f "$dir/ExpertiseLevelEnum.ts" ]; then
    echo "Dossier contenant uniquement ExpertiseLevelEnum.ts trouvé: $dir"
    echo "Suppression du fichier ExpertiseLevelEnum.ts et du dossier s'il devient vide"
    rm -f "$dir/ExpertiseLevelEnum.ts"
    
    # Vérifier si le dossier est maintenant vide
    remaining_files=$(find "$dir" -type f | wc -l | tr -d ' ')
    if [ "$remaining_files" -eq 0 ]; then
      echo "Le dossier est maintenant vide, suppression: $dir"
      rm -rf "$dir"
    else
      echo "Le dossier contient d'autres fichiers, conservation: $dir"
    fi
  fi
done

echo "Terminé! Tous les dossiers constants vides ou ne contenant que ExpertiseLevelEnum.ts ont été supprimés."
