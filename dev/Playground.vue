<script setup lang="ts">
	import HeaderToolbar from '@/components/HeaderToolbar/HeaderToolbar.vue'
	import { ref } from 'vue'

	const leftMenu = ref([{
			text: 'Assuré',
			href: 'https://www.assurance-maladie.ameli.fr/assure',
		},
		{
			text: 'Professionnel de santé',
			href: '',
		},
		{
			text: 'Entreprise',
			href: 'https://www.assurance-maladie.ameli.fr/entreprise',
		},
	])

	const rightMenu = ref([{
			text: 'Qui sommes-nous ?',
			to: '/',
			title: 'Qui sommes-nous ?',
		},
		{
			text: 'Carrières',
			href: 'https://www.assurance-maladie.ameli.fr/carrieres',
			title: 'Carrières',

		},
		{
			text: 'Études et données',
			href: 'https://www.assurance-maladie.ameli.fr/etudes-et-donnees',
			title: 'Études et données',
		},
		{
			text: 'Presse',
			href: 'https://www.assurance-maladie.ameli.fr/presse',
			title: 'Presse',
		}])

	const itemsSelectMenu = ref([
		{
			text: 'Chirurgien-dentiste',
			value: 'Chirurgien-dentiste',
			to: '/',
		},
		{
			text: 'Établissement',
			value: 'Établissement',
			href: 'https://www.ameli.fr/',
		},
		{
			text: 'Exercice coordonné',
			value: 'Exercice coordonné',
			href: 'https://www.ameli.fr/',
		},
		{
			text: 'Infirmier',
			value: 'Infirmier',
			href: 'https://www.ameli.fr/',
		},
		{
			text: 'Laboratoire d\'analyses médicales',
			value: 'Laboratoire',
			href: 'https://www.ameli.fr/',
		},
		{
			text: 'Masseur-kinésithérapeute',
			value: 'Masseur',
			href: 'https://www.ameli.fr/',
		},
	])

</script>

<template>
	<HeaderToolbar
		:left-menu="leftMenu"
		:right-menu="rightMenu"
		:items-select-menu="itemsSelectMenu"
	/>
</template>
