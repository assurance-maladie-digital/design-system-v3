import { mount, type MountingOptions, type VueWrapper } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import type Calendar from '../Calendar.vue'

const displayedMonth = new Date(2024, 5, 15, 12)
const today = new Date(2024, 5, 15, 12)
const originalLanguage = Object.getOwnPropertyDescriptor(navigator, 'language')

describe('Calendar', () => {
	let wrapper: VueWrapper<InstanceType<typeof Calendar>> | null = null

	beforeEach(() => {
		vi.useFakeTimers()
		vi.setSystemTime(today)
		Object.defineProperty(navigator, 'language', {
			configurable: true,
			value: 'fr-FR',
		})
	})

	afterEach(() => {
		wrapper?.unmount()
		wrapper = null
		vi.useRealTimers()
		if (originalLanguage) {
			Object.defineProperty(navigator, 'language', originalLanguage)
		}
	})

	async function mountCalendar(
		props: InstanceType<typeof Calendar>['$props'] = {},
		slots?: MountingOptions<InstanceType<typeof Calendar>['$props']>['slots'],
	) {
		const { default: Calendar } = await import('../Calendar.vue')
		wrapper = mount(Calendar, { props, slots })
		return wrapper
	}

	it('renders a six-week grid starting on Monday with localized weekday headings', async () => {
		const wrapper = await mountCalendar({ displayedMonth })

		expect(wrapper.find('.sy-calendar').attributes('aria-label')).toBe('juin 2024')
		expect(wrapper.findAll('.sy-calendar__week')).toHaveLength(6)
		expect(wrapper.findAll('.sy-calendar__day')).toHaveLength(42)
		expect(wrapper.findAll('.sy-calendar__week').at(0)?.findAll('.sy-calendar__day').map(day => day.attributes('data-date')))
			.toEqual(['2024-05-27', '2024-05-28', '2024-05-29', '2024-05-30', '2024-05-31', '2024-06-01', '2024-06-02'])
		expect(wrapper.findAll('th').map(heading => ({
			abbr: heading.attributes('abbr'),
			text: heading.text(),
		}))).toEqual([
			{ abbr: 'lundi', text: 'lun.' },
			{ abbr: 'mardi', text: 'mar.' },
			{ abbr: 'mercredi', text: 'mer.' },
			{ abbr: 'jeudi', text: 'jeu.' },
			{ abbr: 'vendredi', text: 'ven.' },
			{ abbr: 'samedi', text: 'sam.' },
			{ abbr: 'dimanche', text: 'dim.' },
		])
	})

	it('updates the displayed grid when displayedMonth changes', async () => {
		const wrapper = await mountCalendar({ displayedMonth })

		await wrapper.setProps({ displayedMonth: new Date(2024, 11, 15, 12) })
		await nextTick()

		expect(wrapper.find('.sy-calendar').attributes('aria-label')).toBe('décembre 2024')
		expect(wrapper.findAll('.sy-calendar__week').at(0)?.findAll('.sy-calendar__day').map(day => day.attributes('data-date')))
			.toEqual(['2024-11-25', '2024-11-26', '2024-11-27', '2024-11-28', '2024-11-29', '2024-11-30', '2024-12-01'])
		expect(wrapper.find('[data-date="2024-06-15"]').exists()).toBe(false)
		expect(wrapper.find('[data-date="2024-12-15"]').exists()).toBe(true)
	})

	it('falls back to the mocked current month when displayedMonth is undefined', async () => {
		const wrapper = await mountCalendar()

		expect(wrapper.find('.sy-calendar').attributes('aria-label')).toBe('juin 2024')
		expect(wrapper.find('[data-date="2024-06-15"]').exists()).toBe(true)

		await wrapper.setProps({ displayedMonth: undefined })
		await nextTick()

		expect(wrapper.find('.sy-calendar').attributes('aria-label')).toBe('juin 2024')
	})

	it('uses aria-labelledby in preference to the localized accessible name', async () => {
		const wrapper = await mountCalendar({
			ariaLabelledby: 'calendar-heading',
			displayedMonth,
		})

		expect(wrapper.find('.sy-calendar').attributes()).toMatchObject({
			'aria-labelledby': 'calendar-heading',
		})
		expect(wrapper.find('.sy-calendar').attributes('aria-label')).toBeUndefined()
	})

	it('marks today, selected days, range boundaries, and weekends', async () => {
		const wrapper = await mountCalendar({
			displayedMonth,
			selectedDays: [new Date(2024, 5, 10, 12)],
			selectedRange: [new Date(2024, 5, 12, 12), new Date(2024, 5, 14, 12)],
		})

		expect(wrapper.find('[data-date="2024-06-15"] > div').classes()).toContain('sy-calendar__day-content--today')
		expect(wrapper.find('[data-date="2024-06-15"] > div').attributes('aria-current')).toBe('date')
		expect(wrapper.find('[data-date="2024-06-10"] > div').classes()).toContain('sy-calendar__day-content--selected')
		expect(wrapper.find('[data-date="2024-06-10"] > div').attributes('aria-selected')).toBe('true')
		expect(wrapper.find('[data-date="2024-06-12"] > div').classes()).toContain('sy-calendar__day-content--start-range')
		expect(wrapper.find('[data-date="2024-06-13"] > div').classes()).toContain('sy-calendar__day-content--in-range')
		expect(wrapper.find('[data-date="2024-06-14"] > div').classes()).toContain('sy-calendar__day-content--end-range')
		expect(wrapper.find('[data-date="2024-06-01"] > div').classes()).toContain('sy-calendar__day-content--weekend')
		expect(wrapper.find('[data-date="2024-05-31"] > div').classes()).toContain('sy-calendar__day-content--other-month')
	})

	it('renders a named day slot instead of its default content', async () => {
		const wrapper = await mountCalendar({
			displayedMonth,
		}, {
			'day-2024-06-15': '<button class="custom-day">Jour personnalise</button>',
		})

		expect(wrapper.find('[data-date="2024-06-15"] .custom-day').text()).toBe('Jour personnalise')
		expect(wrapper.find('[data-date="2024-06-15"] .sy-calendar__day-content').exists()).toBe(false)
	})
})
