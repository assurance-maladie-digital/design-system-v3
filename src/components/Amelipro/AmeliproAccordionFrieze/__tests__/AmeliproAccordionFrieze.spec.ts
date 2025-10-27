import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproAccordionFrieze from '../AmeliproAccordionFrieze.vue'

describe('AmeliproAccordionFrieze', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproAccordionFrieze, {
			props: {
				defaultOpenedAccordion: '1',
				defaultSlide: 1,
				duration: 0.5,
				fillSlideOrientation: 'right',
				items: [
					{
						linkStyleText: 'sous-titre 1',
						title: 'titre 1',
						uniqueId: '1',
					},
					{
						linkStyleText: 'sous-titre 2',
						title: 'titre 2',
						uniqueId: '2',
					},
					{
						linkStyleText: 'sous-titre 3',
						title: 'titre 3',
						uniqueId: '3',
					},
					{
						linkStyleText: 'sous-titre 4',
						title: 'titre 4',
						uniqueId: '4',
					},
					{
						linkStyleText: 'sous-titre 5',
						title: 'titre 5',
						uniqueId: '5',
					},
					{
						linkStyleText: 'sous-titre 6',
						title: 'titre 6',
						uniqueId: '6',
					},
					{
						linkStyleText: 'sous-titre 7',
						title: 'titre 7',
						uniqueId: '7',
					},
					{
						linkStyleText: 'sous-titre 8',
						title: 'titre 8',
						uniqueId: '8',
					},
					{
						linkStyleText: 'sous-titre 9',
						title: 'titre 9',
						uniqueId: '9',
					},
					{
						linkStyleText: 'sous-titre 10',
						title: 'titre 10',
						uniqueId: '10',
					},
					{
						linkStyleText: 'sous-titre 11',
						title: 'titre 11',
						uniqueId: '11',
					},
					{
						linkStyleText: 'sous-titre 12',
						title: 'titre 12',
						uniqueId: '12',
					},
					{
						linkStyleText: 'sous-titre 13',
						title: 'titre 13',
						uniqueId: '13',
					},
					{
						linkStyleText: 'sous-titre 14',
						title: 'titre 14',
						uniqueId: '14',
					},
				],
				labelNextBtn: 'Next btn',
				labelPreviousBtn: 'Previous btn',
				title: 'mon titre',
				uniqueId: 'amelipro-accordion-frieze-unique-id',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
