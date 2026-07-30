import { SyTextField } from '@/components'
import { computed, ref } from 'vue'
import {
	VDivider,
	VExpansionPanel,
	VExpansionPanels,
	VExpansionPanelText,
	VExpansionPanelTitle,
} from 'vuetify/components'
import type { StoryObj } from '@storybook/vue3-vite'
import SyTable from '@/components/Tables/SyTable/SyTable.vue'

export default {
	components: { SyTable },
	title: 'Guide Du Dev/Équivalence des composants/Amelipro',
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
				SyTable,
			},

			setup() {
				const searchTerm = ref('')

				const baseUrl = import.meta.env.DEV
					? 'http://localhost:6006/?path=/docs/'
					: 'https://cnam-design-system.netlify.app/?path=/docs/'

				type ComponentType =
					| 'composants vuetify'
					| 'structure'
					| 'layout'
					| 'navigation'
					| 'boutons'
					| 'formulaires'
					| 'formulaires selects'
					| 'tableaux'
					| 'données'
					| 'feedback'
					| 'filtres'
					| 'templates'

				const getComponentUrl = (item: { name: string, type: ComponentType }) => {
					const normalizedType = item.type.trim().toLowerCase()

					const prefix = normalizedType.includes('templates') ? '' : 'composants-'

					const typePath = normalizedType.replace(/\s+/g, '-')
					const namePath = item.name.trim().toLowerCase()

					const suffix = item.name.includes('--') ? '' : '--docs'

					return `${baseUrl}${prefix}${typePath}-${namePath}${suffix}`
				}

				const systemLabel = (component: { name: string }) => {
					if (component.name.startsWith('V')) {
						return 'Vuetify'
					}
					return 'Synapse'
				}

				const apComponents = [
					{
						title: 'AmeliproCheckbox',
						synapse: {
							name: 'SyCheckbox',
							url: getComponentUrl({ name: 'SyCheckbox', type: 'formulaires' }),
						},
						amelipro: {
							name: 'AmeliproCheckbox',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-checkbox',
						},
						props: [
							{ name: 'checkbox', reason: 'Doublon avec label et name' },
							{ name: 'isSwitch', reason: 'Création d’un composant Switch dédié' },
							{ name: 'append', reason: 'Faisable côté projet' },
							{ name: 'errorDefault', reason: 'Géré par la validation' },
							{ name: 'labelLeft', reason: 'Faisable côté projet' },
							{ name: 'requiredErrorMessage', reason: 'Géré par la validation' },
						],
					}, {
						title: 'AmeliproCheckboxGroup',
						synapse: {
							name: 'SyCheckboxGroup',
							url: getComponentUrl({ name: 'SyCheckboxGroup', type: 'formulaires' }),
						},
						amelipro: {
							name: 'AmeliproCheckboxGroup',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-checkbox-group',
						},
					}, {
						title: 'AmeliproBadge',
						synapse: {
							name: 'ChipList',
							url: getComponentUrl({ name: 'ChipList', type: 'données' }),
						},
						amelipro: {
							name: 'AmeliproBadge',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-badge',
						},
					}, {
						title: 'AmeliproBtn',
						synapse: {
							name: 'VBtn',
							url: getComponentUrl({ name: 'VBtn', type: 'composants vuetify' }),
						},
						amelipro: {
							name: 'AmeliproBtn',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-btn',
						},
						props: [
							{ name: 'uniqueId', reason: 'Géré par Vuetify' },
							{ name: 'badge', reason: 'Géré par Vuetify' },
							{ name: 'badgeBgColor', reason: 'Géré par Vuetify' },
							{ name: 'badgeColor', reason: 'Géré par Vuetify' },
							{ name: 'bordered', reason: 'Géré par Vuetify' },
							{ name: 'classes', reason: 'Géré par Vuetify' },
							{ name: 'color', reason: 'Utiliser les couleurs du DS' },
							{ name: 'disabled', reason: 'Géré par Vuetify' },
							{ name: 'hoverColor', reason: 'Utiliser les couleurs du DS' },
							{ name: 'hoverUnderline', reason: 'Utiliser les couleurs du DS' },
							{ name: 'iconBgColor', reason: 'Utiliser les couleurs du DS' },
							{ name: 'iconBordered', reason: 'Géré par Vuetify' },
							{ name: 'iconColor', reason: 'Utiliser les couleurs du DS' },
							{ name: 'iconFocusColor', reason: 'Utiliser les couleurs du DS' },
							{ name: 'iconHoverColor', reason: 'Utiliser les couleurs du DS' },
							{ name: 'iconLeft', reason: 'Géré par Vuetify' },
							{ name: 'iconName', reason: 'Géré par Vuetify' },
							{ name: 'infoBlock', reason: 'Géré par Vuetify' },
							{ name: 'minHeight', reason: 'Géré par Vuetify' },
							{ name: 'size', reason: 'Géré par Vuetify' },
							{ name: 'target', reason: 'Géré par Vuetify' },
							{ name: 'text', reason: 'Géré par Vuetify' },
							{ name: 'textColor', reason: 'Utiliser les couleurs du DS' },
							{ name: 'textFocusColor', reason: 'Utiliser les couleurs du DS' },
							{ name: 'textHoverColor', reason: 'Utiliser les couleurs du DS' },
							{ name: 'type', reason: 'Géré par Vuetify' },
							{ name: 'underline', reason: 'Géré par Vuetify' },
						],
					},
					{
						title: 'AmeliproCallback',
						synapse: {
							name: 'NotificationBar',
							url: getComponentUrl({ name: 'NotificationBar', type: 'feedback' }),
						},
						amelipro: {
							name: 'AmeliproCallback',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-callback',
						},
					},
					{
						title: 'AmeliproCard',
						synapse: {
							name: 'VCard',
							url: getComponentUrl({ name: 'VCard', type: 'composants vuetify' }),
						},
						amelipro: {
							name: 'AmeliproCard',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-card',
						},
						props: [
							{ name: 'cardTitle', reason: 'Géré par Vuetify' },
							{ name: 'uniqueId', reason: 'Géré par Vuetify' },
							{ name: 'borderColor', reason: 'Géré par Vuetify' },
							{ name: 'bordered', reason: 'Géré par Vuetify' },
							{ name: 'cardColor', reason: 'Géré par Vuetify' },
							{ name: 'classes', reason: 'Géré par Vuetify' },
							{ name: 'contentClasses', reason: 'Géré par Vuetify' },
							{ name: 'divider', reason: 'Géré par Vuetify' },
							{ name: 'headerRightWidth', reason: 'Géré par Vuetify' },
							{ name: 'noCardHeader', reason: 'Géré par Vuetify' },
							{ name: 'rightPart', reason: 'Géré par Vuetify' },
							{ name: 'rightPartClasses', reason: 'Géré par Vuetify' },
							{ name: 'rightPartWidth', reason: 'Géré par Vuetify' },
							{ name: 'titleColor', reason: 'Géré par Vuetify' },
							{ name: 'titleLevel', reason: 'Géré par Vuetify' },
						],
					}, {
						title: 'AmeliproContentLayout',
						synapse: {
							name: 'PageContainer',
							url: getComponentUrl({ name: 'PageContainer', type: 'layout' }),
						},
						amelipro: {
							name: 'AmeliproContentLayout',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-content-layout',
						},
					}, {
						title: 'AmeliproDialog',
						synapse: {
							name: 'DialogBox',
							url: getComponentUrl({ name: 'DialogBox', type: 'feedback' }),
						},
						amelipro: {
							name: 'AmeliproDialog',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-dialog',
						},
						props: [
							{ name: 'uniqueId', reason: 'Déjà géré par Synapse' },
							{ name: 'attach', reason: 'Géré par Vuetify' },
							{ name: 'eager', reason: 'Géré par Vuetify' },
							{ name: 'fullscreen', reason: 'Géré par Vuetify' },
							{ name: 'hiddenCancelBtn', reason: 'Déjà géré par Synapse' },
							{ name: 'labelledby', reason: 'Déjà géré par Synapse' },
							{ name: 'mainContentMaxHeight', reason: 'Géré par Vuetify' },
							{ name: 'mainContentMinHeight', reason: 'Géré par Vuetify' },
							{ name: 'noClickOutside', reason: 'Géré par Vuetify' },
							{ name: 'noFooter', reason: 'Non utilisé' },
						],
					}, {
						title: 'AmeliproErrorTemplate',
						synapse: {
							name: 'ErrorPage',
							url: getComponentUrl({ name: 'ErrorPage', type: 'templates' }),
						},
						amelipro: {
							name: 'AmeliproErrorTemplate',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-error-template',
						},
					},
					{
						title: 'AmeliproFilePreview',
						synapse: {
							name: 'FilePreview',
							url: getComponentUrl({ name: 'FilePreview', type: 'données' }),
						},
						amelipro: {
							name: 'AmeliproFilePreview',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-file-preview',
						},
					},
					{
						title: 'AmeliproFooter',
						synapse: {
							name: 'FooterBar',
							url: getComponentUrl({ name: 'FooterBar', type: 'structure' }),
						},
						amelipro: {
							name: 'AmeliproFooter',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-footer',
						},
					}, {
						title: 'AmeliproHeader',
						synapse: {
							name: 'HeaderBar',
							url: getComponentUrl({ name: 'HeaderBar', type: 'structure' }),
						},
						amelipro: {
							name: 'AmeliproHeader',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-header',
						},
					}, {
						title: 'AmeliproHeaderBar',
						synapse: {
							name: 'HeaderBar',
							url: getComponentUrl({ name: 'HeaderBar', type: 'structure' }),
						},
						amelipro: {
							name: 'AmeliproHeaderBar',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-header-bar',
						},
					}, {
						title: 'AmeliproHeaderBrandSection',
						synapse: {
							name: 'HeaderBar',
							url: getComponentUrl({ name: 'HeaderBar', type: 'structure' }),
						},
						amelipro: {
							name: 'AmeliproHeaderBrandSection',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-header-brand-section',
						},
					}, {
						title: 'AmeliproIcon',
						synapse: {
							name: 'SyIcon',
							url: getComponentUrl({ name: 'SyIcon', type: 'données' }),
						},
						amelipro: {
							name: 'AmeliproIcon',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-icon',
						},
					}, {
						title: 'AmeliproIconBtn',
						synapse: {
							name: 'SyIconButton',
							url: getComponentUrl({ name: 'SyIconButton', type: 'boutons' }),
						},
						amelipro: {
							name: 'AmeliproIconBtn',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-icon-btn',
						},
						props: [
							{ name: 'iconBgColor', reason: 'Couleur du DS' },
							{ name: 'iconHoverBgColor', reason: 'Couleur du DS' },
							{ name: 'iconHoverColor', reason: 'Couleur du DS' },
							{ name: 'uniqueId', reason: 'Géré coté projet' },
							{ name: 'xLarge', reason: 'Géré par la props size' },
							{ name: 'badge', reason: 'Géré par Vuetify' },
							{ name: 'badgeBgColor', reason: 'Géré par Vuetify' },
							{ name: 'badgeColor', reason: 'Géré par Vuetify' },
							{ name: 'bordered', reason: 'Implémentation ultérieure à étudier' },
							{ name: 'btnTitle', reason: 'Géré par la props label' },
							{ name: 'href', reason: 'Implémentation ultérieure à étudier' },
							{ name: 'iconBorderColor', reason: 'Couleur du DS' },
							{ name: 'iconFocusBgColor', reason: 'Couleur du DS' },
							{ name: 'iconFocusBorderColor', reason: 'Couleur du DS' },
							{ name: 'iconFocusColor', reason: 'Couleur du DS' },
							{ name: 'iconHoverBorderColor', reason: 'Implémentation ultérieure à étudier' },
							{ name: 'large', reason: 'Géré par la props size' },
							{ name: 'medium', reason: 'Géré par la props size' },
							{ name: 'small', reason: 'Géré par la props size' },
							{ name: 'to', reason: 'Implémentation ultérieure à étudier' },
						],
					},
					{
						title: 'AmeliproLogoAm',
						synapse: {
							name: 'HeaderBar',
							url: getComponentUrl({ name: 'HeaderBar', type: 'structure' }),
						},
						amelipro: {
							name: 'AmeliproLogoAm',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-logo-am',
						},
					},
					{
						title: 'AmeliproMenu',
						synapse: {
							name: 'VNavigationDrawer',
							url: getComponentUrl({ name: 'VNavigationDrawer', type: 'composants vuetify' }),
						},
						amelipro: {
							name: 'AmeliproMenu',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-menu',
						},
					},
					{
						title: 'AmeliproMessage',
						synapse: {
							name: 'NotificationBar',
							url: getComponentUrl({ name: 'NotificationBar', type: 'feedback' }),
						},
						amelipro: {
							name: 'AmeliproMessage',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-message',
						},
						props: [
							{ name: 'alignStart', reason: 'Non utilisé' },
							{ name: 'borderLeftMessage', reason: 'Géré par la props variant' },
							{ name: 'borderLeftMessageTitle', reason: 'Non utilisé' },
							{ name: 'color', reason: 'Géré par la props variant' },
							{ name: 'dark', reason: 'Non utilisé' },
							{ name: 'icon', reason: 'Géré par la props variant' },
							{ name: 'iconBgColor', reason: 'Géré par la props variant' },
							{ name: 'iconColor', reason: 'Géré par la props variant' },
							{ name: 'maxWidth', reason: 'Non utilisé' },
							{ name: 'noIcon', reason: 'Non utilisé' },
							{ name: 'text', reason: 'Géré avec le slot default' },
							{ name: 'textColor', reason: 'Géré par la props variant' },
							{ name: 'type', reason: 'Géré par la props variant' },
							{ name: 'width', reason: 'Non utilisé' },
						],
					},
					{
						title: 'AmeliproStatus',
						synapse: {
							name: 'ChipList',
							url: getComponentUrl({ name: 'ChipList', type: 'données' }),
						},
						amelipro: {
							name: 'AmeliproStatus',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-status',
						},
					},
					{
						title: 'AmeliproTooltips',
						synapse: {
							name: 'VTooltip',
							url: getComponentUrl({ name: 'VTooltip', type: 'composants vuetify' }),
						},
						amelipro: {
							name: 'AmeliproTooltips',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-tooltips',
						},
						props: [
							{ name: 'tooltipText', reason: 'Géré par Vuetify' },
							{ name: 'uniqueId', reason: 'Géré par Vuetify' },
							{ name: 'btnLabel', reason: 'N’utilise pas le bouton' },
							{ name: 'classes', reason: 'Géré par le projet' },
							{ name: 'iconBgColor', reason: 'Géré par le SyIcon' },
							{ name: 'iconColor', reason: 'Géré par le SyIcon' },
							{ name: 'iconHoverBgColor', reason: 'Géré par le SyIcon' },
							{ name: 'iconHoverColor', reason: 'Géré par le SyIcon' },
							{ name: 'iconName', reason: 'Géré par le SyIcon' },
							{ name: 'tooltipBg', reason: 'Couleur du DS' },
							{ name: 'tooltipTextColor', reason: 'Couleur du DS' },
						],
					},
					{
						title: 'AmeliproTransmission',
						synapse: {
							name: 'VCard',
							url: getComponentUrl({ name: 'VCard', type: 'composants vuetify' }),
						},
						amelipro: {
							name: 'AmeliproTransmission',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-transmission',
						},
					},
					{
						title: 'StructureMenu',
						usedComponents: [
							{
								name: 'DialogBox',
								type: 'feedback',
							},
							{
								name: 'NotificationBar',
								type: 'feedback',
							},
							{
								name: 'VSwitch',
								type: 'composants vuetify',
							},
							{
								name: 'VTooltip',
								type: 'composants vuetify',
							},
						],
						amelipro: {
							name: 'StructureMenu',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/structure-menu',
						},
					},
					{
						title: 'StructureBtn',
						synapse: {
							name: 'VBtn',
							url: getComponentUrl({ name: 'VBtn', type: 'composants vuetify' }),
						},
						amelipro: {
							name: 'StructureBtn',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/structure-btn',
						},
					},
					{
						title: 'StructureItem',
						synapse: {
							name: 'SelectBtnField',
							url: getComponentUrl({ name: 'SelectBtnField', type: 'formulaires selects' }),
						},
						amelipro: {
							name: 'StructureItem',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/structure-item',
						},
					},
					{
						title: 'StructureList',
						usedComponents: [
							{
								name: 'SyRadioGroup',
								type: 'formulaires',
							},
							{
								name: 'VBtn',
								type: 'composants vuetify',
							},
						],
						amelipro: {
							name: 'StructureList',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/structure-list',
						},
					},
					{
						title: 'StructureTabs',
						synapse: {
							name: 'SyTabs',
							url: getComponentUrl({ name: 'SyTabs', type: 'navigation' }),
						},
						amelipro: {
							name: 'StructureTabs',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/structure-tabs',
						},
					},
					{
						title: 'UserMenu',
						synapse: {
							name: 'UserMenuBtn',
							url: getComponentUrl({ name: 'UserMenuBtn', type: 'boutons' }),
						},
						amelipro: {
							name: 'UserMenu',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/user-menu',
						},
					},
					{
						title: 'ServiceMenu',
						synapse: {
							name: 'VNavigationDrawer',
							url: getComponentUrl({ name: 'VNavigationDrawer', type: 'composants vuetify' }),
						},
						amelipro: {
							name: 'ServiceMenu',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/service-menu',
						},
					},
					{
						title: 'AmeliproAutoCompleteField',
						synapse: {
							name: 'SyAutoComplete',
							url: getComponentUrl({ name: 'SyAutoComplete', type: 'formulaires selects' }),
						},
						amelipro: {
							name: 'AmeliproAutoCompleteField',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-auto-complete-field',
						},
					}, {
						title: 'AmeliproBreadcrumb',
						synapse: {
							name: 'VBreadcrumbs',
							url: getComponentUrl({ name: 'VBreadcrumbs', type: 'composants vuetify' }),
						},
						amelipro: {
							name: 'AmeliproBreadcrumb',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-breadcrumb',
						},
					}, {
						title: 'AmeliproChips',
						synapse: {
							name: 'ChipList',
							url: getComponentUrl({ name: 'ChipList', type: 'données' }),
						},
						amelipro: {
							name: 'AmeliproChips',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-chips',
						},
						props: [
							{ name: 'Text', reason: 'Géré par Items' },
							{ name: 'uniqueId', reason: 'Géré par Items' },
						],
					},
					{
						title: 'AmeliproDisclosure',
						synapse: {
							name: 'Accordion',
							url: getComponentUrl({ name: 'Accordion', type: 'données' }),
						},
						amelipro: {
							name: 'AmeliproDisclosure',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-disclosure',
						},
					},
					{
						title: 'AmeliproIllustratedDataTile',
						synapse: {
							name: 'VCard',
							url: getComponentUrl({ name: 'VCard', type: 'composants vuetify' }),
						},
						amelipro: {
							name: 'AmeliproIllustratedDataTile',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-illustrated-data-tile',
						},
					},
					{
						title: 'AmeliproIllustratedRadioGroup',
						synapse: {
							name: 'SyRadioGroup',
							url: getComponentUrl({ name: 'SyRadioGroup', type: 'formulaires' }),
						},
						amelipro: {
							name: 'AmeliproIllustratedRadioGroup',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-illustrated-radio-group',
						},
					},
					{
						title: 'AmeliproMailTile',
						usedComponents: [{
							name: 'VCard',
							type: 'composants vuetify',
						}, {
							name: 'VBtn',
							type: 'composants vuetify',
						},
						],
						amelipro: {
							name: 'AmeliproMailTile',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-mail-tile',
						},
					},
					{
						title: 'AmeliproMultipleFoldingCard',
						synapse: {
							name: 'Accordion',
							url: getComponentUrl({ name: 'Accordion--with-custom-content', type: 'données' }),
						},
						amelipro: {
							name: 'AmeliproMultipleFoldingCard',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-multiple-folding-card',
						},
					},
					{
						title: 'AmeliproNumberedCard',
						usedComponents: [
							{
								name: 'VCard',
								type: 'composants vuetify',
							},
						],
						amelipro: {
							name: 'AmeliproNumberedCard',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-numbered-card',
						},
					},
					{
						title: 'AmeliproOnboarding',
						synapse: {
							name: 'DialogBox',
							url: getComponentUrl({ name: 'DialogBox', type: 'feedback' }),
						},
						amelipro: {
							name: 'AmeliproOnboarding',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-onboarding',
						},
					},
					{
						title: 'AmeliproPageLayout',
						synapse: {
							name: 'PageContainer',
							url: getComponentUrl({ name: 'PageContainer', type: 'layout' }),
						},
						amelipro: {
							name: 'AmeliproPageLayout',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-page-layout',
						},
					},
					{
						title: 'AmeliproPagination',
						synapse: {
							name: 'SyPagination',
							url: getComponentUrl({ name: 'SyPagination', type: 'navigation' }),
						},
						amelipro: {
							name: 'AmeliproPagination',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-pagination',
						},
					}, {
						title: 'AmeliproPaginationBtn',
						synapse: {
							name: 'SyPagination',
							url: getComponentUrl({ name: 'SyPagination', type: 'navigation' }),
						},
						amelipro: {
							name: 'AmeliproPaginationBtn',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-pagination-btn',
						},
					},
					{
						title: 'AmeliproPatientBanner',
						synapse: {
							name: 'VCard',
							url: getComponentUrl({ name: 'VCard', type: 'composants vuetify' }),
						},
						amelipro: {
							name: 'AmeliproPatientBanner',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-patient-banner',
						},
					},
					{
						title: 'AmeliproRadioGroup',
						synapse: {
							name: 'SyRadioGroup',
							url: getComponentUrl({ name: 'SyRadioGroup', type: 'formulaires' }),
						},
						amelipro: {
							name: 'AmeliproRadioGroup',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-radio-group',
						},
						props: [
							{ name: 'fullHorizontal', reason: 'utiliser le composant selectBtnField pour horizontal' },
							{ name: 'hiddenLabel', reason: 'Cacher le label n\'est pas une bonne pratique' },
							{ name: 'horizontal', reason: 'utiliser le composant selectBtnField pour horizontal' },
							{ name: 'horizontalLabel', reason: 'utiliser le composant selectBtnField pour horizontal' },
							{ name: 'pills', reason: 'composant existant dans synapse selectBtnField' },
							{ name: 'requiredErrorMessage', reason: 'Geré par le systeme de validation Synapse' },
						],
					},
					{
						title: 'AmeliproSelect',
						synapse: {
							name: 'SySelect',
							url: getComponentUrl({ name: 'SySelect', type: 'formulaires selects' }),
						},
						amelipro: {
							name: 'AmeliproSelect',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-select',
						},
						props: [
							{ name: 'fullWidthErrorMessage', reason: 'Geré par la validation' },
							{ name: 'globalMaxWidth', reason: 'Géré par la props width' },
							{ name: 'globalMinWidth', reason: 'Géré par la props width' },
							{ name: 'globalWidth', reason: 'Géré par la props width' },
							{ name: 'hideErrorMessage', reason: 'Geré par la validation' },
							{ name: 'horizontal', reason: 'Peut etre intégré sur demande' },
							{ name: 'inputMaxWidth', reason: 'Géré par la props width' },
							{ name: 'inputMinWidth', reason: 'Géré par la props width' },
							{ name: 'labelMaxWidth', reason: 'Peut être fait par le développeur du projet' },
							{ name: 'labelMinWidth', reason: 'Peut être fait par le développeur du projet' },
							{ name: 'placeholder', reason: 'Non obligatoire' },
							{ name: 'rules', reason: 'Geré par la validation' },
						],
					},
					{
						title: 'AmeliproStateTile',
						synapse: {
							name: 'VCard',
							url: getComponentUrl({ name: 'VCard', type: 'composants vuetify' }),
						},
						amelipro: {
							name: 'AmeliproStateTile',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-state-tile',
						},
					},
					{
						title: 'AmeliproStepper',
						synapse: {
							name: 'VStepper',
							url: getComponentUrl({ name: 'VStepper', type: 'composants vuetify' }),
						},
						amelipro: {
							name: 'AmeliproStepper',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-stepper',
						},
					},
					{
						title: 'AmeliproTabs',
						synapse: {
							name: 'SyTabs',
							url: getComponentUrl({ name: 'SyTabs', type: 'navigation' }),
						},
						amelipro: {
							name: 'AmeliproTabs',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-tabs',
						},
						props: [
							{ name: 'ariaLabel', reason: 'Géré par le composant' },
							{ name: 'ariaLabelledby', reason: 'Non utilisé' },
							{ name: 'btnGroupClasses', reason: 'Non utilisé' },
							{ name: 'id', reason: 'Non utilisé' },
							{ name: 'noTabDefaultStyle', reason: 'Deux composants totalement différents' },
							{ name: 'pills', reason: 'Deux composants totalement différents' },
						],
					}, {
						title: 'AmeliproTextArea',
						synapse: {
							name: 'SyTextArea',
							url: getComponentUrl({ name: 'SyTextArea', type: 'formulaires' }),
						},
						amelipro: {
							name: 'AmeliproTextArea',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-text-area',
						},
						props: [
							{ name: 'globalMaxWidth', reason: 'Géré par Vuetify' },
							{ name: 'globalMinWidth', reason: 'Géré par Vuetify' },
							{ name: 'horizontal', reason: 'Géré par le projet' },
							{ name: 'inputMaxWidth', reason: 'Géré par Vuetify' },
							{ name: 'inputMinWidth', reason: 'Géré par Vuetify' },
							{ name: 'labelMaxWidth', reason: 'Géré par Vuetify' },
							{ name: 'labelMinWidth', reason: 'Géré par Vuetify' },
							{ name: 'classes', reason: 'Non utilisé' },
						],
					}, {
						title: 'AmeliproTextField',
						synapse: {
							name: 'SyTextField',
							url: getComponentUrl({ name: 'SyTextField', type: 'formulaires' }),
						},
						amelipro: {
							name: 'AmeliproTextField',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-text-field',
						},
						props: [
							{ name: 'classes', reason: 'Non utilisé' },
							{ name: 'disabledDateForSafari', reason: 'Non utilisé' },
							{ name: 'fullWidthErrorMsg', reason: 'Géré par la validation' },
							{ name: 'globalMaxWidth', reason: 'Non utilisé' },
							{ name: 'globalMinWidth', reason: 'Non utilisé' },
							{ name: 'globalWidth', reason: 'Non utilisé' },
							{ name: 'hideErrorMessage', reason: 'Géré par la validation' },
							{ name: 'horizontal', reason: 'Non utilisé' },
							{ name: 'labelMaxWidth', reason: 'Non utilisé' },
							{ name: 'labelMinWidth', reason: 'Non utilisé' },
							{ name: 'maxDate', reason: 'Non utilisé' },
							{ name: 'maxNumber', reason: 'Non utilisé' },
							{ name: 'minDate', reason: 'Non utilisé' },
							{ name: 'minNumber', reason: 'Non utilisé' },
							{ name: 'modelValue', reason: 'Non utilisé' },
							{ name: 'rules', reason: 'Géré par la validation' },
							{ name: 'type', reason: 'Non utilisé' },
							{ name: 'validateOn', reason: 'Géré par la validation' },
						],
					},
					{
						title: 'AmeliproTileBtn',
						synapse: {
							name: 'VCard',
							url: getComponentUrl({ name: 'VCard', type: 'composants vuetify' }),
						},
						amelipro: {
							name: 'AmeliproTileBtn',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-tile-btn',
						},
					},
					{
						title: 'UserInformationSummary',
						synapse: {
							name: 'PageContainer',
							url: getComponentUrl({ name: 'PageContainer--with-header-and-footer', type: 'layout' }),
						},
						amelipro: {
							name: 'UserInformationSummary',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/user-information-summary',
						},
					},
					{
						title: 'AmeliproCustomSelector',
						synapse: {
							name: 'SelectBtnField',
							url: getComponentUrl({ name: 'SelectBtnField--multiple', type: 'formulaires selects' }),
						},
						amelipro: {
							name: 'AmeliproCustomSelector',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-custom-selector',
						},
						props: [
							{ name: 'labelDescription', reason: 'Géré par Items' },
							{ name: 'labelMarginBottom', reason: 'Géré par Items' },
							{ name: 'uniqueId', reason: 'Géré par Items' },
						],
					},
					{
						title: 'AmeliproAccordion',
						synapse: {
							name: 'Accordion',
							url: getComponentUrl({ name: 'Accordion', type: 'données' }),
						},
						amelipro: {
							name: 'AmeliproAccordion',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-accordion',
						},
					},
					{
						title: 'AmeliproCaptcha',
						synapse: {
							name: 'Captcha',
							url: getComponentUrl({ name: 'Captcha', type: 'formulaires' }),
						},
						amelipro: {
							name: 'AmeliproCaptcha',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-captcha',
						},
					},
					{
						title: 'AmeliproUpload',
						synapse: {
							name: 'FileUpload',
							url: getComponentUrl({ name: 'FileUpload', type: 'formulaires' }),
						},
						amelipro: {
							name: 'AmeliproUpload',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-upload',
						},
					},
					{
						title: 'AmeliproTable',
						synapse: {
							name: 'SyTable',
							url: getComponentUrl({ name: 'Sytable', type: 'tableaux' }),
						},
						amelipro: {
							name: 'AmeliproTable',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-table',
						},
					},
					{
						title: 'AmeliproPostalAddressField',
						usedComponents: [
							{
								name: 'SyTextField',
								type: 'formulaires',
							},
							{
								name: 'SySelect',
								type: 'formulaires selects',
							},
						],
						amelipro: {
							name: 'AmeliproPostalAddressField',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-postal-address-field',
						},
					},
					{
						title: 'AmeliproAccordionGroup',
						synapse: {
							name: 'Accordion',
							url: getComponentUrl({ name: 'Accordion', type: 'données' }),
						},
						amelipro: {
							name: 'AmeliproAccordionGroup',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-accordion-group',
						},
						props: [
							{ name: 'defaultItemOpened', reason: 'Géré par le v-model' },
							{ name: 'groupBorderColor', reason: 'Géré par vuetifyOptions' },
							{ name: 'groupBordered', reason: 'Géré par vuetifyOptions' },
							{ name: 'groupColor', reason: 'Géré par vuetifyOptions' },
							{ name: 'groupTitleLevel', reason: 'Géré par vuetifyOptions' },
							{ name: 'groupTitleUppercase', reason: 'Géré par vuetifyOptions' },
							{ name: 'headerRightWidth', reason: 'Géré par vuetifyOptions' },
							{ name: 'hideSeparator', reason: 'Géré par vuetifyOptions' },
						],
					},
					{
						title: 'AmeliproCarousel',
						synapse: {
							name: 'VCarousel',
							url: getComponentUrl({ name: 'VCarousel', type: 'composants vuetify' }),
						},
						amelipro: {
							name: 'AmeliproCarousel',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-carousel',
						},
					},
					{
						title: 'AmeliproAccordionResult',
						synapse: {
							name: 'Accordion',
							url: getComponentUrl({ name: 'Accordion', type: 'données' }),
						},
						amelipro: {
							name: 'AmeliproAccordionResult',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-accordion-result',
						},
					},
					{
						title: 'AmeliproAccordionFrieze',
						synapse: {
							name: 'VSlideGroup',
							url: getComponentUrl({ name: 'VSlideGroup', type: 'composants vuetify' }),
						},
						amelipro: {
							name: 'AmeliproAccordionFrieze',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-accordion-frieze',
						},
					},
					{
						title: 'AmeliproAccordionList',
						synapse: {
							name: 'SyTable',
							url: getComponentUrl({ name: 'sytable--expandable-rows', type: 'tableaux' }),
						},
						amelipro: {
							name: 'AmeliproAccordionList',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-accordion-list',
						},
					},
					{
						title: 'AmeliproAccordionResultList',
						synapse: {
							name: 'SyTable',
							url: getComponentUrl({ name: 'sytable--expandable-rows', type: 'tableaux' }),
						},
						amelipro: {
							name: 'AmeliproAccordionResultList',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-accordion-result-list',
						},
					},
					{
						title: 'AmeliproClickableTile',
						synapse: {
							name: 'VCard',
							url: getComponentUrl({ name: 'VCard', type: 'composants vuetify' }),
						},
						amelipro: {
							name: 'AmeliproClickableTile',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-clickable-tile',
						},
					},
					{
						title: 'AmeliproMessagingLayout',
						synapse: {
							name: 'VNavigationDrawer',
							url: getComponentUrl({ name: 'VNavigationDrawer', type: 'composants vuetify' }),
						},
						amelipro: {
							name: 'AmeliproMessagingLayout',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-messaging-layout',
						},
					},
					{
						title: 'AmeliproPatientLogin',
						usedComponents: [{
							name: 'VCard',
							type: 'composants vuetify',
						}, {
							name: 'VBtn',
							type: 'composants vuetify',
						}, {
							name: 'SyTextField',
							type: 'formulaires ',
						}, {
							name: 'NirField',
							type: 'formulaires ',
						},
						{
							name: 'SyIcon',
							type: 'données',
						}, {
							name: 'SySelect',
							type: 'formulaires selects',
						}],
						amelipro: {
							name: 'AmeliproPatientLogin',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-patient-login',
						},
					},
					{
						title: 'AmeliproPatientLogged',
						usedComponents: [{
							name: 'VCard',
							type: 'composants vuetify',
						}, {
							name: 'VBtn',
							type: 'composants vuetify',
						}, {
							name: 'VTooltip',
							type: 'composants vuetify',
						}, {
							name: 'CopyBtn',
							type: 'boutons',
						}, {
							name: 'SySelect',
							type: 'formulaires selects',
						}],
						amelipro: {
							name: 'AmeliproPatientLogged',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-patient-logged',
						},
					},
					{
						title: 'AmeliproCopyBtn',
						synapse: {
							name: 'CopyBtn',
							url: getComponentUrl({ name: 'CopyBtn', type: 'boutons' }),
						},
						amelipro: {
							name: 'AmeliproCopyBtn',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-copy-btn',
						},
					},
					{
						title: 'AmeliproFirstLogin',
						synapse: {
							name: 'DialogBox',
							url: getComponentUrl({ name: 'DialogBox', type: 'feedback' }),
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

				const headers = ref([
					{
						title: 'Props',
						key: 'name',
					},
					{
						title: 'Raison',
						key: 'reason',
					},
				])

				return { filteredComponents, apComponents, searchTerm, getComponentUrl, systemLabel, headers }
			},

			template: `
				<SyTextField v-model="searchTerm" label="Rechercher un composant" :show-success-messages=false />

				<h5>Composants disponibles : {{filteredComponents.length}}</h5>
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
                        <div class="mt-2 mb-2">
                          <p v-for="item in component.usedComponents" :key="item.name">
                            <a
                                :href="getComponentUrl(item)"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                              {{ item.name }}
                            </a>
                          </p>
                        </div>

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
							Documentation du composant {{ systemLabel(component.synapse) }} {{ component.synapse?.name }}
                        </a>
                      </p>

                      <p class="mt-4">
                        <VDivider class="pb-2" />
                        <a :href="component.amelipro.url" target="_blank">
                          Documentation du composant Amelipro {{ component.amelipro.name }}
                        </a>
                      </p>
						<template v-if="component.props?.length">
							<VDivider class="my-4"/>
							<h4 class="mb-3">
								Props non migrés
							</h4>
							<SyTable
								:items="component.props"
								:headers="headers"
								suffix="table"
								hide-default-footer
								density="compact"
								
							/>
						</template>
                    </template>

                  </VExpansionPanelText>
                </VExpansionPanel>

              </VExpansionPanels>
            `,
		}
	},
	tags: ['!dev'],
}
