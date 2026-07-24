import type { Meta, StoryObj } from '@storybook/vue3-vite'
import DonutChart from '@/components/Chart/DonutChart.vue'

const meta: Meta<typeof DonutChart> = {
	title: 'Éco-conception/Introduction',
	component: DonutChart,
	parameters: {
		layout: 'fullscreen',

	},
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		showTable: false,
		labelHeaderTitle: 'Phase',
		chartData: {
			labels: [
				'Stratégie',
				'Cadrage / Architecture',
				'UX / UI / Dev Front',
				'Dev Back',
				'Maintenance / Run',
			],
			datasets: [
				{
					label: 'Niveau 2 - Avancé',
					data: [9, 21, 43, 12, 18],
					backgroundColor: [
						'#e7dcff',
						'#fff0c8',
						'#f8c7df',
						'#d5f1fb',
						'#f7d8d1',
					],
					borderColor: [
						'#9146ff',
						'#f2ad16',
						'#ed65a4',
						'#55bce5',
						'#bf4937',
					],
					borderWidth: 2,
					weight: 2,
				},
				{
					label: 'Niveau 2',
					data: [1, 1, 1, 1, 1],
					backgroundColor: '#386bb3',
					borderWidth: 0,
					weight: 1.2,
				},
				{
					label: 'Niveau 1 - Essentiel',
					data: [4, 4, 5, 3, 4],
					backgroundColor: [
						'#e7dcff',
						'#fff0c8',
						'#f8c7df',
						'#d5f1fb',
						'#f7d8d1',
					],
					borderColor: [
						'#9146ff',
						'#f2ad16',
						'#ed65a4',
						'#55bce5',
						'#bf4937',
					],
					borderWidth: 1,
					weight: 1,
				},
			],
		},
		chartOptions: {
			responsive: true,
			maintainAspectRatio: false,
			cutout: '22%',
			plugins: {
				legend: {
					display: false,
				},
				title: {
					display: false,
					text: 'Répartition des bonnes pratiques d’écoconception',
				},
			},
		},
	},
	render: args => ({
		components: {
			DonutChart,
		},
		setup() {
			return {
				args,
			}
		},
		template: `
			<div style="width: 100%; height: 560px;">
				<DonutChart v-bind="args" />
                <p>tototot</p>
			</div>
		`,
	}),
	tags: ['!dev'],

}
