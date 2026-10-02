<script lang="ts" setup>
	import { ref, onMounted, nextTick, computed } from 'vue'
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
	import SyTable from '@/components/Tables/SyTable/SyTable.vue'

	// Enregistrement des composants nécessaires de Chart.js
	ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

	// Définition des props pour accepter les données et options dynamiques
	const props = defineProps({
		labelHeaderTitle: {
			type: String,
			default: 'Mois',
		},
		showTable: {
			type: Boolean,
			default: true,
		},
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

	// colonnes
	const tableHeaders = computed(() => {
		const base = [
			{ title: props.labelHeaderTitle, key: 'label' },
		]

		const datasetHeaders = props.chartData.datasets.map((ds, index) => ({
			title: ds.label ?? `Série ${index + 1}`,
			key: `dataset_${index}`,
			align: 'end',
		}))

		return [...base, ...datasetHeaders]
	})

	const tableItems = computed(() =>
		(props.chartData.labels ?? []).map((label, li) => {
			const values = props.chartData.datasets.map((ds, di) => [
				`dataset_${di}`,
				Number(ds.data?.[li] ?? 0),
			])

			return {
				label: String(label),
				...Object.fromEntries(values),
			}
		}),
	)

	// Ajout des attributs d'accessibilité après le rendu
	onMounted(async () => {
		await nextTick()
		if (chartRef.value?.chart?.canvas) {
			const canvasEl = chartRef.value.chart.canvas as HTMLCanvasElement
			canvasEl.setAttribute('role', 'img')
			const title
				= typeof props.chartOptions.plugins?.title === 'object'
					? props.chartOptions.plugins.title.text
					: 'Bar chart'
			canvasEl.setAttribute('aria-label', title ?? 'Bar chart')
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
		{{
			typeof chartOptions.plugins?.title === 'object'
				? chartOptions.plugins.title.text
				: 'Bar chart'
		}}
	</p>

	<SyTable
		v-if="props.showTable"
		suffix="Graphique"
		caption="Historique des données du graphique"
		:headers="tableHeaders"
		:items="tableItems"
		density="compact"
		striped
	/>
</template>
