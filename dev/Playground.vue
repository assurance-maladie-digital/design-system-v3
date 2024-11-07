<script lang="ts" setup>
	import { ref } from 'vue'
	import SubHeader from '@/components/SubHeader/SubHeader.vue'
	import HeaderLoading from '@/components/HeaderLoading/HeaderLoading.vue'
	import { DataListGroupItems } from '@/components/DataListGroup/types'

	const loading = ref(true)
	const dataListGroupItems = ref<DataListGroupItems>([
		{
			title: 'Informations patient',
			itemsNumberLoading: 2,
			headingLoading: true,
			items: [
				{ key: 'Date de naissance', value: '24/09/1970' },
				{ key: 'Adresse', value: '50 Avenue du Professeur André Lemierre<br>75020 Paris' },
			],
		},
		{
			title: 'Médecin traitant',
			itemsNumberLoading: 2,
			headingLoading: true,
			items: [
				{ key: 'Nom du praticien', value: 'Gérard Leblanc' },
				{ key: 'N° RPPS', value: 'XXXXX' },
			],
		},
		{
			title: 'Autres informations',
			itemsNumberLoading: 1,
			headingLoading: true,
			items: [
				{ key: 'Dernière modification', value: '04/06/2020' },
			],
		},
	])
</script>

<template>
	<SubHeader
		:data-list-group-items="dataListGroupItems"
		title-text="Paul Dupont"
		sub-title-text="1 69 08 75 125 456 75"
		render-html-value
	/>
</template>
