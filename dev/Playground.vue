<script lang='ts' setup>
	import { ref } from 'vue'
    import SySelect from '@/components/Customs/Selects/SySelect/SySelect.vue'

	const selectValues = ref([])
	const values = [
        { text: 'Option 1', value: 'option1' },
        { text: 'Option 2', value: 'option2' },
        { text: 'Option 3', value: 'option3' },
        { text: 'Option 4', value: 'option4' },
    ]
</script>
<template>
	<SySelect
		v-model="selectValues"
		:items="values"
		label="Sélectionner une valeur"
		multiple
		chips
	/>
</template>
