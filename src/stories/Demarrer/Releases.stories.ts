import axios from 'axios'
import { onMounted, ref } from 'vue'
import * as marked from 'marked'
import SyAlert from '../../components/SyAlert/SyAlert.vue'

export default {
	title: 'Démarrer/Releases',
	component: SyAlert,
}
export const List = {
	render: () => {
		return {
			components: { SyAlert },
			setup() {
				const releases = ref([])

				const fetchReleases = async () => {
					const { data } = await axios.get('https://api.github.com/repos/assurance-maladie-digital/design-system-v3/releases')
					releases.value = data
				}

				const formatDate = (date: string | number | Date) => {
					return new Date(date).toLocaleDateString()
				}

				const formatMarkdown = (markdown: string) => {
					return marked.parse(markdown)
				}

				onMounted(() => {
					fetchReleases().then(r => r)
				})

				return {
					releases,
					formatDate,
					formatMarkdown,
				}
			},
			template: `
				<div class="releases">
					<SyAlert type="info" variant="tonal" :closable="false">
						<template #default>Nous faisons des nouvelles release (correction de bugs ou nouvelles fonctionnalités) régulièrement. Vous pouvez retrouver la liste des dernières releases ci-dessous.</template>
					</SyAlert>
					<div v-for="release in releases" :key="release.id">
						<h2>{{ release.name }} ({{ formatDate(release.published_at) }})</h2>
						<div v-html="formatMarkdown(release.body)"></div>
						<hr>
					</div>
				</div>
			`,
		}
	},
	tags: ['!dev'],
}
