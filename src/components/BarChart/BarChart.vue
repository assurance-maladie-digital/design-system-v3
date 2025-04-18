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

	// Enregistrement des composants nécessaires de Chart.js
	ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

	// Référence au composant Bar chart
	const chartRef = ref<ChartComponentRef | null>(null)

	// Données du graphique
	const chartData = {
		labels: ['January', 'February', 'March'],
		datasets: [
			{
				label: 'Ventes',
				data: [40, 20, 12],
				backgroundColor: '#0070f3',
			},
		],
	}

	// Options du graphique
	const chartOptions = {
		responsive: true,
		plugins: {
			legend: {
				display: true,
			},
			title: {
				display: true,
				text: 'Graphique des ventes mensuelles',
			},
		},
	}

	// Ajout des attributs d'accessibilité après le rendu
	onMounted(async () => {
		await nextTick() // Attendre que le DOM soit mis à jour
		if (chartRef.value?.chart?.canvas) {
			const canvasEl = chartRef.value.chart.canvas as HTMLCanvasElement
			canvasEl.setAttribute('role', 'img')
			canvasEl.setAttribute(
				'aria-label',
				'Ventes mensuelles pour 2024',
			)
			canvasEl.setAttribute('aria-describedby', 'chart-desc')
		}
	})
</script>

<template>
	<Bar
		ref="chartRef"
		:options="chartOptions"
		:data="chartData"
	/>
	<p
		id="chart-desc"
		class="d-sr-only"
	>
		Graphique représentant les ventes par mois pour 2024. Janvier : 40. Février : 20. Mars : 12.
	</p>
</template>
