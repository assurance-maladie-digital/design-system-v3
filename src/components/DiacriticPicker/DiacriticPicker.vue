<script setup lang="ts">
	import { computed, nextTick, onMounted, ref } from 'vue'
	import useCustomizableOptions, { type CustomizableOptions } from '@/composables/useCustomizableOptions'
	import { config } from './config'

	const props = withDefaults(defineProps<{
		btnTitle?: string
	} & CustomizableOptions>(), {
		btnTitle: 'Éé',
	})

	const wrapperRef = ref(null)
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
		const element = document.querySelector('#diacritique-input-messages')
		if (element) {
			inputMessageHeight.value = element.getBoundingClientRect().height
		}
	}

	const diacriticsMap = {
		e: ['e', 'é', 'è', 'ê', 'ë'],
		a: ['a', 'à', 'â', 'ä', 'æ'],
		i: ['i', 'î', 'ï'],
		o: ['o', 'ô', 'ö', 'œ'],
		u: ['u', 'ù', 'û', 'ü'],
		y: ['y', 'ÿ'],
		c: ['c', 'ç'],
	}

	const diacritics = {
		lower: [...new Set(Object.values(diacriticsMap).flat())],
		upper: [...new Set(Object.values(diacriticsMap).flat().map(c => c.toUpperCase()))],
	}

	function getNativeInput() {
		return wrapperRef.value?.querySelector('input, textarea')
	}

	function insertChar(char) {
		const el = getNativeInput()
		if (!el) return

		const pos = el.selectionStart
		const value = el.value
		el.value = value.slice(0, pos) + char + value.slice(pos)
		el.dispatchEvent(new Event('input')) // Synchronise avec v-model

		nextTick(() => {
			el.focus()
			el.setSelectionRange(pos + 1, pos + 1)
		})

		dialog.value = false
	}

	function handleKeydown(event) {
		if (event.key !== '=') return

		const el = getNativeInput()
		if (!el) return

		const pos = el.selectionStart
		const value = el.value
		const prevChar = value[pos - 1]
		if (!prevChar) return

		const isUpper = prevChar === prevChar.toUpperCase()
		const baseChar = prevChar.toLowerCase()
		const list = diacriticsMap[baseChar]
		if (!list) return

		const currentIndex = list.findIndex(c =>
			isUpper ? c.toUpperCase() === prevChar : c === prevChar,
		)
		if (currentIndex === -1) return

		const nextChar = isUpper
			? list[(currentIndex + 1) % list.length].toUpperCase()
			: list[(currentIndex + 1) % list.length]

		el.value = value.slice(0, pos - 1) + nextChar + value.slice(pos)

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
			@click="dialog = !dialog"
		>
			{{ props.btnTitle }}
		</VBtn>

		<VDialog
			v-model="dialog"
			scrollable
			:retain-focus="false"
			aria-modal="true"
			:aria-labelledby="buttonId"
			role="dialog"
		>
			<VCard @click:outside="dialog = false">
				<VCardTitle>Caractères diacritiques</VCardTitle>
				<VCardText>
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
				</VCardText>
			</VCard>
		</VDialog>
	</div>
</template>

<style scoped>
.diacritic-wrapper {
	width: 100%;
	display: flex;
	align-items: center;
}
</style>
