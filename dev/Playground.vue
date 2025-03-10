<script lang="ts" setup>
	import { ref } from 'vue'
	import { useTheme } from 'vuetify'
	import { BackBtn } from '@/components'

	const theme = useTheme()
	const currentTheme = ref(theme.global.name.value)

	const toggleTheme = () => {
		currentTheme.value = currentTheme.value === 'cnam' ? 'pa' : 'cnam'
		theme.global.name.value = currentTheme.value
	}
</script>

<template>
	<div>
		<p>Current Theme: {{ currentTheme }}</p>
		<button @click="toggleTheme">
			Toggle Theme
		</button>
		<br>
		<BackBtn to="/home" />
	</div>
</template>
