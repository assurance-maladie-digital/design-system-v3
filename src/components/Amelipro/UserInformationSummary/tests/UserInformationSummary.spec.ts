import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import UserInformationSummary from '../UserInformationSummary.vue'

describe('UserInformationSummary', () => {
	it('render correctly', async () => {
		const wrapper = mount(UserInformationSummary, {
			props: {
				uniqueId: 'user-information-summary-id',
				userInformationSummaryInfos: {
					userName: 'nom utilisateur',
					denomination: 'dénomination',
					categorieSpecialite: 'catégorie spécialité',
					nomCabinet: 'nom cabinet',
					adresseLigne1: 'adresse ligne 1',
					adresseLigne2: 'adresse ligne 2',
					profil: 'profil',
				},
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
