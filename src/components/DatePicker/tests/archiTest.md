datePicker/tests
├── core/                           # Tests des fonctionnalités de base
│   ├── validation.core.spec.ts     # Validation de base (required, format)
│   ├── formats.core.spec.ts        # Formats d'entrée/sortie standards
│   └── events.core.spec.ts         # Événements de base (update, focus, blur)
├── components/                     # Tests spécifiques par composant
│   ├── CalendarMode.spec.ts        # Tests CalendarMode complets
│   ├── ComplexDatePicker.spec.ts   # Tests ComplexDatePicker complets
│   └── DateTextInput.spec.ts       # Tests DateTextInput complets
├── features/                       # Tests des fonctionnalités avancées
│   ├── customRules.spec.ts         # Custom rules et règles complexes
│   ├── reactivity.spec.ts          # Réactivité Vue 3 et computed
│   ├── combinedMode.spec.ts        # Mode combined spécifique
│   └── accessibility.spec.ts       # Tests A11y et navigation clavier
├── integration/                    # Tests d'intégration
│   ├── forms.integration.spec.ts   # Intégration Vuetify forms
│   ├── validation.integration.spec.ts # Intégration validation complexe
│   └── multiComponent.integration.spec.ts # Interactions multi-composants
├── performance/                    # Tests de performance
│   ├── stress.performance.spec.ts  # Tests de charge et stress
│   ├── memory.performance.spec.ts  # Memory leaks et cleanup
│   └── rendering.performance.spec.ts # Performance de rendu
├── regression/                     # Tests de régression des bugs
│   ├── clearInput.regression.spec.ts     # Bug croix suppression (Mémoire 1f50fe1b)
│   ├── reactiveRules.regression.spec.ts  # Bug règles réactives (Mémoire 2196b67a)
│   ├── combinedMode.regression.spec.ts   # Bug combined-mode (Mémoire a60921cf)
│   ├── messagePriority.regression.spec.ts # Bug priorité messages (Mémoire 36e3ba09)
│   └── immediateValidation.regression.spec.ts # Bug validation immédiate (Mémoire 36a3ff57)
└── edge-cases/                     # Tests des cas limites
    ├── formats.edge.spec.ts        # Formats exotiques et edge cases
    ├── dates.edge.spec.ts          # Dates limites (1900-2100, bissextiles)
    ├── browser.edge.spec.ts        # Compatibilité navigateurs
    └── corruption.edge.spec.ts     # Données corrompues et robustesse