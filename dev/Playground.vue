<!-- Un playground pour tester différents types de validation avec SyTextField -->
<template>
    <div class="playground">
      <h1>Test des règles de validation</h1>
        <div class="test-case">
          <h2>1. Format européen avec règles de base</h2>
          <SyTextField
            ref="field1"
            v-model="fields.europeanDate"
            label="Date (format européen)"
            placeholder="JJ/MM/AAAA"
            :custom-rules="rules.europeanDate"
          />
          <div class="value">Valeur : {{ fields.europeanDate }}</div>
        </div>
  
        <div class="test-case">
          <h2>2. Format avec règles personnalisées</h2>
          <SyTextField
            ref="field2"
            v-model="fields.customRulesDate"
            label="Date (pas en 2024)"
            placeholder="JJ/MM/AAAA"
            :custom-rules="rules.customDate"
          />
          <div class="value">Valeur : {{ fields.customRulesDate }}</div>
        </div>
  
        <div class="test-case">
          <h2>3. Format avec règles d'avertissement</h2>
          <SyTextField
            ref="field3"
            v-model="fields.warningDate"
            label="Date (avertissement si 2025)"
            placeholder="JJ/MM/AAAA"
            :custom-warning-rules="rules.warningDate"
          />
          <div class="value">Valeur : {{ fields.warningDate }}</div>
        </div>
  
        <div class="test-case">
          <h2>4. Format avec validation min/max</h2>
          <SyTextField
            ref="field4"
            v-model="fields.rangeDate"
            label="Date (entre 01/01/2025 et 31/12/2025)"
            placeholder="JJ/MM/AAAA"
            :custom-rules="rules.rangeDate"
          />
          <div class="value">Valeur : {{ fields.rangeDate }}</div>
        </div>
  
        <div class="test-case">
          <h2>5. Validation de format email</h2>
          <SyTextField
            ref="field5"
            v-model="fields.email"
            label="Adresse email"
            placeholder="exemple@domaine.com"
            :custom-rules="rules.email"
          />
          <div class="value">Valeur : {{ fields.email }}</div>
        </div>
  
        <div class="test-case">
          <h2>6. Validation de numéro de téléphone</h2>
          <SyTextField
            ref="field6"
            v-model="fields.phone"
            label="Téléphone"
            placeholder="0612345678"
            :custom-rules="rules.phone"
          />
          <div class="value">Valeur : {{ fields.phone }}</div>
        </div>
  
        <button @submit.prevent="handleSubmit" type="submit" class="submit-button">
          Soumettre
        </button>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, reactive } from 'vue'
  import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'
  
  // Références
  const field1 = ref()
  const field2 = ref()
  const field3 = ref()
  const field4 = ref()
  const field5 = ref()
  const field6 = ref()
  
  // État du formulaire
  const fields = reactive({
    europeanDate: '',
    customRulesDate: '21/12/2025',
    warningDate: '20/12/2025',
    rangeDate: '20/12/2024',
    email: '',
    phone: ''
  })
  
  // Règles de validation
  const rules = {
    europeanDate: [{
      type: 'matchPattern',
      options: {
        pattern: /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
        message: 'Format de date invalide (JJ/MM/AAAA)',
        successMessage: 'Format de date valide',
        fieldIdentifier: 'date'
      }
    }],
  
    customDate: [{
      type: 'custom',
      options: {
        validate: (value: string) => {
          if (!value) return true
          return !value.includes('2024')
        },
        message: 'Les dates en 2024 ne sont pas autorisées',
        successMessage: 'Les dates hors 2024 sont autorisées',
        fieldIdentifier: 'date'
      }
    }],
  
    warningDate: [{
      type: 'custom',
      options: {
        validate: (value: string) => {
          if (!value) return true
          return !value.includes('2025')
        },
        warningMessage: 'Les dates en 2025 ne sont pas recommandées',
        successMessage: 'Date hors 2025',
        fieldIdentifier: 'date',
        isWarning: true
      }
    }],
  
    rangeDate: [
      {
        type: 'notBeforeDate',
        options: {
          date: '01/01/2025',
          message: 'La date doit être postérieure ou égale au 01/01/2025',
          successMessage: 'Date valide (après 01/01/2025)',
          fieldIdentifier: 'date'
        }
      },
      {
        type: 'notAfterDate',
        options: {
          date: '31/12/2025',
          message: 'La date doit être antérieure ou égale au 31/12/2025',
          successMessage: 'Date valide (avant 31/12/2025)',
          fieldIdentifier: 'date'
        }
      }
    ],
  
    email: [{
      type: 'email',
      message: 'Format d\'email invalide',
      successMessage: 'Format d\'email valide'
    }],
  
    phone: [{
      type: 'matchPattern',
      options: {
        pattern: /^0[1-9][0-9]{8}$/,
        message: 'Format de téléphone invalide (0X XX XX XX XX)',
        successMessage: 'Format de téléphone valide'
      }
    }]
  }
  
  // Méthodes
  const handleSubmit = () => {
    const references = [
      { ref: field1, name: 'Format européen' },
      { ref: field2, name: 'Règles personnalisées' },
      { ref: field3, name: 'Règles d\'avertissement' },
      { ref: field4, name: 'Validation min/max' },
      { ref: field5, name: 'Email' },
      { ref: field6, name: 'Téléphone' }
    ]
    
    const invalidFields: string[] = []
  
    references.forEach(({ ref, name }) => {
      const isValid = ref.value?.validateOnSubmit()
      if (!isValid) {
        invalidFields.push(name)
      }
    })
  
    if (invalidFields.length > 0) {
      alert(`Les champs suivants sont invalides :\n${invalidFields.join('\n')}`)
    } else {
      alert('Formulaire soumis avec succès !')
    }
  }
  </script>
  
  <style scoped>
  .playground {
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
  }
  
  .test-case {
    margin-bottom: 30px;
    padding: 20px;
    background-color: #f5f5f5;
    border-radius: 8px;
  }
  
  .test-case h2 {
    margin-top: 0;
    margin-bottom: 15px;
    font-size: 1.2rem;
    color: #424242;
  }
  
  .value {
    margin-top: 10px;
    font-family: monospace;
    color: #666;
  }
  
  .submit-button {
    margin-top: 20px;
    padding: 10px 20px;
    background-color: #1976d2;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
  }
  
  .submit-button:hover {
    background-color: #1565c0;
  }
  </style>
  