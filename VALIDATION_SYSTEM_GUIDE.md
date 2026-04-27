# Guide du Système de Validation

> **Vue d'ensemble** : Le système de validation fournit un **framework complet de gestion des états de formulaire**, supportant la validation synchrone et asynchrone avec gestion des conflits (race conditions), et offrant trois niveaux de feedback (erreurs bloquantes, avertissements informatifs, confirmations de succès).

---

## Vue d'ensemble

```mermaid
flowchart TB
    subgraph Champs["Composants de formulaire"]
        A[SyTextField<br/>email]
        B[SyTextField<br/>password]
        C[DatePicker<br/>date]
    end

    subgraph Form["Coordination"]
        S[SyForm<br/>Registre central]
    end

    subgraph Rules["Règles de validation"]
        RA["• required<br/>• email format"]
        RB["• minLength(8)<br/>• pattern regex"]
        RC["• noWeekend<br/>• async API check"]
    end

    A -->|enregistrement| S
    B -->|enregistrement| S
    C -->|enregistrement| S

    S -->|valide| RA
    S -->|valide| RB
    S -->|valide| RC

    style S fill:#e1f5fe
    style A fill:#f3e5f5
    style B fill:#f3e5f5
    style C fill:#f3e5f5
```

**Fichiers source :**
- [`SyForm.vue`](src/components/Customs/SyForm/SyForm.vue) - Composant formulaire
- [`SyTextField.vue`](src/components/Customs/SyTextField/SyTextField.vue) - Champ de saisie
- [`DateTextInput.vue`](src/components/DatePicker/DateTextInput/DateTextInput.vue) - Saisie de date
- [`useFieldValidation.ts`](src/composables/rules/useFieldValidation.ts) - Définition des règles

---

## Les 3 niveaux de validation

```mermaid
stateDiagram-v2
    [*] --> NEUTRAL: Initialisation

    NEUTRAL --> REJECTED: Règle non respectée
    REJECTED --> [*]: Bloque soumission

    NEUTRAL --> VALIDATED_WITH_WARNINGS: Règle respectée avec alerte
    VALIDATED_WITH_WARNINGS --> [*]: Autorise soumission

    NEUTRAL --> VALIDATED: Règle respectée
    VALIDATED --> [*]: Autorise soumission

    note right of REJECTED
        🔴 ERREUR
        - Soumission bloquée
        - Message d'erreur
        - border-error + icônes
    end note

    note right of VALIDATED_WITH_WARNINGS
        🟡 AVERTISSEMENT
        - Soumission autorisée
        - Message d'alerte
        - border-warning + icônes
    end note

    note right of VALIDATED
        🟢 SUCCÈS
        - Validation confirmée
        - Message de confirmation
        - border-success + icônes
    end note
```

---

## Architecture à deux étages

### Couche 1 : Système Legacy (Fondations)

```mermaid
flowchart TB
    subgraph Legacy["VALIDATION LEGACY (Couche 1)"]
        direction TB

        UV[useValidation.ts<br/>Moteur principal]
        UV_Desc["• Gestion des tokens<br/>anti-race-condition<br/>• Exécution sync/async<br/>• Retour: errors/warnings/successes"]

        UVT[useValidatable.ts<br/>Interface d'enregistrement]
        UVT_Desc["• Auto-enregistrement<br/>• API: validate / clear / reset"]

        UFV[useFormValidation.ts<br/>Registre central]
        UFV_Desc["• Lifecycle des composants<br/>• Validation collective"]
    end

    UV --> UV_Desc
    UVT --> UVT_Desc
    UFV --> UFV_Desc

    UFV -.->|fournit context| UVT
    UVT -.->|appelle| UV

    style UV fill:#fff3e0
    style UVT fill:#fff3e0
    style UFV fill:#fff3e0
```

**Fichiers source :**
- [`useValidation.ts`](src/composables/validation/useValidation.ts) - Moteur de validation legacy
- [`useValidatable.ts`](src/composables/validation/useValidatable.ts) - Interface d'enregistrement
- [`useFormValidation.ts`](src/composables/validation/useFormValidation.ts) - Registre central

### Couche 2 : Système Unifié (Interface modernisée)

```mermaid
flowchart TB
    subgraph Unified["VALIDATION UNIFIÉE (Couche 2)"]
        direction TB

        Entry[useValidation.ts<br/>Point d'entrée unique]

        subgraph Modes["Modes de validation"]
            Vuetify[useVuetifyValidation.ts<br/>Adapteur natif Vuetify]
            Custom[useCustomValidation.ts<br/>Pont vers useValidation.ts]
            Props[Props Handler]
        end
    end

    Entry -->|useVuetifyValidation: true| Vuetify
    Entry -->|useVuetifyValidation: false| Custom
    Entry --> Props

    Custom -.->|wrap| UV_Legacy[useValidation.ts<br/>Legacy]

    style Entry fill:#e8f5e9
    style Vuetify fill:#e3f2fd
    style Custom fill:#fce4ec
    style UV_Legacy fill:#fff3e0
```

**Fichiers source :**
- [`useValidation.ts (unifié)`](src/composables/unifyValidation/useValidation.ts) - Point d'entrée unifié
- [`useVuetifyValidation.ts`](src/composables/unifyValidation/useVuetifyValidation.ts) - Adapteur Vuetify
- [`useCustomValidation.ts`](src/composables/unifyValidation/useCustomValidation.ts) - Pont vers validation legacy
- [`useValidation.ts (legacy)`](src/composables/validation/useValidation.ts) - Validation legacy

---

## Flux de validation

### 1. Validation Synchrone

```mermaid
sequenceDiagram
    actor U as Utilisateur
    participant C as Composant
    participant V as useValidation
    participant R as Règle

    U->>C: Saisie valeur
    U->>C: blur / input event
    C->>V: validate()
    V->>R: Exécution règle
    R-->>V: boolean | string
    V-->>C: Résultat immédiat (< 1ms)
    C-->>U: Affichage état
```

### 2. Validation Asynchrone (Avec gestion des conflits)

```mermaid
sequenceDiagram
    actor U as Utilisateur
    participant C as Composant
    participant V as useValidation
    participant T as Token Counter
    participant API as Service externe

    Note over U,API: Premier appel
    U->>C: Saisie "john" + blur
    C->>V: validate()
    V->>T: Génère token #42
    V->>API: Requête async
    API--xV: Promise pending (~500ms)

    Note over U,API: Nouvelle saisie (avant retour)
    U->>C: Saisie "john.doe" + blur
    C->>V: validate()
    V->>T: Génère token #43
    Note right of T: currentToken = 43<br/>#42 devient obsolète
    V->>API: Nouvelle requête async

    Note over U,API: Gestion des résultats
    API-->>V: Résultat #42
    V->>V: Vérifie token #42 != 43
    Note right of V: Résultat ignoré

    API-->>V: Résultat #43
    V->>V: Vérifie token #43 == 43
    V-->>C: Affiche résultat
    C-->>U: Mise à jour UI
```

**Fichiers source associés :**
- [`useValidation.ts`](src/composables/validation/useValidation.ts) - Gestion des tokens et race conditions
- [`useFieldValidation.ts`](src/composables/rules/useFieldValidation.ts) - Définition des règles custom

---

## Types de règles disponibles

```mermaid
mindmap
  root((Règles de<br/>Validation))
    StringRules
      required
      minLength(n)
      maxLength(n)
      exactLength(n)
      email
      matchPattern
    NumberRules
      min(n)
      max(n)
    DateRules
      noWeekend
      notBeforeToday
      notAfterToday
      notBeforeDate
      notAfterDate
      dateExact
      isHolidayDay
    CustomRule
      sync
      async
```

**Règle personnalisée (CustomRule)**

```typescript
type CustomValidator = (value: unknown) => 
  | boolean           // true = OK, false = erreur implicite
  | string            // Message d'erreur personnalisé
  | Promise<boolean | string>  // Validation asynchrone
```

---

## Migration : Legacy → Unifié

### Avant (Legacy) - À ÉVITER

```typescript
// ❌ Ancienne façon - Directement dans le composant
import { useValidation } from '@/composables/validation/useValidation'

const { validate, errors } = useValidation({
  modelValue: ref(''),
  rules: [
    { type: 'required', options: { message: 'Requis' } },
    { type: 'email', options: {} }
  ]
})
```

### Après (Unifié) - RECOMMANDÉ

```typescript
// ✅ Nouvelle façon - Via le composant wrapper
import { useValidation } from '@/composables/unifyValidation/useValidation'

// Dans le composant (ex: SyTextField)
const { validate, errors, warnings, successes } = useValidation({
  modelValue: model,
  // Mode Vuetify ou Custom ?
  useVuetifyValidation: false, // ← false = validation Synapse
  
  // Règles personnalisées
  customRules: computed(() => [
    { type: 'required', options: { message: 'Email requis' } },
    { type: 'email', options: { message: 'Format invalide' } },
    { 
      type: 'custom', 
      options: { 
        message: 'Email déjà utilisé',
        validate: async (value) => {
          const exists = await checkEmailExists(value)
          return !exists // true = OK, false = erreur
        }
      } 
    }
  ]),
  
  // Règles d'avertissement (ne bloquent pas)
  customWarningRules: [...],
  
  // Règles de succès (feedback positif)
  customSuccessRules: [...]
})
```

---

## Checklist de migration

```
┌────────────────────────────────────────────────────────────────┐
│              CHECKLIST MIGRATION VALIDATION                     │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  □ Importer depuis unifyValidation au lieu de validation       │
│    import { useValidation } from '@/composables/unifyValidation/useValidation'
│                                                                 │
│  □ Utiliser useVuetifyValidation pour choisir le mode          │
│    • true  → Validation Vuetify native                         │
│    • false → Validation Synapse (recommandé)                   │
│                                                                 │
│  □ Migrer les règles vers customRules                            │
│    • customRules pour les erreurs bloquantes                    │
│    • customWarningRules pour les avertissements                │
│    • customSuccessRules pour les feedbacks positifs            │
│                                                                 │
│  □ Remplacer la gestion manuelle des erreurs                     │
│    • props.errorMessages → géré automatiquement                  │
│    • hasError → utiliser le retour du composable               │
│                                                                 │
│  □ Exposer validate() pour SyForm                               │
│    defineExpose({ validateOnSubmit: validate })                │
│                                                                 │
│  □ Tester la validation asynchrone si utilisée                  │
│    • Vérifier le mécanisme de token (race condition)           │
│    • S'assurer que les promises sont gérées                   │
│                                                                 │
```

---

## Exemple complet : Formulaire avec validation croisée

```mermaid
flowchart LR
    subgraph CrossValidation["Validation croisée"]
        direction TB

        Start[Date de début<br/>01/06/2024]
        End[Date de fin<br/>15/06/2024]

        Rule["Règle réactive<br/>(computed)"]
        RuleCheck{"endDate ≥<br/>startDate ?"}

        Valid["✓ VALID"]
        Invalid["✗ INVALID<br/>'Doit être après<br/>la date de début'"]
    end

    Start -->|dépendance| Rule
    End -->|validation| Rule
    Rule --> RuleCheck
    RuleCheck -->|oui| Valid
    RuleCheck -->|non| Invalid

    style Rule fill:#e3f2fd
    style Valid fill:#e8f5e9
    style Invalid fill:#ffebee
```

**Implémentation :**

```typescript
// Champ Date de fin
const customRules = computed(() => [{
  type: 'custom',
  options: {
    validate: (endDate) => {
      const start = props.startDate
      return !start || endDate >= start || 
             'Doit être après la date de début'
    }
  }
}])

// La règle se réévalue automatiquement quand props.startDate change
```

---

## Points clés à retenir

```mermaid
mindmap
  root((Points clés))
    SyForm["Registre et coordinateur de validation de formulaire"]
    useValidation["Composable principal retournant l'état de validation"]
    ValidationRule["Définition d'une contrainte de validation"]
    Token["Identifiant de validation pour gestion des race conditions"]
    Async["Support des validations retournant Promise"]
    Niveaux["3 niveaux : Error, Warning, Success"]
```
| Concept | Explication technique | Où ça vit |
|---------|-------------------|-----------|
| SyForm | Registre et coordinateur de validation de formulaire | `components/Customs/SyForm/` |
| **useValidation** | Composable principal retournant l'état de validation | `composables/unifyValidation/` |
| **ValidationRule** | Définition d'une contrainte de validation | `useFieldValidation.ts` |
| **Token** | Identifiant de validation pour gestion des race conditions | `useValidation.ts` |
| **Async** | Support des validations retournant Promise | Règles custom avec validate async |
| **3 niveaux** | Error (REJECTED), Warning (VALIDATED_WITH_WARNINGS), Success (VALIDATED) | Retours structurés de useValidation |

---

