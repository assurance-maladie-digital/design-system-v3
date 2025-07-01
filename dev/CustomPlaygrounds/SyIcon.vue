<script setup lang="ts">
	import { mdiChevronRight, mdiAlert } from '@mdi/js'
	import { onMounted } from 'vue'
	import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'

	function inspectIconAccessibility() {
		// Récupérer les icônes
		const decorativeIcon = document.querySelector('.icon-test:nth-child(2) .v-icon')
		const functionalIcon = document.querySelector('.icon-test:nth-child(3) .v-icon')

		if (decorativeIcon && functionalIcon) {
			// Inspecter l'icône décorative
			const decorativeSvg = decorativeIcon.querySelector('svg')
			console.log('Icône décorative - élément i:', {
				role: decorativeIcon.getAttribute('role'),
				ariaHidden: decorativeIcon.getAttribute('aria-hidden'),
				ariaLabel: decorativeIcon.getAttribute('aria-label'),
			})
			console.log('Icône décorative - élément svg:', {
				role: decorativeSvg?.getAttribute('role'),
				ariaHidden: decorativeSvg?.getAttribute('aria-hidden'),
			})

			// Inspecter l'icône fonctionnelle
			const functionalSvg = functionalIcon.querySelector('svg')
			console.log('Icône fonctionnelle - élément i:', {
				role: functionalIcon.getAttribute('role'),
				ariaHidden: functionalIcon.getAttribute('aria-hidden'),
				ariaLabel: functionalIcon.getAttribute('aria-label'),
			})
			console.log('Icône fonctionnelle - élément svg:', {
				role: functionalSvg?.getAttribute('role'),
				ariaHidden: functionalSvg?.getAttribute('aria-hidden'),
			})
		}
	}

	onMounted(() => {
		// Attendre que le DOM soit complètement chargé
		setTimeout(() => {
			inspectIconAccessibility()
		}, 500) // Délai plus long pour s'assurer que nos corrections ont été appliquées
	})
</script>

<template>
	<div>
		<h2>Test d'accessibilité des icônes</h2>

		<div class="icon-test">
			<SyIcon
				:icon="mdiAlert"
				:decorative="false"
			/>
			<h3>Icône décorative</h3>
			<SyIcon
				color="green-darken-2"
				:icon="mdiChevronRight"
				size="large"
				:decorative="true"
			/>
		</div>

		<div class="icon-test">
			<h3>Icône fonctionnelle</h3>
			<SyIcon
				color="blue-darken-2"
				:icon="mdiChevronRight"
				size="large"
				:decorative="false"
			/>
		</div>

		<button
			class="mt-4 pa-2"
			@click="inspectIconAccessibility()"
		>
			Vérifier l'accessibilité
		</button>
	</div>
</template>

<style scoped>
.icon-test {
  margin: 20px 0;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
</style>
