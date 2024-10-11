<script setup lang="ts">
	import { computed, ref, watch } from 'vue'
	import type { AllLanguagesChar } from '@/components/LangBtn/types'
	import { mdiMenuDown } from '@mdi/js'
	import { locales } from './locales'
	import ISO6391 from 'iso-639-1'
	import useCustomizableOptions, { type CustomizableOptions } from '@/composables/useCustomizableOptions'
	import defaultOptions from './config'
  import GenericMenu from '@/components/Generics/GenericMenu.vue';

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
    <GenericMenu
        v-bind="options.menu"
        :id="isMenuOpen ? 'lang-menu' : menuId"
        v-model="menu"
        role="menu"
        location="bottom"
        :items="languagesData"
        item-key="code"
        item-label="nativeName"
        :aria-label="`${props.ariaLabel} ${currentLangData.name}`"
        :aria-controls="menuId"
        :aria-owns="menuId"
        :aria-expanded="isMenuOpen"
        @change="updateLang"
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
    </GenericMenu>
  </div>
</template>
<style lang="scss" scoped>
@import '../../assets/tokens';

.v-list-item:hover {
  background-color: rgba($colors-overlay, 0.005)
}

.vd-lang-btn {
  font-weight: 700;
  --hoverColor: rgba($colors-overlay, 0.5);
  text-transform: capitalize;
}
</style>
