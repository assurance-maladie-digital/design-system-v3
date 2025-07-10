<script setup lang="ts">
	/* eslint-disable vuejs-accessibility/label-has-for, no-console */
	import AmeliproComponent from '@/components/Amelipro/AmeliproComponent/AmeliproComponent.vue'
	import { ref } from 'vue'

	interface IAmeliproComponentProps {
		ariaRequired?: boolean
		uniqueId: string
	}

	const ameliproComponent = ref<typeof AmeliproComponent>()

	const valueA = (): IAmeliproComponentProps => ({ uniqueId: 'amelipro-component-unique-id-a' })

	const valueB = (): IAmeliproComponentProps => ({ uniqueId: 'amelipro-component-unique-id-b' })

	const valueC = (): IAmeliproComponentProps => ({
		ariaRequired: true,
		uniqueId: 'amelipro-component-unique-id-c',
	})

	const dataTest = ref<IAmeliproComponentProps>(valueA())
	const values: Record<string, () => IAmeliproComponentProps> = {
		A: valueA,
		B: valueB,
		C: valueC,
	}
	const selectData = (key: string): void => {
		dataTest.value = values[key]()
	}

	const onChange = (event: any) => console.info('AmeliproComponent:onChange', event)
</script>

<template>
	<section>
		<h2>AmeliproComponent</h2>
		<p class="data-selector-wrapper">
			Set props data :
			<button @click="selectData('A')">
				Data set A (reset)
			</button> | <button @click="selectData('B')">
				Data set B
			</button> | <button @click="selectData('C')">
				Data set C
			</button>
			-
			<label><input
				v-model="dataTest.ariaRequired"
				type="checkbox"
			> ariaRequired</label>
		</p>
		<div class="component-wrapper">
			<AmeliproComponent
				v-bind="dataTest"
				ref="ameliproComponent"
				@change="onChange"
			/>
		</div>
	</section>
</template>

<style scoped>

</style>
