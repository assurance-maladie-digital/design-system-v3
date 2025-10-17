<script setup lang='ts'>
	import { ref } from 'vue'
	import { isRequired } from '@/utils/rules'

	const number = ref(0)
</script>

<template>
	<div class="demo-container">
		<div class="demo-header">
			<h2 class="demo-title">
				Test de la règle isRequired avec la valeur 0
			</h2>
			<div class="demo-description">
				<p><strong>Attendu :</strong> Pas d'erreur à la saisie et à la perte de focus lorsqu'on saisit 0</p>
				<p class="demo-note">
					La valeur 0 est considérée comme valide car elle représente une valeur numérique réelle,
					contrairement à null, undefined ou une chaîne vide.
				</p>
			</div>
		</div>

		<div class="demo-content">
			<VTextField
				v-model="number"
				label="Nombre (testez avec 0)"
				:rules="[isRequired]"
				variant="outlined"
				type="number"
				class="demo-field"
				hint="Essayez de saisir 0, puis cliquez ailleurs pour tester la validation"
				persistent-hint
			/>

			<div class="demo-info">
				<p><strong>Valeur actuelle :</strong> {{ number }}</p>
				<p><strong>Type :</strong> {{ typeof number }}</p>
			</div>
		</div>
	</div>
</template>

<style scoped>
.demo-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.demo-header {
  margin-bottom: 2rem;
}

.demo-title {
  color: #1976d2;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.demo-description {
  background: #e3f2fd;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid #1976d2;
}

.demo-description p {
  margin: 0.5rem 0;
  line-height: 1.5;
}

.demo-note {
  font-size: 0.9rem;
  color: #666;
  font-style: italic;
}

.demo-content {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.demo-field {
  margin-bottom: 1.5rem;
}

.demo-info {
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 6px;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
}

.demo-info p {
  margin: 0.25rem 0;
}
</style>
