<script setup lang="ts">
	import { ref, computed } from 'vue'
	import type { VariantType } from '@/types/vuetifyTypes'

	const props = defineProps({
		modelValue: {
			type: [String, Number],
			default: '',
		},
		items: {
			type: Array as () => Array<unknown>,
			required: true,
		},
		itemKey: {
			type: String,
			default: 'value',
		},
		itemLabel: {
			type: String,
			default: 'label',
		},
		visible: {
			type: Boolean,
			default: true,
		},
		label: {
			type: String,
			default: 'Sélectionnez un élément',
		},
		placeholder: {
			type: String,
			default: 'Sélectionner',
		},
		hasSelectError: {
			type: Boolean,
			default: false,
		},
		infoIcon: {
			type: String,
			default: 'mdi-information',
		},
		menuId: {
			type: String,
			default: 'menuId',
		},
		variant: {
			type: String as () => VariantType,
			default: 'text',
		},
		btnClass: {
			type: String,
			default: '',
		},
	})

	const emits = defineEmits(['update:modelValue', 'item-selected', 'blur'])

	const menu = ref(false)

	const selectedLabel = computed(() => {
		const selectedItem = props.items?.find((item) => {
			const value = getItemValue(item)
			return value === props.modelValue
		})
		return selectedItem ? getItemLabel(selectedItem) : ''
	})

	function getItemValue(item: unknown) {
		return props.itemKey in item ? item[props.itemKey] : item
	}

	function getItemLabel(item: unknown) {
		return props.itemLabel in item ? item[props.itemLabel] : item
	}

	function getItemKey(item: unknown, index: number) {
		return props.itemKey in item ? item[props.itemKey] : index
	}

	function onItemSelected(item: unknown) {
		const value = getItemValue(item)
		emits('update:modelValue', value)
		emits('item-selected', item)
		menu.value = false
	}

	function onBlur() {
		emits('blur')
	}
</script>

<template>
	<VMenu
		v-if="visible"
		v-model="menu"
		role="menu"
		location="bottom"
		:label="label"
	>
		<template #activator="{ props: activatorProps }">
			<VBtn
				v-bind="activatorProps"
				:variant="variant"
				:class="btnClass"
				tabindex="0"
				@blur="onBlur"
			>
				{{ selectedLabel || placeholder }}
				<VIcon v-if="hasSelectError">
					{{ infoIcon }}
				</VIcon>
			</VBtn>
		</template>
		<VList :aria-labelledby="menuId">
			<VListItem
				v-for="(item, index) in items"
				:key="getItemKey(item, index)"
				:tabindex="index + 1"
				@click="onItemSelected(item)"
			>
				<VListItemTitle>
					{{ getItemLabel(item) }}
				</VListItemTitle>
			</VListItem>
		</VList>
	</VMenu>
</template>

<style scoped>

</style>
