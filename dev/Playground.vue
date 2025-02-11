<script lang="ts" setup>
import { ref } from 'vue'
import DateTextInput from '@/components/DatePicker/DateTextInput.vue'

// Test cases
const simpleDate = ref<string | null>(null)
const shortYearDate = ref<string | null>(null)
const mmddDate = ref<string | null>(null)
const requiredDate = ref<string | null>(null)
const rangeDate = ref<string | null>(null)
const customMessagesDate = ref<string | null>(null)

// Min/Max dates
const today = new Date()
const minDate = new Date(today)
minDate.setMonth(today.getMonth() - 1)
const maxDate = new Date(today)
maxDate.setMonth(today.getMonth() + 1)

const formatDate = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

// Custom error messages
const customErrors = {
  required: '⚠️ Une date est requise',
  format: '❌ Format incorrect (JJ/MM/AAAA)',
  min: '⬅️ Date trop ancienne :',
  max: '➡️ Date trop récente :',
  invalid: '❌ Cette date n\'existe pas'
}
</script>

<template>
  <div class="playground">
    <h1>Test du DateTextInput</h1>

    <div class="test-cases">
      <h2>Scénarios de test :</h2>
      <ol>
        <li>✍️ <strong>Saisie manuelle</strong> : tapez "09022024"</li>
        <li>📋 <strong>Copier-coller</strong> : copiez "09/02/2024"</li>
        <li>📅 <strong>Année courte</strong> : tapez "09/02/24"</li>
        <li>❌ <strong>Date invalide</strong> : tapez "31/02/2024"</li>
        <li>⚠️ <strong>Hors limites</strong> : tapez une date hors min/max</li>
        <li>🔄 <strong>Format US</strong> : tapez "02/09/2024"</li>
        <li>⌨️ <strong>Saisie rapide</strong> : tapez rapidement une date</li>
        <li>🗑️ <strong>Effacement</strong> : effacez une date valide</li>
      </ol>
    </div>

    <div class="test-case">
      <h2>1. Date simple (format par défaut)</h2>
      <p>Testez la saisie manuelle et le copier-coller</p>
      <div class="input-container">
        <DateTextInput
          v-model="simpleDate"
          placeholder="Date au format DD/MM/YYYY"
        />
        <div class="value">Valeur : {{ simpleDate }}</div>
      </div>
    </div>

    <div class="test-case">
      <h2>2. Année sur 2 chiffres</h2>
      <p>Les années > 50 sont 19xx, les années ≤ 50 sont 20xx</p>
      <div class="input-container">
        <DateTextInput
          v-model="shortYearDate"
          placeholder="Date avec année courte"
          yearFormat="short"
        />
        <div class="value">Valeur : {{ shortYearDate }}</div>
      </div>
    </div>

    <div class="test-case">
      <h2>3. Format MM/DD/YYYY</h2>
      <p>Format américain</p>
      <div class="input-container">
        <DateTextInput
          v-model="mmddDate"
          placeholder="Date format US"
          format="MM/DD/YYYY"
        />
        <div class="value">Valeur : {{ mmddDate }}</div>
      </div>
    </div>

    <div class="test-case">
      <h2>4. Date requise avec min/max</h2>
      <p>Date requise entre {{ formatDate(minDate) }} et {{ formatDate(maxDate) }}</p>
      <div class="input-container">
        <DateTextInput
          v-model="requiredDate"
          placeholder="Date requise"
          required
          :minDate="formatDate(minDate)"
          :maxDate="formatDate(maxDate)"
        />
        <div class="value">Valeur : {{ requiredDate }}</div>
      </div>
    </div>

    <div class="test-case">
      <h2>5. Messages personnalisés</h2>
      <p>Avec emojis et messages custom</p>
      <div class="input-container">
        <DateTextInput
          v-model="customMessagesDate"
          placeholder="Date avec messages custom"
          required
          :minDate="formatDate(minDate)"
          :maxDate="formatDate(maxDate)"
          :errorMessages="customErrors"
        />
        <div class="value">Valeur : {{ customMessagesDate }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.playground {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  font-family: system-ui, -apple-system, sans-serif;
}

h1 {
  color: #2c3e50;
  margin-bottom: 2rem;
}

.test-case {
  margin-bottom: 3rem;
  padding: 1.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #fff;
}

h2 {
  color: #34495e;
  font-size: 1.2rem;
  margin: 0 0 1rem;
}

p {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.input-container {
  margin-top: 1rem;
}

.value {
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.9rem;
}

.test-cases {
  margin-top: 3rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.test-cases ol {
  padding-left: 1.5rem;
}

.test-cases li {
  margin: 0.5rem 0;
  color: #2c3e50;
}

strong {
  color: #42b983;
}
</style>
