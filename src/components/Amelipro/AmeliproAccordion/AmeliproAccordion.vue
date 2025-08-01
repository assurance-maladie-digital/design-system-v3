<script setup lang="ts">
	import AmeliproAccordionTemplate from './AmeliproAccordionTemplate/AmeliproAccordionTemplate.vue'
	import { ref } from 'vue'

	const props = defineProps({
		accordionTitle: {
			type: String,
			required: true,
		},
		borderColor: {
			type: String,
			default: 'ap-grey-lighten-2',
		},
		bordered: {
			type: Boolean,
			default: true,
		},
		cardColor: {
			type: String,
			default: 'ap-white',
		},
		headerRightWidth: {
			type: String,
			default: '50%',
		},
		hideSeparator: {
			type: Boolean,
			default: false,
		},
		isOpen: {
			type: Boolean,
			default: false,
		},
		titleLevel: {
			type: Number,
			default: 2,
		},
		titleUppercase: {
			type: Boolean,
			default: false,
		},
		uniqueId: {
			type: String,
			required: true,
		},
	})

	const opened = ref(props.isOpen)

	const openClose = (): void => {
		opened.value = !opened.value
	}

	// Rendre publique la méthode openClose permet à un bouton ou à un composant externe de fermer/ouvrir l'accordéon
	defineExpose({ openClose })
</script>

<template>
	<AmeliproAccordionTemplate
		:accordion-title="accordionTitle"
		:border-color="borderColor"
		:bordered="bordered"
		:card-color="cardColor"
		:header-right-width="headerRightWidth"
		:hide-separator="hideSeparator"
		:is-open="opened"
		:title-level="titleLevel"
		:title-uppercase="titleUppercase"
		:unique-id="uniqueId"
		@open-close="openClose"
	>
		<template
			v-if="$slots.default"
			#default
		>
			<slot />
		</template>

		<template
			v-if="$slots.headerRight"
			#headerRight
		>
			<slot name="headerRight" />
		</template>
	</AmeliproAccordionTemplate>
</template>
