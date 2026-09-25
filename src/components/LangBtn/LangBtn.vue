<script setup lang="ts">
	import { computed, nextTick, ref, useId, watch } from 'vue'
	import type { AllLanguagesChar } from '@/components/LangBtn/types'
	import { mdiCheck, mdiMenuDown } from '@mdi/js'
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
		validator: (value: string[] | AllLanguagesChar): boolean => {
			if (Array.isArray(value)) {
				return value.length > 0
			}
			else {
				return value === '*'
			}
		},
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

	const isMenuOpen = computed(() => menu.value)

	// Ids uniques par instance (RGAA 8.2 : pas de doublon si plusieurs LangBtn)
	const instanceId = useId()
	const btnId = computed(() => `lang-btn${instanceId}`)
	const listboxId = computed(() => `lang-listbox${instanceId}`)
	const optionId = (code: string): string => `lang-option${instanceId}-${code}`

	// Langues à écriture de droite à gauche (RGAA 8.10)
	const RTL_LANGUAGES = new Set(['ar', 'arc', 'dv', 'fa', 'ha', 'he', 'khw', 'ks', 'ku', 'ps', 'ur', 'yi'])
	const langDir = (code: string): 'rtl' | 'ltr' => (RTL_LANGUAGES.has(code) ? 'rtl' : 'ltr')

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

	// Focus initial sur l'option sélectionnée à l'ouverture (pattern listbox APG)
	const selectedIndex = computed(() => Object.keys(languagesData.value).indexOf(selectedLanguage.value))

	watch(
		menu,
		async (newVal) => {
			if (newVal) {
				await nextTick()
				requestAnimationFrame(() => {
					// Le menu a pu se fermer avant la frame : ne pas déplacer le focus
					if (!menu.value) {
						return
					}
					const index = selectedIndex.value >= 0 ? selectedIndex.value : 0
					itemRef.value[index]?.$el?.focus()
				})
			}
			else {
				await nextTick()
				btnRef.value?.$el?.focus()
			}
		},
	)

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
					}"
					ref="btnRef"
					:aria-label="`${props.ariaLabel} ${currentLangData.name}`"
					aria-haspopup="listbox"
					:aria-controls="isMenuOpen ? listboxId : undefined"
					:aria-owns="isMenuOpen ? activatorProps['aria-owns'] : undefined"
					:aria-expanded="isMenuOpen"
					class="vd-lang-btn"
				>
					<span :lang="selectedLanguage">{{ currentLangData.name }}</span>
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
				:id="listboxId"
				:aria-labelledby="btnId"
				color="secondary"
				role="listbox"
			>
				<!-- tabindex=0 sur chaque option : requis par la navigation clavier de VMenu (focus réel) -->
				<VListItem
					v-for="(langData, code) in languagesData"
					v-bind="options.listTile"
					:id="optionId(code)"
					:key="code"
					ref="itemRef"
					:active="selectedLanguage === code"
					role="option"
					:aria-selected="selectedLanguage === code"
					:lang="code"
					:dir="langDir(code)"
					color="primary"
					tabindex="0"
					@click="updateLang(code)"
				>
					<VListItemTitle v-bind="options.listTileTitle">
						{{ langData.nativeName }}
					</VListItemTitle>
					<template #append>
						<SyIcon
							v-if="selectedLanguage === code"
							:icon="mdiCheck"
							decorative
							class="text-primary"
						/>
					</template>
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
