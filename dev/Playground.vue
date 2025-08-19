<script setup lang="ts">
	import { ref } from 'vue'
	import DatePicker from '@/components/DatePicker/CalendarMode/DatePicker.vue'

	const date1 = ref('')
	const date2 = ref('')
</script>

<template>
	<div class="date-picker-keyboard-test">
		<p>Test focus management when using keyboard navigation:</p>

		<div class="test-container">
			<div class="field">
				<h5 for="field1">
					Field before DatePicker:
				</h5>
				<input
					id="field1"
					type="text"
					placeholder="Tab to DatePicker"
				>
			</div>

			<div class="field">
				<h5 for="date-picker">
					DatePicker:
				</h5>
				<DatePicker
					id="date-picker"
					v-model="date1"
					h5="Test DatePicker"
					placeholder="Enter a date"
				/>
			</div>

			<div class="field">
				<h5 for="field2">
					Field after DatePicker:
				</h5>
				<input
					id="field2"
					type="text"
					placeholder="Tab should land here"
				>
			</div>

			<div class="instructions">
				<h3>Instructions:</h3>
				<ol>
					<li>Utiliser la touche Tabulation pour naviguer jusqu’au sélecteur de date</li>
					<li>Appuyer sur Entrée ou Espace pour ouvrir le calendrier</li>
					<li>Appuyer sur Tabulation pour parcourir le calendrier</li>
					<li>Appuyer sur Enter pour selectionner une date</li>
					<li>Appuyer sur ESC pour quitter sans selectionner de date</li>
					<li>Vérifier que le focus passe au champ suivant (et non de retour sur l’icône du calendrier)</li>
				</ol>
			</div>
		</div>
	</div>
</template>

<style scoped>
.date-picker-keyboard-test {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.test-container {
  margin-top: 30px;
}

.field {
  margin-bottom: 20px;
}

.field h5 {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.instructions {
  margin: 40px;
  padding: 35px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.instructions h3 {
  margin-top: 0;
}
</style>
