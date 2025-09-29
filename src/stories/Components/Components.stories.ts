import { VCard, VCardText, VCardTitle, VRow, VCol, VIcon } from 'vuetify/components'
import type { StoryObj } from '@storybook/vue3'

export default {
	title: 'Composants/Vue d\'ensemble',
}

export const Header: StoryObj = {
	render: () => {
		return {
			template: `
        <div class="mb-8">
          <h1 class="text-h4 title font-weight-bold mb-4">Composants</h1>
          <p class="text-body-1">Découvrez notre collection de composants réutilisables conçus pour créer des interfaces utilisateur cohérentes et accessibles.</p>
        </div>
      `,
		}
	},
	tags: ['!dev'],
}

export const ComponentsList: StoryObj = {
	render: () => {
		return {
			components: { VCard, VCardText, VCardTitle, VRow, VCol, VIcon },
			setup() {
				const components = [
					{
						title: 'HeaderBar',
						description: 'Utilisé pour afficher l’en-tête d’une page ainsi qu’une barre de navigation.',
						link: '/?path=/docs/composants-structure-headerbar--docs',
						img: '/components/header-bar.svg',
						category: 'Structure',
					},
					{
						title: 'HeaderToolbar',
						description: 'Utilisé pour afficher une barre d\'outils en haut de la page. Il est composé de deux zones customisables.',
						link: '/?path=/docs/composants-structure-headertoolbar--docs',
						img: '/components/header-toolbar.svg',
						category: 'Structure',
					},
					{
						title: 'HeaderLoading',
						description: 'Utilisé pour afficher un élément de chargement avec des dimensions personnalisées.',
						link: '/?path=/docs/composants-structure-headerloading--docs',
						img: '/components/header-loading.svg',
						category: 'Structure',
					},
					{
						title: 'SubHeader',
						description: 'Utilisé pour afficher un bloc d’informations sous l’en-tête principale.',
						link: '/?path=/docs/composants-structure-subheader--docs',
						img: '/components/sub-header.svg',
						category: 'Structure',
					},
					{
						title: 'FooterBar',
						description: 'Utilisé pour afficher une barre de pied de page avec des liens et des informations supplémentaires.',
						link: '/?path=/docs/composants-structure-footerbar--docs',
						img: '/components/footer-bar.svg',
						category: 'Structure',
					},
					{
						title: 'PageContainer',
						description: 'Conteneur transparent utilisé pour afficher une page.',
						link: '/?path=/docs/composants-layout-pagecontainer--docs',
						img: '/components/page-container.svg',
						category: 'Layout',
					},
					{
						title: 'ContextualMenu',
						description: 'Utilisé pour afficher un menu avec une liste d’ancres pour la navigation.',
						link: '/?path=/docs/composants-navigation-contextualmenu--docs',
						img: '/components/contextual-menu.svg',
						category: 'Navigation',
					},
					{
						title: 'ExternalLinks',
						description: 'Utilisé pour afficher un menu avec une liste vers des liens externes.',
						link: '/?path=/docs/composants-navigation-externallinks--docs',
						img: '/components/external-links.svg',
						category: 'Navigation',
					},
					{
						title: 'SocialMediaLinks',
						description: 'Utilisé pour afficher des liens de réseaux sociaux dans le composant Footer.',
						link: '/?path=/docs/composants-navigation-socialmedialinks--docs',
						img: '/components/social-media-links.svg',
						category: 'Navigation',
					},
					{
						title: 'SkipLink',
						description: 'Utilisé pour permettre à l\'utilisateur utilisant la navigation au clavier de passer directement à une section de contenu.',
						link: '/?path=/docs/composants-navigation-skiplink--docs',
						img: '/components/skip-link.svg',
						category: 'Navigation',
					},
					{
						title: 'BackBtn',
						description: 'Utilisé pour permettre à l’utilisateur de revenir à la page précédente.',
						link: '/?path=/docs/composants-boutons-backbtn--docs',
						img: '/components/back-btn.svg',
						category: 'Boutons',
					},
					{
						title: 'BackToTopBtn',
						description: 'Utilisé pour afficher un bouton permettant à l’utilisateur de remonter en haut de la page.',
						link: '/?path=/docs/composants-boutons-backtotopbtn--docs',
						img: '/components/back-to-top-btn.svg',
						category: 'Boutons',
					},
					{
						title: 'CopyBtn',
						description: 'Utilisé pour afficher un bouton permettant à l’utilisateur de copier du texte.',
						link: '/?path=/docs/composants-boutons-copybtn--docs',
						img: '/components/copy-btn.svg',
						category: 'Boutons',
					},
					{
						title: 'LangBtn',
						description: 'Utilisé pour permettre à l’utilisateur de choisir la langue de l’application.',
						link: '/?path=/docs/composants-boutons-langbtn--docs',
						img: '/components/lang-btn.svg',
						category: 'Boutons',
					},
					{
						title: 'DownloadBtn',
						description: 'Utilisé pour permettre à l’utilisateur de télécharger un document provenant d’une API.',
						link: '/?path=/docs/composants-boutons-downloadbtn--docs',
						img: '/components/download-btn.svg',
						category: 'Boutons',
					},
					{
						title: 'FranceConnectBtn',
						description: 'Utilisé pour afficher un bouton de connexion à FranceConnect.',
						link: '/?path=/docs/composants-boutons-franceconnectbtn--docs',
						img: '/components/france-connect-btn.svg',
						category: 'Boutons',
					},
					{
						title: 'UserMenuBtn',
						description: 'Utilisé pour afficher un bouton de menu utilisateur avec un menu déroulant.',
						link: '/?path=/docs/composants-boutons-usermenubtn--docs',
						img: '/components/user-menu-btn.svg',
						category: 'Boutons',
					},
					{
						title: 'SyTextField',
						description: 'Utilisé pour proposer une alternative au TextField de Vuetify, conforme au style du Design System et qui respecte les règles d\'accessibilité RGAA.',
						link: '/?path=/docs/composants-formulaires-sytextfield--docs',
						img: '/components/sy-text-field.svg',
						category: 'Formulaires',
					},
					{
						title: 'SySelect',
						description: 'Utilisé pour proposer une alternative au v-select de Vuetify qui ne respecte pas les règles d\'accessibilité RGAA. Il est basé sur un v-textfield.',
						link: '/?path=/docs/composants-formulaires-syselect--docs',
						img: '/components/sy-select.svg',
						category: 'Formulaires',
					},
					{
						title: 'SyInputSelect',
						description: 'Utilisé pour proposer une alternative au v-select de Vuetify qui ne respecte pas les règles RGAA.Il est basé sur un v-input.',
						link: '/?path=/docs/composants-formulaires-syinputselect--docs',
						img: '/components/sy-input-select.svg',
						category: 'Formulaires',
					},
					{
						title: 'SyBtnSelect',
						description: 'Utilisé pour proposer une sélection d\'options avec un bouton personnalisé, conforme au style du Design System et qui respecte les règles d\'accessibilité RGAA. Il est basé sur un v-btn.',
						link: '/?path=/docs/composants-formulaires-sybtnselect--docs',
						img: '/components/sy-btn-select.svg',
						category: 'Formulaires',
					},
					{
						title: 'DatePicker',
						description: ' Utilisé pour permettre à l’utilisateur de sélectionner ou de saisir une date.',
						link: '/?path=/docs/composants-formulaires-datepicker--docs',
						img: '/components/date-picker.svg',
						category: 'Formulaires',
					},
					{
						title: 'FileUpload',
						description: 'Utilisé pour permettre à l’utilisateur de sélectionner ou de glisser-déposer des fichiers.',
						link: '/?path=/docs/composants-formulaires-fileupload--docs',
						img: '/components/file-upload.svg',
						category: 'Formulaires',
					},
					{
						title: 'NirField',
						description: 'Utilisé pour permettre à l’utilisateur de saisir un numéro de Sécurité sociale (NIR).',
						link: '/?path=/docs/composants-formulaires-nirfield--docs',
						img: '/components/nir-field.svg',
						category: 'Formulaires',
					},
					{
						title: 'PasswordField',
						description: 'Utilisé pour afficher un champ de saisie de mot de passe et gérer sa validation.',
						link: '/?path=/docs/composants-formulaires-passwordfield--docs',
						img: '/components/password-field.svg',
						category: 'Formulaires',
					},
					{
						title: 'PeriodField',
						description: 'Utilisé pour permettre à l’utilisateur de saisir une période.',
						link: '/?path=/docs/composants-formulaires-periodfield--docs',
						img: '/components/period-field.svg',
						category: 'Formulaires',
					},
					{
						title: 'PhoneField',
						description: 'Utilisé pour saisir des numéros de téléphone avec différentes options de formatage.',
						link: '/?path=/docs/composants-formulaires-phonefield--docs',
						img: '/components/phone-field.svg',
						category: 'Formulaires',
					},
					{
						title: 'RangeField',
						description: 'Utilisé pour permettre à l\'utilisateur de sélectionner un interval.',
						link: '/?path=/docs/composants-formulaires-rangefield--docs',
						img: '/components/range-field.svg',
						category: 'Formulaires',
					},
					{
						title: 'SearchListField',
						description: 'Utilisé pour permettre à l’utilisateur de sélectionner des valeurs dans une liste.',
						link: '/?path=/docs/composants-formulaires-searchlistfield--docs',
						img: '/components/search-list-field.svg',
						category: 'Formulaires',
					},
					{
						title: 'SelectBtnField',
						description: 'Utilisé pour permettre à l’utilisateur de sélectionner une valeur dans une liste.',
						link: '/?path=/docs/composants-formulaires-selectbtnfield--docs',
						img: '/components/select-btn-field.svg',
						category: 'Formulaires',
					},
					{
						title: 'PaginatedTable',
						description: 'Utilisé pour afficher une VDataTable de Vuetify avec une pagination persistante.',
						link: '/?path=/docs/composants-tableaux-paginatedtable--docs',
						img: '/components/paginated-table.svg',
						category: 'Tableaux',
					},
					{
						title: 'TableToolbar',
						description: 'Utilisé pour afficher une barre d\'outils pour les tableaux.',
						link: '/?path=/docs/composants-tableaux-tabletoolbar--docs',
						img: '/components/table-toolbar.svg',
						category: 'Tableaux',
					},
					{
						title: 'Logo',
						description: 'Utilisé pour afficher le logo de l\'application avec différentes options de personnalisation.',
						link: '/?path=/docs/composants-donn%C3%A9es-logo--docs',
						img: '/components/logo.svg',
						category: 'Données',
					},
					{
						title: 'LogoBrandSection',
						description: 'Permet d\'afficher le logo de l\'Assurance Maladie avec des logos ou un titre secondaire.',
						link: '/?path=/docs/composants-donn%C3%A9es-logobrandsection--docs',
						img: '/components/logo-brand-section.svg',
						category: 'Données',
					},
					{
						title: 'CollapsibleList',
						description: 'Utilisé pour afficher des listes de liens. Les éléments peuvent être dépliés ou repliés.',
						link: '/?path=/docs/composants-donn%C3%A9es-collapsiblelist--docs',
						img: '/components/collapsible-list.svg',
						category: 'Données',
					},
					{
						title: 'ChipList',
						description: 'Utilisé pour afficher une liste de puces.',
						link: '/?path=/docs/composants-donn%C3%A9es-chiplist--docs',
						img: '/components/chip-list.svg',
						category: 'Données',
					},
					{
						title: 'DataList',
						description: 'Utilisé pour afficher une liste d’informations.',
						link: '/?path=/docs/composants-donn%C3%A9es-datalist--docs',
						img: '/components/data-list.svg',
						category: 'Données',
					},
					{
						title: 'DataListGroup',
						description: 'Utilisé pour afficher une liste de DataList.',
						link: '/?path=/docs/composants-donn%C3%A9es-datalistgroup--docs',
						img: '/components/data-list-group.svg',
						category: 'Données',
					},
					{
						title: 'FilePreview',
						description: 'Utilisé pour afficher l\'aperçu d\'un fichier.',
						link: '/?path=/docs/composants-donn%C3%A9es-filepreview--docs',
						img: '/components/file-preview.svg',
						category: 'Données',
					},
					{
						title: 'FileList',
						description: 'Utilisé pour afficher une liste de document à téléverser.',
						link: '/?path=/docs/composants-donn%C3%A9es-filelist--docs',
						img: '/components/file-list.svg',
						category: 'Données',
					},
					{
						title: 'SyAlert',
						description: 'Utilisé pour afficher une alerte à l’utilisateur.',
						link: '/?path=/docs/composants-feedback-syalert--docs',
						img: '/components/sy-alert.svg',
						category: 'Feedback',
					},
					{
						title: 'DialogBox',
						description: 'Utilisé pour afficher une boîte de dialogue avec des boutons d\'action.',
						link: '/?path=/docs/composants-feedback-dialogbox--docs',
						img: '/components/dialog-box.svg',
						category: 'Feedback',
					},
					{
						title: 'NotificationBar',
						description: 'Utilisé pour afficher des notifications à l’utilisateur.',
						link: '/?path=/docs/composants-feedback-notificationbar--docs',
						img: '/components/notification-bar.svg',
						category: 'Feedback',
					},
					{
						title: 'CookieBanner',
						description: 'Utilisé pour afficher une bannière de consentement pour les cookies.',
						link: '/?path=/docs/composants-feedback-cookiebanner--docs',
						img: '/components/cookie-banner.svg',
						category: 'Feedback',
					},
					{
						title: 'RatingPicker',
						description: 'Permet de recueillir l’avis d’un utilisateur.',
						link: '/?path=/docs/composants-feedback-ratingpicker--docs',
						img: '/components/rating-picker.svg',
						category: 'Feedback',
					},
				]

				const categoryOrder = [
					'Structure',
					'Layout',
					'Navigation',
					'Boutons',
					'Formulaires',
					'Tableaux',
					'Données',
					'Feedback',
				]

				const groupedComponents = categoryOrder.map(category => ({
					category,
					components: components.filter(component => component.category === category),
				}))

				return {
					groupedComponents,
				}
			},
			template: `
				<div>
					<div v-for="group in groupedComponents" :key="group.category">
						<h2 class="mt-6 mb-4">{{ group.category }}</h2>
						<VRow>
							<VCol v-for="component in group.components" :key="component.title" cols="12" sm="6" md="4" lg="3">
								<VCard
									:href="component.link"
									color="primary"
									class="h-100 card-hover"
									variant="outlined"
									:ripple="true"
								>
									<img
										:src="component.img"
										:alt="component.title"
										class="w-100"
									/>
									<VCardTitle class="d-flex align-center text-h6 font-weight-bold">
										{{ component.title }}
									</VCardTitle>
									<VCardText class="text-black">
										{{ component.description }}
									</VCardText>
								</VCard>
							</VCol>
						</VRow>
					</div>
				</div>
			`,
		}
	},
	tags: ['!dev'],
}
