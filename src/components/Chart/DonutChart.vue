<script lang="ts" setup>
	import { computed, nextTick, onMounted, ref } from 'vue'
	import { Doughnut } from 'vue-chartjs'
	import {
		ArcElement,
		Chart as ChartJS,
		Legend,
		Title,
		Tooltip,
	} from 'chart.js'
	import type {
		ChartData,
		ChartOptions,
	} from 'chart.js'
	import type { ChartComponentRef } from 'vue-chartjs'

	interface DonutChartProps {
		labelHeaderTitle?: string
		showTable?: boolean
		chartData?: ChartData<'doughnut'>
		chartOptions?: ChartOptions<'doughnut'>
	}
	// Enregistrement des composants nécessaires de Chart.js
	ChartJS.register(
		Title,
		Tooltip,
		Legend,
		ArcElement,
	)

	// Définition des props pour accepter les données et options dynamiques
	const props = withDefaults(defineProps<DonutChartProps>(), {
		labelHeaderTitle: 'Catégorie',
		showTable: false,

		chartData: () => ({
			labels: [
				'Catégorie 1',
				'Catégorie 2',
				'Catégorie 3',
			],
			datasets: [
				{
					label: 'Valeurs',
					data: [10, 20, 30],
					backgroundColor: [
						'#0c419a',
						'#6e8fc4',
						'#dbe4f3',
					],
				},
			],
		}),

		chartOptions: () => ({
			responsive: true,
			maintainAspectRatio: false,
			plugins: {
				legend: {
					display: true,
				},
				title: {
					display: true,
					text: 'Graphique en anneau',
				},
			},
		}),
	})

	// Référence au composant Doughnut
	const chartRef = ref<ChartComponentRef | null>(null)

	const chartTitle = computed(() => {
		const titleOptions = props.chartOptions.plugins?.title

		if (
			typeof titleOptions === 'object'
			&& titleOptions !== null
			&& 'text' in titleOptions
		) {
			const title = titleOptions.text

			if (Array.isArray(title)) {
				return title.join(' ')
			}

			return title ?? 'Graphique en anneau'
		}

		return 'Graphique en anneau'
	})

	// Ajout des attributs d’accessibilité après le rendu
	onMounted(async () => {
		await nextTick()

		const canvasEl = chartRef.value?.chart?.canvas

		if (!canvasEl) {
			return
		}

		canvasEl.setAttribute('role', 'img')
		canvasEl.setAttribute('aria-label', String(chartTitle.value))
		canvasEl.setAttribute('aria-describedby', 'donut-chart-desc')
	})
</script>

<template>
	<div class="donut-chart">
		<div class="donut-chart__canvas">
			<Doughnut
				ref="chartRef"
				:options="props.chartOptions"
				:data="props.chartData"
			/>
		</div>
	</div>
</template>

<style scoped lang="scss">
.donut-chart {
	display: flex;
	flex-direction: column;
	gap: 24px;
	width: 100%;
}

.donut-chart__canvas {
	position: relative;
	width: 100%;
	min-height: 400px;
}

.donut-chart__center {
	position: absolute;
	top: 50%;
	left: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100px;
	height: 100px;
	border-radius: 50%;
	font-size: 1.1rem;
	font-weight: 700;
	text-align: center;
	pointer-events: none;
	transform: translate(-50%, -50%);
}
</style>
