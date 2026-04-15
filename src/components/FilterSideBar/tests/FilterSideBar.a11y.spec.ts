// @vitest-environment jsdom

import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { defineComponent } from 'vue'
import { VApp } from 'vuetify/components'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import FilterSideBar from '../FilterSideBar.vue'

// Scénario d’accessibilité : barre latérale de filtres avec un filtre actif,
// tiroir ouvert et boutons d’action visibles.

const TestA11yComponent = defineComponent({
	components: { VApp, FiltersSideBar: FilterSideBar },
	data() {
		return {
			localModelValue: [
				{
					name: 'name',
					title: 'Nom',
					value: 'John Doe',
				},
			],
		}
	},
	template: `
    <VApp>
      <FiltersSideBar v-model="localModelValue" />
    </VApp>
  `,
})

describe('FilterSideBar – accessibility (axe)', () => {
	it('has no obvious axe violations with drawer open and one active filter', async () => {
		const wrapper = mount(TestA11yComponent, {
			global: {
				stubs: {
					Teleport: true,
				},
			},
			attachTo: document.body,
		})

		const toggleButton = wrapper.find('.sy-filters-side-bar .v-btn__content')
		if (toggleButton.exists()) {
			await toggleButton.trigger('click')
			await wrapper.vm.$nextTick()
		}

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'FilterSideBar – drawer open', {
			ignoreRules: ['region'],
		})

		wrapper.unmount()
	})

	it('has no obvious axe violations in modal mode with drawer open', async () => {
		const wrapper = mount(
			defineComponent({
				components: { VApp, FiltersSideBar: FilterSideBar },
				data() {
					return {
						localModelValue: [{ name: 'name', title: 'Nom' }],
					}
				},
				template: `
					<VApp>
						<FiltersSideBar v-model="localModelValue" :modale="true" />
					</VApp>
				`,
			}),
			{
				global: {
					stubs: { Teleport: true },
				},
				attachTo: document.body,
			},
		)

		const toggleButton = wrapper.find('.sy-filters-side-bar .v-btn__content')
		if (toggleButton.exists()) {
			await toggleButton.trigger('click')
			await wrapper.vm.$nextTick()
		}

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'FilterSideBar – modal mode, drawer open', {
			ignoreRules: ['region'],
		})

		wrapper.unmount()
	})

	it('has no obvious axe violations with drawer closed', async () => {
		const wrapper = mount(TestA11yComponent, {
			global: {
				stubs: { Teleport: true },
			},
			attachTo: document.body,
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'FilterSideBar – drawer closed', {
			ignoreRules: ['region'],
		})

		wrapper.unmount()
	})
})
