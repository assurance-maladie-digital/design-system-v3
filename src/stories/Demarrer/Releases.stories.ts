import axios from 'axios'
import { onMounted, ref } from 'vue'
import * as marked from 'marked'
import SyAlert from '../../components/SyAlert/SyAlert.vue'

type GitHubRelease = {
	id: number
	name?: string
	tag_name?: string
	published_at: string
	body: string
}

export default {
	title: 'Démarrer/Releases',
	component: SyAlert,
}
export const List = {
	render: () => {
		return {
			components: { SyAlert },
			setup() {
				const releases = ref<GitHubRelease[]>([])
				const errorMessage = ref('')

				const fetchReleases = async () => {
					try {
						const { data } = await axios.get('https://api.github.com/repos/assurance-maladie-digital/design-system-v3/releases')
						releases.value = data
					}
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					catch (error) {
						errorMessage.value = 'Une erreur est survenue lors de la récupération des releases.'
					}
				}

				const formatDate = (date: string | number | Date) => {
					return new Date(date).toLocaleDateString()
				}

				const formatMarkdown = (markdown: string) => {
					return marked.parse(markdown)
				}

				const isStarterKitNoticeRelease = (release: GitHubRelease) => {
					return [release.name, release.tag_name].some(value => value?.includes('v1.0.24'))
				}

				onMounted(() => {
					fetchReleases().then(r => r)
				})

				return {
					releases,
					errorMessage,
					formatDate,
					formatMarkdown,
					isStarterKitNoticeRelease,
				}
			},
			template: `
			   <div class="d-flex justify-space-between align-center">
                  <h1 class="title font-weight-medium mb-5">Releases</h1>
              </div>
				<div class="releases">
					<SyAlert type="info" variant="tonal" :closable="false">
						<template #default>Nous faisons des nouvelles release (correction de bugs ou nouvelles fonctionnalités) régulièrement. Vous pouvez retrouver la liste des dernières releases ci-dessous.</template>
					</SyAlert>
					<SyAlert type="info" variant="tonal" :closable="false" class="mt-4">
						<template #default>Version Amelipro : alpha</template>
					</SyAlert>
					<div v-if="errorMessage" class="error">{{ errorMessage }}</div>
					<div v-else>
						<div v-for="release in releases" :key="release.id">
							<h2>{{ release.name }} ({{ formatDate(release.published_at) }})</h2>
							<SyAlert v-if="isStarterKitNoticeRelease(release)" type="warning" variant="tonal" :closable="false" class="mt-2 mb-4">
								<template #default>Il est conseillé de faire une montée de version du Starter Kit en 2.0.32</template>
							</SyAlert>
							<div v-html="formatMarkdown(release.body)"></div>
							<hr>
						</div>
					</div>
				</div>
			`,
		}
	},
	tags: ['!dev'],
}
