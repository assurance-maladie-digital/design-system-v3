<script lang="ts" setup>
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
</script>
<template>
	<Bar
		id="my-chart-id"
		:options="chartOptions"
		:data="chartData"
	/>
</template>
