<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<!-- eslint-disable no-console -->
<script setup lang="ts">
	import { ref } from 'vue'
	import AmeliproMailTile from '@/components/Amelipro/AmeliproMailTile/AmeliproMailTile.vue'
	import type { AmeliproMailTileType } from '@/components/Amelipro/AmeliproMailTile/types'

	interface IAmeliproMailTileProps {
		editable?: boolean
		mailInfo: AmeliproMailTileType
		uniqueId: string
	}

	const ameliproMailTile = ref<typeof AmeliproMailTile>()

	const valueA = (): IAmeliproMailTileProps => ({
		mailInfo: {
			// commentValue?: boolean
			mailObject: 'Mail object A',
			messageInfoFirstLine: 'Message info first line A',
			messageInfoSecondLine: 'Message info second line A',
			// messageInfoThirdLine?: string
			date: '2023-10-01',
			hour: '12:00',
		// href?: string
		// to?: RouteLocationRaw
		// readValue?: boolean
		}, uniqueId: 'the-unique-id-a',
	})

	const valueB = (): IAmeliproMailTileProps => ({
		mailInfo: {
			// commentValue?: boolean
			mailObject: 'Mail object B',
			messageInfoFirstLine: 'Message info first line B',
			messageInfoSecondLine: 'Message info second line B',
			messageInfoThirdLine: 'Message info third line B',
			date: '2024-01-01',
			hour: '12:24',
			// href?: string
			// to: {
			//	name: 'Example',
			//	params: { id: '123' },
			// },

			readValue: false,
		}, uniqueId: 'the-unique-id-b',
	})

	const valueC = (): IAmeliproMailTileProps => ({
		mailInfo: {
			commentValue: true,
			mailObject: 'Mail object C',
			messageInfoFirstLine: 'Message info first line C',
			messageInfoSecondLine: 'Message info second line C',
			messageInfoThirdLine: 'Message info third line C',
			date: '2024-01-01',
			hour: '12:24',
			href: '#href-c',
			readValue: false,
		}, uniqueId: 'the-unique-id-c',
	})

	const dataTest = ref<IAmeliproMailTileProps>(valueA())
	const values: Record<string, () => IAmeliproMailTileProps> = {
		A: valueA,
		B: valueB,
		C: valueC,
	}
	const selectData = (key: string): void => {
		dataTest.value = values[key]()
	}

	const onStatusChange = (event: any) => console.info('AmeliproMailTile:onStatusChange', event)
	const onClick = (event: any) => console.info('AmeliproMailTile:onClick', event)
</script>

<template>
	<section>
		<h2>AmeliproMailTile</h2>
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
			<AmeliproMailTile
				v-bind="dataTest"
				ref="ameliproMailTile"
				@status-change="onStatusChange"
				@click="onClick"
			/>
		</div>
	</section>
</template>

<style scoped></style>
