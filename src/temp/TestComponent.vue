<script setup lang="ts">
	import { computed } from 'vue'
	import { VBtn } from 'vuetify/components/VBtn'

	const props = withDefaults(defineProps<{
		prop1?: string
		number1: number
		number2: number
	}>(), {

		prop1: 'default value',
	})

	defineEmits([
		'click',
	])

	const value = defineModel< string >()
	const result = computed(() => {
		return props.number1 + props.number2
	})
</script>

<template>
	<div>
		{{ prop1 }}
	</div>
	<v-btn @click="$emit('click', result)">
		click me
	</v-btn>
	<div>
		Result : {{ result }}
	</div>
	<div>{{ value }}</div>
</template>

<style lang="scss" scoped></style>
