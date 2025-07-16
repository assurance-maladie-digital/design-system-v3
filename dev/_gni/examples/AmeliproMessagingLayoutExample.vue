<script setup lang="ts">
	/* eslint-disable no-console */
	import AmeliproMessagingLayout from '@/components/Amelipro/AmeliproMessagingLayout/AmeliproMessagingLayout.vue'
	import { type MessagingMenuTypes } from '@/components/Amelipro/AmeliproMessagingLayout/types'
	import { ref } from 'vue'

	interface IAmeliproMessagingLayoutProps {
		items?: MessagingMenuTypes[]
		mainContentBg?: string
		menuWidth?: string
		newMessageDisable?: boolean
		secondaryBtnLabel?: string
		uniqueId: string
	}

	const theComponent = ref<typeof AmeliproMessagingLayout>()

	const valueA = (): IAmeliproMessagingLayoutProps => ({ uniqueId: 'unique-id-a' })

	const valueB = (): IAmeliproMessagingLayoutProps => ({ uniqueId: 'unique-id-b', secondaryBtnLabel: 'Secondary action' })

	const valueC = (): IAmeliproMessagingLayoutProps => ({
		items: [
			{
				icon: 'utilisateur',
				label: 'Messages',
				to: '#messages',
				unreadNumber: 5,
			},
			{
				icon: 'structures',
				label: 'Notifications',
				to: '#notifications',
				unreadNumber: 2,
			},
			{
				icon: 'applications',
				label: 'Settings',
				to: '#settings',
				unreadNumber: 0,
			},
		],
		mainContentBg: 'ap-blue darken-2',
		secondaryBtnLabel: 'SOS ijklmnop qrstuv wxyz',
		uniqueId: 'unique-id-c',
	})

	const dataTest = ref<IAmeliproMessagingLayoutProps>(valueA())
	const values: Record<string, () => IAmeliproMessagingLayoutProps> = {
		A: valueA,
		B: valueB,
		C: valueC,
	}
	const selectData = (key: string): void => {
		dataTest.value = values[key]()
	}

	const onNewMessage = (event: MouseEvent): void => {
		console.log('New message button clicked', event)
	}

	const onSecondaryBtn = (event: MouseEvent): void => {
		console.log('Secondary button clicked', event)
	}
</script>

<template>
	<section>
		<h2>AmeliproMessagingLayout</h2>
		<p class="data-selector-wrapper">
			Set props data :
			<button @click="selectData('A')">
				Data set A (reset)
			</button> | <button @click="selectData('B')">
				Data set B
			</button> | <button @click="selectData('C')">
				Data set C
			</button>
		</p>
		<div class="component-wrapper">
			<AmeliproMessagingLayout
				v-bind="dataTest"
				ref="theComponent"
				@click-new-message="onNewMessage"
				@click-secondary-btn="onSecondaryBtn"
			/>
		</div>
	</section>
</template>

<style scoped>

</style>
