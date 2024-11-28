<script lang="ts" setup>
	import { ref, defineProps, defineEmits, watch, PropType } from 'vue'

	// Props : valeur et règles de validation
	const props = defineProps({
		modelValue: {
			type: [String, Number],
			required: true,
		},
		rules: {
			type: Array as PropType<Array<(value: string | number) => true | string>>,
			default: () => [],
		},
	})

	// Événements émis vers le parent
	const emit = defineEmits(['update:modelValue', 'validated'])

	// État local
	const localValue = ref<string | number>(props.modelValue)
	const touched = ref(false)

	// Messages d'erreur pour ce champ
	const errorMessages = ref<string[]>([])

	// Valider le champ
	const validate = () => {
		if (touched.value) {
			errorMessages.value = props.rules
				.map(rule => rule(localValue.value))
				.filter(msg => msg !== true) as string[]
			emit('validated', errorMessages.value.length === 0) // Informe le parent
			return errorMessages.value.length === 0
		}
		return true
	}

	// Mettre à jour la valeur et valider
	const onInput = (event: Event) => {
		const value = (event.target as HTMLInputElement).value
		localValue.value = value
		touched.value = true
		emit('update:modelValue', value)
		validate()
	}

	// Valider automatiquement lorsque la valeur change
	watch(localValue, () => validate(), { immediate: true })
</script>

<template>
	<v-text-field
		v-model="localValue"
		:error-messages="errorMessages"
		v-bind="$attrs"
		@blur="onInput"
	/>
</template>
