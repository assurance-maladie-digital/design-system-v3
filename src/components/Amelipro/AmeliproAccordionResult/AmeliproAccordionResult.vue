<script setup lang="ts">
	import AmeliproAccordionResultTemplate from './AmeliproAccordionResultTemplate/AmeliproAccordionResultTemplate.vue'
	import { ref } from 'vue'

	const props = defineProps({
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
		hideSeparator: {
			type: Boolean,
			default: false,
		},
		isOpen: {
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
	<AmeliproAccordionResultTemplate
		:border-color="borderColor"
		:bordered="bordered"
		:card-color="cardColor"
		:hide-separator="hideSeparator"
		:is-open="opened"
		:unique-id="uniqueId"
		@open-close="openClose"
	>
		<template
			v-if="$slots.headingContent"
			#headingContent
		>
			<slot name="headingContent" />
		</template>

		<template
			v-if="$slots.accordionContent"
			#default
		>
			<slot name="accordionContent" />
		</template>
	</AmeliproAccordionResultTemplate>
</template>
