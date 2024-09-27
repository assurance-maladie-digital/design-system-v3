<script setup lang="ts">
	import { computed, ref, watch } from 'vue'
	import type { AllLanguagesChar } from '@/components/LangBtn/types'
	import { mdiMenuDown } from '@mdi/js'
	import { locales } from './locales'
	import ISO6391 from 'iso-639-1'
	import useCustomizableOptions, { type CustomizableOptions } from '@/composables/useCustomizableOptions'
	import defaultOptions from './config'

	const props = withDefaults(defineProps<CustomizableOptions & {
		modelValue?: string
		hideDownArrow?: boolean
		ariaLabel?: string
		ariaOwns?: string
		availableLanguages?: string[] | AllLanguagesChar
	}>(), {
		modelValue: 'fr',
		hideDownArrow: false,
		ariaLabel: locales.label,
		ariaOwns: 'lang-btn',
		availableLanguages: () => ['fr', 'en'],
	})

	const options = useCustomizableOptions(defaultOptions, props)

	const emit = defineEmits(['update:modelValue'])
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
		menu.value = false
	}

	interface LanguageInfo {
		code: string
		name: string
		nativeName: string
	}

	type LanguagesData = Record<string, LanguageInfo>

	const isMenuOpen = computed(() => menu.value)
	const menuId = computed(() => `lang-menu-${Math.random().toString(36).substr(2, 9)}`)

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
</script>

<template>
	<VMenu
		v-bind="options.menu"
		v-model:opened="menu"
		location="bottom"
		@update:opened="menu = $event"
	>
		<template #activator="{ props: activatorProps }">
			<VBtn
				:aria-label="activatorProps.ariaLabel"
				aria-haspopup="menu"
				:aria-controls="menuId"
				:aria-owns="menuId"
				:aria-expanded="isMenuOpen"
				v-bind="{
					...activatorProps,
					...options.btn,
				}"
				class="vd-lang-btn"
			>
				{{ currentLangData.name }}
				<VIcon
					v-if="!hideDownArrow"
					v-bind="options.icon"
					class="ml-1"
				>
					{{ mdiMenuDown }}
				</VIcon>
			</VBtn>
		</template>
		<VList
			v-bind="options.list"
			aria-labelledby="lang-menu-btn"
		>
			<VListItem
				v-for="(langData, code) in languagesData"
				v-bind="options.listTile"
				:key="code"
				role="option"
				:aria-label="langData.nativeName"
				:aria-labelledby="menuId"
				@click="updateLang(code)"
			>
				<VListItemTitle v-bind="options.listTileTitle">
					{{ langData.nativeName }}
				</VListItemTitle>
			</VListItem>
		</VList>
	</VMenu>
</template>
<style lang="scss" scoped>
@import '../../assets/tokens';

.v-list-item:hover {
  background-color: rgba($colors-overlay-onlight, 0.2)
}

.vd-lang-btn {
  font-weight: 700;
  --hoverColor: rgba($colors-overlay-onlight, 0.9);
  text-transform: capitalize;
}
</style>
