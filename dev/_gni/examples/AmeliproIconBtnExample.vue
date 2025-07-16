<script setup lang="ts">
	/* eslint-disable vuejs-accessibility/label-has-for */
	import AmeliproIconBtn from '@/components/Amelipro/AmeliproIconBtn/AmeliproIconBtn.vue'
	import { ref } from 'vue'

	interface IAmeliproIconBtnProps {
		btnLabel?: string
		btnTitle?: string
		icon: string
		iconBgColor?: string
		iconColor: string
		iconHoverBgColor?: string
		iconHoverColor: string
		xLarge?: boolean
		bordered?: boolean
		badge?: boolean | number | string
	}

	const ameliproIconBtn = ref<typeof AmeliproIconBtn>()

	const valueA = (): IAmeliproIconBtnProps => ({
		btnLabel: 'informations utilisateur',
		icon: 'utilisateur',
		iconBgColor: 'ap-blue-darken-1',
		iconColor: 'ap-white',
		iconHoverBgColor: 'ap-blue-darken-2',
		iconHoverColor: 'ap-white',
		xLarge: true,
	})

	const valueB = (): IAmeliproIconBtnProps => ({
		bordered: true,
		icon: 'structures',
		iconBgColor: 'ap-blue-darken-1',
		iconColor: 'ap-white',
		iconHoverBgColor: 'ap-blue-darken-2',
		iconHoverColor: 'ap-white',
	})

	const valueC = (): IAmeliproIconBtnProps => ({
		badge: 3,
		icon: 'applications',
		iconBgColor: 'ap-red-darken-1',
		iconColor: 'ap-white',
		iconHoverBgColor: 'ap-red-darken-2',
		iconHoverColor: 'ap-white',
		xLarge: true,
	})

	const dataTest = ref<IAmeliproIconBtnProps>(valueA())
	const values: Record<string, () => IAmeliproIconBtnProps> = {
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
		<h2>AmeliproIconBtn</h2>
		<p class="data-selector-wrapper">
			Set props data :
			<button @click="selectData('A')">
				Set A (reset)
			</button> |
			<button @click="selectData('B')">
				Set B
			</button> |
			<button @click="selectData('C')">
				Set C
			</button>
			-
			<label>
				<input
					v-model="dataTest.xLarge"
					type="checkbox"
				>xLarge
			</label>
			<label class="ml-2">
				<input
					v-model="dataTest.bordered"
					type="checkbox"
				>bordered
			</label>
		</p>
		<div class="component-wrapper">
			<AmeliproIconBtn
				v-bind="dataTest"
				ref="ameliproIconBtn"
			/>
		</div>
	</section>
</template>

<style scoped></style>
