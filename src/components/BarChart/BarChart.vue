<script lang="ts" setup>
	import { ref, onMounted, nextTick } from 'vue'
	import { Bar } from 'vue-chartjs'
	import {
		Chart as ChartJS,
		Title,
		Tooltip,
		Legend,
		BarElement,
		CategoryScale,
		LinearScale,
	} from 'chart.js'
	import type { ChartComponentRef } from 'vue-chartjs'
	import type { ChartData } from 'chart.js'

	// Enregistrement des composants nécessaires de Chart.js
	ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

	// Définition des props pour accepter les données et options dynamiques
	const props = defineProps({
		chartData: {
			type: Object as () => ChartData<'bar'>,
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

	// Référence au composant Bar chart
	const chartRef = ref<ChartComponentRef | null>(null)

	// Ajout des attributs d'accessibilité après le rendu
	onMounted(async () => {
		await nextTick()
		if (chartRef.value?.chart?.canvas) {
			const canvasEl = chartRef.value.chart.canvas as HTMLCanvasElement
			canvasEl.setAttribute('role', 'img')
			canvasEl.setAttribute('aria-label', props.chartOptions.plugins.title.text)
			canvasEl.setAttribute('aria-describedby', 'chart-desc')
		}
	})
</script>

<template>
	<Bar
		ref="chartRef"
		:options="props.chartOptions"
		:data="props.chartData"
	/>
	<p
		id="chart-desc"
		class="d-sr-only"
	>
		{{ props.chartOptions.plugins.title.text }}
	</p>
</template>
