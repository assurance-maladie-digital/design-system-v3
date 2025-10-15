<script setup lang="ts">
	import { ref, watch } from 'vue'
	import { type VForm } from 'vuetify/components'
	import SyTextField from '../Customs/SyTextField/SyTextField.vue'
	import type { locales as defaultLocales } from './locales'

	interface Props {
		label: string
		modelValue?: string | null
		state?: string | null
		loading?: boolean
		errors: string[] | undefined
		locales: typeof defaultLocales
	}

	const props = defineProps<Props>()
	const emit = defineEmits(['update:modelValue', 'submit'])

	const text = ref<string | null>(props.modelValue ?? null)
	const formRef = ref<VForm | null>(null)

	watch(() => props.modelValue, (newVal) => {
		text.value = newVal ?? null
	}, { immediate: true })

	watch(() => props.state, () => {
		resetForm()
	})

	function resetForm() {
		formRef.value?.resetValidation()
	}

	function emitChangeEvent() {
		emit('update:modelValue', text.value)
	}

	async function emitSubmitEvent() {
		if (!formRef.value) return

		const isValid = await formRef.value.validate()
		if (!isValid) return

		emit('submit', text.value)
	}
</script>

<template>
	<VForm
		ref="formRef"
		class="captcha-form"
		@submit.prevent="emitSubmitEvent"
	>
		<VSheet>
			<SyTextField
				v-model="text"
				class="mt-4"
				variant="outlined"
				:error-messages="props.errors"
				is-clearable
				:custom-rules="[
					{
						type: 'required',
						options: { message: locales.required },
					}
				]"
				:show-success-messages="false"
				:disabled="state === 'rejected'"
				:label="label"
				hide-details="auto"
				@update:model-value="emitChangeEvent"
			/>

			<VBtn
				type="submit"
				class="capcha-submit text-none d-block ml-auto mb-4"
				height="44"
				width="95"
				color="primary"
				:disabled="state === 'rejected'"
				:loading="loading"
			>
				{{ locales.validate }}
			</VBtn>
		</VSheet>
	</VForm>
</template>
<style lang="css" scoped>
.capcha-submit :deep(.v-btn__content){
	letter-spacing: 0%;
}
</style>
