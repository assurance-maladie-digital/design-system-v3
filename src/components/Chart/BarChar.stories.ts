import type { Meta, StoryObj } from '@storybook/vue3'
import BarChart from './BarChart.vue'
import pattern from 'patternomaly'

const meta: Meta<typeof BarChart> = {
	title: 'Composants/Données/Charts/BarChart',
	component: BarChart,
	parameters: {
		layout: 'fullscreen',
	},
	argTypes: {
		chartData: {
			control: { type: 'object' },
			description: 'Données du graphique en barres',
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
	<BarChart
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
	labels: ['Mai', 'Juin', 'Juillet', 'Août', 'Sept', 'Oct'],
	datasets: [
		{
			label: 'Légende',
			data: [20, 32, 14, 20, 12, 68],
			backgroundColor: '#0c419a',
			stack: 'total',
			barThickness: 36,
		},
	]
}

const chartOptions = {
	responsive: true,
	maintainAspectRatio: false,
}
</script>
`,
			},
		],
	},
	args: {
		chartData: {
			labels: ['Mai', 'Juin', 'Juillet', 'Août', 'Sept', 'Oct'],
			datasets: [
				{
					label: 'Légende 1',
					data: [20, 32, 14, 20, 12, 68],
					backgroundColor: '#0c419a',
					stack: 'total',
					barThickness: 36,

				},
				{
					label: 'Légende 2',
					data: [22, 18, 40, 8, 33, 10],
					backgroundColor: '#dbe4f3',
					stack: 'total',
					barThickness: 36,

				},
				{
					label: 'Légende 3',
					data: [12, 10, 28, 7, 32, 8],
					backgroundColor: [
						pattern.draw('line', '#ffffff', '#0c419a', 10),
					],
					stack: 'total',
					barThickness: 36,

				},
			],
		},
		chartOptions: {
			responsive: true,
			maintainAspectRatio: false,
		},
	},
	render: args => ({
		components: { BarChart },
		setup() {
			return { args }
		},
		template: `
			<div style="width: 800px; height: 400px">
				<BarChart v-bind="args" />
			</div>
		`,
	}),
}
