# Guide du Système de Validation

> **Vue d'ensemble** : Le système de validation fournit un **framework complet de gestion des états de formulaire**, supportant la validation synchrone et asynchrone avec gestion des conflits (race conditions), et offrant trois niveaux de feedback (erreurs bloquantes, avertissements informatifs, confirmations de succès).

---

## Vue d'ensemble

```mermaid
flowchart TB
    subgraph Champs["Composants de formulaire"]
        A["SyTextField: email"]
        B["SyTextField: password"]
        C["DatePicker: date"]
    end

    subgraph Form["Coordination"]
        S["SyForm: Registre central"]
    end

    subgraph Rules["Regles"]
        RA["required, email"]
        RB["minLength(8), pattern"]
        RC["noWeekend, async API"]
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
flowchart TB
    subgraph Statuts["Statuts de validation"]
        N[NEUTRAL\nInitialisation]
        R[REJECTED\nERREUR]
        VW[VALIDATED_WITH_WARNINGS\nAVERTISSEMENT]
        V[VALIDATED\nSUCCES]
    end

    N -->|Règle non respectée| R
    N -->|Règle respectée avec alerte| VW
    N -->|Règle respectée| V

    style R fill:#ffcdd2,stroke:#f44336
    style VW fill:#ffe0b2,stroke:#ff9800
    style V fill:#c8e6c9,stroke:#4caf50
    style N fill:#f5f5f5,stroke:#9e9e9e
```

**Légende :**
- 🔴 **REJECTED (Erreur)** : Soumission bloquée, border-error
- 🟡 **VALIDATED_WITH_WARNINGS (Avertissement)** : Soumission autorisée, border-warning  
- 🟢 **VALIDATED (Succès)** : Validation confirmée, border-success

---

## Architecture à deux étages

### Couche 1 : Système Legacy (Fondations)

```mermaid
flowchart TB
    subgraph Legacy["VALIDATION LEGACY"]
        UV["useValidation.ts"]
        UV_Desc["Gestion des tokens, sync/async"]

        UVT["useValidatable.ts"]
        UVT_Desc["Auto-enregistrement"]

        UFV["useFormValidation.ts"]
        UFV_Desc["Registre central"]
    end

    UV --> UV_Desc
    UVT --> UVT_Desc
    UFV --> UFV_Desc

    UFV -.->|context| UVT
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
    subgraph Unified["VALIDATION UNIFIEE"]
        Entry["useValidation.ts"]

        Vuetify["useVuetifyValidation.ts"]
        Custom["useCustomValidation.ts"]
        UV_Legacy["useValidation.ts Legacy"]
    end

    Entry -->|mode: true| Vuetify
    Entry -->|mode: false| Custom
    Custom -.->|wrap| UV_Legacy

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
flowchart TD
    Root["REGLES DE VALIDATION"]
    
    Root --> StringRules["StringRules"]
    Root --> NumberRules["NumberRules"]
    Root --> DateRules["DateRules"]
    Root --> CustomRule["CustomRule"]
    
    StringRules --> R1["required"]
    StringRules --> R2["minLength(n)"]
    StringRules --> R3["maxLength(n)"]
    StringRules --> R4["email"]
    StringRules --> R5["matchPattern"]
    
    NumberRules --> N1["min(n)"]
    NumberRules --> N2["max(n)"]
    
    DateRules --> D1["noWeekend"]
    DateRules --> D2["notBeforeToday"]
    DateRules --> D3["notAfterToday"]
    DateRules --> D4["dateExact"]
    DateRules --> D5["isHolidayDay"]
    
    CustomRule --> C1["sync"]
    CustomRule --> C2["async"]
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
    subgraph CrossValidation["Validation croisee"]
        Start["Date debut"]
        End["Date fin"]
        Rule["Regle reactive (computed)"]
        RuleCheck{"fin >= debut ?"}
        Valid["VALID"]
        Invalid["INVALID"]
    end

    Start -->|dependance| Rule
    End -->|validation| Rule
    Rule --> RuleCheck
    RuleCheck -->|oui| Valid
    RuleCheck -->|non| Invalid

    style Rule fill:#e3f2fd
    style Valid fill:#c8e6c9
    style Invalid fill:#ffcdd2
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
flowchart TD
    Root["POINTS CLES"]
    
    Root --> SyForm["SyForm - Registre formulaire"]
    Root --> useValidation["useValidation - Etat validation"]
    Root --> ValidationRule["ValidationRule - Contraintes"]
    Root --> Token["Token - Race conditions"]
    Root --> Async["Async - Promise support"]
    Root --> Niveaux["3 niveaux: Error, Warning, Success"]
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

