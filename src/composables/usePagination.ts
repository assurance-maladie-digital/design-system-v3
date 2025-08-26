import type { Breakpoints, IDataListItem } from '../components/Amelipro/types'
import { type Ref, computed, ref, watch } from 'vue'
import type { PaginationTypes } from '../components/Amelipro/AmeliproPagination/types'
import type { SelectItem } from '../components/Amelipro/AmeliproSelect/types'
import { useDisplay } from 'vuetify'

export interface IUsePagination {
	// N° de la page courante
	currentPage: Ref<number>
	// Liste des items de la page courante

	currentPageItems: (currentList: IDataListItem[]) => IDataListItem[]
	// Nombre d'items par page
	itemToDisplay: Ref<number>
	// Nombre total de pages
	pageTotal: Ref<number>
	// À quoi sert la pagination ? Semble non utilisé
	pagination: Ref<boolean>
	// Sélecteur de nombre d'items par page
	paginationSelectItems: SelectItem[]
	// Tableau stockant la pagination
	paginationTable: Ref<PaginationTypes[]>
	// Renseigne le nombre d'items par page au mount du composant et au changement de breakpoint entre desktop et mobile
	setDefaultItemsPerPage: () => void
	// Mise à jour du tableau de pagination

	updatePagination: (currentList: IDataListItem[], itemPerPage: number) => void
}

export const usePagination = (list: IDataListItem[], itemPerPageDefault?: number, itemPerPageDefaultMobile?: number, breakPointValue?: Breakpoints): IUsePagination => {
	const breakPointCurrentValue: Breakpoints = breakPointValue ? breakPointValue : 'mdAndUp'
	const currentDisplay = useDisplay()
	const isDesktop = computed<boolean>(() => currentDisplay[breakPointCurrentValue].value)

	const dataListItems = ref(list)
	const itemToDisplay = ref(10)
	const itemToDisplayForDesktop = itemPerPageDefault ?? itemToDisplay.value
	const itemToDisplayForMobile = itemPerPageDefaultMobile ?? itemToDisplay.value

	const currentPage = ref(1)
	const pagination = ref(false)
	const paginationTable = ref<PaginationTypes[]>([])
	const paginationSelectItems: SelectItem[] = [5, 10, 20, 30, 50, 100].map(value => ({ title: value, value }))

	watch(() => isDesktop.value, () => {
		setDefaultItemsPerPage()
	})

	const setDefaultItemsPerPage = (): void => {
		itemToDisplay.value = isDesktop.value ? itemToDisplayForDesktop : itemToDisplayForMobile
		updatePagination(list, itemToDisplay.value)
	}

	const pageTotal = computed<number>(() => {
		let pages = dataListItems.value.length / itemToDisplay.value
		const reste = dataListItems.value.length % itemToDisplay.value

		if (reste > 0 && pages >= 1) {
			pages += 1
		}

		return Math.trunc(pages)
	})

	const updatePagination = (newList: IDataListItem[], itemPerPage: number): void => {
		dataListItems.value = newList
		itemToDisplay.value = itemPerPage
		paginationTable.value = []
		if (pageTotal.value > 1) {
			for (let i = 1; i <= pageTotal.value; i++) {
				paginationTable.value.push({ key: i })
			}
		}
	}

	const currentPageItems = (newList: IDataListItem[]): IDataListItem[] => {
		dataListItems.value = newList

		if (newList.length > itemToDisplay.value) {
			if (currentPage.value === paginationTable.value.length) {
				return newList.slice((currentPage.value - 1) * itemToDisplay.value, newList.length)
			}
			return newList.slice((currentPage.value - 1) * itemToDisplay.value, currentPage.value * itemToDisplay.value)
		}

		return newList
	}

	// Init pagination
	setDefaultItemsPerPage()

	return {
		currentPage,
		currentPageItems,
		itemToDisplay,
		pageTotal,
		pagination,
		paginationSelectItems,
		paginationTable,
		setDefaultItemsPerPage,
		updatePagination,
	}
}
