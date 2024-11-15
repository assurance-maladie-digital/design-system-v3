import { ExpertiseLevelEnum } from './constants/ExpertiseLevelEnum'

export const AccessibiliteItems = [
	{
		title: 'Catégorie 1 : Images',
		subtitle: '1.4 Pour chaque image utilisée comme CAPTCHA ou comme image-test, ayant une alternative textuelle, cette alternative permet-elle d’identifier la nature et la fonction de l’image ?',
		items: [
			{

				precision: '1.4.1 Pour chaque image (balise <img>) utilisée comme CAPTCHA ou comme image-test, ayant une alternative textuelle, cette alternative est-elle pertinente ?',
				link: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#1.4.1',
				solution: [{
					info1: '1. Retrouver dans le document les images structurées au moyen d’un élément <img> pourvues d’une alternative textuelle et utilisées comme CAPTCHA ou comme image-test',
					info2: '2. Pour chaque image, vérifier que l’alternative textuelle est pertinente',
					info3: '3. Si c’est le cas pour chaque image, le test est validé',
				}],
				expertise: ExpertiseLevelEnum.DESIGN,

			},

		],
	},
	{
		title: 'Catégorie 10 : Présentation de l’information',
		subtitle: '10.8 Pour chaque page Web, les contenus cachés ont-ils vocation à être ignorés par les technologies d’assistance ?',
		items: [

			{
				precision: '10.8.1 Dans chaque page web, chaque contenu caché vérifie-t-il une de ces conditions ? - le contenu caché a vocation à être ignoré par les technologies d’assistance ;Le contenu caché n’a pas vocation à être ignoré par les technologies d’assistance et est rendu restituable par les technologies d’assistance suite à une action de l’utilisateur réalisable au clavier ou par tout dispositif de pointage sur un élément précédent le contenu caché ou suite à un repositionnement du focus dessus.',
				link: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#10.8.1',
				solution: [{
					info1: '1. Retrouver les contenus cachés (éléments pourvus de l’attribut hidden ou de l’attribut WAI-ARIA aria-hidden, ou bien d’une classe ou d’un ensemble de styles CSS susceptibles de masquer le contenu)',
					info2: '2. Pour chaque contenu caché, vérifier que :Soit le contenu caché a vocation à être ignoré par les technologies d’assistance (un élément statistique de visites par exemple) ; Soit le contenu caché n’a pas vocation à être ignoré par les technologies d’assistance, et dans ce cas il est rendu restituable par les technologies d’assistance au moyen : Soit d’une action de l’utilisateur réalisable au clavier ou par tout dispositif de pointage sur un élément précédent le contenu caché ; Soit d’une fonction de programmation qui repositionne le focus sur le contenu.',
					info3: '3. Si c’est le cas pour chaque contenu caché, le test est validé',
				}],
				expertise: ExpertiseLevelEnum.DEV,

			},

		],
	},

]
