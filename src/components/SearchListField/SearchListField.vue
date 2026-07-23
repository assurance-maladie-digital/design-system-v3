<script lang="ts" setup>
	import { ref, computed, watch } from 'vue'
	import { mdiMagnify } from '@mdi/js'
	import { useId } from 'vue'
	import type { PropType } from 'vue'
	import type { SearchListItem } from './types'
	import { locales as defaultLocales } from './locales'
	import { useLocales } from '@/composables/useLocales'
	import type { DeepPartial } from '@/utils/locales/mergeLocales'

	import { SyTextField, SyCheckbox } from '@/components'
	import slugify from 'slugify'
	import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'

	const props = defineProps({
		modelValue: {
			type: Array as PropType<unknown[] | undefined | null>,
			default: () => [],
		},
		items: {
			type: Array as PropType<SearchListItem[]>,
			default: () => [],
		},
		outlined: {
			type: Boolean,
			default: true,
		},
		bgColor: {
			type: String,
			default: 'white',
		},
		returnObject: {
			type: Boolean,
			default: false,
		},
		label: {
			type: String,
			required: true,
		},
		listLabel: {
			type: String,
			default: defaultLocales.searchListTitle,
		},
		locales: {
			type: Object as PropType<DeepPartial<typeof defaultLocales>>,
			default: () => ({}),
		},
	})

	const locales = useLocales(defaultLocales, () => props.locales)

	const emit = defineEmits(['update:modelValue'])

	const search = ref<string | null>(null)
	const internalValue = ref<(SearchListItem | unknown)[]>([])

	watch(
		() => props.modelValue,
		(newValue) => {
			internalValue.value = Array.isArray(newValue) ? [...newValue] : []
		}, { immediate: true },
	)

	const filteredItems = computed(() => {
		if (search.value === null) {
			return props.items
		}
		const searchLower = search.value.toLowerCase()
		return props.items.filter((item) => {
			return item.label.toLowerCase().includes(searchLower)
		})
	})

	function toggleCheckbox(item: SearchListItem, state: boolean) {
		if (state) {
			if (props.returnObject) {
				internalValue.value.push(item)
			}
			else {
				internalValue.value.push(item.value)
			}
		}
		else {
			if (props.returnObject) {
				internalValue.value = internalValue.value.filter(
					el => el !== item,
				)
			}
			else {
				internalValue.value = internalValue.value.filter(
					el => el !== item.value,
				)
			}
		}
		emitChangeEvent(internalValue.value)
	}

	const emitChangeEvent = (value: unknown[]) => {
		emit('update:modelValue', [...value])
	}

	const id = useId()

	defineExpose({
		filteredItems,
		search,
		emitChangeEvent,
	})
</script>

<template>
	<div class="sy-search-list">
		<SyTextField
			v-model="search"
			:label="props.label"
			hide-details
			color="primary"
			:variant="outlined ? 'outlined' : 'underlined'"
			clearable
			tabindex="0"
			data-test-id="search-input"
			:bg-color="props.bgColor"
			:disable-error-handling="true"
		>
			<template #prepend-inner>
				<SyIcon
					:icon="mdiMagnify"
					class="mr-1"
					decorative
				/>
			</template>
		</SyTextField>

		<fieldset>
			<legend
				class="d-sr-only"
			>
				{{ props.listLabel }}
			</legend>

			<p
				role="status"
				class="mx-4 my-2 text-caption"
				:class="{
					'd-sr-only': filteredItems.length > 0,
				}"
			>
				{{ search ? locales.nbItems(filteredItems.length) : '' }}
			</p>

			<ul
				v-if="filteredItems.length > 0"
				class="list"
				data-test-id="suggestions-list"
			>
				<li
					v-for="item in filteredItems"
					:key="item.label"
					v-ripple
					class="suggestion-item"
					:class="{
						'suggestion-item--selected': !!internalValue.find(el => el === (props.returnObject ? item : item.value)),
					}"
				>
					<!-- eslint-disable-next-line vuejs-accessibility/label-has-for -->
					<label
						class="label"
						:for="`checkbox-${slugify(item.label)}-${id}`"
					>
						<SyCheckbox
							:id="`checkbox-${slugify(item.label)}-${id}`"
							:name="`checkbox-${slugify(item.label)}-${id}`"
							hide-details
							density="compact"
							class="ml-2"
							:model-value="!!internalValue.find(el => el === (props.returnObject ? item : item.value))"
							@update:model-value="(e: boolean)=>toggleCheckbox(item, e)"
						/>
						<span>
							{{ item.label }}
						</span>
					</label>
				</li>
			</ul>
		</fieldset>
	</div>
</template>

<style lang="scss" scoped>
.sy-search-list fieldset {
	border: 0;
}

.list {
	padding: 0;
	padding-top: 8px;
	margin: 0;
	margin-left: 16px;
	margin-right: 16px;
	list-style: none;
}

.label {
	display: grid;
	align-items: center;
	grid-template-columns: auto 1fr;
	grid-gap: 8px;
	min-height: 34px;
	cursor: pointer;
	transition: background-color 0.2s ease-in-out;

	&:hover {
		background-color: rgba(var(--v-theme-primary), 0.08);
	}

	// La ligne entière (`<label>`) est la cible cliquable : le ring DS épouse donc toute la
	// ligne. Offset inset (-2px) pour ne jamais toucher/rogner les lignes voisines empilées.
	&:has(:focus-visible) {
		outline: 2px solid rgb(var(--v-theme-primary));
		outline-offset: -2px;
	}

	// On neutralise le ring propre de SyCheckbox (`.v-selection-control--focus-visible`, offset
	// 2px sur la case) pour éviter un double contour : le ring de ligne suffit.
	:deep(.v-selection-control--focus-visible) {
		outline: none;
	}

	span {
		display: block;
		min-width: 100%;
	}
}

.suggestion-item--selected .label {
	background-color: rgba(var(--v-theme-primary), 0.12);
}

</style>
