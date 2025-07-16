<script setup lang="ts">
	/* eslint-disable vuejs-accessibility/label-has-for */
	import AmeliproIllustratedDataTile from '@/components/Amelipro/AmeliproIllustratedDataTile/AmeliproIllustratedDataTile.vue'
	import { ref } from 'vue'

	interface IAmeliproIllustratedDataTileProps {
		iconName?: string
		imgSrc?: string
		labelFirstLine: string
		labelSecondLine: string
		tileInfoColor?: string
		tileMinHeight?: string
		tilePadding?: string
		tileWidth?: string
		titleLevel?: number
		uniqueId?: string
		complementaryInformation?: Array<{ label: string, value?: string }>
	}

	const items = [
		{ label: 'info supp : ', value: '2' },
		{ label: 'info' },
	]

	const ameliproIllustratedDataTile = ref<typeof AmeliproIllustratedDataTile>()

	const valueA = (): IAmeliproIllustratedDataTileProps => ({
		iconName: 'chrono',
		labelFirstLine: 'Label 1',
		labelSecondLine: 'Label 2',
	})

	const valueB = (): IAmeliproIllustratedDataTileProps => ({
		complementaryInformation: items,
		iconName: 'discussion',
		labelFirstLine: 'Ligne 1',
		labelSecondLine: 'Ligne 2',
		tileInfoColor: 'ap-blue darken-1',
		tileMinHeight: '100%',
	})

	const valueC = (): IAmeliproIllustratedDataTileProps => ({
		complementaryInformation: items,
		imgSrc: 'https://placehold.co/60x60',
		labelFirstLine: 'Image',
		labelSecondLine: 'Sans icône',
		tileInfoColor: 'ap-blue darken-1',
		tileMinHeight: '100%',
	})

	const dataTest = ref<IAmeliproIllustratedDataTileProps>(valueA())
	const values: Record<string, () => IAmeliproIllustratedDataTileProps> = {
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
		<h2>AmeliproIllustratedDataTile</h2>
		<p class="data-selector-wrapper">
			Jeu de props :
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
					v-model="dataTest.tileMinHeight"
					false-value=""
					true-value="'100%'"
					type="checkbox"
				>tileMinHeight 100%
			</label>
		</p>
		<div class="component-wrapper d-flex flex-wrap align-center justify-center">
			<AmeliproIllustratedDataTile
				v-bind="dataTest"
				ref="ameliproIllustratedDataTile"
			/>
		</div>
		<h2>Liste</h2>
		<ul class="list-style-none d-flex flex-wrap">
			<li>
				<AmeliproIllustratedDataTile
					:complementary-information="items"
					icon-name="chrono"
					label-first-line="Ligne 1"
					label-second-line="Ligne 2"
					tile-info-color="ap-blue darken-1"
					tile-min-height="100%"
				/>
			</li>

			<li>
				<AmeliproIllustratedDataTile
					:complementary-information="items"
					icon-name="discussion"
					label-first-line="Ligne 1"
					label-second-line="Ligne 2"
					tile-info-color="ap-blue darken-1"
					tile-min-height="100%"
				/>
			</li>

			<li>
				<AmeliproIllustratedDataTile
					:complementary-information="items"
					icon-name="chrono"
					label-first-line="Ligne 1"
					label-second-line="Ligne 2"
					tile-info-color="ap-blue darken-1"
					tile-min-height="100%"
				/>
			</li>

			<li>
				<AmeliproIllustratedDataTile
					icon-name="discussion"
					label-first-line="Ligne 1"
					label-second-line="Ligne 2"
					tile-info-color="ap-blue darken-1"
					tile-min-height="100%"
				/>
			</li>
		</ul>
	</section>
</template>

<style lang="scss" scoped>
li {
	margin: 10px 5px;
	width: calc((100% / 4) - 10px);
}
</style>
