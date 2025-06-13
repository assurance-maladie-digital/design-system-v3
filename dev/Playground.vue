<script setup lang="ts">
	import Accordion from '@/components/Accordion/Accordion.vue'
</script>

<template>
	<main>
		<h1>Test du composant Accordion</h1>

		<h2>Avec un contenu simple (string)</h2>
		<Accordion
			:items="[
				{ id: 'item1', title: 'Section 1', content: 'Contenu de la section 1' },
				{ id: 'item2', title: 'Section 2', content: 'Contenu de la section 2' }
			]"
			:heading-level="2"
			background-color="warning"
		/>

		<h2>Avec un contenu objet (title + content)</h2>
		<Accordion
			:items="[
				{
					id: 'item3',
					title: 'Section 3',
					content: {
						title: 'Sous-titre de la section 3',
						content: 'Contenu détaillé de la section 3'
					}
				},
				{
					id: 'item4',
					title: 'Section 4',
					content: {
						title: 'Sous-titre de la section 4',
						content: 'Contenu détaillé de la section 4'
					}
				}
			]"
			:heading-level="2"
		/>
	</main>
</template>

<style scoped>
main {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1, h2 {
  margin-bottom: 20px;
}

h2 {
  margin-top: 40px;
}
</style>
