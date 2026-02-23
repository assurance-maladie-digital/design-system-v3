import type { Meta, StoryObj } from '@storybook/vue3'
import FormChart from './FormChart.vue'

const meta: Meta<typeof FormChart> = {
	title: 'Composants/Données/Charts/FormChart',
	component: FormChart,
	parameters: {
		layout: 'fullscreen',
	},
	argTypes: {
		chartData: {
			control: { type: 'object' },
			description: 'Données du graphique en nuage de points',
		},
		chartOptions: {
			control: { type: 'object' },
			description: 'Options Chart.js pour le graphique',
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
  <FormChart
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
	datasets: [
		{
			label: 'Product A',
			data: [
				{ x: 10, y: 4 }, { x: 22, y: 3.2 }, { x: 25, y: 6.2 },
				{ x: 35, y: 5.9 }, { x: 45, y: 6.0 }, { x: 55, y: 11.8 },
				{ x: 60, y: 9.2 }, { x: 75, y: 11.7 }, { x: 85, y: 10.4 },
				{ x: 105, y: 12.1 },
			],
			backgroundColor: '#6C4CFF',
			pointRadius: 7,
			pointHoverRadius: 8,
			pointStyle: 'circle',
		},
		{
			label: 'Product B',
			data: [
				{ x: 32, y: 9.2 }, { x: 42, y: 8.6 }, { x: 50, y: 10.2 },
				{ x: 65, y: 10.8 }, { x: 80, y: 12.6 }, { x: 78, y: 8.8 },
				{ x: 102, y: 7.2 },
			],
			backgroundColor: '#12B8A6',
			pointRadius: 7,
			pointHoverRadius: 8,
			pointStyle: 'rect',
		},
		{
			label: 'Product C',
			data: [
				{ x: 52, y: 7.5 }, { x: 68, y: 7.8 }, { x: 72, y: 10.0 },
				{ x: 90, y: 8.4 }, { x: 95, y: 11.6 }, { x: 100, y: 10.1 },
				{ x: 110, y: 11.0 },
			],
			backgroundColor: '#F97316',
			pointRadius: 8,
			pointHoverRadius: 9,
			pointStyle: 'triangle',
		},
	],
}

const chartOptions = {
	responsive: true,
	maintainAspectRatio: false,
	plugins: {
		title: { display: true, align: 'start', font: { size: 18, weight: '600' } },
		legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 10 } },
		tooltip: { callbacks: { label: ctx => \`\${ctx.dataset.label}: \${ctx.parsed.y}M€\` } },
	},
	scales: {
		x: { title: { display: true, text: 'Units' }, grid: { color: '#E5E7EB' }, min: 0, max: 125 },
		y: { title: { display: true, text: 'millions €' }, grid: { color: '#E5E7EB' }, min: 0, max: 15, ticks: { stepSize: 5, callback: value => \`\${value}M€\` } },
	},
}
</script>
`,
			},
		],
	},
	args: {
		chartData: {
			datasets: [
				{
					label: 'Product A',
					data: [
						{ x: 10, y: 4 }, { x: 22, y: 3.2 }, { x: 25, y: 6.2 },
						{ x: 35, y: 5.9 }, { x: 45, y: 6.0 }, { x: 55, y: 11.8 },
						{ x: 60, y: 9.2 }, { x: 75, y: 11.7 }, { x: 85, y: 10.4 },
						{ x: 105, y: 12.1 },
					],
					backgroundColor: '#6C4CFF',
					pointRadius: 7,
					pointHoverRadius: 8,
					pointStyle: 'circle',
				},
				{
					label: 'Product B',
					data: [
						{ x: 32, y: 9.2 }, { x: 42, y: 8.6 }, { x: 50, y: 10.2 },
						{ x: 65, y: 10.8 }, { x: 80, y: 12.6 }, { x: 78, y: 8.8 },
						{ x: 102, y: 7.2 },
					],
					backgroundColor: '#12B8A6',
					pointRadius: 7,
					pointHoverRadius: 8,
					pointStyle: 'rect',
				},
				{
					label: 'Product C',
					data: [
						{ x: 52, y: 7.5 }, { x: 68, y: 7.8 }, { x: 72, y: 10.0 },
						{ x: 90, y: 8.4 }, { x: 95, y: 11.6 }, { x: 100, y: 10.1 },
						{ x: 110, y: 11.0 },
					],
					backgroundColor: '#F97316',
					pointRadius: 8,
					pointHoverRadius: 9,
					pointStyle: 'triangle',
				},
			],
		},
		chartOptions: {
			responsive: true,
			maintainAspectRatio: false,
			plugins: {
				title: { display: true, align: 'start', font: { size: 18, weight: '600' } },
				legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 10 } },
				tooltip: { callbacks: { label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.y}M€` } },
			},
			scales: {
				x: { title: { display: true, text: 'Units' }, grid: { color: '#E5E7EB' }, min: 0, max: 125 },
				y: { title: { display: true, text: 'millions €' }, grid: { color: '#E5E7EB' }, min: 0, max: 15, ticks: { stepSize: 5, callback: value => `${value}M€` } },
			},
		},
	},
	render: args => ({
		components: { FormChart },
		setup() {
			return { args }
		},
		template: `
			<div style="width: 800px; height: 400px">
				<FormChart v-bind="args" />
			</div>
		`,
	}),
}
