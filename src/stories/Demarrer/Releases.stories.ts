import axios from 'axios'
import { onMounted, shallowRef } from 'vue'
import * as marked from 'marked'
import SyAlert from '../../components/SyAlert/SyAlert.vue'

type GitHubRelease = {
	id: number
	name?: string | null
	tag_name?: string | null
	published_at: string
	body?: string | null
}

type ReleaseAlert = {
	id: string
	releaseVersion: string
	message: string
	type: 'success' | 'info' | 'warning' | 'error'
	variant: 'tonal' | 'outlined'
	link?: { href: string, text: string }
	components?: string[]
}

const releaseAlerts: ReleaseAlert[] = [
	{
		id: 'form-success-messages-hidden',
		releaseVersion: 'v1.1.0',
		message: 'Cette version modifie le comportement des composants de formulaire, les messages de succès sont désormais masqués par défaut. Cette modification répond à la fois à des besoins projets et à l\'harmonisation des différents thèmes (CNAM, PAG, Amelipro).\nPour les projets souhaitant afficher les messages de succès vous pouvez simplement le faire via la prop showSuccessMessages.\nLes composants concernés sont :',
		type: 'warning',
		variant: 'tonal',
		components: [
			'SyTextField',
			'SyTextArea',
			'SyAutocomplete',
			'SySelect',
			'SyCheckbox',
			'SyCheckBoxGroup',
			'SyRadioGroup',
			'DatePicker',
			'PeriodField',
			'MonthPicker',
			'LunarCalendar',
			'PeriodField',
			'NirField',
			'PasswordField',
			'PhoneField',
			'Captcha',
		],
	},
	{
		id: 'node-18-decommission',
		releaseVersion: 'v1.1.0',
		message: 'En lien avec le Starter Kit, fin de support de Node 18.',
		type: 'warning',
		variant: 'tonal',
	},
	{
		id: 'tokens-simplification',
		releaseVersion: 'v1.0.27',
		message: 'Nous avons procédé à une simplification des tokens contraint par l\'ajout du thème Amelipro, merci de vous référer à la page des ',
		type: 'warning',
		variant: 'tonal',
		link: { href: '/?path=/docs/design-tokens-couleurs--docs', text: 'couleurs' },
	},
	{
		id: 'starter-kit-2-0-35',
		releaseVersion: 'v1.0.27',
		message: 'Il est conseillé de faire une montée de version du Starter Kit en 2.0.35',
		type: 'warning',
		variant: 'tonal',
	},
	{
		id: 'starter-kit-2-0-33',
		releaseVersion: 'v1.0.25',
		message: 'Il est conseillé de faire une montée de version du Starter Kit en 2.0.33',
		type: 'warning',
		variant: 'tonal',
	},
	{
		id: 'starter-kit-2-0-32',
		releaseVersion: 'v1.0.24',
		message: 'Il est conseillé de faire une montée de version du Starter Kit en 2.0.32',
		type: 'warning',
		variant: 'tonal',
	},
]

export default {
	title: 'Démarrer/Releases',
	component: SyAlert,
}
export const List = {
	render: () => {
		return {
			components: { SyAlert },
			setup() {
				const releases = shallowRef<GitHubRelease[]>([])
				const errorMessage = shallowRef('')

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

				const formatMarkdown = (markdown?: string | null) => {
					const html = marked.parse(markdown ?? '') as string
					return html.replace(/<blockquote>[\s\S]*?<\/blockquote>/g, '')
				}

				const getReleaseAlerts = (release: GitHubRelease) => {
					return releaseAlerts.filter(alert =>
						[release.name, release.tag_name].some(value => value?.includes(alert.releaseVersion)),
					)
				}

				onMounted(() => {
					fetchReleases().then(r => r)
				})

				return {
					releases,
					errorMessage,
					formatDate,
					formatMarkdown,
					getReleaseAlerts,
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
							<SyAlert
								v-for="alert in getReleaseAlerts(release)"
								:key="alert.id"
								:type="alert.type"
								:variant="alert.variant"
								:closable="false"
								class="mt-2 mb-4"
							>
								<template #default><span style="white-space: pre-line">{{ alert.message }}</span><template v-if="alert.link"> <a :href="alert.link.href">{{ alert.link.text }}</a>.</template><ul v-if="alert.components" class="mt-2 ml-4" style="column-count: 3; max-width: 42rem;"><li v-for="component in alert.components" :key="component">{{ component }}</li></ul></template>
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
