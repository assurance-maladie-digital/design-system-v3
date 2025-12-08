<script setup lang="ts">
	import NirField from '@/components/NirField/NirField.vue'
	import { ref } from 'vue'

	const value = ref('')
	const value2 = ref('')
</script>

<template>
	<div class="demo-container">
		<h1 class="demo-title">
			Démo NirField - Test d'édition
		</h1>

		<div class="demo-section">
			<h2 class="section-title">
				Avec clé de validation
			</h2>
			<NirField
				v-model="value"
				label="NIR complet"
				number-label="Numéro de sécurité sociale"
				key-label="Clé"
			/>
			<div class="value-display">
				<strong>Valeur :</strong> {{ value || 'Vide' }}
			</div>
		</div>

		<div class="demo-section">
			<h2 class="section-title">
				Sans clé de validation
			</h2>
			<NirField
				v-model="value2"
				:display-key="false"
				label="NIR sans clé"
				number-label="Numéro de sécurité sociale"
			/>
			<div class="value-display">
				<strong>Valeur :</strong> {{ value2 || 'Vide' }}
			</div>
		</div>
	</div>
</template>

<style scoped>
.demo-container {
	max-width: 800px;
	margin: 0 auto;
	padding: 2rem;
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.demo-title {
	text-align: center;
	color: #2c3e50;
	margin-bottom: 2rem;
	font-size: 2rem;
	font-weight: 600;
}

.demo-section {
	background: #f8f9fa;
	border-radius: 12px;
	padding: 1.5rem;
	margin-bottom: 2rem;
	border: 1px solid #e9ecef;
}

.section-title {
	color: #495057;
	margin-bottom: 1rem;
	font-size: 1.25rem;
	font-weight: 500;
}

.value-display {
	margin-top: 1rem;
	padding: 0.75rem;
	background: #ffffff;
	border-radius: 8px;
	border: 1px solid #dee2e6;
	font-family: 'Monaco', 'Menlo', monospace;
	color: #6c757d;
}
</style>
