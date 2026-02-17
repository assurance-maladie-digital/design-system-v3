<script lang="ts" setup>
	import { ref, onMounted, nextTick } from 'vue'
	import { Scatter } from 'vue-chartjs'
	import {
		Chart as ChartJS,
		Title,
		Tooltip,
		Legend,
		PointElement,
		LinearScale,
	} from 'chart.js'
	import type { ChartComponentRef } from 'vue-chartjs'
	import type { ChartData } from 'chart.js'

	// Enregistrement Chart.js
	ChartJS.register(
		Title,
		Tooltip,
		Legend,
		PointElement,
		LinearScale,
	)

	// Définition des props pour accepter les données et options dynamiques
	const props = defineProps({
		chartData: {
			type: Object as () => ChartData<'scatter'>,
			required: true,
			default: () => ({
				labels: ['Default Label 1', 'Default Label 2'],
				datasets: [
					{
						label: 'Default Dataset',
						data: [10, 20],
						backgroundColor: '#0c419a',
					},
				],
			}),
		},
		chartOptions: {
			type: Object,
			required: true,
			default: () => ({
				responsive: true,
				plugins: {
					legend: {
						display: true,
					},
					title: {
						display: true,
						text: 'Default Chart Title',
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
			const canvas = chartRef.value.chart.canvas
			canvas.setAttribute('role', 'img')
			canvas.setAttribute('aria-label', 'Scatter chart')
		}
	})
</script>

<template>
	<Scatter
		ref="chartRef"
		:data="props.chartData"
		:options="chartOptions"
	/>
</template>
