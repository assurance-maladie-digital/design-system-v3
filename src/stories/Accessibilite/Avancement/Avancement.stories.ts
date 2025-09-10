import type { StoryObj } from '@storybook/vue3'
import { computed, ref } from 'vue'

type AuditStatus = 'Audité' | 'En cours' | 'Non audité'
type AuditItem = { composant: string, status: AuditStatus, lastUpdate?: string }

const STATUS = {
	AUDITED: 'Audité' as AuditStatus,
	IN_PROGRESS: 'En cours' as AuditStatus,
	NOT_AUDITED: 'Non audité' as AuditStatus,
}

const ITEMS: AuditItem[] = [
	{ composant: 'PageContainer', status: STATUS.AUDITED },
	{ composant: 'SkipLink', status: STATUS.AUDITED },
	{ composant: 'Alerts', status: STATUS.AUDITED },
	{ composant: 'NotificationBar', status: STATUS.NOT_AUDITED },
	{ composant: 'BackBtn', status: STATUS.AUDITED },
	{ composant: 'BackToTopBtn', status: STATUS.AUDITED },
	{ composant: 'CopyBtn', status: STATUS.AUDITED },
	{ composant: 'LangBtn', status: STATUS.AUDITED },
	{ composant: 'DownloadBtn', status: STATUS.AUDITED },
	{ composant: 'FranceConnectBtn', status: STATUS.AUDITED },
	{ composant: 'SyTextField', status: STATUS.AUDITED },
	{ composant: 'HeaderBar', status: STATUS.AUDITED },
	{ composant: 'HeaderNavigationBar', status: STATUS.AUDITED },
	{ composant: 'LogoBrandSection', status: STATUS.AUDITED },
	{ composant: 'SubHeader', status: STATUS.AUDITED },
	{ composant: 'HeaderLoading', status: STATUS.AUDITED },
	{ composant: 'HeaderToolbar', status: STATUS.IN_PROGRESS },
	{ composant: 'Footer', status: STATUS.AUDITED },
	{ composant: 'SySelect', status: STATUS.AUDITED },
	{ composant: 'SyInputSelect', status: STATUS.NOT_AUDITED },
	{ composant: 'Logo', status: STATUS.AUDITED },
	{ composant: 'DataListGroup', status: STATUS.AUDITED },
	{ composant: 'DataList', status: STATUS.AUDITED },
	{ composant: 'DataListItem', status: STATUS.AUDITED },
	{ composant: 'DataListLoading', status: STATUS.AUDITED },
	{ composant: 'ErrorPage', status: STATUS.AUDITED },
	{ composant: 'CookieBanner', status: STATUS.AUDITED },
	{ composant: 'ContextualMenu', status: STATUS.AUDITED },
	{ composant: 'DialogBox', status: STATUS.NOT_AUDITED },
	{ composant: 'PasswordField', status: STATUS.IN_PROGRESS },
	{ composant: 'PhoneField', status: STATUS.AUDITED },
	{ composant: 'UserMenuBtn', status: STATUS.NOT_AUDITED },
	{ composant: 'SyBtnSelect', status: STATUS.NOT_AUDITED },
	{ composant: 'NirField', status: STATUS.IN_PROGRESS },
	{ composant: 'PeriodField', status: STATUS.NOT_AUDITED },
	{ composant: 'RangeField', status: STATUS.NOT_AUDITED },
	{ composant: 'SearchListField', status: STATUS.NOT_AUDITED },
	{ composant: 'SelectBtnField', status: STATUS.NOT_AUDITED },
	{ composant: 'RatingPicker', status: STATUS.NOT_AUDITED },
	{ composant: 'DatePicker', status: STATUS.NOT_AUDITED },
	{ composant: 'FileUpload', status: STATUS.NOT_AUDITED },
	{ composant: 'FilePreview', status: STATUS.NOT_AUDITED },
	{ composant: 'FileList', status: STATUS.NOT_AUDITED },
	{ composant: 'UploadWorkflow', status: STATUS.NOT_AUDITED },
	{ composant: 'ChipList', status: STATUS.AUDITED },
	{ composant: 'FilterInline', status: STATUS.NOT_AUDITED },
	{ composant: 'FilterSideBar', status: STATUS.NOT_AUDITED },
	{ composant: 'PaginatedTable', status: STATUS.NOT_AUDITED },
	{ composant: 'TableToolbar', status: STATUS.NOT_AUDITED },
	{ composant: 'NotFoundPage', status: STATUS.AUDITED },
	{ composant: 'MaintenancePage', status: STATUS.AUDITED },
	{ composant: 'ExternalLinks', status: STATUS.AUDITED },
	{ composant: 'SyIcon', status: STATUS.NOT_AUDITED },
	{ composant: 'SocialMediaLinks', status: STATUS.AUDITED },
	{ composant: 'CollapsibleList', status: STATUS.AUDITED },
	{ composant: 'Accordion', status: STATUS.NOT_AUDITED },
	{ composant: 'ToolbarContainer', status: STATUS.NOT_AUDITED },
	{ composant: 'SyTable', status: STATUS.NOT_AUDITED },
	{ composant: 'SyTableServer', status: STATUS.NOT_AUDITED },
	{ composant: 'Diacritic', status: STATUS.NOT_AUDITED },
	{ composant: 'SyCheckBox', status: STATUS.NOT_AUDITED },
	{ composant: 'SyTabs', status: STATUS.NOT_AUDITED },
]

function countByStatus(items: AuditItem[]) {
	const audited = items.filter(i => i.status === STATUS.AUDITED).length
	const inProgress = items.filter(i => i.status === STATUS.IN_PROGRESS).length
	const notAudited = items.filter(i => i.status === STATUS.NOT_AUDITED).length
	return { audited, inProgress, notAudited, total: items.length }
}

function useAuditFilters(source: AuditItem[]) {
	const search = ref('')
	const statusFilter = ref<'all' | 'audited' | 'in-progress' | 'not-audited'>('all')
	const page = ref(1)
	const itemsPerPage = 20

	const filteredItems = computed(() => {
		let result = [...source]
		if (statusFilter.value !== 'all') {
			result = result.filter((item) => {
				switch (statusFilter.value) {
					case 'audited':
						return item.status === STATUS.AUDITED
					case 'in-progress':
						return item.status === STATUS.IN_PROGRESS
					case 'not-audited':
						return item.status === STATUS.NOT_AUDITED
				}
			})
		}
		if (search.value) {
			const q = search.value.toLowerCase()
			result = result.filter(i => i.composant.toLowerCase().includes(q))
		}
		return result
	})

	const paginatedItems = computed(() => {
		const start = (page.value - 1) * itemsPerPage
		return filteredItems.value.slice(start, start + itemsPerPage)
	})

	return {
		search,
		statusFilter,
		page,
		itemsPerPage,
		filteredItems,
		paginatedItems,
	}
}

export default {
	title: 'Accessibilité/Design System/Avancement',
}

export const Stats: StoryObj = {
	render: () => {
		return {
			setup() {
				const { audited, inProgress, notAudited, total } = countByStatus(ITEMS)
				return {
					auditedCount: audited,
					inProgressCount: inProgress,
					notAuditedCount: notAudited,
					totalCount: total,
				}
			},
			template: `
        <div class="progress-stats">
          <div class="stat-item">
            <span class="stat-value stat-success">{{ auditedCount }}</span>
            <span class="stat-label">Composants audités</span>
          </div>
          <div class="stat-item">
            <span class="stat-value stat-wip">{{ inProgressCount }}</span>
            <span class="stat-label">En cours</span>
          </div>
          <div class="stat-item">
            <span class="stat-value stat-info">{{ totalCount }}</span>
            <span class="stat-label">Total des composants</span>
          </div>
        </div>
      `,
		}
	},
	tags: ['!dev'],
}

export const PreAudit: StoryObj = {
	render: () => {
		return {
			setup() {
				const totalCount = ITEMS.length
				return { totalCount }
			},
			template: `
        <v-chip
          class="ma-2"
          color="success"
          variant="elevated"
        >
          {{ totalCount }}/{{ totalCount }} Composants
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
					{ text: 'Dernière mise à jour', value: 'lastUpdate' },
				]

				const statusOptions = [
					{ title: 'Tous les composants', value: 'all' },
					{ title: 'Audités', value: 'audited' },
					{ title: 'En cours', value: 'in-progress' },
					{ title: 'Non audités', value: 'not-audited' },
				]

				const { search, statusFilter, page, itemsPerPage, filteredItems, paginatedItems } = useAuditFilters(ITEMS)

				const totalItems = computed(() => ITEMS.length)
				const checkedItems = computed(() => ITEMS.filter(i => i.status === STATUS.AUDITED).length)

				return {
					headers,
					items: ITEMS,
					filteredItems,
					totalItems,
					checkedItems,
					search,
					statusFilter,
					statusOptions,
					page,
					itemsPerPage,
					// couleurs de statut pour les puces
					statusColor: (s: AuditStatus) =>
						s === STATUS.AUDITED ? '#56c271' : s === STATUS.IN_PROGRESS ? '#a05bb6' : '#f0b323',
					paginatedItems,
				}
			},
			template: `
        <div class="audit-dashboard pa-4">
          <div class="d-flex flex-wrap align-center justify-space-between mb-6">
            <div class="d-flex flex-wrap">
              <v-select
                v-model="statusFilter"
                :items="statusOptions"
                item-title="title"
                item-value="value"
                label="Filtrer par statut"
                hide-details
                class="mr-2 mb-2"
                style="max-width: 250px; min-width: 250px"
                density="comfortable"
                variant="outlined"
              />
              
              <v-text-field
                v-model="search"
                label="Rechercher un composant"
                append-inner-icon="mdi-magnify"
                single-line
                hide-details
                class="mb-2"
                style="max-width: 250px; min-width: 250px"
                density="comfortable"
                variant="outlined"
              />
            </div>
          </div>

          <div class="component-grid mb-6">
            <v-row>
              <v-col
                v-for="item in paginatedItems"
                :key="item.composant"
                cols="12"
                sm="6"
                md="4"
                lg="3"
              >
                <v-card
                  class="component-card"
                  :class="{ 'audited': item.status === 'Audité', 'in-progress': item.status === 'En cours', 'not-audited': item.status === 'Non audité' }"
                  elevation="2"
                  height="100%"
                >
                  <v-card-item>
                    <v-card-title class="text-truncate">{{ item.composant }}</v-card-title>
                  </v-card-item>
                  
                  <v-card-text>
                    <v-chip
                      :color="statusColor(item.status)"
                      variant="flat"
                      class="mb-2"
                    >
                      {{ item.status }}
                    </v-chip>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <div class="d-flex justify-center mt-4">
              <v-pagination
                v-model="page"
                :length="Math.ceil(filteredItems.length / itemsPerPage)"
                total-visible="7"
                rounded
              />
            </div>

            <div class="pa-2 text-caption text-right">
              Dernière mise à jour: 10/09/2025
            </div>
          </div>
        </div>
      `,
		}
	},
	tags: ['!dev'],
}
