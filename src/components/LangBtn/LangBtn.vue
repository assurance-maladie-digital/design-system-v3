<script setup lang="ts">
	import { computed, ref, watch } from 'vue'
	import { AllLanguagesChar } from '@/components/LangBtn/types'
	import { mdiMenuDown } from '@mdi/js'
	import type { PropType } from 'vue'
	import { locales } from './locales'
	import ISO6391 from 'iso-639-1'

	const props = defineProps({
		modelValue: { type: String, default: 'fr' },
		hideDownArrow: { type: Boolean, default: false },
		ariaLabel: { type: String, default: locales.label },
		availableLanguages: {
			type: [Array, String] as PropType<string[] | AllLanguagesChar>,
			default: () => ['fr', 'en'],
			validator: (value: string[] | AllLanguagesChar): boolean => {
				if (Array.isArray(value)) {
					return value.length > 0
				}
				else {
					return value === '*'
				}
			},
		},
	})

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
		v-model:opened="menu"
		location="bottom"
		@update:opened="menu = $event"
	>
		<template #activator="{ props: activatorProps }">
			<VBtn
				:aria-label="ariaLabel"
				v-bind="activatorProps"
				variant="outlined"
				color="primary"
				class="vd-lang-btn"
			>
				{{ currentLangData.name }}
				<VIcon
					v-if="!hideDownArrow"
					class="ml-1"
				>
					{{ mdiMenuDown }}
				</VIcon>
			</VBtn>
		</template>
		<VList>
			<VListItem
				v-for="(langData, code) in languagesData"
				:key="code"
				:class="{ 'selected-language': code === selectedLanguage.value }"
				@click="updateLang(code)"
			>
				<VListItemTitle>{{ langData.nativeName }}</VListItemTitle>
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
