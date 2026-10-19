import axios from 'axios'
import { onMounted, shallowRef } from 'vue'
import * as marked from 'marked'
import SyAlert from '../../components/SyAlert/SyAlert.vue'
import { sanitizeHtml } from './sanitizeHtml'

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
		id: 'syform-validation-behavior',
		releaseVersion: 'v1.2.0',
		message: 'Changements de comportement du SyForm. Ce sont des corrections, mais un projet existant peut les percevoir comme des régressions : vérifiez vos formulaires après la montée de version.\n- Le v-model du SyForm est tri-état (true / false / null) : il vaut null tant que la validité n\'est pas connue, au lieu de false. Un formulaire sans champ Synapse suit l\'état du VForm au lieu de valoir true.\n- error-messages et has-error font échouer la soumission, et le validateOnSubmit() du champ renvoie false. Le parent doit retirer l\'erreur quand l\'utilisateur corrige la valeur (@update:model-value="serverErrors = []"), sinon le formulaire reste bloqué.\n- Un SyInputSelect required laissé vide bloque la soumission.\n- Les champs Vuetify disabled sont ignorés par le SyForm, qu\'ils soient natifs ou en use-vuetify-validation.\n- Les champs en use-vuetify-validation sont enregistrés dans le VForm sous <label>-<id> au lieu de <label> : l\'id des entrées de validate().errors change.\nPour plus de détails, voir la page ',
		type: 'warning',
		variant: 'tonal',
		link: { href: '/?path=/docs/composants-formulaires-syform--docs', text: 'SyForm' },
	},
	{
		id: 'form-fields-validation-behavior',
		releaseVersion: 'v1.2.0',
		message: 'Changements de comportement des champs de formulaire :\n- PhoneField et LunarCalendar appliquent use-vuetify-validation. La prop était ignorée et la validation Synapse s\'appliquait. Désormais, seules les rules sont évaluées : required n\'ajoute que l\'indication visuelle et ARIA, et les contrôles intégrés (format, min-year / max-year…) ne s\'appliquent plus. Ajoutez les règles correspondantes dans rules.\n- SySelect affiche son message « requis » à la soumission. Avant, seule la bordure passait en rouge.\n- SyTextArea inclut le libellé du champ dans son message « requis ».\nPour plus de détails, voir le ',
		type: 'warning',
		variant: 'tonal',
		link: { href: '/?path=/docs/guide-du-dev-formulaires-validation-guide-des-formulaires--docs', text: 'guide de validation des formulaires' },
	},
	{
		id: 'theme-css-variables-kebab-case',
		releaseVersion: 'v1.1.5',
		message: 'Les variables CSS du thème sont désormais générées en kebab-case : --v-theme-onBackgroundVariant devient --v-theme-on-background-variant. Toutes les clés en camelCase sont concernées.\nUn var() pointant vers l\'ancien nom ne résout plus : la déclaration est ignorée et la couleur retombe sur l\'héritage, ce qui peut dégrader des écrans sans erreur visible.\nPour repérer les usages à migrer dans votre projet : grep -rnE -- "--v-theme-[a-z0-9]*[A-Z]" src/\nPour la liste des variables disponibles, voir la page ',
		type: 'warning',
		variant: 'tonal',
		link: { href: '/?path=/docs/design-tokens-utilisation--docs', text: 'Utilisation' },
	},
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
		id: 'tokens-simplification-rappel',
		releaseVersion: 'v1.1.0',
		message: 'Pour rappel (depuis la v1.0.27), une simplification des tokens a été menée suite à l\'ajout du thème Amelipro, merci de vous référer à la page des ',
		type: 'warning',
		variant: 'tonal',
		link: { href: '/?path=/docs/design-tokens-couleurs--docs', text: 'couleurs' },
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
		id: 'tokens-css-variables',
		releaseVersion: 'v1.0.25',
		message: 'Les design tokens ne sont plus exposés via l\'export SCSS (`$gap-2`, variables de couleur…) mais sous forme de variables CSS `--v-…` (ex. `var(--v-gap-2)`, `rgb(var(--v-theme-primary))`). Pour l\'usage et la migration, voir la page ',
		type: 'warning',
		variant: 'tonal',
		link: { href: '/?path=/docs/design-tokens-utilisation--docs', text: 'Utilisation' },
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
					return sanitizeHtml(html.replace(/<blockquote>[\s\S]*?<\/blockquote>/g, ''))
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
