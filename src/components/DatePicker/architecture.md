# Architecture du DatePicker

Le DatePicker est un système de composants modulaire conçu pour offrir une expérience utilisateur cohérente et accessible pour la sélection de dates, avec support pour les plages de dates et différents formats.

## Structure

### Composants

1. **DatePicker** (composant principal)
   - Composant de base qui intègre les fonctionnalités de sélection de date
   - Gère la synchronisation entre le champ de texte et le calendrier
   - Permet la validation des dates (règles required, personnalisées, etc.)
   - Offre une option `noCalendar` pour utiliser uniquement la saisie manuelle (le calendrier est alors caché et DateTextInput est utilisé)

2. **DateTextInput**
   - Composant spécialisé pour la saisie manuelle de dates
   - Formatage automatique intelligent des dates pendant la saisie
   - Validation du format et des règles métier

3. **ComplexDatePicker**
   - Version avancée du DatePicker qui combine le calendrier et la saisie manuelle
   - Support complet des plages de dates (calendrier et saisie manuelle)

### Composables

1. **useDateRangeInput**
   - Gère la saisie manuelle des plages de dates
   - Permet le formatage et la validation des plages au format "date1 - date2"
   - Gère les états de saisie (première date, deuxième date)
   - Facilite l'extraction et l'analyse des parties d'une plage

2. **useDateRangeValidation**
   - Valide les plages de dates (date de début avant date de fin)
   - Fournit des messages d'erreur appropriés
   - S'intègre avec le système de validation général

3. **useDateSelection**
   - Gère la sélection de dates dans les composants
   - Support pour les plages de dates et génération des dates intermédiaires
   - Synchronisation entre différents formats de dates

4. **useDatePickerViewMode**
   - Contrôle le mode d'affichage du DatePicker (année, mois, jour)
   - Gestion spéciale pour les dates de naissance
   - Transitions automatiques entre les modes

5. **useTodayButton**
   - Gère la fonctionnalité du bouton "Aujourd'hui"
   - Formate la date du jour selon le format spécifié

6. **useWeekendDays**
   - Gère l'affichage des jours de week-end dans le calendrier

## Flux de données

1. **Initialisation**
   - Les props sont passées aux composants
   - Les dates initiales sont formatées et stockées dans les refs
   - Les composables sont initialisés avec les paramètres appropriés

2. **Saisie utilisateur**
   - L'utilisateur peut saisir une date manuellement ou utiliser le calendrier
   - La saisie manuelle est formatée automatiquement avec ajout des séparateurs
   - Les dates sélectionnées sont validées en temps réel

3. **Synchronisation**
   - Le composant maintient une synchronisation bidirectionnelle entre:
     - La valeur affichée dans le champ de texte (textInputValue)
     - Les dates sélectionnées dans le calendrier (selectedDates)
     - La valeur du modèle exposée via v-model (modelValue)
   - Un gestionnaire d'événements @update:model-value assure la mise à jour correcte de displayFormattedDate

4. **Validation**
   - La validation s'effectue à plusieurs niveaux:
     - Validation du format de date
     - Validation des règles métier (required, etc.)
     - Validation des dépendances (même si des erreurs standard existent)
     - Validation spécifique aux plages de dates

5. **Émission des événements**
   - Les changements de valeur sont émis via update:modelValue
   - D'autres événements (focus, blur, closed) sont émis pour permettre des interactions externes