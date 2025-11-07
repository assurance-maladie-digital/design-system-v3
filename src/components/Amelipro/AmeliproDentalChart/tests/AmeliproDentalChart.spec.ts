import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproDentalChart from '../AmeliproDentalChart.vue'

describe('AmeliproDentalChart', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproDentalChart, {
			props: {
				modelValue: [
					[
						{
							currentState: {
								decayed: true,
								filled: false,
								missing: false,
							},
							previousState: {
								decayed: true,
								filled: false,
								missing: false,
							},
							toothNumber: '18',
						},
						{
							currentState: {
								decayed: false,
								filled: true,
								missing: false,
							},
							previousState: {
								decayed: false,
								filled: true,
								missing: false,
							},
							toothNumber: '17',
						},
						{
							currentState: {
								decayed: false,
								filled: false,
								missing: true,
							},
							previousState: {
								decayed: false,
								filled: false,
								missing: true,
							},
							toothNumber: '16',
						},
						{
							currentState: {
								decayed: true,
								filled: true,
								missing: false,
							},
							previousState: {
								decayed: true,
								filled: true,
								missing: false,
							},
							toothNumber: '15',
						},
						{
							currentState: {
								decayed: true,
								filled: false,
								missing: false,
							},
							toothNumber: '14',
						},
						{
							currentState: {
								decayed: false,
								filled: true,
								missing: false,
							},
							toothNumber: '13',
						},
						{
							currentState: {
								decayed: false,
								filled: false,
								missing: true,
							},
							toothNumber: '12',
						},
						{
							currentState: {
								decayed: true,
								filled: true,
								missing: false,
							},
							toothNumber: '11',
						},
						{
							currentState: {
								decayed: false,
								filled: false,
								missing: false,
							},
							toothNumber: '21',
						},
						{
							currentState: {
								decayed: false,
								filled: false,
								missing: false,
							},
							toothNumber: '22',
						},
						{
							currentState: {
								decayed: false,
								filled: false,
								missing: false,
							},
							toothNumber: '23',
						},
						{
							currentState: {
								decayed: false,
								filled: false,
								missing: false,
							},
							toothNumber: '24',
						},
						{
							currentState: {
								decayed: false,
								filled: false,
								missing: false,
							},
							toothNumber: '25',
						},
						{
							currentState: {
								decayed: false,
								filled: false,
								missing: false,
							},
							toothNumber: '26',
						},
						{
							currentState: {
								decayed: false,
								filled: false,
								missing: false,
							},
							toothNumber: '27',
						},
						{
							currentState: {
								decayed: false,
								filled: false,
								missing: false,
							},
							toothNumber: '28',
						},
					],
					[
						{
							currentState: {
								decayed: false,
								filled: false,
								missing: false,
							},
							toothNumber: '55',
						},
						{
							currentState: {
								decayed: false,
								filled: false,
								missing: false,
							},
							toothNumber: '54',
						},
						{
							currentState: {
								decayed: false,
								filled: false,
								missing: false,
							},
							toothNumber: '53',
						},
						{
							currentState: {
								decayed: false,
								filled: false,
								missing: false,
							},
							toothNumber: '52',
						},
						{
							currentState: {
								decayed: false,
								filled: false,
								missing: false,
							},
							toothNumber: '51',
						},
						{
							currentState: {
								decayed: false,
								filled: false,
								missing: false,
							},
							toothNumber: '61',
						},
						{
							currentState: {
								decayed: false,
								filled: false,
								missing: false,
							},
							toothNumber: '62',
						},
						{
							currentState: {
								decayed: false,
								filled: false,
								missing: false,
							},
							toothNumber: '63',
						},
						{
							currentState: {
								decayed: false,
								filled: false,
								missing: false,
							},
							toothNumber: '64',
						},
						{
							currentState: {
								decayed: false,
								filled: false,
								missing: false,
							},
							toothNumber: '65',
						},
					],
					[
						{
							currentState: {
								decayed: false,
								filled: false,
								missing: false,
							},
							toothNumber: '85',
						},
						{
							currentState: {
								decayed: false,
								filled: false,
								missing: false,
							},
							toothNumber: '84',
						},
						{
							currentState: {
								decayed: false,
								filled: false,
								missing: false,
							},
							toothNumber: '83',
						},
						{
							currentState: {
								decayed: false,
								filled: false,
								missing: false,
							},
							toothNumber: '82',
						},
						{
							currentState: {
								decayed: false,
								filled: false,
								missing: false,
							},
							toothNumber: '81',
						},
						{
							currentState: {
								decayed: false,
								filled: false,
								missing: false,
							},
							toothNumber: '71',
						},
						{
							currentState: {
								decayed: false,
								filled: false,
								missing: false,
							},
							toothNumber: '72',
						},
						{
							currentState: {
								decayed: false,
								filled: false,
								missing: false,
							},
							toothNumber: '73',
						},
						{
							currentState: {
								decayed: false,
								filled: false,
								missing: false,
							},
							toothNumber: '74',
						},
						{
							currentState: {
								decayed: false,
								filled: false,
								missing: false,
							},
							toothNumber: '75',
						},
					],
					[
						{
							currentState: {
								decayed: false,
								filled: false,
								missing: false,
							},
							toothNumber: '48',
						},
						{
							currentState: {
								decayed: false,
								filled: false,
								missing: false,
							},
							toothNumber: '47',
						},
						{
							currentState: {
								decayed: false,
								filled: false,
								missing: false,
							},
							toothNumber: '46',
						},
						{
							currentState: {
								decayed: false,
								filled: false,
								missing: false,
							},
							toothNumber: '45',
						},
						{
							currentState: {
								decayed: false,
								filled: false,
								missing: false,
							},
							toothNumber: '44',
						},
						{
							currentState: {
								decayed: false,
								filled: false,
								missing: false,
							},
							toothNumber: '43',
						},
						{
							currentState: {
								decayed: false,
								filled: false,
								missing: false,
							},
							toothNumber: '42',
						},
						{
							currentState: {
								decayed: false,
								filled: false,
								missing: false,
							},
							toothNumber: '41',
						},
						{
							currentState: {
								decayed: false,
								filled: false,
								missing: false,
							},
							toothNumber: '31',
						},
						{
							currentState: {
								decayed: false,
								filled: false,
								missing: false,
							},
							toothNumber: '32',
						},
						{
							currentState: {
								decayed: false,
								filled: false,
								missing: false,
							},
							toothNumber: '33',
						},
						{
							currentState: {
								decayed: false,
								filled: false,
								missing: false,
							},
							toothNumber: '34',
						},
						{
							currentState: {
								decayed: false,
								filled: false,
								missing: false,
							},
							toothNumber: '35',
						},
						{
							currentState: {
								decayed: false,
								filled: false,
								missing: false,
							},
							toothNumber: '36',
						},
						{
							currentState: {
								decayed: false,
								filled: false,
								missing: false,
							},
							toothNumber: '37',
						},
						{
							currentState: {
								decayed: false,
								filled: false,
								missing: false,
							},
							toothNumber: '38',
						},
					],
				],
				uniqueId: 'my-btn-id',
			},
			slots: {
				default: 'My Button',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
