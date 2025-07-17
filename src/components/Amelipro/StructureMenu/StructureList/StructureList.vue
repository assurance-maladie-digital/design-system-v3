<script setup lang="ts">
	import { type PropType, computed, nextTick, ref } from 'vue'
	import { mdiChevronDown, mdiChevronUp } from '@mdi/js'
	import AmeliproBtn from '../../AmeliproBtn/AmeliproBtn.vue'
	import type { Structure } from '../StructureItem/types'
	import StructureItem from '../StructureItem/StructureItem.vue'
	import { locales } from './locales'

	const props = defineProps({
		hiddenLabel: {
			type: Boolean,
			default: false,
		},
		label: {
			type: String,
			required: true,
		},
		maxStructuresLoadedDefault: {
			type: Number,
			default: 5,
		},
		modelValue: {
			type: String,
			default: undefined,
		},
		name: {
			type: String,
			required: true,
		},
		structures: {
			type: Array as PropType<Structure[]>,
			required: true,
		},
	})

	const chevronDown = mdiChevronDown
	const maxStructuresLoaded = ref(props.maxStructuresLoadedDefault)

	const emit = defineEmits(['update:model-value'])
	const currentValue = computed({
		get() {
			return props.modelValue
		},
		set(value: string | undefined) {
			emit('update:model-value', value)
		},
	})

	const selectItem = async (value: string): Promise<void> => {
		currentValue.value = value
		await nextTick()
	}

	const loadMore = (): void => {
		if (maxStructuresLoaded.value <= props.structures.length) {
			const itemToFocus = maxStructuresLoaded.value - 1
			maxStructuresLoaded.value = props.structures.length
			const idToFocus = `${props.name}-item-${itemToFocus}`
			document.getElementById(idToFocus)?.focus()
		}
	}

	const loadLess = (): void => {
		if (maxStructuresLoaded.value > props.maxStructuresLoadedDefault) {
			maxStructuresLoaded.value = props.maxStructuresLoadedDefault
			const itemToFocus = maxStructuresLoaded.value - 1
			const idToFocus = `${props.name}-item-${itemToFocus}`
			document.getElementById(idToFocus)?.focus()
		}
	}
</script>

<template>
	<div
		:id="`${name}-container`"
		class="structure-list"
	>
		<VRadioGroup
			:id="`${name}-radio-group`"
			v-model="currentValue"
			class="w-100"
			column
			hide-details
			:label="label"
			:name="name"
		>
			<StructureItem
				v-for="(item, index) in (structures.slice(0, maxStructuresLoaded))"
				:key="item.value"
				:checked="item.value === currentValue"
				:group-name="name"
				:item="item"
				:unique-id="`${name}-item-${index}`"
				@select="selectItem(item.value)"
			/>
		</VRadioGroup>

		<div class="d-flex justify-center">
			<AmeliproBtn
				v-if="structures.length > maxStructuresLoaded"
				class="text-none"
				hover-underline
				text
				:unique-id="`${name}-load-more-btn`"
				@click="loadMore"
			>
				{{ locales.loadMore }}

				<template #icon>
					{{ chevronDown }}
				</template>
			</AmeliproBtn>

			<AmeliproBtn
				v-if="structures.length === maxStructuresLoaded && maxStructuresLoaded > maxStructuresLoadedDefault"
				class="text-none"
				hover-underline
				text
				:unique-id="`${name}-load-less-btn`"
				@click="loadLess"
			>
				{{ locales.loadLess }}

				<template #icon>
					{{ mdiChevronUp }}
				</template>
			</AmeliproBtn>
		</div>
	</div>
</template>
