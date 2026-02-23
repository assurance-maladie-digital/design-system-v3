<script lang="ts" setup>
	import { ref, onMounted, nextTick } from 'vue'
	import { Line } from 'vue-chartjs'
	import {
		Chart as ChartJS,
		Title,
		Tooltip,
		Legend,
		LineElement,
		PointElement,
		CategoryScale,
		LinearScale,
	} from 'chart.js'
	import type { ChartComponentRef } from 'vue-chartjs'
	import type { ChartData } from 'chart.js'

	// Enregistrement Chart.js
	ChartJS.register(
		Title,
		Tooltip,
		Legend,
		LineElement,
		PointElement,
		CategoryScale,
		LinearScale,
	)

	// Définition des props pour accepter les données et options dynamiques
	const props = defineProps({
		chartData: {
			type: Object as () => ChartData<'line'>,
			required: true,
			default: () => ({
				labels: [],
				datasets: [
				],
			}),
		},
		chartOptions: {
			type: Object,
			required: true,
			default: () => ({
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: {
						display: true,
						position: 'bottom',
					},
					title: {
						display: false,
						text: '',
					},
					tooltip: {
						mode: 'index',
						intersect: false,
					},
				},
				interaction: {
					mode: 'nearest',
					intersect: false,
				},
				scales: {
					x: {
						grid: {
							display: false,
						},
					},
					y: {
						grid: {
							color: '#eee',
						},
					},
				},
			}),
		},
	})

	const chartRef = ref<ChartComponentRef | null>(null)

	// Accessibilité
	onMounted(async () => {
		await nextTick()
		if (chartRef.value?.chart?.canvas) {
			const canvas = chartRef.value.chart.canvas as HTMLCanvasElement
			canvas.setAttribute('role', 'img')

			const title
				= typeof props.chartOptions.plugins?.title === 'object'
					? props.chartOptions.plugins.title.text
					: 'Line chart'

			canvas.setAttribute('aria-label', title ?? 'Line chart')
			canvas.setAttribute('aria-describedby', 'chart-desc')
		}
	})
</script>

<template>
	<Line
		ref="chartRef"
		:data="chartData"
		:options="chartOptions"
	/>

	<p
		id="chart-desc"
		class="d-sr-only"
	>
		{{
			typeof chartOptions.plugins?.title === 'object'
				? chartOptions.plugins.title.text
				: 'Line chart'
		}}
	</p>
</template>
