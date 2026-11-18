<script setup lang="ts">
	import { ref } from 'vue'
	import { mdiCogOutline, mdiSquareEditOutline } from '@mdi/js'
	import VListNavPanel, { type NavAction, type NavItem } from './VListNavPanel.vue'

	// Données reprises de la maquette PA « Sous-menu — Dossiers client » (#2634).
	// « Pièces justificatives » est un exemple : la maquette ne montre pas le contenu de ce niveau.
	const edit = { id: 'edit', icon: mdiSquareEditOutline, label: 'Modifier' }
	const settings = { id: 'settings', icon: mdiCogOutline, label: 'Paramètres' }

	const items: NavItem[] = [
		{
			id: 'droit-de-base',
			label: 'Droit de base',
			actions: [edit],
			children: [
				{
					id: 'demande-affiliation',
					label: 'Demande d’affiliation',
					children: [{ id: 'pieces-justificatives', label: 'Pièces justificatives' }],
				},
			],
		},
		{
			id: 'cmu-b',
			label: 'CMU-B',
			actions: [edit],
			children: [
				{ id: 'reception', label: 'Réception' },
				{ id: 'instruction', label: 'Instruction' },
				{ id: 'revision', label: 'Révision' },
			],
		},
		{ id: 'cmu-c-as', label: 'CMU-C/AS' },
		{ id: 'ame', label: 'AME', actions: [settings, edit] },
		{ id: 'at-mp', label: 'AT/MP', actions: [settings, edit] },
	]

	const lastEvent = ref('Aucune interaction pour l’instant.')

	function onNavigate(item: NavItem): void {
		lastEvent.value = `Navigation vers « ${item.label} »`
	}

	function onAction(item: NavItem, action: NavAction): void {
		lastEvent.value = `Action « ${action.label} » sur « ${item.label} »`
	}
</script>

<template>
	<VApp>
		<VMain class="pa-8">
			<h1 class="text-h5 mb-2">
				Liste de navigation avec actions et sous-niveau (solution Vuetify)
			</h1>
			<p class="mb-6">
				Survolez ou tabulez dans une entrée pour afficher ses actions.
				Le chevron ouvre le sous-niveau (clic, Entrée, Espace ; aussi au survol à la souris), Échap le referme.
			</p>

			<nav aria-label="Dossiers client">
				<!-- Pas de label : le <nav> porte déjà le nom, sinon il serait annoncé deux fois -->
				<VListNavPanel
					:items="items"
					@navigate="onNavigate"
					@action="onAction"
				/>
			</nav>

			<p
				class="mt-6"
				role="status"
			>
				{{ lastEvent }}
			</p>
		</VMain>
	</VApp>
</template>
