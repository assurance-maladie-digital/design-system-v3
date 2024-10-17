<script setup lang="ts">
	import LangBtn from '@/components/LangBtn/LangBtn.vue'
	import CustomSelect from '@/components/Customs/CustomSelect/customSelect.vue'
	import { ref } from 'vue'

	const value = ref('fr')
	const selectedValue2 = ref(undefined)
	const items = ['fr', 'en', 'co']
	const items2 = ref(['1', '2', '3', '4', '5'])
	const ariaLabel = 'Choix de la langue'
</script>

<template>
	<main>
		<div class="mt-12 ml-12">
     <CustomSelect
       v-model="value"
       :items="items"
       label="Choix de la langue"
       ariaLabel="Choix de la langue"
      />
		</div>
	</main>
</template>
