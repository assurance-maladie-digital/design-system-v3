<script setup lang="ts">
	import HeaderToolbar from '@/components/HeaderToolbar/HeaderToolbar.vue'
	import { ref } from 'vue'
	import type { MenuItem, SelectItem } from '@/components/HeaderToolbar/types'

	const leftMenu = ref([{
			title: 'Assuré',
			href: '#',
		},
		{
			title: 'Professionnel de santé',
			href: '#',
		},
		{
			title: 'Entreprise',
			href: '#',
		},
	] as MenuItem[])

	const rightMenu = ref([{
			title: 'Qui sommes-nous ?',
			to: '/',
		},
		{
			title: 'Carrières',
			href: 'https://www.assurance-maladie.ameli.fr/carrieres',
			openInNewTab: true,
		},
		{
			title: 'Études et données',
			href: 'https://www.assurance-maladie.ameli.fr/etudes-et-donnees',
			openInNewTab: true,
		},
		{
			title: 'Presse',
			href: 'https://www.assurance-maladie.ameli.fr/presse',
			openInNewTab: true,
		}] as MenuItem[])

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
	] as SelectItem[])

</script>

<template>
	<HeaderToolbar
		:left-menu="leftMenu"
		:right-menu="rightMenu"
		:items-select-menu="itemsSelectMenu"
	/>
</template>
