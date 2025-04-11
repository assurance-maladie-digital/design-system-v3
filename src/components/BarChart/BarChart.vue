<script lang="ts" setup>
	import { ref, onMounted } from 'vue'
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
	import type { ComponentPublicInstance } from 'vue'

	const chartRef = ref<ComponentPublicInstance<typeof Bar> | null>(null)

	// Enregistrement des composants Chart.js
	ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

	// Données du graphique
	const chartData = {
		labels: ['January', 'February', 'March'],
		datasets: [
			{
				data: [40, 20, 12],
				label: 'Sales',
				backgroundColor: '#0070f3',
			},
		],
	}

	// Options de configuration du graphique
	const chartOptions = {
		responsive: true,
		plugins: {
			legend: {
				display: true,
			},
			title: {
				display: true,
				text: 'Bar Chart',
			},
		},
	}

	onMounted(() => {
		const canvas = chartRef.value?.$el?.querySelector('canvas')
		if (canvas) {
			canvas.setAttribute('role', 'img')
			canvas.setAttribute('aria-label', 'Graphique représentant les ventes par mois pour 2024')
		}
	})
</script>
<template>
	<Bar
		id="my-chart-id"
		ref="chartRef"
		:options="chartOptions"
		:data="chartData"
	/>
</template>
