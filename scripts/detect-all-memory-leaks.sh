#!/bin/bash

# Script de détection des fuites mémoire pour tous les tests
# Exécute les tests un par un avec isolation et surveille la consommation mémoire

# Couleurs pour une meilleure lisibilité
BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
THRESHOLD_MB=10        # Seuil d'alerte en MB
REPEAT_COUNT=2         # Nombre d'exécutions pour chaque test
REPORT_FILE="memory-leak-report.txt"

echo -e "${BLUE}🔍 Détection des fuites mémoire dans TOUS les tests${NC}"
echo -e "${YELLOW}Note: Cette opération peut prendre du temps car chaque test est exécuté isolément ${REPEAT_COUNT} fois${NC}\n"
echo -e "${YELLOW}Seuil d'alerte: ${THRESHOLD_MB} MB${NC}"
echo -e "${YELLOW}Résultats seront enregistrés dans: ${REPORT_FILE}${NC}\n"

# Trouver tous les fichiers de test
echo -e "${BLUE}Recherche des fichiers de test...${NC}"
TEST_FILES=$(find src tests -name "*.spec.ts")

# Vérifier qu'on a trouvé des fichiers
if [ -z "$TEST_FILES" ]; then
  echo -e "${RED}Aucun fichier de test trouvé!${NC}"
  exit 1
fi

# Compter les fichiers
FILE_COUNT=$(echo "$TEST_FILES" | wc -l)
echo -e "${GREEN}$FILE_COUNT fichiers de test trouvés.${NC}\n"

# Préparer le rapport
echo "Rapport de détection des fuites mémoire - $(date)" > "$REPORT_FILE"
echo "Seuil d'alerte: $THRESHOLD_MB MB" >> "$REPORT_FILE"
echo "Nombre de tests: $FILE_COUNT" >> "$REPORT_FILE"
echo "---------------------------------------------" >> "$REPORT_FILE"

# Compteurs
LEAKING_COUNT=0
ERROR_COUNT=0

# Tester chaque fichier
for TEST_FILE in $TEST_FILES; do
  echo -e "${BLUE}Test: $TEST_FILE${NC}"
  echo "Test: $TEST_FILE" >> "$REPORT_FILE"
  
  # Variables pour suivre la mémoire
  TOTAL_DIFF=0
  MAX_DIFF=0
  ERROR_DETECTED=false
  
  # Exécuter le test plusieurs fois
  for i in $(seq 1 $REPEAT_COUNT); do
    echo -e "${YELLOW}  Itération $i/$REPEAT_COUNT${NC}"
    
    # Mesure de mémoire avant
    MEM_BEFORE=$(ps -o rss= -p $$ | awk '{print $1/1024}')
    echo "  Mémoire avant: ${MEM_BEFORE} MB"
    
    # Exécuter le test avec isolation
    if npx vitest run "$TEST_FILE" --isolate --silent > /dev/null 2>&1; then
      TEST_STATUS="OK"
    else
      TEST_STATUS="ÉCHEC"
      ERROR_DETECTED=true
    fi
    
    # Mesure de mémoire après
    MEM_AFTER=$(ps -o rss= -p $$ | awk '{print $1/1024}')
    echo "  Mémoire après: ${MEM_AFTER} MB"
    
    # Calculer la différence
    DIFF=$(echo "$MEM_AFTER - $MEM_BEFORE" | bc)
    TOTAL_DIFF=$(echo "$TOTAL_DIFF + $DIFF" | bc)
    
    # Mettre à jour le max si nécessaire
    if (( $(echo "$DIFF > $MAX_DIFF" | bc -l) )); then
      MAX_DIFF=$DIFF
    fi
    
    echo "  Δ Mémoire: ${DIFF} MB (Status: $TEST_STATUS)"
    echo ""
    
    # Attendre un peu pour stabiliser
    sleep 1
  done
  
  # Calculer la moyenne
  AVG_DIFF=$(echo "scale=2; $TOTAL_DIFF / $REPEAT_COUNT" | bc)
  
  # Vérifier s'il y a une fuite
  if (( $(echo "$MAX_DIFF > $THRESHOLD_MB" | bc -l) )); then
    echo -e "${RED}⚠️ FUITE DÉTECTÉE: $TEST_FILE - Max: ${MAX_DIFF} MB, Moy: ${AVG_DIFF} MB${NC}"
    echo "⚠️ FUITE DÉTECTÉE - Max: ${MAX_DIFF} MB, Moy: ${AVG_DIFF} MB" >> "$REPORT_FILE"
    LEAKING_COUNT=$((LEAKING_COUNT + 1))
  elif [ "$ERROR_DETECTED" = true ]; then
    echo -e "${YELLOW}⚠️ ERREUR: $TEST_FILE - Le test a échoué${NC}"
    echo "⚠️ ERREUR - Le test a échoué" >> "$REPORT_FILE"
    ERROR_COUNT=$((ERROR_COUNT + 1))
  else
    echo -e "${GREEN}✓ OK: $TEST_FILE - Max: ${MAX_DIFF} MB, Moy: ${AVG_DIFF} MB${NC}"
    echo "✓ OK - Max: ${MAX_DIFF} MB, Moy: ${AVG_DIFF} MB" >> "$REPORT_FILE"
  fi
  
  echo "---------------------------------------------" >> "$REPORT_FILE"
  echo "" # Ligne vide pour séparer les résultats
done

# Résumé final
echo -e "\n${BLUE}📊 RÉSUMÉ DES RÉSULTATS${NC}"
echo -e "${BLUE}📊 $FILE_COUNT tests analysés${NC}"
echo -e "${RED}⚠️ $LEAKING_COUNT tests avec des fuites mémoire${NC}"
echo -e "${YELLOW}⚠️ $ERROR_COUNT tests avec des erreurs${NC}"

# Ajouter le résumé au rapport
echo "" >> "$REPORT_FILE"
echo "RÉSUMÉ DES RÉSULTATS" >> "$REPORT_FILE"
echo "$FILE_COUNT tests analysés" >> "$REPORT_FILE"
echo "$LEAKING_COUNT tests avec des fuites mémoire" >> "$REPORT_FILE"
echo "$ERROR_COUNT tests avec des erreurs" >> "$REPORT_FILE"

echo -e "\n${GREEN}Rapport enregistré dans $REPORT_FILE${NC}"
