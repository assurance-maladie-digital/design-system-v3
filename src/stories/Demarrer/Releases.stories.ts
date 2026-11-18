import axios from 'axios'
import { computed, defineComponent, h, nextTick, onMounted, shallowRef, useTemplateRef, watch } from 'vue'
import { VPagination } from 'vuetify/components'
import * as marked from 'marked'
import SyAlert from '../../components/SyAlert/SyAlert.vue'
import SySelect from '../../components/Customs/Selects/SySelect/SySelect.vue'
import { sanitizeHtml } from './sanitizeHtml'
import './Releases.css'

type GitHubRelease = {
	id: number
	name?: string | null
	tag_name?: string | null
	published_at: string
	body?: string | null
}

// Texte d'un bandeau : les passages entre backticks sont rendus en `<code>`.
type ReleaseAlertItem = {
	label: string
	text: string
}

// Thème d'un bandeau : ses changements sont repliés sous son titre
type ReleaseAlertGroup = {
	title: string
	items: ReleaseAlertItem[]
	components?: string[]
	link?: { intro: string, href: string, text: string }
}

type ReleaseAlert = {
	id: string
	releaseVersion: string
	type: 'success' | 'info' | 'warning' | 'error'
	variant: 'tonal' | 'outlined'
	title: string
	paragraphs?: string[]
	// Liste des changements, repliée sous un « Voir les N changements »
	items?: ReleaseAlertItem[]
	// Changements regroupés par thème, chaque thème replié séparément
	groups?: ReleaseAlertGroup[]
	components?: string[]
	link?: { intro: string, href: string, text: string }
}

const releaseAlerts: ReleaseAlert[] = [
	{
		id: 'v1-2-2-behavior',
		releaseVersion: 'v1.2.2',
		type: 'info',
		variant: 'tonal',
		title: 'Changements de comportement',
		paragraphs: [
			'Ce sont des corrections ou des améliorations, mais un projet existant peut devoir adapter son code, ses tests ou ses baselines visuelles. Les changements sont regroupés par thème.',
		],
		groups: [
			{
				title: 'DatePicker',
				items: [
					{
						label: 'Règles `custom`',
						text: 'Une règle personnalisée reçoit une `Date` ou une chaîne selon le mode de saisie. Adaptez vos règles pour gérer les deux types, par exemple en normalisant la valeur avec `parseDate`. En développement, un avertissement `[DatePicker]` dans la console signale les règles concernées.',
					},
					{
						label: 'Infobulle `title`',
						text: 'Le champ n\'a plus d\'infobulle `title` par défaut. Si vous en aviez besoin, passez-la explicitement (`title="Saisir la date au format JJ/MM/AAAA"`) ; `:title="false"` la désactive.',
					},
					{
						label: 'Description du format',
						text: 'Elle est rédigée en langage naturel (« jour en 2 chiffres… ») au lieu de `DD/MM/YYYY`. Mettez à jour les tests qui vérifiaient ce texte ou la description accessible du champ.',
					},
					{
						label: '`hideDetails`',
						text: 'Il s\'applique aussi en mode saisie et en mode combiné : la zone de messages est masquée, comme en mode calendrier.',
					},
					{
						label: 'Validité du `SyForm` (non cassant)',
						text: 'En mode combiné et en saisie seule, le formulaire devient valide dès que la date saisie est validée, au lieu de rester à `null` jusqu\'à la soumission.',
					},
					{
						label: 'Nouvelles props `helpText` et `clearable` (non cassant)',
						text: '`helpText` affiche une consigne sous le champ ; `clearable` (activé par défaut) affiche un bouton d\'effacement quand le champ contient une valeur.',
					},
				],
				components: ['DatePicker'],
				link: { intro: 'Pour plus de détails, voir la page', href: '/?path=/docs/composants-formulaires-datepicker-calendarmode--docs', text: 'DatePicker' },
			},
			{
				title: 'Champs de formulaire',
				items: [
					{
						label: 'Prop `direction` de `SyTextField` supprimée',
						text: 'Elle produisait un attribut HTML invalide sur l\'`<input>`. Retirez-la de vos usages : en TypeScript strict ou avec `strictTemplates`, elle est désormais signalée comme inconnue.',
					},
					{
						label: 'Prop `required` de `Captcha`',
						text: 'Elle est respectée, à `true` par défaut. Si vous passiez `:required="false"` en comptant sur un captcha toujours bloquant, retirez cette prop.',
					},
					{
						label: 'Règles par borne du `PeriodField`',
						text: '`fieldIdentifier` dans `customRules` s\'appliquait en réalité aux deux bornes. Utilisez les props dédiées `customFromRules` / `customToRules` (et leurs variantes `Warning`).',
					},
					{
						label: 'Nouvelle prop `validateOn` (mode Vuetify)',
						text: 'Elle choisit le déclencheur de la validation et remplace `isValidateOnBlur` si les deux sont fournies. Sur `SyTextArea`, les valeurs de `validate-on` déjà présentes sont désormais appliquées.',
					},
				],
				components: ['SyTextField', 'Captcha', 'PeriodField', 'SyTextArea'],
				link: { intro: 'Pour plus de détails, voir le', href: '/?path=/docs/guide-du-dev-formulaires-validation-guide-des-formulaires--docs', text: 'guide de validation des formulaires' },
			},
			{
				title: 'Tableaux : pagination et sélection',
				items: [
					{
						label: 'Pagination',
						text: 'Elle utilise des boutons à la place des liens `<a href="#">`, et porte le nom de la `caption` du tableau. Adaptez les tests E2E (par exemple le bouton « Page 2 ») et les surcharges CSS qui ciblent `.sy-pagination a`.',
					},
					{
						label: 'Case « Sélectionner toutes les lignes »',
						text: 'Elle n\'a plus d\'`aria-label`, son nom vient de son `<label>`. Ciblez-la par son nom accessible : `getByRole(\'checkbox\', { name: \'Sélectionner toutes les lignes\' })`.',
					},
					{
						label: '`hideDefaultFooter`',
						text: 'Le pied de tableau vide est retiré du DOM.',
					},
					{
						label: 'Nouvelle prop `hideCaption` (non cassant)',
						text: 'Elle masque visuellement la légende tout en la gardant pour les lecteurs d\'écran. Donnez une `caption` distincte à chaque tableau d\'une même page.',
					},
				],
				components: ['SyTable', 'SyServerTable', 'SyPagination'],
				link: { intro: 'Pour plus de détails, voir la page', href: '/?path=/docs/composants-tableaux-sytable--docs', text: 'SyTable' },
			},
			{
				title: 'Menu de l\'en-tête',
				items: [
					{
						label: 'Slot `navigation-menu-content`',
						text: 'Il est rendu dans un `div` et non plus dans un `ul`. Fournissez vous-même la liste : un `ul` autour des `HeaderMenuItem`, ou des `HeaderMenuSection` avec un `title`.',
					},
					{
						label: '`role="menu"`',
						text: 'Il est retiré du menu burger, qui reste une boîte de dialogue contenant une zone de navigation. Ciblez `[role="dialog"]` ou `.menu-wrapper` dans vos tests.',
					},
					{
						label: '`overflow` de la page',
						text: 'Le menu ne force plus `overflow: auto` sur la page à sa fermeture. Si votre projet comptait dessus pour rétablir le défilement, définissez `overflow` explicitement.',
					},
				],
				components: ['HeaderNavigationBar', 'HeaderBurgerMenu', 'HeaderMenuSection'],
				link: { intro: 'Pour plus de détails, voir la page', href: '/?path=/docs/composants-structure-headerbar-headernavigationbar--docs', text: 'HeaderNavigationBar' },
			},
			{
				title: 'Tests et affichage',
				items: [
					{
						label: 'Libellés de `SyTabs`',
						text: 'Ils gardent leur casse dans le DOM, les majuscules sont appliquées en CSS : `getByText(\'TOUS LES VIREMENTS\')` devient `getByText(\'Tous les virements\')`.',
					},
					{
						label: 'Rôles de `SyInputSelect`',
						text: 'Le déclencheur a le rôle `button` et la liste le rôle `listbox`, au lieu de `menu` / `list`. Le bouton d\'effacement est un vrai `<button>`.',
					},
					{
						label: 'Bouton de fermeture de `NotificationBar`',
						text: 'Son nom accessible est complet. Avec un `closeBtnText` personnalisé, adaptez les tests qui ciblent le bouton par son nom.',
					},
					{
						label: 'Ajustements visuels, sans impact sur le code',
						text: 'Contraste du texte d\'aide de `SyTextField`, espacements des champs sur petit écran, alignement du texte d\'aide sous un message (`SyTextField`, `SySelect`). Seuls les tests de captures d\'écran concernés sont à mettre à jour.',
					},
				],
				components: ['SyTabs', 'SyInputSelect', 'NotificationBar', 'SyTextField', 'SySelect'],
			},
		],
	},
	{
		id: 'datepicker-model-behavior',
		releaseVersion: 'v1.2.1',
		type: 'info',
		variant: 'tonal',
		title: 'Correction du comportement du DatePicker',
		paragraphs: [
			'Ce sont des corrections, mais un projet existant peut les percevoir comme des régressions : vérifiez les écrans qui écoutent le modèle ou `date-selected`.',
		],
		items: [
			{
				label: '`update:modelValue`',
				text: 'Il émet `null` dès que la saisie est invalide ou incomplète (format invalide, date non parsable, plage incomplète, saisie partiellement effacée). Avant, le modèle gardait la dernière valeur valide et se désynchronisait du texte affiché.',
			},
			{
				label: '`date-selected`',
				text: 'Il n\'est émis que pour une sélection complète (date unique confirmée ou plage complète). Il ne l\'est plus quand seule la première borne d\'une plage est saisie au clavier.',
			},
			{
				label: 'Nouvelle prop `validateWithReturnFormat` (non cassant)',
				text: 'Avec cette prop, le `validate` des règles personnalisées reçoit la date au format `dateFormatReturn`, comme le `v-model`. Sans elle, le comportement est inchangé.',
			},
		],
		components: ['DatePicker'],
		link: { intro: 'Pour plus de détails, voir la page', href: '/?path=/docs/composants-formulaires-datepicker-calendarmode--docs', text: 'DatePicker' },
	},
	{
		id: 'select-zero-false-values',
		releaseVersion: 'v1.2.1',
		type: 'info',
		variant: 'tonal',
		title: 'Valeurs 0 et false dans les sélecteurs',
		paragraphs: [
			'Les valeurs `0` et `false` sont désormais des choix valides, et non plus une absence de valeur. `\'\'`, `null` et `undefined` restent une absence de valeur.',
		],
		items: [
			{
				label: '`SyAutocomplete` (sélection simple)',
				text: 'Une option de valeur `0` ou `false` s\'affiche dans le champ et est marquée sélectionnée. Avant, le champ restait vide.',
			},
			{
				label: 'Prop `required`',
				text: 'Choisir une option de valeur `false` n\'affiche plus le message « Le champ … est requis. ».',
			},
			{
				label: 'Règle `required` dans `customRules`',
				text: 'Elle refuse toujours `false` par défaut, ce qui garde obligatoires les cases du type « J\'accepte ». Pour une liste booléenne, ajoutez l\'option `allowFalse: true`.',
			},
			{
				label: '`SelectBtnField`',
				text: 'Une sélection de valeur `0` n\'est plus remplacée quand le focus clavier passe sur une autre option.',
			},
			{
				label: '`SySelect`',
				text: 'Des items booléens bruts (`:items="[true, false]"`) s\'affichent et émettent leur valeur booléenne.',
			},
		],
		components: ['SyAutocomplete', 'SySelect', 'SyRadioGroup', 'SelectBtnField', 'SyCheckBoxGroup'],
		link: { intro: 'Pour plus de détails, voir la page', href: '/?path=/docs/composants-formulaires-selects-syselect--docs', text: 'SySelect' },
	},
	{
		id: 'table-pinned-styles',
		releaseVersion: 'v1.2.1',
		type: 'info',
		variant: 'tonal',
		title: 'Styles des tableaux personnalisables par variables CSS',
		paragraphs: [
			'Les colonnes épinglées, la colonne de sélection épinglée et les cases à cocher n\'imposent plus leur style par des styles inline ou des `!important`. Si votre projet les surchargeait avec `!important`, remplacez ces surcharges par les variables CSS ci-dessous.',
		],
		items: [
			{
				label: '`--sy-table-pinned-cell-bg`',
				text: 'Fond des cellules épinglées et de la colonne de sélection épinglée.',
			},
			{
				label: '`--sy-table-row-bg`',
				text: 'Couleur d\'une ligne, étendue aux cellules épinglées. Un `background-color` posé seul sur la ligne ne s\'étend pas aux cellules épinglées.',
			},
			{
				label: '`--sy-table-pinned-left-shadow` / `--sy-table-pinned-right-shadow`',
				text: 'Ombre signalant le contenu masqué à gauche / à droite.',
			},
			{
				label: '`--sy-table-checkbox-color`',
				text: 'Couleur des cases à cocher du tableau.',
			},
			{
				label: 'Zébrage `striped`',
				text: 'Il s\'applique désormais à toute la ligne, cellules épinglées comprises.',
			},
			{
				label: 'Défilement horizontal',
				text: 'Une ombre signale le contenu masqué dès qu\'un tableau est plus large que son conteneur, y compris sans colonne épinglée.',
			},
		],
		components: ['SyTable', 'SyServerTable'],
		link: { intro: 'Pour plus de détails, voir la page', href: '/?path=/docs/composants-tableaux-sytable--docs', text: 'SyTable' },
	},
	{
		id: 'syform-validation-behavior',
		releaseVersion: 'v1.2.0',
		type: 'warning',
		variant: 'tonal',
		title: 'Changements de comportement du SyForm',
		paragraphs: [
			'Ce sont des corrections, mais un projet existant peut les percevoir comme des régressions : vérifiez vos formulaires après la montée de version.',
			'Ils font suite à la finalisation de la validation des formulaires (SyForm et champs de formulaire), engagée depuis la v1.0.24. Nous avons testé tous les cas qui nous semblaient utiles aux projets, mais il est possible que certains nous aient échappé : n\'hésitez pas à nous signaler tout comportement inattendu.',
		],
		items: [
			{
				label: 'Erreurs injectées (`error-messages`, `has-error`)',
				text: 'Elles bloquent maintenant la soumission. Retirez l\'erreur quand l\'utilisateur corrige la valeur (`@update:model-value="serverErrors = []"`), sinon le formulaire reste bloqué. Le `validateOnSubmit()` du champ renvoie aussi `false`, y compris avec `disable-error-handling`. Un `has-error` utilisé seulement pour la mise en forme bloque aussi la soumission.',
			},
			{
				label: '`v-model` du formulaire',
				text: 'Il vaut `null` tant qu\'aucune erreur n\'est affichée, au lieu de `false`. Si vous testez `valid === false` (bouton de soumission, garde), un formulaire invalide passe : comparez à `true` (`:disabled="valid !== true"`).',
			},
			{
				label: 'Formulaire sans champ Synapse',
				text: 'Il ne vaut plus `true` d\'office. Un SyForm qui ne contient que des composants Vuetify natifs suit maintenant leur validité.',
			},
			{
				label: '`SyInputSelect` requis vide',
				text: 'Il bloque désormais la soumission.',
			},
			{
				label: 'Champs Vuetify `disabled`',
				text: 'Ils sont ignorés par la validation du SyForm.',
			},
			{
				label: '`validate().errors`',
				text: 'Uniquement si vous le lisez : l\'id des champs en `use-vuetify-validation` devient `<label>-<id>` au lieu de `<label>`.',
			},
		],
		link: { intro: 'Pour plus de détails, voir la page', href: '/?path=/docs/composants-formulaires-syform--docs', text: 'SyForm' },
	},
	{
		id: 'form-fields-validation-behavior',
		releaseVersion: 'v1.2.0',
		type: 'warning',
		variant: 'tonal',
		title: 'Changements de comportement des champs de formulaire',
		items: [
			{
				label: '`PhoneField` et `LunarCalendar` en `use-vuetify-validation`',
				text: 'La prop était ignorée et la validation Synapse s\'appliquait. Désormais, seules les `rules` sont évaluées : `required` n\'ajoute que l\'indication visuelle et ARIA, et les contrôles intégrés (format, `min-year` / `max-year`…) ne s\'appliquent plus. Ajoutez les règles correspondantes dans `rules`. En développement, un avertissement console signale un champ `required` sans règle dans `rules`.',
			},
			{
				label: '`SySelect`',
				text: 'Il affiche son message « requis » à la soumission. Avant, seule la bordure passait en rouge.',
			},
			{
				label: '`SyTextArea`',
				text: 'Son message « requis » inclut le libellé du champ.',
			},
			{
				label: '`DatePicker`',
				text: 'Une date incomplète est refusée au blur et à la soumission. Avant, effacer une partie d\'une date valide laissait soumettre l\'ancienne date. Le message « Format de date invalide (…) » s\'affiche désormais, y compris en mode combiné, où « La date est requise. » s\'affichait à la place.',
			},
			{
				label: '`NirField`',
				text: 'La clé n\'est plus requise quand elle est masquée (`display-key="false"`).',
			},
			{
				label: 'Mode Vuetify',
				text: 'Une règle qui renvoie `false` affiche « La valeur est invalide. », au lieu de passer le champ en erreur sans message.',
			},
		],
		link: { intro: 'Pour plus de détails, voir le', href: '/?path=/docs/guide-du-dev-formulaires-validation-guide-des-formulaires--docs', text: 'guide de validation des formulaires' },
	},
	{
		id: 'theme-css-variables-kebab-case',
		releaseVersion: 'v1.1.5',
		type: 'warning',
		variant: 'tonal',
		title: 'Variables CSS du thème générées en kebab-case',
		paragraphs: [
			'`--v-theme-onBackgroundVariant` devient `--v-theme-on-background-variant`. Toutes les clés en camelCase sont concernées.',
			'Un `var()` pointant vers l\'ancien nom ne résout plus : la déclaration est ignorée et la couleur retombe sur l\'héritage, ce qui peut dégrader des écrans sans erreur visible.',
			'Pour repérer les usages à migrer dans votre projet : `grep -rnE -- "--v-theme-[a-z0-9]*[A-Z]" src/`',
		],
		link: { intro: 'Pour la liste des variables disponibles, voir la page', href: '/?path=/docs/design-tokens-utilisation--docs', text: 'Utilisation' },
	},
	{
		id: 'form-success-messages-hidden',
		releaseVersion: 'v1.1.0',
		type: 'warning',
		variant: 'tonal',
		title: 'Messages de succès masqués par défaut dans les composants de formulaire',
		paragraphs: [
			'Cette modification répond à la fois à des besoins projets et à l\'harmonisation des différents thèmes (CNAM, PAG, Amelipro).',
			'Pour afficher les messages de succès, utilisez la prop `showSuccessMessages`.',
		],
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
			'NirField',
			'PasswordField',
			'PhoneField',
			'Captcha',
		],
	},
	{
		id: 'node-18-decommission',
		releaseVersion: 'v1.1.0',
		type: 'warning',
		variant: 'tonal',
		title: 'Fin du support de Node 18',
		paragraphs: ['En lien avec le Starter Kit.'],
	},
	{
		id: 'tokens-simplification-rappel',
		releaseVersion: 'v1.1.0',
		type: 'warning',
		variant: 'tonal',
		title: 'Rappel : simplification des tokens (depuis la v1.0.27)',
		paragraphs: ['Elle a été menée suite à l\'ajout du thème Amelipro.'],
		link: { intro: 'Voir la page des', href: '/?path=/docs/design-tokens-couleurs--docs', text: 'couleurs' },
	},
	{
		id: 'tokens-simplification',
		releaseVersion: 'v1.0.27',
		type: 'warning',
		variant: 'tonal',
		title: 'Simplification des tokens',
		paragraphs: ['Elle est rendue nécessaire par l\'ajout du thème Amelipro.'],
		link: { intro: 'Voir la page des', href: '/?path=/docs/design-tokens-couleurs--docs', text: 'couleurs' },
	},
	{
		id: 'starter-kit-2-0-35',
		releaseVersion: 'v1.0.27',
		type: 'warning',
		variant: 'tonal',
		title: 'Montée de version du Starter Kit conseillée en 2.0.35',
	},
	{
		id: 'tokens-css-variables',
		releaseVersion: 'v1.0.25',
		type: 'warning',
		variant: 'tonal',
		title: 'Design tokens exposés en variables CSS',
		paragraphs: [
			'Ils ne sont plus exposés via l\'export SCSS (`$gap-2`, variables de couleur…) mais sous forme de variables CSS `--v-…` (ex. `var(--v-gap-2)`, `rgb(var(--v-theme-primary))`).',
		],
		link: { intro: 'Pour l\'usage et la migration, voir la page', href: '/?path=/docs/design-tokens-utilisation--docs', text: 'Utilisation' },
	},
	{
		id: 'starter-kit-2-0-33',
		releaseVersion: 'v1.0.25',
		type: 'warning',
		variant: 'tonal',
		title: 'Montée de version du Starter Kit conseillée en 2.0.33',
	},
	{
		id: 'starter-kit-2-0-32',
		releaseVersion: 'v1.0.24',
		type: 'warning',
		variant: 'tonal',
		title: 'Montée de version du Starter Kit conseillée en 2.0.32',
	},
]

// Nombre de releases affichées par page
const PAGE_SIZE = 3
// Valeur du sélecteur pour afficher toutes les versions (une chaîne vide serait traitée comme une absence de valeur)
const ALL_VERSIONS = 'all'

// Rend un texte de bandeau en remplaçant les passages entre backticks par des `<code>`
// (pas de `v-html` : le texte reste échappé par Vue).
const AlertText = defineComponent({
	props: {
		text: { type: String, required: true },
	},
	setup(props) {
		return () => props.text
			.split('`')
			.map((part, index) => (index % 2 === 1 ? h('code', part) : part))
			.filter(part => part !== '')
	},
})

export default {
	title: 'Démarrer/Releases',
	component: SyAlert,
	tags: ['!manifest'],
}
export const List = {
	render: () => {
		return {
			components: { SyAlert, SySelect, VPagination, AlertText },
			setup() {
				const releases = shallowRef<GitHubRelease[]>([])
				const errorMessage = shallowRef('')
				const loading = shallowRef(true)
				const selectedVersion = shallowRef(ALL_VERSIONS)
				const page = shallowRef(1)
				const listRef = useTemplateRef<HTMLElement>('list')

				const fetchReleases = async () => {
					try {
						// 100 par page (maximum de l'API) : toutes les releases en une requête, le sélecteur les liste toutes
						const { data } = await axios.get('https://api.github.com/repos/assurance-maladie-digital/design-system-v3/releases', { params: { per_page: 100 } })
						releases.value = data
					}
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					catch (error) {
						errorMessage.value = 'Une erreur est survenue lors de la récupération des releases.'
					}
					finally {
						loading.value = false
					}
				}

				const versionItems = computed(() => [
					{ text: 'Toutes les versions', value: ALL_VERSIONS },
					...releases.value.map(release => ({
						text: release.name || release.tag_name || String(release.id),
						value: String(release.id),
					})),
				])

				const filteredReleases = computed(() => selectedVersion.value === ALL_VERSIONS
					? releases.value
					: releases.value.filter(release => String(release.id) === selectedVersion.value),
				)

				const pageCount = computed(() => Math.ceil(filteredReleases.value.length / PAGE_SIZE))

				const visibleReleases = computed(() => filteredReleases.value.slice((page.value - 1) * PAGE_SIZE, page.value * PAGE_SIZE))

				const rangeText = computed(() => {
					const total = filteredReleases.value.length
					if (total <= 1) {
						return ''
					}
					const start = (page.value - 1) * PAGE_SIZE + 1
					const end = Math.min(page.value * PAGE_SIZE, total)
					return `Versions ${start} à ${end} sur ${total}`
				})

				// Le sélecteur peut renvoyer `null` s'il est vidé : on revient alors à toutes les versions
				const selectVersion = (value: unknown) => {
					selectedVersion.value = typeof value === 'string' ? value : ALL_VERSIONS
					page.value = 1
				}

				// La pagination est sous la liste : on ramène le focus (et la vue) sur le sélecteur, en haut de la nouvelle page
				watch(page, () => {
					nextTick(() => listRef.value?.focus())
				})

				const formatDate = (date: string | number | Date) => {
					return new Date(date).toLocaleDateString()
				}

				// Le corps reprend la section du CHANGELOG, qui commence par « ## vX.Y.Z (date) » :
				// ce titre double celui affiché juste au-dessus (nom et date de la release).
				const formatMarkdown = (markdown?: string | null) => {
					const body = (markdown ?? '').replace(/^\s*#{1,6}\s*v?\d+\.\d+\.\d+[^\n]*\n/, '')
					const html = marked.parse(body) as string
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
					errorMessage,
					loading,
					selectedVersion,
					page,
					versionItems,
					pageCount,
					visibleReleases,
					rangeText,
					selectVersion,
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
					<p v-else-if="loading" class="mt-4">Chargement des releases…</p>
					<div v-else ref="list" tabindex="-1" class="releases__list">
						<div class="releases__toolbar mt-6">
							<SySelect
								:model-value="selectedVersion"
								:items="versionItems"
								label="Version"
								menu-id="releases-version-menu"
								hide-details
								disable-error-handling
								class="releases__select"
								@update:model-value="selectVersion"
							/>
							<p class="releases__range" aria-live="polite">{{ rangeText }}</p>
						</div>
						<div v-for="release in visibleReleases" :key="release.id">
							<h2>{{ release.name }} ({{ formatDate(release.published_at) }})</h2>
							<SyAlert
								v-for="alert in getReleaseAlerts(release)"
								:key="alert.id"
								:type="alert.type"
								:variant="alert.variant"
								:closable="false"
								density="comfortable"
								class="release-alert mt-2 mb-4"
							>
								<p class="release-alert__title">{{ alert.title }}</p>
								<p v-for="paragraph in alert.paragraphs" :key="paragraph" class="release-alert__text"><AlertText :text="paragraph" /></p>
								<details v-if="alert.items" class="release-alert__details">
									<summary>Voir les {{ alert.items.length }} changements</summary>
									<ul class="release-alert__list">
										<li v-for="item in alert.items" :key="item.label">
											<strong><AlertText :text="item.label" /></strong> : <AlertText :text="item.text" />
										</li>
									</ul>
								</details>
								<div v-if="alert.groups" class="release-alert__groups">
									<details v-for="group in alert.groups" :key="group.title" class="release-alert__details release-alert__group">
										<summary>{{ group.title }} ({{ group.items.length }})</summary>
										<ul class="release-alert__list">
											<li v-for="item in group.items" :key="item.label">
												<strong><AlertText :text="item.label" /></strong> : <AlertText :text="item.text" />
											</li>
										</ul>
										<p v-if="group.components" class="release-alert__text release-alert__group-components">
											Composants concernés : <template v-for="(component, index) in group.components" :key="component"><code>{{ component }}</code><template v-if="index < group.components.length - 1">, </template></template>
										</p>
										<p v-if="group.link" class="release-alert__text">{{ group.link.intro }} <a :href="group.link.href">{{ group.link.text }}</a>.</p>
									</details>
								</div>
								<template v-if="alert.components">
									<p class="release-alert__text">Composants concernés :</p>
									<ul class="release-alert__components">
										<li v-for="component in alert.components" :key="component"><code>{{ component }}</code></li>
									</ul>
								</template>
								<p v-if="alert.link" class="release-alert__text">{{ alert.link.intro }} <a :href="alert.link.href">{{ alert.link.text }}</a>.</p>
							</SyAlert>
							<div v-html="formatMarkdown(release.body)"></div>
							<hr>
						</div>
						<VPagination
							v-if="pageCount > 1"
							v-model="page"
							:length="pageCount"
							:total-visible="5"
							rounded
							class="releases__pagination mt-4"
							aria-label="Pagination des releases"
						/>
					</div>
				</div>
			`,
		}
	},
	tags: ['!dev', '!manifest'],
}
