<script lang="ts" setup>
	import Usages from '@/components/Usages/Usages.vue'
	const itemsToDo = [
		'texteddddddddddddddddddddddddddddddddddddd2', 'texte2', 'texte2',
	]

	const itemsNotToDo = [
		'texteddddddddddddddddddddddddddddddddddd', 'texte2', 'texte2', 'texte2',
	]
</script>
<template>
	<Usages
		:items1="itemsToDo"
		:items2="itemsNotToDo"
	/>
</template>
