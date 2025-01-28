<script lang="ts" setup>
	import { ref, computed, watch } from 'vue'
	import { mdiMagnify } from '@mdi/js'
	import type { PropType } from 'vue'
	import type { SearchListItem } from './types'
	import { locales } from './locales'

	import { SyTextField } from '@/components'

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
	})

	const emit = defineEmits(['update:modelValue'])

	const search = ref<string | null>(null)
	const internalValue = ref<unknown[]>(props.modelValue)
	const searchIcon = mdiMagnify

	watch(
		() => props.modelValue,
		(newValue) => {
			internalValue.value = newValue
		},
	)

	watch(search, (newValue) => {
		if (newValue === '') {
			search.value = null
		}
	})

	const filteredItems = computed(() => {
		if (search.value === null) {
			return props.items
		}
		const searchLower = search.value.toLowerCase()
		return props.items.filter(item =>
			item.label.toLowerCase().includes(searchLower),
		)
	})

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
	<div class="vd-search-list">
		<SyTextField
			v-model="search"
			:label="locales.search"
			:variant="outlined ? 'outlined' : 'underlined'"
			aria-describedby="search-description"
			aria-labelledby="search-label"
			color="primary"
			hide-details
			is-clearable
			tabindex="0"
		>
			<template #prepend-inner>
				<VIcon class="mr-1">
					{{ searchIcon }}
				</VIcon>
			</template>
		</SyTextField>

		<!-- eslint-disable-next-line  vuejs-accessibility/label-has-for -->
		<label
			id="search-label"
			class="d-sr-only"
		>
			{{ locales.search }}
		</label>
		<span
			id="search-description"
			class="d-sr-only"
		>
			{{ locales.search }}
		</span>

		<VList
			id="search-list"
			v-model:selected="internalValue"
			aria-labelledby="search-list-title"
			class="pb-0"
			role="listbox"
			select-strategy="classic"
			title="search-list"
			@update:selected="emitChangeEvent"
		>
			<h2
				id="search-list-title"
				class="d-sr-only"
			>
				{{ locales.searchListTitle }}
			</h2>
			<VListItem
				v-for="(item, index) in filteredItems"
				:id="`search-list-item-${index}`"
				:key="index"
				:aria-labelledby="`search-list-item-${index}`"
				:aria-selected="internalValue.includes(item.value)"
				:tabindex="0"
				:value="item.value"
				active-class="text-primary"
				class="d-flex align-center justify-start mx-4"
				role="option"
			>
				<span
					:id="`search-list-item-label-${index}`"
					class="d-sr-only"
				>
					{{ item.label }}
				</span>
				<template #prepend="{ isActive }">
					<VListItemAction start>
						<input
							:id="`checkbox-${index}`"
							:aria-label="`${locales.checkboxLabel} ${item.label}`"
							:aria-labelledby="`checkbox-${index}`"
							:aria-selected="isActive"
							:checked="isActive"
							:title="`${locales.checkboxLabel} ${item.label}`"
							class="custom-checkbox ml-2"
							role="option"
							type="checkbox"
						>
						<!-- eslint-disable-next-line  vuejs-accessibility/label-has-for -->
						<label
							:for="`checkbox-${index}`"
							class="d-sr-only"
						>
							{{ locales.checkboxLabel }}
						</label>
					</VListItemAction>

					<VListItemTitle>{{ item.label }}</VListItemTitle>
				</template>
			</VListItem>
		</VList>
	</div>
</template>

<style lang="scss" scoped>
@use '@/assets/tokens';

.v-list {
  background: transparent;
}

.vd-search-list .v-list-item--active::before {
  opacity: 0;
}

.custom-checkbox {
  appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid rgb(0 0 0 / 50%);
  border-radius: 2px;
  outline: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.custom-checkbox:checked {
  background-color: tokens.$primary-base !important;
  border-color: tokens.$primary-base !important;

  &::before {
    content: '\2713';
    display: block;
    text-align: center;
    line-height: 15px;
    color: #fff;
  }
}

.custom-checkbox:hover {
  border-color: tokens.$primary-darker !important;
}
</style>
