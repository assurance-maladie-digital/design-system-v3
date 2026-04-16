<script setup lang="ts">
	import { type PropType, computed, ref } from 'vue'
	import AmeliproIcon from '../../AmeliproIcon/AmeliproIcon.vue'
	import type { IndexedObject } from '../../types'
	import type { Structure } from './types'
	import { convertToHex } from '@/utils/functions/convertToHex'
	import { locales } from './locales'

	const props = defineProps({
		checked: {
			type: Boolean,
			default: false,
		},
		groupName: {
			type: String,
			required: true,
		},
		item: {
			type: Object as PropType<Structure>,
			required: true,
		},
		outlineColor: {
			type: String,
			default: 'ap-black',
		},
		uniqueId: {
			type: String,
			required: true,
		},
	})

	const focused = ref(false)
	const focusStyle = computed<IndexedObject | undefined>(() => (focused.value ? { outline: `1px dotted ${convertToHex(props.outlineColor)}` } : undefined))
	const emit = defineEmits(['select'])

	const emitEvent = (): void => {
		emit('select', props.item.value)
	}
</script>

<template>
	<label
		:id="`${uniqueId}-label`"
		class="w-100 mb-4 pointer structure-item"
		:for="uniqueId"
	>
		<input
			:id="uniqueId"
			:checked="checked"
			:name="groupName"
			type="radio"
			:value="item.value"
			@blur="focused = false"
			@click="emitEvent"
			@focus="focused = true"
			@keyup.space="emitEvent"
		>

		<span
			class="d-flex flex-column w-100 px-2 px-sm-4 py-2 rounded hover-style"
			:class="checked ? 'bg-ap-blue-lighten-3 selected-border' : 'bg-ap-grey-lighten-4'"
			:style="focusStyle"
		>
			<span
				v-if="item.defaultStructure"
				:id="`${uniqueId}-default-structure-mobile`"
				class="d-block d-md-none align-self-end text-ap-blue-darken-1 font-weight-bold"
			>
				{{ locales.defaultStructure }}
			</span>

			<span class="d-flex align-md-center">
				<AmeliproIcon
					bordered
					class="mr-4"
					icon="localisation"
					icon-bg-color="ap-white"
					icon-color="#01B9F5"
					:unique-id="`${uniqueId}-icon`"
					x-large
				/>

				<span
					:id="`${uniqueId}-structure-infos`"
					class="structure w-100 d-flex flex-column flex-md-row justify-md-space-between align-md-center"
				>
					<span class="user-infos d-flex flex-column">
						<span class="name">{{ item.name }}</span>
						<span class="address">{{ item.address }}</span>
					</span>

					<span>
						<span
							v-if="item.defaultStructure"
							:id="`${uniqueId}-default-structure-desktop`"
							class="d-none d-md-block text-right text-ap-blue-darken-1 font-weight-bold"
						>
							{{ locales.defaultStructure }}
						</span>

						{{ locales.label }} {{ item.idNumber }}
					</span>
				</span>
			</span>
		</span>
	</label>
</template>

<style lang="scss" scoped>
input {
	position: absolute;
	width: 0;
	height: 0;
	opacity: 0;
}

.item-rounded {
	border-radius: 8px;
}

.hover-style {
	&:hover {
		background-color: rgb(var(--v-theme-ap-blue-lighten-3)) !important;
	}
}

.selected-border {
	border: 1px solid rgb(var(--v-theme-ap-blue));
}

.structure {
	font-size: var(--v-ap-fontSizeXs);
	color: rgb(var(--v-theme-ap-grey-darken-1));

	.name {
		font-weight: 600;
	}
}
</style>
