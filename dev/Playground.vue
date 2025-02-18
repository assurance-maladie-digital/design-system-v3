<script setup lang="ts">
	import ChipList from '@/components/ChipList/ChipList.vue'
	const items = [
		{
			text: 'Email',
			value: 'email',
			state: 'info',
		},
		{
			text: 'Courrier',
			value: 'courrier',
			state: 'success',

		},
		{
			text: 'SMS',
			value: 'sms',
			state: 'error',
		},

		{
			text: 'Telephone',
			value: 'telephone',
			state: 'warning',
		},

	]

</script>

<template>
	<ChipList
		:items="items"
		:overflow-limit="5"
	/>
</template>
