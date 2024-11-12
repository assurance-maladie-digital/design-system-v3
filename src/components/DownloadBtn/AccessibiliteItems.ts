import { ExpertiseLevelEnum } from './constants/ExpertiseLevelEnum'

export const AccessibiliteItems = [
	{
		title: 'Catégorie 1 : Images',
		subtitle: '1.4 Pour chaque image utilisée comme CAPTCHA ou comme image-test, ayant une alternative textuelle, cette alternative permet-elle d’identifier la nature et la fonction de l’image ?',
		items: [
			{

				precision: '1.4.1 Pour chaque image (balise <img>) utilisée comme CAPTCHA ou comme image-test, ayant une alternative textuelle, cette alternative est-elle pertinente ?',
				solution: 'Si ces images sont utilisées comme CAPTCHA, vérifier qu\'il existe une alternative non graphique ou une autre solution d\'accès à la fonctionnalité qui est sécurisée par le CAPTCHA',
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
				solution: 'Vérifier que ces éléments on bien vocation à être ignorés par les technologies d\'assistance.',
				expertise: ExpertiseLevelEnum.DEV,

			},

		],
	},

]
