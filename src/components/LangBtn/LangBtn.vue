<script setup lang="ts">
	import { computed, nextTick, ref, useId, watch } from 'vue'
	import type { AllLanguagesChar } from '@/components/LangBtn/types'
	import { mdiMenuDown } from '@mdi/js'
	import { locales } from './locales'
	import ISO6391 from 'iso-639-1'
	import useCustomizableOptions, { type CustomizableOptions } from '@/composables/useCustomizableOptions'
	import defaultOptions from './config'
	import type { VBtn } from 'vuetify/components/VBtn'
	import type { VListItem } from 'vuetify/components/VList'
	import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'

	const props = withDefaults(defineProps<CustomizableOptions & {
		modelValue?: string
		hideDownArrow?: boolean
		ariaLabel?: string
		availableLanguages?: string[] | AllLanguagesChar
	}>(), {
		modelValue: 'fr',
		hideDownArrow: false,
		ariaLabel: locales.label,
		availableLanguages: () => ['fr', 'en'],
	})

	const options = useCustomizableOptions(defaultOptions, props)

	const emit = defineEmits(['update:modelValue', 'change'])
	const menu = ref(false)
	const selectedLanguage = ref(props.modelValue)

	watch(
		() => props.modelValue,
		(newVal) => {
			selectedLanguage.value = newVal
		},
	)

	function updateLang(lang: string) {
		selectedLanguage.value = lang
		emit('update:modelValue', lang)
		emit('change', lang)
		menu.value = false
	}

	interface LanguageInfo {
		code: string
		name: string
		nativeName: string
	}

	type LanguagesData = Record<string, LanguageInfo>

	// Identifiants uniques par instance : plusieurs LangBtn peuvent coexister sur une page.
	const uid = useId()
	const btnId = `lang-btn-${uid}`
	const listId = `lang-list-${uid}`

	const languagesData = computed<LanguagesData>(() => {
		const data: LanguagesData = {}
		let languageCodes: string[]

		if (props.availableLanguages === '*') {
			languageCodes = ISO6391.getAllCodes()
		}
		else {
			languageCodes = props.availableLanguages as string[]
		}

		languageCodes.forEach((language) => {
			data[language] = {
				code: language,
				name: ISO6391.getName(language) || language,
				nativeName: ISO6391.getNativeName(language) || ISO6391.getName(language) || language,
			}
		})

		return data
	})

	const currentLangData = computed(() => {
		const langInfo = languagesData.value[selectedLanguage.value]
		return {
			name: langInfo?.nativeName || selectedLanguage.value,
			label: `${props.ariaLabel} ${langInfo?.nativeName || selectedLanguage.value}`,
		}
	})

	const itemRef = ref<Array<VListItem>>([])
	const btnRef = ref<VBtn | null>(null)

	// Roving tabindex : seul l'item actif est atteignable à la tabulation (pattern APG).
	// Cela permet aussi au focusChild natif de VMenu — qui ignore les tabindex="-1" —
	// de placer le focus sur le bon item quand le menu s'ouvre au clavier (flèches).
	const activeIndex = ref(0)

	// À l'ouverture, le focus est placé sur la langue sélectionnée (pattern menu APG) ;
	// à la fermeture, il est restitué au bouton activateur.
	watch(menu, async (isOpen) => {
		if (isOpen) {
			const codes = Object.keys(languagesData.value)
			activeIndex.value = Math.max(codes.indexOf(selectedLanguage.value), 0)
			await nextTick()
			focusActiveItem()
		}
		else {
			await nextTick()
			btnRef.value?.$el?.focus()
		}
	})

	// Le contenu du VMenu est monté de façon asynchrone (overlay téléporté) : on retente
	// le focus tant que les items ne sont pas encore dans le DOM.
	function focusActiveItem(remainingAttempts = 10) {
		const el = itemRef.value[activeIndex.value]?.$el as HTMLElement | undefined
		if (el) {
			el.focus()
			return
		}
		if (remainingAttempts > 0) {
			requestAnimationFrame(() => focusActiveItem(remainingAttempts - 1))
		}
	}

	// Navigation clavier du menu (pattern APG) : les flèches, Home et End déplacent le
	// focus réel entre les items — d'où l'absence d'aria-activedescendant.
	// Branché en capture + stopPropagation : VList possède sa propre navigation au
	// clavier (focusChild) qui entrerait en conflit avec celle-ci.
	function onMenuKeydown(event: KeyboardEvent) {
		const items = itemRef.value
		if (!items.length) return

		const currentIndex = items.findIndex(item => item.$el === document.activeElement)
		let nextIndex: number
		switch (event.key) {
		case 'ArrowDown':
			nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % items.length
			break
		case 'ArrowUp':
			nextIndex = currentIndex < 0 ? items.length - 1 : (currentIndex - 1 + items.length) % items.length
			break
		case 'Home':
			nextIndex = 0
			break
		case 'End':
			nextIndex = items.length - 1
			break
		default:
			return
		}
		event.preventDefault()
		event.stopPropagation()
		activeIndex.value = nextIndex
		items[nextIndex]?.$el?.focus()
	}

	defineExpose({
		currentLangData,
		updateLang,
		selectedLanguage,
	})
</script>

<template>
	<div>
		<VMenu
			v-bind="options.menu"
			v-model="menu"
			scroll-strategy="none"
			location="bottom"
		>
			<template #activator="{ props: activatorProps }">
				<VBtn
					:id="btnId"
					v-bind="{
						...options.btn,
						...activatorProps,
						// VMenu pose `aria-controls` et `aria-owns` en permanence, alors que
						// l'overlay n'est monté qu'à la première ouverture : tant que le menu
						// est fermé, ces attributs pointent vers un identifiant absent du
						// document. On ne les expose donc que lorsque la cible existe.
						'aria-controls': menu ? activatorProps['aria-controls'] : undefined,
						'aria-owns': menu ? activatorProps['aria-owns'] : undefined,
					}"
					ref="btnRef"
					:aria-label="`${props.ariaLabel} ${currentLangData.name}`"
					aria-haspopup="menu"
					:aria-expanded="menu"
					class="vd-lang-btn"
				>
					{{ currentLangData.name }}
					<SyIcon
						v-if="!hideDownArrow"
						v-bind="options.icon"
						class="ml-1"
						:icon="mdiMenuDown"
						decorative
					/>
				</VBtn>
			</template>
			<VList
				v-bind="options.list"
				:id="listId"
				:aria-labelledby="btnId"
				color="secondary"
				role="menu"
				@keydown.capture="onMenuKeydown"
			>
				<VListItem
					v-for="(langData, code, index) in languagesData"
					v-bind="options.listTile"
					:key="code"
					ref="itemRef"
					:active="selectedLanguage === code"
					role="menuitemradio"
					:aria-checked="selectedLanguage === code"
					:lang="code"
					color="primary"
					:tabindex="index === activeIndex ? 0 : -1"
					@click="updateLang(code)"
				>
					<VListItemTitle v-bind="options.listTileTitle">
						{{ langData.nativeName }}
					</VListItemTitle>
				</VListItem>
			</VList>
		</VMenu>
	</div>
</template>
<style lang="scss" scoped>
.v-list-item:hover {
	background-color: rgba(var(--v-theme-colors-overlay), 0.005);
}

.v-list-item:focus-visible {
	outline: 2px solid rgb(var(--v-theme-primary));
	outline-offset: -3px;

	:deep(.v-list-item__overlay) {
		display: none;
	}
}

.vd-lang-btn {
	font-size: var(--v-fontSize-corpsDeTexte);
	text-transform: none;
	letter-spacing: inherit;
}

.v-theme--dark .vd-lang-btn {
	color: rgb(var(--v-theme-on-primary)) !important;
}
</style>
