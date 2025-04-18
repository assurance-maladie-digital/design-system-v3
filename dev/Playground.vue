<script lang="ts" setup>
	import BarChart from '@/components/BarChart/BarChart.vue'

	const data = {
		labels: ['April', 'May', 'June'],
		datasets: [
			{
				label: 'Revenus',
				data: [50, 30, 70],
				backgroundColor: '#34a853',
			},
		],
	}

	const options = {
		plugins: {
			title: {
				text: 'Graphique des revenus trimestriels',
			},
		},
	}
</script>

<template>
	<div class="d-flex flex-wrap align-center pa-4">
		<BarChart
			:chart-data="data"
			:chart-options="options"
		/>
	</div>
</template>
