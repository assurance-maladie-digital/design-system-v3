<script setup lang="ts">
	import { computed, nextTick, ref, watch } from 'vue'
	import type { AllLanguagesChar } from '@/components/LangBtn/types'
	import { mdiMenuDown } from '@mdi/js'
	import { locales } from './locales'
	import ISO6391 from 'iso-639-1'
	import useCustomizableOptions, { type CustomizableOptions } from '@/composables/useCustomizableOptions'
	import defaultOptions from './config'
	import type { VBtn, VListItem } from 'vuetify/components'

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

	const itemRef = ref<Array<VListItem>>([])
	const btnRef = ref<VBtn | null>(null)
	watch(
		menu,
		(newVal) => {
			setTimeout(async () => {
				if (newVal) {
					setTimeout(() => {
						requestAnimationFrame(() => {
							const inputElement = itemRef.value[0]?.$el
							if (inputElement) {
								inputElement.focus()
							}
						})
					}, 0)
				}
				else {
					await nextTick()
					btnRef.value?.$el.focus()
				}
			}, 0)
		},
	)

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
			id="lang-menu"
			v-model="menu"
			scroll-strategy="none"
			role="menu"
			location="bottom"
		>
			<template #activator="{ props: activatorProps }">
				<VBtn
					id="lang-menu-btn"
					v-bind="{
						...options.btn,
						...activatorProps,
					}"
					ref="btnRef"
					:aria-label="`${props.ariaLabel} ${currentLangData.name}`"
					aria-haspopup="menu"
					:aria-controls="menuId"
					:aria-owns="menuId"
					:aria-expanded="isMenuOpen"
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
				activatable
				aria-labelledby="lang-menu-btn"
				color="secondary"
				:aria-activedescendant="`lang-item-${selectedLanguage}`"
				role="menu"
			>
				<VListItem
					v-for="(langData, code) in languagesData"
					v-bind="options.listTile"
					:id="`lang-item-${code}`"
					:key="code"
					ref="itemRef"
					:active="selectedLanguage === code"
					role="menuitem"
					:lang="code"
					color="primary"
					tabindex="0"
					:aria-label="`${props.ariaLabel} ${langData.nativeName}`"
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
@use '@/assets/tokens';

.v-list-item:hover {
	background-color: rgba(tokens.$colors-overlay, 0.005);
}

.v-list-item:focus-visible {
	&::after {
		color: rgb(var(--v-theme-primary));
		opacity: 1;
	}

	:deep(.v-list-item__overlay) {
		display: none;
	}
}

.vd-lang-btn {
	font-size: 16px;

	--hover-color: rgba(tokens.$colors-overlay, 0.5);

	text-transform: none;
	letter-spacing: inherit;

	&:deep() {
		.v-btn__underlay,
		.v-btn__overlay {
			display: none;
		}
	}
}

.vd-lang-btn:focus-visible {
	outline: 0;
}

.vd-lang-btn:focus-visible::after {
	opacity: 1;
}
</style>
