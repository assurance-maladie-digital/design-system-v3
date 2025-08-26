<script setup lang="ts">
	import { type PropType, onMounted, ref } from 'vue'
	import type { AmeliproAccordionGroupItem } from './types'
	import AmeliproAccordionTemplate from '../AmeliproAccordion/AmeliproAccordionTemplate/AmeliproAccordionTemplate.vue'

	const props = defineProps({
		defaultItemOpened: {
			type: [Number, null] as PropType<number | null>,
			default: null,
		},
		groupBorderColor: {
			type: String,
			default: 'ap-grey-lighten-2',
		},
		groupBordered: {
			type: Boolean,
			default: true,
		},
		groupColor: {
			type: String,
			default: 'ap-white',
		},
		groupTitleLevel: {
			type: Number,
			default: 2,
		},
		groupTitleUppercase: {
			type: Boolean,
			default: false,
		},
		headerRightWidth: {
			type: String,
			default: '50%',
		},
		hideSeparator: {
			type: Boolean,
			default: false,
		},
		items: {
			type: Array as PropType<AmeliproAccordionGroupItem[]>,
			required: true,
		},
		uniqueId: {
			type: String,
			default: undefined,
		},
	})

	const openId = ref<string | null>(null)

	onMounted(() => {
		if (props.defaultItemOpened !== null) {
			openId.value = props.items[props.defaultItemOpened].id
		}
	})

	const emit = defineEmits(['change'])

	const openClose = (id: string): void => {
		openId.value = openId.value === id ? null : id
		emit('change', openId.value)
	}

	// Rendre publique la méthode openClose permet à un bouton ou à un composant externe de fermer/ouvrir l'accordéon
	defineExpose({ openClose })
</script>

<template>
	<div
		:id="uniqueId"
		class="accordion-group"
	>
		<AmeliproAccordionTemplate
			v-for="(accordion, index) in items"
			:key="index"
			:accordion-title="accordion.title"
			:border-color="groupBorderColor"
			:bordered="groupBordered"
			:card-color="groupColor"
			:header-right-width="headerRightWidth"
			:hide-separator="hideSeparator"
			:is-open="accordion.id === openId"
			:title-level="groupTitleLevel"
			:title-uppercase="groupTitleUppercase"
			:unique-id="accordion.id"
			@open-close="openClose(accordion.id)"
		>
			<template #headerRight>
				<slot :name="`accordion-header-right-${index}`">
					<slot
						name="accordion-header-right"
						v-bind="accordion"
					/>
				</slot>
			</template>

			<template #default>
				<slot :name="`accordion-content-${index}`">
					<slot
						name="accordion-content"
						v-bind="accordion"
					/>
				</slot>
			</template>
		</AmeliproAccordionTemplate>
	</div>
</template>
