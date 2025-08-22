<script setup lang="ts">
	import { ref } from 'vue'
	import { useRouter } from 'vue-router'
	import HeaderNavigationBar from '@/components/HeaderNavigationBar/HeaderNavigationBar.vue'

	// Référence au composant HeaderNavigationBar
	const headerNavigationBar = ref<InstanceType<typeof HeaderNavigationBar> | null>(null)
	const router = useRouter()

	// Items de navigation pour le HeaderNavigationBar
	const navigationItems = [
		{
			label: 'Structures',
			to: '/structures',
		},
		{
			label: 'Radiologues',
			to: '/radiologues',
		},
		{
			label: 'Administration',
			to: '/administration',
		},
	]

	// Middleware pour intercepter les navigations et demander confirmation
	let isNavigationConfirmed = false

	router.beforeEach(async (to, from, next) => {
		// Vérifier si on doit demander une confirmation
		// Par exemple, si on est sur une page d'édition/création
		if (shouldAskConfirmation(from.path) && !isNavigationConfirmed) {
			// Afficher une boîte de dialogue de confirmation
			const confirmed = await showConfirmationDialog('Êtes-vous sûr de vouloir quitter cette page? Les modifications non enregistrées seront perdues.')

			if (confirmed) {
				// L'utilisateur a confirmé, on continue la navigation
				isNavigationConfirmed = true
				next()
			}
			else {
				// L'utilisateur a annulé, on reste sur la page actuelle
				isNavigationConfirmed = false

				// PARTIE CLEF: Réinitialiser la sélection d'onglet pour qu'elle corresponde à l'URL courante
				resetTabSelection()

				// Arrêter la navigation
				next(false)
			}
		}
		else {
			// Pas besoin de confirmation, continuer normalement
			isNavigationConfirmed = false
			next()
		}
	})

	// Fonction pour déterminer si la confirmation est nécessaire
	function shouldAskConfirmation(path: string): boolean {
		// Toujours demander confirmation lors d'un changement d'onglet
		return true
	}

	// Fonction fictive pour afficher une boîte de dialogue de confirmation
	async function showConfirmationDialog(message: string): Promise<boolean> {
		// Dans une application réelle, vous utiliseriez un composant de dialogue
		// Ici, on simule avec confirm() natif du navigateur
		return window.confirm(message)
	}

	// Fonction pour réinitialiser la sélection d'onglet après une annulation de navigation
	function resetTabSelection() {
		// Accéder au composant HeaderNavigationBar et appeler sa méthode resetTabSelection
		if (headerNavigationBar.value) {
			// Appeler la méthode resetTabSelection exposée par HeaderNavigationBar
			// qui délègue au HorizontalNavbar
			headerNavigationBar.value.resetTabSelection()
		}
	}

	// Méthode pour gérer l'annulation de navigation émise par les composants enfants
	function onCancelNavigation() {
		resetTabSelection()
	}
</script>

<template>
	<div>
		<HeaderNavigationBar
			ref="headerNavigationBar"
			service-title="Application Exemple"
			:items="navigationItems"
		/>
		<router-view v-slot="{ Component }">
			<component
				:is="Component"
				@cancel-navigation="onCancelNavigation"
			/>
		</router-view>
	</div>
</template>
