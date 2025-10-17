import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproOnboarding from '../AmeliproOnboarding.vue'

describe('AmeliproOnboarding', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproOnboarding, {
			props: {
				steps: [
					{
						content: [
							'Dans cet espace, vous allez pouvoir souscrire un contrat d’engagement au dispositif AIR afin de permettre aux professionnels de santé '
							+ 'de votre établissement de consulter le DMP de leurs patients.',
						],
						img: 'img-1',
						title: 'Gérez votre contrat d’accès au DMP en toute simplicité',
					},
					{
						content: [
							'Vous avez la possibilité de désigner les personnes qui seront les contacts privilégiés de l’Assurance Maladie dans la gestion au quotidien de la solution AIR.',
						],
						img: 'img-2',
						title: 'Ajoutez ou modifiez des contacts',
					},
					{
						content: [
							'A partir de la page principale, vous pouvez consulter vos conditions d’engagement et retrouver les documents  '
							+ 'utiles à l’application des conditions de mise en œuvre de la solution AIR.',
						],
						img: 'img-3',
						title: 'Retrouvez les informations utiles à la gestion de vos contrats',
					},
				],
				title: 'titre de la modale',
				uniqueId: 'my-onboarding-id',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
