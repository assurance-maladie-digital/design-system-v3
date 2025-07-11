<script setup lang="ts">
	/* eslint-disable vuejs-accessibility/label-has-for */
	import AmeliproIcon from '@/components/Amelipro/AmeliproIcon/AmeliproIcon.vue'
	import { ref } from 'vue'

	interface IAmeliproIconProps {
		borderColor?: string
		bordered?: boolean
		icon?: string
		iconBgColor?: string
		iconColor: string
		label?: string
		large?: boolean
		mdiPadding?: string
		medium?: boolean
		size?: string
		small?: boolean
		uniqueId?: string
		widthAuto?: boolean
		xLarge?: boolean
	}

	const ameliproIcon = ref<typeof AmeliproIcon>()

	const valueA = (): IAmeliproIconProps => ({
		icon: 'utilisateur',
		iconColor: '#f0c0c0',
		uniqueId: 'amelipro-icon-unique-id-a',
	})

	const valueB = (): IAmeliproIconProps => ({
		icon: 'structures',
		iconColor: '#c0f0c0',
		uniqueId: 'amelipro-icon-unique-id-b',
	})

	const valueC = (): IAmeliproIconProps => ({
		icon: 'applications',
		iconColor: '#c0c0f0',
		uniqueId: 'amelipro-icon-unique-id-c',
	})

	const dataTest = ref<IAmeliproIconProps>(valueA())
	const values: Record<string, () => IAmeliproIconProps> = {
		A: valueA,
		B: valueB,
		C: valueC,
	}
	const selectData = (key: string): void => {
		dataTest.value = values[key]()
	}
</script>

<template>
	<section>
		<h2>AmeliproIcon</h2>
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
				v-model="dataTest.bordered"
				type="checkbox"
			> bordered</label>
		</p>
		<div class="component-wrapper">
			<AmeliproIcon
				v-bind="dataTest"
				ref="ameliproIcon"
			/>
		</div>
	</section>
</template>

<style scoped></style>
