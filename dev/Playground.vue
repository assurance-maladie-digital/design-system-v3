<script lang="ts" setup>
	import BarChart from '@/components/Chart/BarChart.vue'
	import LineChart from '@/components/Chart/LineChart.vue'
	import FormChart from '@/components/Chart/FormChart.vue'

	const formData = {
		datasets: [
			// Product A — Violet ●
			{
				label: 'Product A',
				data: [
					{ x: 10, y: 4 },
					{ x: 22, y: 3.2 },
					{ x: 25, y: 6.2 },
					{ x: 35, y: 5.9 },
					{ x: 45, y: 6.0 },
					{ x: 55, y: 11.8 },
					{ x: 60, y: 9.2 },
					{ x: 75, y: 11.7 },
					{ x: 85, y: 10.4 },
					{ x: 105, y: 12.1 },
				],
				backgroundColor: '#6C4CFF',
				pointRadius: 7,
				pointHoverRadius: 8,
				pointStyle: 'circle',
			},

			// Product B — Vert ■
			{
				label: 'Product B',
				data: [
					{ x: 32, y: 9.2 },
					{ x: 42, y: 8.6 },
					{ x: 50, y: 10.2 },
					{ x: 65, y: 10.8 },
					{ x: 80, y: 12.6 },
					{ x: 78, y: 8.8 },
					{ x: 102, y: 7.2 },
				],
				backgroundColor: '#12B8A6',
				pointRadius: 7,
				pointHoverRadius: 8,
				pointStyle: 'rect',
			},

			// Product C — Orange ▲
			{
				label: 'Product C',
				data: [
					{ x: 52, y: 7.5 },
					{ x: 68, y: 7.8 },
					{ x: 72, y: 10.0 },
					{ x: 90, y: 8.4 },
					{ x: 95, y: 11.6 },
					{ x: 100, y: 10.1 },
					{ x: 110, y: 11.0 },
				],
				backgroundColor: '#F97316',
				pointRadius: 8,
				pointHoverRadius: 9,
				pointStyle: 'triangle',
			},
		],
	}
	const dataBar = {
		labels: ['Mai 2023', 'Juin 2023', 'Juillet 2023', 'Août 2023', 'Sept 2023', 'Oct 2023'],
		datasets: [
			{
				label: 'Légende',
				data: [20, 32, 14, 20, 12, 68],
				backgroundColor: '#0c419a',
				stack: 'total',
				barThickness: 36,
			},
			{
				label: 'Légende',
				data: [22, 18, 40, 8, 33, 10],
				backgroundColor: '#dbe4f3',
				stack: 'total',
				barThickness: 36,
			},
			{
				label: 'Légende',
				data: [12, 10, 28, 7, 32, 8],
				backgroundColor: 'transparent',
				borderColor: '#0c419a',
				borderWidth: 2,
				borderDashOffset: 40,
				stack: 'total',
				barThickness: 36,
			},
		],
	}

	const optionsBar = {
		responsive: true,
		scales: {
			x: {
				stacked: true,
				grid: {
					display: false,
				},
				border: {
					display: false,
				},
			},
			y: {
				stacked: true,
				beginAtZero: true,
				grid: {
					color: '#e5e7eb',
					drawBorder: false,
				},
				ticks: {
					color: '#6b7280',
				},
			},
		},
		plugins: {
			legend: {
				position: 'top',
				align: 'start',
				labels: {
					boxWidth: 14,
					color: '#0c419a',
				},
			},
			title: {
				display: true,
				text: 'Titre du graphique',
				color: '#0c419a',
				font: {
					size: 20,
					weight: 'bold',
				},
			},
		},
	}

	const lineOptions = {
		responsive: true,
		maintainAspectRatio: false,

		plugins: {
			legend: {
				position: 'bottom',
				labels: {
					usePointStyle: true,
					boxWidth: 8,
					boxHeight: 8,
				},
			},
			tooltip: {
				mode: 'index',
				intersect: false,
			},
			title: {
				display: false,
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
					drawBorder: false,
				},
				ticks: {
					color: '#6B7280',
				},
			},
			y: {
				position: 'right',
				grid: {
					color: '#E5E7EB',
					drawBorder: false,
				},
				ticks: {
					stepSize: 250,
					color: '#6B7280',
				},
			},
		},
	}

	const formOptions = {
		responsive: true,
		maintainAspectRatio: false,

		plugins: {
			title: {
				highlight: false,
				display: true,
				align: 'start',
				font: {
					size: 18,
					weight: '600',
				},
			},
			legend: {
				position: 'bottom',
				labels: {
					usePointStyle: true,
					boxWidth: 10,
				},
			},
			tooltip: {
				callbacks: {
					label: ctx =>
						` ${ctx.dataset.label}: ${ctx.parsed.y}M€`,
				},
			},
		},

		scales: {
			x: {
				title: {
					display: true,
					text: 'Units',
				},
				grid: {
					color: '#E5E7EB',
				},
				min: 0,
				max: 125,
			},
			y: {
				title: {
					display: true,
					text: 'millions €',
				},
				grid: {
					color: '#E5E7EB',
				},
				min: 0,
				max: 15,
				ticks: {
					stepSize: 5,
					callback: value => `${value}M€`,
				},
			},
		},
	}

	const lineData = {
		labels: ['Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre'],
		datasets: [
			// violet pleinn
			{
				label: 'A',
				data: [520, 610, 480, 620, 590, 740, 480],
				borderColor: '#6C4CFF',
				backgroundColor: '#6C4CFF',
				borderWidth: 3,
				tension: 0.45,
				pointRadius: 0,
			},

			// violet pointillé
			{
				label: 'A (last month)',
				data: [650, 700, 620, 680, 660, 780, 620],
				borderColor: '#6C4CFF',
				borderDash: [4, 4],
				borderWidth: 2,
				tension: 0.45,
				pointRadius: 0,
			},

			// vert normal
			{
				label: 'B',
				data: [150, 180, 300, 330, 290, 210, 140],
				borderColor: '#12B8A6',
				backgroundColor: '#12B8A6',
				borderWidth: 3,
				tension: 0.45,
				pointRadius: 0,
			},

			// vert pointillé
			{
				label: 'B (last month)',
				data: [260, 280, 360, 380, 340, 310, 270],
				borderColor: '#12B8A6',
				borderDash: [4, 4],
				borderWidth: 2,
				tension: 0.45,
				pointRadius: 0,
			},
		],
	}
</script>

<template>
	<div
		class="d-flex flex-wrap align-center pa-4"
		style="height: 600px; width: 800px;"
	>
		<BarChart
			:chart-data="dataBar"
			:chart-options="optionsBar"
		/>

		<LineChart
			:chart-data="lineData"
			:chart-options="lineOptions"
		/>

		<FormChart
			:chart-data="formData"
			:chart-options="formOptions"
		/>
	</div>
</template>
