<script lang='ts' setup>
	import { ref } from 'vue'
	import SySelect from '@/components/Customs/Selects/SySelect/SySelect.vue'
	import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'

	const selectedValue = ref()
	const values = [
		{ text: 'A', value: 'a' },
		{ text: 'B', value: 'b' },
		{ text: 'C', value: 'c' },
	]
	const name = ref('')
</script>

<template>
	<div class="container form-row pa-4">
		<SySelect
			v-model="selectedValue"
			:items="values"
			label="Type"
      help-text="Un texte d'aide "
			required
			display-asterisk
		/>
		<span class="dash">&nbsp;-&nbsp;</span>
		<SyTextField
			v-model="name"
			:show-success-messages="false"
			label="Nom"
			help-text="Un texte d'aide "
			required
			display-asterisk
		/>
	</div>
	<div class="pa-4">
		Type: {{ selectedValue }}
		<br>
		Nom: {{ name }}
	</div>
</template>

<style lang="scss">
.container {
  max-width: 600px;
  // height: 200vh;
}
.form-row {
  display: flex;
  flex-direction: row;
  gap: 10px;
}
</style>
