import { SyTextField } from '@/components'
import { computed, ref } from 'vue'
import {
	VDivider,
	VExpansionPanel,
	VExpansionPanels,
	VExpansionPanelText,
	VExpansionPanelTitle,
} from 'vuetify/components'
import type { StoryObj } from '@storybook/vue3'

export default {
	title: 'Guide Du Dev/Correspondance composants Amelipro',
}

export const AmeliproComponents: StoryObj = {
	render: () => {
		return {
			components: {
				VExpansionPanels,
				VExpansionPanel,
				VExpansionPanelTitle,
				VExpansionPanelText,
				VDivider,
				SyTextField,
			},

			setup() {
				const searchTerm = ref('')

				const baseUrl = 'https://cnam-design-system.netlify.app/?path=/docs/composants-'

				const getComponentUrl = (item: { name: string, type: string }) => {
					const typePath = item.type
						.trim()
						.toLowerCase()
						.replace(/\s+/g, '-')

					const namePath = item.name
						.trim()
						.toLowerCase()

					return `${baseUrl}${typePath}-${namePath}--docs`
				}

				const apComponents = [
					{
						title: 'AmeliproCheckbox',
						synapse: {
							name: 'Composant synapse',
							url: '',
						},
						amelipro: {
							name: 'AmeliproCheckbox',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-checkbox',
						},
					}, {
						title: 'AmeliproCheckboxGroup',
						synapse: {
							name: 'Composant synapse',
							url: '',
						},
						amelipro: {
							name: 'AmeliproCheckboxGroup',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-checkbox-group',
						},
					}, {
						title: 'AmeliproBadge',
						synapse: {
							name: 'Composant synapse',
							url: '',
						},
						amelipro: {
							name: 'AmeliproBadge',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-badge',
						},
					}, {
						title: 'AmeliproBtn',
						synapse: {
							name: 'Composant Vuetify',
							url: 'https://vuetifyjs.com/api/v-btn',
						},
						amelipro: {
							name: 'AmeliproBtn',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-btn',
						},
					}, {
						title: 'AmeliproCallback',
						synapse: {
							name: 'Composant synapse',
							url: '',
						},
						amelipro: {
							name: 'AmeliproCallback',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-callback',
						},
					}, {
						title: 'AmeliproCard',
						synapse: {
							name: 'Composant synapse',
							url: '',
						},
						amelipro: {
							name: 'AmeliproCard',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-card',
						},
					}, {
						title: 'AmeliproContentLayout',
						synapse: {
							name: 'PageContainer',
							url: 'https://cnam-design-system.netlify.app/?path=/docs/composants-layout-pagecontainer--docs',
						},
						amelipro: {
							name: 'AmeliproContentLayout',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-content-layout',
						},
					}, {
						title: 'AmeliproDialog',
						synapse: {
							name: 'Composant synapse',
							url: '',
						},
						amelipro: {
							name: 'AmeliproDialog',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-dialog',
						},
					}, {
						title: 'AmeliproErrorTemplate',
						synapse: {
							name: 'Composant synapse',
							url: '',
						},
						amelipro: {
							name: 'AmeliproErrorTemplate',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-error-template',
						},
					}, {
						title: 'AmeliproFilePreview',
						synapse: {
							name: 'Composant synapse',
							url: '',
						},
						amelipro: {
							name: 'AmeliproFilePreview',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-file-preview',
						},
					}, {
						title: 'AmeliproFooter',
						synapse: {
							name: 'FooterBar',
							url: 'https://cnam-design-system.netlify.app/?path=/docs/composants-structure-footerbar--docs',
						},
						amelipro: {
							name: 'AmeliproFooter',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-footer',
						},
					}, {
						title: 'AmeliproHeader',
						synapse: {
							name: 'HeaderBar',
							url: 'https://cnam-design-system.netlify.app/?path=/docs/composants-structure-headerbar--docs',
						},
						amelipro: {
							name: 'AmeliproHeader',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-header',
						},
					}, {
						title: 'AmeliproHeaderBar',
						synapse: {
							name: 'Composant synapse',
							url: '',
						},
						amelipro: {
							name: 'AmeliproHeaderBar',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-header-bar',
						},
					}, {
						title: 'AmeliproHeaderBrandSection',
						synapse: {
							name: 'Composant synapse',
							url: '',
						},
						amelipro: {
							name: 'AmeliproHeaderBrandSection',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-header-brand-section',
						},
					}, {
						title: 'AmeliproIcon',
						synapse: {
							name: 'Composant synapse',
							url: '',
						},
						amelipro: {
							name: 'AmeliproIcon',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-icon',
						},
					}, {
						title: 'AmeliproIconBtn',
						synapse: {
							name: 'Composant synapse',
							url: '',
						},
						amelipro: {
							name: 'AmeliproIconBtn',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-icon-btn',
						},
					}, {
						title: 'AmeliproLogoAm',
						synapse: {
							name: 'Composant synapse',
							url: '',
						},
						amelipro: {
							name: 'AmeliproLogoAm',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-logo-am',
						},
					}, {
						title: 'AmeliproMenu',
						synapse: {
							name: 'Composant synapse',
							url: '',
						},
						amelipro: {
							name: 'AmeliproMenu',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-menu',
						},
					}, {
						title: 'AmeliproMessage',
						synapse: {
							name: 'Composant synapse',
							url: '',
						},
						amelipro: {
							name: 'AmeliproMessage',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-message',
						},
					}, {
						title: 'AmeliproStatus',
						synapse: {
							name: 'Composant synapse',
							url: '',
						},
						amelipro: {
							name: 'AmeliproStatus',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-status',
						},
					}, {
						title: 'AmeliproTooltips',
						synapse: {
							name: 'Composant Vuetify',
							url: 'https://vuetifyjs.com/en/api/v-tooltip',
						},
						amelipro: {
							name: 'AmeliproTooltips',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-tooltips',
						},
					}, {
						title: 'AmeliproTransmission',
						synapse: {
							name: 'Composant synapse',
							url: '',
						},
						amelipro: {
							name: 'AmeliproTransmission',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-transmission',
						},
					}, {
						title: 'StructureMenu',
						synapse: {
							name: 'Composant synapse',
							url: '',
						},
						amelipro: {
							name: 'StructureMenu',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/structure-menu',
						},
					}, {
						title: 'StructureBtn',
						synapse: {
							name: 'Composant synapse',
							url: '',
						},
						amelipro: {
							name: 'StructureBtn',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/structure-btn',
						},
					}, {
						title: 'StructureItem',
						synapse: {
							name: 'Composant synapse',
							url: '',
						},
						amelipro: {
							name: 'StructureItem',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/structure-item',
						},
					}, {
						title: 'StructureList',
						synapse: {
							name: 'Composant synapse',
							url: '',
						},
						amelipro: {
							name: 'StructureList',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/structure-list',
						},
					}, {
						title: 'StructureTabs',
						synapse: {
							name: 'Composant synapse',
							url: '',
						},
						amelipro: {
							name: 'StructureTabs',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/structure-tabs',
						},
					}, {
						title: 'UserMenu',
						synapse: {
							name: 'Composant synapse',
							url: '',
						},
						amelipro: {
							name: 'UserMenu',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/user-menu',
						},
					}, {
						title: 'UserMenuDetails',
						synapse: {
							name: 'Composant synapse',
							url: '',
						},
						amelipro: {
							name: 'UserMenuDetails',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/user-menu-details',
						},
					}, {
						title: 'ServiceMenu',
						synapse: {
							name: 'Composant synapse',
							url: '',
						},
						amelipro: {
							name: 'ServiceMenu',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/service-menu',
						},
					}, {
						title: 'ServiceBtn',
						synapse: {
							name: 'Composant synapse',
							url: '',
						},
						amelipro: {
							name: 'ServiceBtn',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/service-btn',
						},
					}, {
						title: 'ServiceList',
						synapse: {
							name: 'Composant synapse',
							url: '',
						},
						amelipro: {
							name: 'ServiceList',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/service-list',
						},
					}, {
						title: 'ServiceMenuContent',
						synapse: {
							name: 'Composant synapse',
							url: '',
						},
						amelipro: {
							name: 'ServiceMenuContent',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/service-menu-content',
						},
					}, {
						title: 'AmeliproAutoCompleteField',
						synapse: {
							name: 'Composant synapse',
							url: '',
						},
						amelipro: {
							name: 'AmeliproAutoCompleteField',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-auto-complete-field',
						},
					}, {
						title: 'AmeliproBreadcrumb',
						synapse: {
							name: 'Composant synapse',
							url: '',
						},
						amelipro: {
							name: 'AmeliproBreadcrumb',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-breadcrumb',
						},
					}, {
						title: 'AmeliproChips',
						synapse: {
							name: 'Composant synapse',
							url: '',
						},
						amelipro: {
							name: 'AmeliproChips',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-chips',
						},
					}, {
						title: 'AmeliproDisclosure',
						synapse: {
							name: 'Composant synapse',
							url: '',
						},
						amelipro: {
							name: 'AmeliproDisclosure',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-disclosure',
						},
					}, {
						title: 'AmeliproIllustratedDataTile',
						synapse: {
							name: 'Composant synapse',
							url: '',
						},
						amelipro: {
							name: 'AmeliproIllustratedDataTile',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-illustrated-data-tile',
						},
					}, {
						title: 'AmeliproIllustratedRadioGroup',
						synapse: {
							name: 'Composant synapse',
							url: '',
						},
						amelipro: {
							name: 'AmeliproIllustratedRadioGroup',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-illustrated-radio-group',
						},
					}, {
						title: 'AmeliproMailTile',
						synapse: {
							name: 'Composant synapse',
							url: '',
						},
						amelipro: {
							name: 'AmeliproMailTile',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-mail-tile',
						},
					}, {
						title: 'AmeliproMultipleFoldingCard',
						synapse: {
							name: 'Composant synapse',
							url: '',
						},
						amelipro: {
							name: 'AmeliproMultipleFoldingCard',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-multiple-folding-card',
						},
					}, {
						title: 'AmeliproNumberedCard',
						synapse: {
							name: 'Composant synapse',
							url: '',
						},
						amelipro: {
							name: 'AmeliproNumberedCard',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-numbered-card',
						},
					}, {
						title: 'AmeliproOnboarding',
						synapse: {
							name: 'Composant synapse',
							url: '',
						},
						amelipro: {
							name: 'AmeliproOnboarding',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-onboarding',
						},
					}, {
						title: 'AmeliproPageLayout',
						synapse: {
							name: 'Composant synapse',
							url: '',
						},
						amelipro: {
							name: 'AmeliproPageLayout',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-page-layout',
						},
					}, {
						title: 'AmeliproPagination',
						synapse: {
							name: 'SyPagination',
							url: 'https://cnam-design-system.netlify.app/?path=/docs/composants-navigation-sypagination--docs',
						},
						amelipro: {
							name: 'AmeliproPagination',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-pagination',
						},
					}, {
						title: 'AmeliproPaginationBtn',
						synapse: {
							name: 'Composant synapse',
							url: '',
						},
						amelipro: {
							name: 'AmeliproPaginationBtn',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-pagination-btn',
						},
					}, {
						title: 'AmeliproPatientBanner',
						synapse: {
							name: 'Composant synapse',
							url: '',
						},
						amelipro: {
							name: 'AmeliproPatientBanner',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-patient-banner',
						},
					}, {
						title: 'AmeliproRadioGroup',
						synapse: {
							name: 'Composant synapse',
							url: '',
						},
						amelipro: {
							name: 'AmeliproRadioGroup',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-radio-group',
						},
					}, {
						title: 'AmeliproSelect',
						synapse: {
							name: 'Composant synapse',
							url: '',
						},
						amelipro: {
							name: 'AmeliproSelect',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-select',
						},
					}, {
						title: 'AmeliproStateTile',
						synapse: {
							name: 'Composant synapse',
							url: '',
						},
						amelipro: {
							name: 'AmeliproStateTile',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-state-tile',
						},
					}, {
						title: 'AmeliproStepper',
						synapse: {
							name: 'Composant synapse',
							url: '',
						},
						amelipro: {
							name: 'AmeliproStepper',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-stepper',
						},
					}, {
						title: 'AmeliproStepBtn',
						synapse: {
							name: 'Composant synapse',
							url: '',
						},
						amelipro: {
							name: 'AmeliproStepBtn',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-step-btn',
						},
					}, {
						title: 'AmeliproTabs',
						synapse: {
							name: 'Composant synapse',
							url: '',
						},
						amelipro: {
							name: 'AmeliproTabs',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-tabs',
						},
					}, {
						title: 'AmeliproTextArea',
						synapse: {
							name: 'Composant synapse',
							url: '',
						},
						amelipro: {
							name: 'AmeliproTextArea',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-text-area',
						},
					}, {
						title: 'AmeliproTextField',
						synapse: {
							name: 'Composant synapse',
							url: '',
						},
						amelipro: {
							name: 'AmeliproTextField',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-text-field',
						},
					}, {
						title: 'AmeliproTileBtn',
						synapse: {
							name: 'Composant synapse',
							url: '',
						},
						amelipro: {
							name: 'AmeliproTileBtn',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-tile-btn',
						},
					}, {
						title: 'UserInformationSummary',
						synapse: {
							name: 'Composant synapse',
							url: '',
						},
						amelipro: {
							name: 'UserInformationSummary',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/user-information-summary',
						},
					}, {
						title: 'AmeliproCustomSelector',
						synapse: {
							name: 'Composant synapse',
							url: '',
						},
						amelipro: {
							name: 'AmeliproCustomSelector',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-custom-selector',
						},
					}, {
						title: 'AmeliproAccordion',
						synapse: {
							name: 'Composant synapse',
							url: '',
						},
						amelipro: {
							name: 'AmeliproAccordion',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-accordion',
						},
					}, {
						title: 'AmeliproCaptcha',
						synapse: {
							name: 'Composant synapse',
							url: '',
						},
						amelipro: {
							name: 'AmeliproCaptcha',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-captcha',
						},
					}, {
						title: 'AmeliproUpload',
						synapse: {
							name: 'Composant synapse',
							url: '',
						},
						amelipro: {
							name: 'AmeliproUpload',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-upload',
						},
					}, {
						title: 'AmeliproTable',
						synapse: {
							name: 'Composant synapse',
							url: '',
						},
						amelipro: {
							name: 'AmeliproTable',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-table',
						},
					}, {
						title: 'AmeliproPostalAddressField',
						synapse: {
							name: 'Composant synapse',
							url: '',
						},
						amelipro: {
							name: 'AmeliproPostalAddressField',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-postal-address-field',
						},
					}, {
						title: 'AmeliproAccordionGroup',
						synapse: {
							name: 'Composant synapse',
							url: '',
						},
						amelipro: {
							name: 'AmeliproAccordionGroup',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-accordion-group',
						},
					}, {
						title: 'AmeliproCarousel',
						synapse: {
							name: 'Composant synapse',
							url: '',
						},
						amelipro: {
							name: 'AmeliproCarousel',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-carousel',
						},
					}, {
						title: 'AmeliproAccordionResult',
						synapse: {
							name: 'Composant synapse',
							url: '',
						},
						amelipro: {
							name: 'AmeliproAccordionResult',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-accordion-result',
						},
					}, {
						title: 'AmeliproAccordionFrieze',
						synapse: {
							name: 'Composant synapse',
							url: '',
						},
						amelipro: {
							name: 'AmeliproAccordionFrieze',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-accordion-frieze',
						},
					}, {
						title: 'AmeliproAccordionList',
						synapse: {
							name: 'Composant synapse',
							url: '',
						},
						amelipro: {
							name: 'AmeliproAccordionList',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-accordion-list',
						},
					}, {
						title: 'AmeliproAccordionResultList',
						synapse: {
							name: 'Composant synapse',
							url: '',
						},
						amelipro: {
							name: 'AmeliproAccordionResultList',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-accordion-result-list',
						},
					}, {
						title: 'AmeliproClickableTile',
						synapse: {
							name: 'Composant synapse',
							url: '',
						},
						amelipro: {
							name: 'AmeliproClickableTile',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-clickable-tile',
						},
					}, {
						title: 'AmeliproDentalChart',
						synapse: {
							name: 'Composant synapse',
							url: '',
						},
						amelipro: {
							name: 'AmeliproDentalChart',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-dental-chart',
						},
					}, {
						title: 'AmeliproMessagingLayout',
						synapse: {
							name: 'Composant synapse',
							url: '',
						},
						amelipro: {
							name: 'AmeliproMessagingLayout',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-messaging-layout',
						},
					}, {
						title: 'AmeliproDropdownMenu',
						synapse: {
							name: 'Composant synapse',
							url: '',
						},
						amelipro: {
							name: 'AmeliproDropdownMenu',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-dropdown-menu',
						},
					}, {
						title: 'AmeliproDropdownMenuBtn',
						synapse: {
							name: 'Composant synapse',
							url: '',
						},
						amelipro: {
							name: 'AmeliproDropdownMenuBtn',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-dropdown-menu-btn',
						},
					}, {
						title: 'AmeliproMessagingMenuBtn',
						synapse: {
							name: 'Composant synapse',
							url: '',
						},
						amelipro: {
							name: 'AmeliproMessagingMenuBtn',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-messaging-menu-btn',
						},
					}, {
						title: 'AmeliproPatientLogin',
						synapse: {
							name: 'Composant synapse',
							url: '',
						},
						amelipro: {
							name: 'AmeliproPatientLogin',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-patient-login',
						},
					}, {
						title: 'AmeliproPatientLogged',
						usedComponents: [{
							name: 'Vbtn',
							type: 'composants vuetify',
						}, {
							name: 'VCard',
							type: 'composants vuetify',
						}, {
							name: 'Vbtn',
							type: 'composants vuetify',
						}],
						amelipro: {
							name: 'AmeliproPatientLogged',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-patient-logged',
						},
					}, {
						title: 'AmeliproCopyBtn',
						synapse: {
							name: 'Composant synapse',
							url: '',
						},
						amelipro: {
							name: 'AmeliproCopyBtn',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-copy-btn',
						},
					}, {
						title: 'AmeliproFirstLogin',
						synapse: {
							name: 'Composant synapse',
							url: '',
						},
						amelipro: {
							name: 'AmeliproFirstLogin',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-first-login',
						},
					},
				]

				const filteredComponents = computed(() => {
					const term = searchTerm.value.trim().toLowerCase()

					return apComponents
						.filter(component =>
							!term
							|| component.title.toLowerCase().includes(term),
						)
						.sort((a, b) =>
							a.title.localeCompare(b.title, 'fr', { sensitivity: 'base' }),
						)
				})

				return { filteredComponents, apComponents, searchTerm, getComponentUrl }
			},

			template: `
				<SyTextField v-model="searchTerm" label="Rechercher un composant" :show-success-messages=false />
              <VExpansionPanels>

                <VExpansionPanel
                    v-for="component in filteredComponents"
                    :key="component.title"
                >
                  <VExpansionPanelTitle class="font-weight-bold">
                    {{ component.title }}
                  </VExpansionPanelTitle>

                  <VExpansionPanelText>

                    <template v-if="component.text">
                      <p style="white-space: pre-line">
                        {{ component.text }}
                      </p>
                    </template>

					  <template v-else-if="component.usedComponents">
						  <p>
							  Pour reproduire son comportement, utilisez les composants du Design System suivants :
						  </p>

						  <p v-for="item in component.usedComponents" :key="item.name">
							  <a
								  :href="getComponentUrl(item)"
				                  target="_blank"
				                  rel="noopener noreferrer"
							  >
								  {{ item.name }}
							  </a>
						  </p>

						  <p>
							  et implémentez la logique métier directement dans votre projet.
						  </p>
					  </template>

                    <template v-else>
                      <p>
                        Le composant
                        <span class="component-name">{{ component.amelipro.name }}</span>
                        est remplacé par
                        <span class="component-name">{{ component.synapse.name }}</span>.
                        <br>
                        <a :href="component.synapse.url" target="_blank" rel="noopener noreferrer">
                          Documentation du composant Synapse {{ component.synapse.name }}
                        </a>
                      </p>

                      <p class="mt-4">
                        <VDivider class="pb-2" />
                        <a :href="component.amelipro.url" target="_blank">
                          Documentation du composant Amelipro {{ component.amelipro.name }}
                        </a>
                      </p>
                    </template>

                  </VExpansionPanelText>
                </VExpansionPanel>

              </VExpansionPanels>
            `,
		}
	},
	tags: ['!dev'],
}
