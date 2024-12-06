<script setup lang="ts">
	import CookiesSection from '@/components/CookiesSelection/CookiesSelection.vue'
	import { ref } from 'vue'

	let cookiesList = ref({
		essentials: [
			{
				name: 'session',
				description: 'Sauvegarde la session pour rester connecté.',
				conservation: '20 heures',
			},
			{
				name: 'cookie_policy',
				description: 'Sauvegarde les préférences de cookies.',
				conservation: '1 an',
			},
		],
		functional: [
			{
				name: 'contrast',
				description: 'Sauvegarde la personnalisation de l’affichage.',
				conservation: '1 an',
			},
		],
		analytics: [
			{
				name: 'user_id',
				description: 'Sauvegarde l’identifiant unique de visiteur.',
				conservation: '6 mois',
			},
		],
	})
</script>

<template>
	<div>
		{{ cookiesList }}
		<CookiesSection :items="cookiesList" />
	</div>
</template>

<style lang="scss" scoped></style>
