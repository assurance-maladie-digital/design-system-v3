<template>
  <v-container>
    <v-text-field
        v-model="lazyValue"
        :error-messages="errorBucket"
        :success="hasSuccess"
        :error="hasError"
        @focus="isFocused = true"
        @blur="handleBlur"
    ></v-text-field>
    <v-btn @click="validate(true)">Validate</v-btn>
    <v-btn @click="reset">Reset</v-btn>
    <v-btn @click="resetValidation">Reset Validation</v-btn>
  </v-container>
</template>

<script>
import { ref } from 'vue'
import { useValidatable } from '@/composables/validatable/useValidatable'

export default {
  name: 'ValidatableTextField',
  props: {
    value: {
      type: String,
      default: '',
    },
    rules: {
      type: Array,
      default: () => [
        (v) => !!v || 'Field is required',
        (v) => (v && v.length >= 6) || 'Min 6 characters',
      ],
    },
    error: Boolean,
    errorMessages: [String, Array],
    success: Boolean,
    successMessages: [String, Array],
    validateOnBlur: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    const {
      lazyValue,
      errorBucket,
      hasError,
      hasSuccess,
      validate,
      reset,
      resetValidation,
      isFocused,
      hasInput,
      hasFocused,
    } = useValidatable(props)

    const handleBlur = () => {
      isFocused.value = false
      hasFocused.value = true
    }

    return {
      lazyValue,
      errorBucket,
      hasError,
      hasSuccess,
      validate,
      reset,
      resetValidation,
      isFocused,
      hasInput,
      hasFocused,
      handleBlur,
    }
  },
}
</script>
