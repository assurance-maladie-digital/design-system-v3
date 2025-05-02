import type { StoryObj } from '@storybook/vue3'
import { computed } from 'vue'

export default {
	title: 'Accessibilité/Avancement',
}

export const PreAudit: StoryObj = {
	render: () => {
		return {
			setup() {},
			template: `
				<v-chip
					class="ma-2"
					color="success"
					variant="elevated"
				>
					50/50 Composants
				</v-chip>
			`,
		}
	},
	tags: ['!dev'],
}

export const Manuel: StoryObj = {
	render: () => {
		return {
			setup() {
				const headers = [
					{ text: 'Composant', value: 'composant' },
					{ text: 'Statut', value: 'status' },
				]

				const items = [
					{ composant: 'PageContainer', status: 'Audité' },
					{ composant: 'SkipLink', status: 'Audité' },
					{ composant: 'Alerts', status: 'Audité' },
					{ composant: 'NotificationBar', status: 'Non audité' },
					{ composant: 'BackBtn', status: 'Audité' },
					{ composant: 'BackToTopBtn', status: 'Audité' },
					{ composant: 'CopyBtn', status: 'Audité' },
					{ composant: 'LangBtn', status: 'Audité' },
					{ composant: 'DownloadBtn', status: 'Audité' },
					{ composant: 'FranceConnectBtn', status: 'Audité' },
					{ composant: 'SyTextField', status: 'Audité' },
					{ composant: 'HeaderBar', status: 'Non audité' },
					{ composant: 'HeaderNavigationBar', status: 'Non audité' },
					{ composant: 'LogoBrandSection', status: 'Non audité' },
					{ composant: 'SubHeader', status: 'Non audité' },
					{ composant: 'HeaderLoading', status: 'Non audité' },
					{ composant: 'HeaderToolbar', status: 'Non audité' },
					{ composant: 'Footer', status: 'Non audité' },
					{ composant: 'SySelect', status: 'Non audité' },
					{ composant: 'SyInputSelect', status: 'Non audité' },
					{ composant: 'Logo', status: 'Non audité' },
					{ composant: 'DataListGroup', status: 'Non audité' },
					{ composant: 'DataList', status: 'Non audité' },
					{ composant: 'DataListItem', status: 'Non audité' },
					{ composant: 'DataListLoading', status: 'Non audité' },
					{ composant: 'ErrorPage', status: 'Non audité' },
					{ composant: 'CookieBanner', status: 'Non audité' },
					{ composant: 'ExternalLinks', status: 'Non audité' },
					{ composant: 'ContextualMenu', status: 'Non audité' },
					{ composant: 'DialogBox', status: 'Non audité' },
					{ composant: 'PasswordField', status: 'Non audité' },
					{ composant: 'PhoneField', status: 'Non audité' },
					{ composant: 'UserMenuBtn', status: 'Non audité' },
					{ composant: 'SyBtnSelect', status: 'Non audité' },
					{ composant: 'NirField', status: 'Non audité' },
					{ composant: 'PeriodField', status: 'Non audité' },
					{ composant: 'RangeField', status: 'Non audité' },
					{ composant: 'SearchListField', status: 'Non audité' },
					{ composant: 'SelectBtnField', status: 'Non audité' },
					{ composant: 'RatingPicker', status: 'Non audité' },
					{ composant: 'DatePicker', status: 'Non audité' },
					{ composant: 'FileUpload', status: 'Non audité' },
					{ composant: 'FilePreview', status: 'Non audité' },
					{ composant: 'FileList', status: 'Non audité' },
					{ composant: 'UploadWorkflow', status: 'Non audité' },
					{ composant: 'ChipList', status: 'Non audité' },
					{ composant: 'FilterInline', status: 'Non audité' },
					{ composant: 'FilterSideBar', status: 'Non audité' },
					{ composant: 'PaginatedTable', status: 'Non audité' },
					{ composant: 'TableToolbar', status: 'Non audité' },
				]

				const totalItems = computed(() => items.length)

				const checkedItems = computed(() => {
					return items.filter(item => item.status === 'Audité').length
				})

				return { headers, items, totalItems, checkedItems }
			},
			template: `
				<v-chip
					class="ma-2"
					color="warning"
					variant="elevated"
				>
					{{checkedItems}}/{{totalItems}} Composants
				</v-chip>

				<v-data-table
					:items="items"
					:items-per-page="10"
					class="elevation-1 mt-4"
					item-value="composant"
				>
					<template #item.composant="{ item }">
						{{ item.composant }}
					</template>
					<template #item.status="{ item }">
						<v-chip
							:color="item.status === 'Audité' ? 'warning' : 'error'"
							variant="flat"
							small
						>
							{{ item.status }}
						</v-chip>
					</template>
				</v-data-table>
			`,
		}
	},
	tags: ['!dev'],
}
