<script setup lang="ts">
	import { ref } from 'vue'
	import { SyTextField } from '@/components'
	const selectedValue = ref('')


	const customRules = [{
		type: 'custom',
		options: {
			validate: async (value: string) => {
				return fetch(`https://pokeapi.co/api/v2/pokemon/${value}/`)
					.then((response) => {
						console.log('API response status:', response.status, response.ok)
						return response.ok
					})
			},
			message: 'This Pokemon does not exist.',
		},
	}]

</script>

<template>
	<div class="ma-8">
		<h1 class="text-2xl font-bold mb-4">
			Playground
		</h1>
		<SyTextField
			v-model="selectedValue"
			label="Pokemon Name"
			:custom-rules="customRules"
		/>
	</div>
</template>
