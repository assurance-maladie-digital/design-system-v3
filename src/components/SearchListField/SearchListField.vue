<script lang="ts" setup>
	import { ref, computed, watch } from 'vue'
	import { mdiMagnify } from '@mdi/js'
	import type { PropType } from 'vue'
	import type { SearchListItem } from './types'
	import { locales as defaultLocales } from './locales'

	import { SyTextField, SyCheckbox } from '@/components'
	import slugify from 'slugify'

	const props = defineProps({
		modelValue: {
			type: Array as PropType<unknown[]>,
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
			type: Object as PropType<typeof defaultLocales>,
			default: () => defaultLocales,
		},
	})

	const emit = defineEmits(['update:modelValue'])

	const search = ref<string | null>(null)
	const internalValue = ref<(SearchListItem | unknown)[]>([])

	watch(
		() => props.modelValue,
		(newValue) => {
			internalValue.value = newValue
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
		emit('update:modelValue', value)
	}

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
		>
			<template #prepend-inner>
				<VIcon class="mr-1">
					{{ mdiMagnify }}
				</VIcon>
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
						:for="`checkbox-${slugify(item.label)}`"
					>
						<SyCheckbox
							:id="`checkbox-${slugify(item.label)}`"
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
@use '@/assets/tokens';

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

	&:has(:focus-visible) {
		outline: 2px solid rgba(var(--v-theme-primary));
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
