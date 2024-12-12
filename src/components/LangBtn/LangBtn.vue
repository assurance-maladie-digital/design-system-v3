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
	const menuId = computed(() => `lang-menu-id`)

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

	defineExpose({
		currentLangData,
		updateLang,
		selectedLanguage,
	})
</script>

<template>
	<div :id="menuId">
		<VMenu
			v-bind="options.menu"
			:id="isMenuOpen ? 'lang-menu' : menuId "
			v-model="menu"
			role="menu"
			location="bottom"
		>
			<template #activator="{ props: activatorProps }">
				<VBtn
					id="lang-menu-btn"
					:aria-label="`${props.ariaLabel} ${currentLangData.name}`"
					aria-haspopup="menu"
					:aria-controls="menuId"
					:aria-owns="menuId"
					:aria-expanded="isMenuOpen"
					v-bind="{
						...options.btn,
						...activatorProps,
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
					v-for="(langData, code, index) in languagesData"
					v-bind="options.listTile"
					:key="code"
					role="menuitem"
					:tabindex="index + 1"
					:aria-label="`${props.ariaLabel} ${langData.nativeName}`"
					:aria-labelledby="`${menuId} ${langData.nativeName}`"
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
@use '@/assets/tokens.scss';

.v-list-item:hover {
  background-color: rgba(tokens.$colors-overlay, 0.005)
}

.vd-lang-btn {
  font-size: 16px;
  --hoverColor: rgba(tokens.$colors-overlay, 0.5);
  text-transform: none;
  letter-spacing: inherit;
}
</style>
