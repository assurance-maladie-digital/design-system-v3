# Vue d'ensemble du système de validation

## Props principales

| Prop                  | Type      | Description                                                                 |
|-----------------------|-----------|-----------------------------------------------------------------------------|
| `modelValue`          | any       | Valeur du champ à valider.                                                  |
| `customRules`         | array     | Tableau de règles de validation personnalisées (erreurs bloquantes).        |
| `customWarningRules`  | array     | Tableau de règles d’avertissement (non bloquantes).                         |
| `customSuccessRules`  | array     | Tableau de règles de succès (feedback positif).                             |
| `useVuetifyValidation`| boolean   | Active le mode validation Vuetify (sinon Synapse).                          |
| `rules`        | array     | Règles synchrones au format Vuetify (mode Vuetify uniquement).              |

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

    style S fill:#0288d1,color:#fff,stroke:#01579b,stroke-width:2px
    style A fill:#7b1fa2,color:#fff,stroke:#4a148c,stroke-width:0px
    style B fill:#7b1fa2,color:#fff,stroke:#4a148c,stroke-width:0px
    style C fill:#7b1fa2,color:#fff,stroke:#4a148c,stroke-width:0px
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
        N[Etat neutre]
        R[Etat d'erreur]
        VW[Etat de warning]
        V[Etat de success]
    end

    N -->|Règle classique| R
    N -->|Règle de type warning| VW
    N -->|Règle de confirmation| V

    style R fill:#d32f2f,color:#fff,stroke:#b71c1c,stroke-width:2px
    style VW fill:#f57c00,color:#fff,stroke:#e65100,stroke-width:0px
    style V fill:#388e3c,color:#fff,stroke:#1b5e20,stroke-width:0px
    style N fill:#616161,color:#fff,stroke:#212121,stroke-width:0px
```

**Légende :**
- 🔴 **REJECTED (Erreur)** : Soumission bloquée, border-error + icone
- 🟡 **VALIDATED_WITH_WARNINGS (Avertissement)** : Soumission autorisée, border-warning  + icone
- 🟢 **VALIDATED (Succès)** : Validation confirmée, border-success + icone

---

## Architecture à deux étages

### Couche 1 : Système Legacy (Fondations)

```mermaid
flowchart TB
    subgraph Legacy["VALIDATION LEGACY"]
        Entry["Component.vue"]
        useValidation["useValidation.ts"]
        useFieldValidation["useFieldValidation.ts"]
        useValidatable["useValidatable.ts"]
        useFormValidation["useFormValidation.ts"]
    end

    Entry -->|validation logic|useValidation
    useValidation -->|génération des règles| useFieldValidation
    Entry -->|SyForm enregistrement| useValidatable
    useValidatable --> useFormValidation

    style Entry fill:#388e3c,color:#fff,stroke:#1b5e20,stroke-width:2px
    style useValidation fill:#f57c00,color:#fff,stroke:#e65100,stroke-width:0px
    style useValidatable fill:#f57c00,color:#fff,stroke:#e65100,stroke-width:0px
    style useFieldValidation fill:#f57c00,color:#fff,stroke:#e65100,stroke-width:0px
```

### Couche 2 : Système Unifié (Interface modernisée)

Le nouveau système permet :
- D'avoir un seul point d'entré pour la validation et l'enregistrement dans le registre de formulaire (SyForm).
 - ajoute une couche d'abstraction pour gérer les différents êtats de validation (error, warning, success)
- Gérer les règles de validation au format natif Vuetify ou au format Synapse

```mermaid
flowchart TB
    subgraph Unified["VALIDATION UNIFIEE"]
        Entry["Component.vue"]
        subgraph Nouveaux wrapper unifié
            useValidation["useValidation.ts"]
            Vuetify["useVuetifyValidation.ts"]
            Custom["useCustomValidation.ts"]
            end
        subgraph composants préexistant
            UV_Legacy["useValidation.ts synapse"]
            useValidatable["useValidatable.ts"]
            end
    end

    Entry -->useValidation
    useValidation -->|useVuetifyValidation: true| Vuetify["useVuetifyValidation <br>*Gère la validation au format natif Vuetify*"]
    useValidation -->|"useVuetifyValidation: false<br>(mode par défaut)"| Custom["useCustomValidation <br>*Gère la validation au format Synapse*"]
    Custom -.->|wrap| UV_Legacy
    Custom -.->|wrap| useValidatable

    style Entry fill:#388e3c,color:#fff,stroke:#1b5e20,stroke-width:2px
    style useValidation fill:purple,color:#fff,stroke-width:0
    style Vuetify fill:#0288d1,color:#fff,stroke-width:0
    style Custom fill:#c2185b,color:#fff,stroke-width:0
    style UV_Legacy fill:#f57c00,color:#fff,stroke-width:0
    style useValidatable fill:#f57c00,color:#fff,stroke-width:0
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
| **useValidation** | Composable principal retournant l'état de validation | `composables/unifyValidation/useValidation.ts` |
| **ValidationRule** | Définition d'une contrainte de validation | `composable/rules/useFieldValidation.ts` |
| **Token** | Identifiant pour éviter les validations concurrentes (race conditions) | `composable/validation/useValidation.ts` |
| **Async** | Support des validations retournant Promise | Règles custom avec validate async |
| **3 niveaux** | Erreur bloquante, avertissement informatif, confirmation de succès | `composable/validation/useValidation.ts`|
