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
		message: 'Changements de comportement du SyForm. Ce sont des corrections, mais un projet existant peut les percevoir comme des régressions : vérifiez vos formulaires après la montée de version.\nIls font suite à la finalisation de la validation des formulaires (SyForm et champs de formulaire), engagée depuis la v1.0.24. Nous avons testé tous les cas qui nous semblaient utiles aux projets, mais il est possible que certains nous aient échappé : n\'hésitez pas à nous signaler tout comportement inattendu.\n- Erreurs injectées (error-messages, has-error) : elles bloquent maintenant la soumission. Retirez l\'erreur quand l\'utilisateur corrige la valeur (@update:model-value="serverErrors = []"), sinon le formulaire reste bloqué. Le validateOnSubmit() du champ renvoie aussi false, y compris avec disable-error-handling. Un has-error utilisé seulement pour la mise en forme bloque aussi la soumission.\n- v-model du formulaire : il vaut null tant qu\'aucune erreur n\'est affichée, au lieu de false. Si vous testez valid === false (bouton de soumission, garde), un formulaire invalide passe : comparez à true (:disabled="valid !== true").\n- Formulaire sans champ Synapse : il ne vaut plus true d\'office. Un SyForm qui ne contient que des composants Vuetify natifs suit maintenant leur validité.\n- SyInputSelect requis vide : il bloque désormais la soumission.\n- Champs Vuetify disabled : ils sont ignorés par la validation du SyForm.\n- Uniquement si vous lisez validate().errors : l\'id des champs en use-vuetify-validation devient <label>-<id> au lieu de <label>.\nPour plus de détails, voir la page ',
		type: 'warning',
		variant: 'tonal',
		link: { href: '/?path=/docs/composants-formulaires-syform--docs', text: 'SyForm' },
	},
	{
		id: 'form-fields-validation-behavior',
		releaseVersion: 'v1.2.0',
		message: 'Changements de comportement des champs de formulaire :\n- PhoneField et LunarCalendar appliquent use-vuetify-validation. La prop était ignorée et la validation Synapse s\'appliquait. Désormais, seules les rules sont évaluées : required n\'ajoute que l\'indication visuelle et ARIA, et les contrôles intégrés (format, min-year / max-year…) ne s\'appliquent plus. Ajoutez les règles correspondantes dans rules. En développement, un avertissement console signale un champ required sans règle dans rules.\n- SySelect affiche son message « requis » à la soumission. Avant, seule la bordure passait en rouge.\n- SyTextArea inclut le libellé du champ dans son message « requis ».\n- DatePicker : une date incomplète est refusée au blur et à la soumission. Avant, effacer une partie d\'une date valide laissait soumettre l\'ancienne date. Le message « Format de date invalide (…) » s\'affiche désormais, y compris en mode combiné, où « La date est requise. » s\'affichait à la place.\n- NirField : la clé n\'est plus requise quand elle est masquée (display-key="false").\n- Mode Vuetify : une règle qui renvoie false affiche « La valeur est invalide. », au lieu de passer le champ en erreur sans message.\nPour plus de détails, voir le ',
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
