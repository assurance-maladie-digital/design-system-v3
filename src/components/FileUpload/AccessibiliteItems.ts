import { ExpertiseLevelEnum } from './constants/ExpertiseLevelEnum'

export const AccessibiliteItemsIndeterminate = [
]

export const AccessibiliteItemsValidated = [
	{
		title: 'Catégorie 11 : Formulaires',
		subtitle: '11.2  Chaque étiquette associée à un champ de formulaire est-elle pertinente (hors cas particuliers) ?   ',
		items: [
			{

				precision: '11.2.2 Chaque attribut title permet-il de connaître la fonction exacte du champ de formulaire auquel il est associé ? ',
				link: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#11.2.2',
				solution: [{
					info1: '1. Retrouver dans le document les champs de formulaire dont l’étiquette est fournie par un attribut title ; ',
					info2: '2. Pour chaque champ de formulaire, vérifier que le contenu de l’attribut est pertinent ; ',
					info3: '3. Si c’est le cas pour chaque champ de formulaire, le test est validé.',
				}],
				expertise: ExpertiseLevelEnum.DESIGN,

			},
		],

	},

]
