import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { ref, nextTick, defineComponent } from 'vue'
import { useYearListRegionAria } from '../useYearListRegionAria'
import { locales } from '../../locales'
import type { ViewMode } from '../useDatePickerViewMode'

const buildYearsDom = () => {
	const rootEl = document.createElement('div')
	const yearsGrid = document.createElement('div')
	yearsGrid.className = 'v-date-picker-years'
	const yearsContent = document.createElement('div')
	yearsContent.className = 'v-date-picker-years__content'
	yearsContent.tabIndex = 0
	yearsGrid.appendChild(yearsContent)
	rootEl.appendChild(yearsGrid)
	document.body.appendChild(rootEl)
	return { rootEl, yearsContent }
}

const mountComposable = (options: {
	isDatePickerVisible?: boolean
	currentViewMode?: ViewMode
	getRootEl?: () => HTMLElement | null | undefined
} = {}) => {
	const isDatePickerVisible = ref(options.isDatePickerVisible ?? true)
	const currentViewMode = ref<ViewMode>(options.currentViewMode ?? 'year')
	const getRootEl = options.getRootEl ?? (() => null)

	let api!: ReturnType<typeof useYearListRegionAria>
	const TestComponent = defineComponent({
		setup() {
			api = useYearListRegionAria({
				getRootEl,
				isDatePickerVisible,
				currentViewMode,
			})
			return () => null
		},
	})

	const wrapper = mount(TestComponent)
	return { api, isDatePickerVisible, currentViewMode, wrapper }
}

describe('useYearListRegionAria', () => {
	it('applique role=region et aria-label sur .v-date-picker-years__content', () => {
		const { rootEl, yearsContent } = buildYearsDom()

		const { api } = mountComposable({ getRootEl: () => rootEl })
		api.applyYearListRegionAria()

		expect(yearsContent.getAttribute('role')).toBe('region')
		expect(yearsContent.getAttribute('aria-label')).toBe(locales.yearListRegionLabel)
		rootEl.remove()
	})

	it('ne fait rien quand le conteneur années est absent', () => {
		const rootEl = document.createElement('div')
		document.body.appendChild(rootEl)

		const { api } = mountComposable({ getRootEl: () => rootEl })
		expect(() => api.applyYearListRegionAria()).not.toThrow()
		rootEl.remove()
	})

	it('est idempotent : la réapplication conserve un seul role et un seul label', () => {
		const { rootEl, yearsContent } = buildYearsDom()

		const { api } = mountComposable({ getRootEl: () => rootEl })
		api.applyYearListRegionAria()
		api.applyYearListRegionAria()

		expect(yearsContent.getAttribute('role')).toBe('region')
		expect(yearsContent.getAttribute('aria-label')).toBe(locales.yearListRegionLabel)
		rootEl.remove()
	})

	it('réapplique les attributs si Vuetify recrée le conteneur', () => {
		const { rootEl } = buildYearsDom()
		const { api } = mountComposable({ getRootEl: () => rootEl })

		api.applyYearListRegionAria()

		// Vuetify remplace le DOM après une transition : les attributs sont perdus
		const recreated = document.createElement('div')
		recreated.className = 'v-date-picker-years__content'
		rootEl.querySelector('.v-date-picker-years__content')?.replaceWith(recreated)

		api.applyYearListRegionAria()

		expect(recreated.getAttribute('role')).toBe('region')
		expect(recreated.getAttribute('aria-label')).toBe(locales.yearListRegionLabel)
		rootEl.remove()
	})

	it('applique la région à l\'ouverture du calendrier directement en vue années', async () => {
		const { rootEl, yearsContent } = buildYearsDom()

		const { isDatePickerVisible } = mountComposable({
			getRootEl: () => rootEl,
			isDatePickerVisible: false,
			currentViewMode: 'year',
		})

		isDatePickerVisible.value = true
		await nextTick()
		await nextTick()

		expect(yearsContent.getAttribute('role')).toBe('region')
		expect(yearsContent.getAttribute('aria-label')).toBe(locales.yearListRegionLabel)
		rootEl.remove()
	})

	it('n\'applique rien quand le view mode n\'est pas year', async () => {
		const { rootEl, yearsContent } = buildYearsDom()

		mountComposable({ getRootEl: () => rootEl, currentViewMode: 'month' })
		await nextTick()
		await nextTick()

		expect(yearsContent.getAttribute('role')).toBeNull()
		expect(yearsContent.getAttribute('aria-label')).toBeNull()
		rootEl.remove()
	})
})
