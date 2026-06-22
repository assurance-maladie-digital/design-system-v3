<script setup lang="ts">
import { ref } from 'vue'
import NirField from '@/components/NirField/NirField.vue'

const nirValue = ref('')

// Règle personnalisée qui accepte une plage étendue de codes
const extendedNumberRules = [
  {
    type: 'custom' as const,
    options: {
      validate: (value: string) => {
        if (!value) return true

        const normalizedValue = value.replace(/\s/g, '')

        // Si le numéro est incomplet, on laisse les validations existantes gérer l'état
        if (normalizedValue.length < 13) {
          return true
        }

        // Validation personnalisée acceptant les codes de 1 à 8
        const extendedCodeRegex = /^[1-8]\d{12}$/

        if (!extendedCodeRegex.test(normalizedValue)) {
          return 'Le numéro doit commencer par un chiffre entre 1 et 8'
        }

        return true
      },
      message: 'Format du numéro invalide',
      fieldIdentifier: 'Numéro de sécurité sociale',
    },
  },
]

// Exemples de valeurs à tester
const testCases = [
  { label: 'Code 5', value: '5900175120005' },
  { label: 'Code 6', value: '6900175120005' },
  { label: 'Code 1', value: '1900175120005' },
  { label: 'Code 2', value: '2900175120005' },
]

const setTestValue = (value: string) => {
  nirValue.value = value
}
</script>

<template>
  <div class="pa-6">
    <h1 class="text-h4 mb-4">NirField - Validation avec codes étendus</h1>

    <v-card class="mb-6" elevation="2">
      <v-card-text>
        <h2 class="text-h6 mb-3">Configuration avec règles personnalisées</h2>

        <p class="text-body-2 mb-4">
          Ce playground utilise <code>customRulesPrecedence</code> avec une règle personnalisée
          permettant d’accepter une plage de codes plus large que la validation standard.
        </p>

        <NirField
          v-model="nirValue"
          label="Numéro de sécurité sociale"
          number-label="NIR"
          key-label="Clé"
          :custom-number-rules="extendedNumberRules"
          custom-rules-precedence
          nir-type="complexe"
          show-success-messages
        />

        <v-divider class="my-4" />

        <div class="text-caption">
          <strong>Valeur actuelle :</strong> {{ nirValue || 'vide' }}
        </div>
      </v-card-text>
    </v-card>

    <v-card class="mb-6" elevation="2">
      <v-card-text>
        <h2 class="text-h6 mb-3">Tests rapides</h2>

        <p class="text-body-2 mb-4">
          Cliquez sur les boutons pour tester différentes valeurs avec des codes compris entre 1 et 8.
        </p>

        <v-row>
          <v-col
            v-for="testCase in testCases"
            :key="testCase.value"
            cols="12"
            sm="6"
            md="3"
          >
            <v-btn
              variant="outlined"
              size="small"
              block
              @click="setTestValue(testCase.value)"
            >
              {{ testCase.label }}
            </v-btn>

            <div class="text-caption mt-1 text-center">
              {{ testCase.value }}
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-card elevation="2">
      <v-card-text>
        <h2 class="text-h6 mb-3">Principe de fonctionnement</h2>

        <v-alert type="info" variant="tonal" class="mb-3">
          <strong>Comment ça marche :</strong>

          <ul class="mt-2">
            <li><code>customRulesPrecedence="true"</code> donne priorité aux règles personnalisées.</li>
            <li>La règle personnalisée vérifie le format avec la regex <code>/^[1-8]\d{12}$/</code>.</li>
            <li>Les codes compris entre <code>1</code> et <code>8</code> sont acceptés.</li>
            <li>Cette configuration permet de tester des cas métier spécifiques sans modifier le composant.</li>
          </ul>
        </v-alert>

        <v-alert type="warning" variant="tonal">
          <strong>Point d’attention :</strong>

          <ul class="mt-2">
            <li>Cette règle porte uniquement sur le numéro principal.</li>
            <li>La validation de la clé de contrôle doit être vérifiée séparément si elle est requise.</li>
            <li>Cette configuration est destinée à un usage de test ou de démonstration.</li>
          </ul>
        </v-alert>
      </v-card-text>
    </v-card>
  </div>
</template>

<style scoped>
.code {
  background-color: #f5f5f5;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
}
</style>