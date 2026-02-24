import type { Meta, StoryObj } from '@storybook/vue3'
import LineChart from './LineChart.vue'

const meta: Meta<typeof LineChart> = {
	title: 'Composants/Données/Charts/LineChart',
	component: LineChart,
	parameters: {
		layout: 'fullscreen',
	},
	argTypes: {
		chartData: {
			control: { type: 'object' },
			description: 'Données du graphique linéaire',
		},
		chartOptions: {
			control: { type: 'object' },
			description: 'Options Chart.js',
		},
	},
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	parameters: {
		a11y: { disable: true },
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <LineChart
    :chart-data="chartData"
    :chart-options="chartOptions"
  />
</template>
`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
const chartData = {
	labels: ['Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre'],
	datasets: [
		{
			label: 'A',
			data: [520, 610, 480, 620, 590, 740, 480],
			borderColor: '#6C4CFF',
			backgroundColor: '#6C4CFF',
			borderWidth: 3,
			tension: 0.45,
			pointRadius: 0,
		},
		{
			label: 'A (last month)',
			data: [650, 700, 620, 680, 660, 780, 620],
			borderColor: '#6C4CFF',
			borderDash: [4, 4],
			borderWidth: 2,
			tension: 0.45,
			pointRadius: 0,
		},
		{
			label: 'B',
			data: [150, 180, 300, 330, 290, 210, 140],
			borderColor: '#12B8A6',
			backgroundColor: '#12B8A6',
			borderWidth: 3,
			tension: 0.45,
			pointRadius: 0,
		},
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

const chartOptions = {
	responsive: true,
	maintainAspectRatio: false,
	plugins: {
		legend: {
				position: 'bottom',
				labels: {
					usePointStyle: false,
					boxHeight: 1,
					boxWidth: 30,
				},
			},
		tooltip: { mode: 'index', intersect: false },
	},
	scales: {
		x: { grid: { display: false } },
		y: { position: 'right', grid: { color: '#E5E7EB' } },
	},
}
</script>
`,
			},
		],
	},
	args: {
		chartData: {
			labels: ['Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre'],
			datasets: [
				{
					label: 'A',
					data: [520, 610, 480, 620, 590, 740, 480],
					borderColor: '#6C4CFF',
					backgroundColor: '#6C4CFF',
					borderWidth: 3,
					tension: 0.45,
					pointRadius: 0,
				},
				{
					label: 'A (last month)',
					data: [650, 700, 620, 680, 660, 780, 620],
					borderColor: '#6C4CFF',
					borderDash: [4, 4],
					borderWidth: 2,
					tension: 0.45,
					pointRadius: 0,
				},
				{
					label: 'B',
					data: [150, 180, 300, 330, 290, 210, 140],
					borderColor: '#12B8A6',
					backgroundColor: '#12B8A6',
					borderWidth: 3,
					tension: 0.45,
					pointRadius: 0,
				},
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
		},
		chartOptions: {
			responsive: true,
			maintainAspectRatio: false,
			plugins: {
				legend: {
					position: 'bottom',
					labels: {
						usePointStyle: false,
						boxHeight: 1,
						boxWidth: 30,
					},
				}, tooltip: { mode: 'index', intersect: false },
			},
			scales: {
				x: { grid: { display: false } },
				y: { position: 'right', grid: { color: '#E5E7EB' } },
			},
		},
	},
	render: args => ({
		components: { LineChart },
		setup() {
			return { args }
		},
		template: `
			<div style="width: 800px; height: 400px">
				<LineChart v-bind="args" />
			</div>
		`,
	}),
}
