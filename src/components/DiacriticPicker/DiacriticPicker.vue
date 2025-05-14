<script setup lang="ts">
	import { computed, nextTick, onMounted, ref } from 'vue'
	import useCustomizableOptions, { type CustomizableOptions } from '@/composables/useCustomizableOptions'
	import { config } from './config'
	import { locales } from './locales'
	import { VBtn, VCard, VCardText, VCardTitle, VDialog } from 'vuetify/components'

	const props = withDefaults(defineProps<{
		modelValue: string
		btnTitle?: string
		diacritics?: string[]
		inputAriaLabel?: string
	} & CustomizableOptions>(), {
		modelValue: '',
		btnTitle: 'éÉ',
		diacritics: () => [
			'é', 'è', 'ê', 'ë',
			'à', 'â', 'ä', 'æ',
			'î', 'ï',
			'ô', 'ö', 'œ',
			'ù', 'û', 'ü',
			'ÿ',
			'ç',
		],
		inputAriaLabel: locales.inputAriaLabel,
	})

	const emit = defineEmits<{
		(e: 'update:modelValue', value: string): void
	}>()

	const wrapperRef = ref<HTMLElement | null>(null)
	const dialog = ref(false)

	const options = useCustomizableOptions(config, props)

	const uniqueId = Math.random().toString(36).substr(2, 9)

	const labelId = `diacritic-label-${uniqueId}`
	const inputId = `diacritic-input-${uniqueId}`
	const buttonId = `diacritic-button-${uniqueId}`
	const dialogId = `diacritic-dialog-${uniqueId}`

	const inputMessageHeight = ref(0)

	const dynamicStyles = computed(() => ({
		marginTop: `-${inputMessageHeight.value}px`,
	}))

	function updateInputMessageHeight() {
		const el = wrapperRef.value?.querySelector<HTMLElement>('.v-input__details')
		if (el) {
			inputMessageHeight.value = el.getBoundingClientRect().height
		}
	}

	const diacritics = computed(() => {
		const grouped: Record<string, string[]> = {}

		for (const char of props.diacritics) {
			const baseChar = char.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
			if (!grouped[baseChar]) grouped[baseChar] = []
			grouped[baseChar].push(char)
		}

		const all = Object.values(grouped).flat()
		return {
			lower: [...new Set(all)],
			upper: [...new Set(all.map(c => c.toUpperCase()))],
		}
	})

	function getNativeInput(): HTMLInputElement | HTMLTextAreaElement | null {
		return wrapperRef.value?.querySelector('input, textarea') ?? null
	}

	function insertChar(char: string) {
		const el = getNativeInput()
		if (!el) return

		const start = el.selectionStart ?? 0
		const end = el.selectionEnd ?? 0

		// Remplace le texte sélectionné ou insère à la position du curseur
		const newValue
			= props.modelValue.slice(0, start)
				+ char
				+ props.modelValue.slice(end)

		emit('update:modelValue', newValue)

		nextTick(() => {
			el.focus()
			const newPos = start + char.length
			el.setSelectionRange(newPos, newPos)
		})

		dialog.value = false
	}

	function handleKeydown(event: KeyboardEvent) {
		// Si la touche = est pressée avec Shift, on n'active PAS le remplacement
		if (event.key !== '=' || event.shiftKey) return

		const el = getNativeInput()
		if (!el) return

		const start = el.selectionStart ?? 0
		const end = el.selectionEnd ?? 0

		// Si aucun caractère précédent, insérer =
		if (start === 0) {
			const newValue = props.modelValue.slice(0, start) + '=' + props.modelValue.slice(end)
			emit('update:modelValue', newValue)

			nextTick(() => {
				el.focus()
				el.setSelectionRange(start + 1, start + 1)
			})

			event.preventDefault()
			return
		}

		// Remplacer le caractère précédent par le caractère diacritique suivant
		const currentChar = props.modelValue.charAt(start - 1)
		const diacriticChars = diacritics.value.lower.filter(c =>
			c.normalize('NFD').replace(/[\u0300-\u036f]/g, '') === currentChar.normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
		)

		if (diacriticChars.length > 0) {
			const currentIndex = diacriticChars.indexOf(currentChar)
			const nextIndex = (currentIndex + 1) % diacriticChars.length
			const newChar = diacriticChars[nextIndex]

			const newValue = props.modelValue.slice(0, start - 1) + newChar + props.modelValue.slice(end)
			emit('update:modelValue', newValue)

			nextTick(() => {
				el.focus()
				el.setSelectionRange(start, start)
			})

			event.preventDefault()
		}
	}

	onMounted(() => {
		nextTick(() => {
			updateInputMessageHeight()
		})
	})
</script>

<template>
	<div class="sy-diacritic-wrapper">
		<div
			:id="inputId"
			ref="wrapperRef"
			class="sy-input-slot flex-grow-1"
			role="textbox"
			:aria-label="inputAriaLabel"
			:title="labelId"
			tabindex="0"
			@keydown="handleKeydown"
		>
			<slot />
		</div>

		<VBtn
			:id="buttonId"
			v-bind="options.btn"
			icon
			:title="locales.title"
			:aria-label="`${props.btnTitle}, ${locales.title}`"
			:aria-controls="dialogId"
			:aria-haspopup="'dialog'"
			:aria-expanded="dialog.toString()"
			:style="dynamicStyles"
			class="sy-diacritic-btn"
			@click="dialog = !dialog"
		>
			{{ props.btnTitle }}
		</VBtn>

		<VDialog
			:id="dialogId"
			v-model="dialog"
			:aria-labelledby="buttonId"
			v-bind="options.dialog"
			scrollable
			:retain-focus="false"
			aria-modal="true"
			class="sy-diacritic-dialog"
			role="dialog"
		>
			<VCard
				color="grey-lighten-2"
				@click:outside="dialog = false"
			>
				<VCardTitle class="pb-0 text-center">
					Caractères diacritiques
				</VCardTitle>
				<VCardText>
					<div class="sy-diacritic-dialog-content">
						<div
							class="d-flex flex-wrap"
							role="group"
							:aria-label="locales.lowercaseChars"
						>
							<VBtn
								v-for="char in diacritics.lower"
								:key="'l-' + char"
								size="small"
								class="ma-1"
								@click="insertChar(char)"
							>
								{{ char }}
							</VBtn>
						</div>
						<div
							class="d-flex flex-wrap"
							role="group"
							:aria-label="locales.uppercaseChars"
						>
							<VBtn
								v-for="char in diacritics.upper"
								:key="'u-' + char"
								size="small"
								class="ma-1"
								@click="insertChar(char)"
							>
								{{ char }}
							</VBtn>
						</div>
					</div>
				</VCardText>
			</VCard>
		</VDialog>
	</div>
</template>

<style scoped lang="scss">
.sy-diacritic-wrapper {
	width: 100%;
	display: flex;
	align-items: center;
	padding: 0;
}

:deep(.sy-diacritic-dialog-content) {
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: 12px;
}

:deep(.sy-diacritic-dialog-content > div[role='group']) {
	width: 100%;
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
}
</style>
