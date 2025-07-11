<script setup lang="ts">
	/* eslint-disable vuejs-accessibility/label-has-for, no-console */
	import AmeliproMessage from '@/components/Amelipro/AmeliproMessage/AmeliproMessage.vue'
	import { ref } from 'vue'

	interface IAmeliproMessageProps {
		alignStart?: boolean
		borderLeftMessage?: boolean
		borderLeftMessageBackground?: string
		borderLeftMessageTitle?: string
		color?: string
		dark?: boolean
		dismissible?: boolean
		icon?: string
		iconBgColor?: string
		iconColor?: string
		maxWidth?: string
		noIcon?: boolean
		text?: boolean
		textColor?: string
		type?: 'info' | 'error' | 'warning' | 'success'
		uniqueId?: string
		value?: boolean
		width?: string
	}

	const ameliproMessage = ref<typeof AmeliproMessage>()

	const valueA = (): IAmeliproMessageProps => ({ })

	const valueB = (): IAmeliproMessageProps => ({
		alignStart: true,
		borderLeftMessage: true,
		borderLeftMessageBackground: 'ap-grey lighten-6',
		borderLeftMessageTitle: 'Border left message title',
		color: 'ap-blue',
		dark: true,
		dismissible: true,
		icon: 'mdi-alert-circle-outline',
		iconBgColor: 'ap-blue',
		iconColor: 'ap-white',
		maxWidth: '300px',
		noIcon: false,
		text: true,
		textColor: 'ap-blue',
		type: 'info',
		value: true,
		width: '100%',
	})

	const valueC = (): IAmeliproMessageProps => ({
		alignStart: false,
		borderLeftMessage: false,
		borderLeftMessageBackground: 'ap-red lighten-6',
		borderLeftMessageTitle: 'Other left message title',
		color: 'ap-red',
		dark: false,
		dismissible: false,
		icon: 'mdi-alert-circle-outline',
		iconBgColor: 'ap-red',
		iconColor: 'ap-white',
		maxWidth: '250px',
		noIcon: true,
		text: false,
		textColor: 'ap-red',
		type: 'error',
		value: false,
		width: '100%',
	})

	const dataTest = ref<IAmeliproMessageProps>(valueA())
	const values: Record<string, () => IAmeliproMessageProps> = {
		A: valueA,
		B: valueB,
		C: valueC,
	}
	const selectData = (key: string): void => {
		dataTest.value = values[key]()
	}

	const onClickClose = (event: any) => console.info('AmeliproMessage:onClickClose', event)
</script>

<template>
	<section>
		<h2>AmeliproMessage</h2>
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
				v-model="dataTest.noIcon"
				type="checkbox"
			> noIcon</label>
		</p>
		<div class="component-wrapper">
			<AmeliproMessage
				v-bind="dataTest"
				ref="ameliproMessage"
				@click:close="onClickClose"
			/>
		</div>
	</section>
</template>

<style scoped>

</style>
