<script setup lang="ts">
	import { computed, nextTick, onMounted, ref } from 'vue'
	import useCustomizableOptions, { type CustomizableOptions } from '@/composables/useCustomizableOptions'
	import { config } from './config'
	import { VBtn, VCard, VCardText, VCardTitle, VDialog } from 'vuetify/components'

	const props = withDefaults(defineProps<{
		btnTitle?: string
		diacritics?: string[]
	} & CustomizableOptions>(), {
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
	})

	const wrapperRef = ref<HTMLElement | null>(null)
	const dialog = ref(false)

	const options = useCustomizableOptions(config, props)

	const inputId = 'diacritique-input'
	const buttonId = 'diacritique-button'
	const dialogId = 'diacritique-dialog'

	const inputMessageHeight = ref(0)

	const dynamicStyles = computed(() => ({
		marginTop: `-${inputMessageHeight.value}px`,
	}))

	function updateInputMessageHeight() {
		const element = document.querySelector<HTMLElement>('#diacritique-input-messages')
		if (element) {
			inputMessageHeight.value = element.getBoundingClientRect().height
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

		const pos = el.selectionStart ?? 0
		const value = el.value
		el.value = value.slice(0, pos) + char + value.slice(pos)
		el.dispatchEvent(new Event('input'))

		nextTick(() => {
			el.focus()
			el.setSelectionRange(pos + 1, pos + 1)
		})

		dialog.value = false
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key !== '=') return

		const el = getNativeInput()
		if (!el) return

		const pos = el.selectionStart ?? 0
		const value = el.value
		const prevChar = value[pos - 1]
		if (!prevChar) return

		const isUpper = prevChar === prevChar.toUpperCase()
		const baseChar = prevChar.toLowerCase()
		const list = props.diacritics.filter(c =>
			c.normalize('NFD').replace(/[\u0300-\u036f]/g, '') === baseChar,
		)

		if (!list.length) return

		const currentIndex = list.findIndex(c =>
			isUpper ? c.toUpperCase() === prevChar : c === prevChar,
		)
		if (currentIndex === -1) return

		const nextChar = isUpper
			? list[(currentIndex + 1) % list.length].toUpperCase()
			: list[(currentIndex + 1) % list.length]

		el.value = value.slice(0, pos - 1) + nextChar + value.slice(pos)
		el.dispatchEvent(new Event('input'))

		nextTick(() => {
			el.setSelectionRange(pos, pos)
		})

		event.preventDefault()
	}

	onMounted(() => {
		nextTick(() => {
			updateInputMessageHeight()
		})
	})
</script>

<template>
	<div class="diacritic-wrapper">
		<div
			:id="inputId"
			ref="wrapperRef"
			class="input-slot flex-grow-1"
			role="textbox"
			tabindex="0"
			@keydown="handleKeydown"
		>
			<slot />
		</div>

		<VBtn
			:id="buttonId"
			v-bind="options.btn"
			icon
			:aria-controls="dialogId"
			:aria-haspopup="'dialog'"
			:aria-expanded="dialog.toString()"
			:style="dynamicStyles"
			class="diacritic-btn"
			@click="dialog = !dialog"
		>
			{{ props.btnTitle }}
		</VBtn>

		<VDialog
			v-model="dialog"
			v-bind="options.dialog"
			scrollable
			:retain-focus="false"
			aria-modal="true"
			:aria-labelledby="buttonId"
			class="diacritic-dialog"
			role="dialog"
		>
			<VCard @click:outside="dialog = false">
				<VCardTitle>Caractères diacritiques</VCardTitle>
				<VCardText>
					<div class="diacritic-dialog-content">
						<div
							class="d-flex flex-wrap"
							role="group"
							aria-label="Caractères minuscules"
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
							class="d-flex flex-wrap mt-2"
							role="group"
							aria-label="Caractères majuscules"
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
.diacritic-wrapper {
	width: 100%;
	display: flex;
	align-items: center;
}
:deep(.v-card-text > .diacritic-dialog-content) {
  padding: 0 !important;
}
</style>
