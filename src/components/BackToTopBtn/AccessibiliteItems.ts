import { ExpertiseLevelEnum } from './constants/ExpertiseLevelEnum'

export const AccessibiliteItemsIndeterminate = [
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
				expertise: ExpertiseLevelEnum.DEV,

			},
			{

				precision: ' 1.4.6 Pour chaque image vectorielle (balise <svg>) utilisée comme CAPTCHA ou comme image-test, ayant une alternative textuelle, cette alternative est-elle pertinente ?',
				link: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#1.4.6',
				solution: [{
					info1: '1. Retrouver dans le document les éléments <svg> pourvus d’une alternative textuelle et utilisés comme CAPTCHA ou comme image-test;',
					info2: '2. Pour chaque élément <svg>, vérifier que l’alternative textuelle est pertinente',
					info3: '3. Si c’est le cas pour chaque image, le test est validé',
				}],
				expertise: ExpertiseLevelEnum.DEV,

			},

		],
	},
	{
		title: "Catégorie 10 : Présentation de l'information",
		subtitle: '10.8 Pour chaque page web, les contenus cachés ont-ils vocation à être ignorés par les technologies d’assistance',
		items: [
			{

				precision: '10.8.1 Le contenu caché a vocation à être ignoré par les technologies d’assistance , il n’a pas vocation à être ignoré par les technologies d’assistance et est rendu restituable par les technologies d’assistance suite à une action de l’utilisateur réalisable au clavier ou par tout dispositif de pointage sur un élément précédent le contenu caché ou suite à un repositionnement du focus dessus',
				link: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#10.8.1',
				solution: [{
					info1: '1. Retrouver les contenus cachés (éléments pourvus de l’attribut hidden ou de l’attribut WAI-ARIA aria-hidden, ou bien d’une classe ou d’un ensemble de styles CSS susceptibles de masquer le contenu)',
					info2: '2. Pour chaque contenu caché, vérifier que :' +
						'Soit le contenu caché a vocation à être ignoré par les technologies d’assistance (un élément statistique de visites par exemple) ;' +
						'Soit le contenu caché n’a pas vocation à être ignoré par les technologies d’assistance, et dans ce cas il est rendu restituable par les technologies d’assistance au moyen :' +
						'Soit d’une action de l’utilisateur réalisable au clavier ou par tout dispositif de pointage sur un élément précédent le contenu caché ;' +
						'Soit d’une fonction de programmation qui repositionne le focus sur le contenu',
					info3: '3. Si c’est le cas pour chaque contenu caché, le test est validé',
				}],
				expertise: ExpertiseLevelEnum.DEV,

			},

		],
	},
]

export const AccessibiliteItemsValidated = [
	
	{
		title: 'Catégorie 3 : Couleurs',
		subtitle: '3.2 Dans chaque page web, le contraste entre la couleur du texte et la couleur de son arrière-plan est-il suffisamment élevé?',
		items: [
			{

				precision: '3.2.1 Dans chaque page web, le texte et le texte en image sans effet de graisse d’une taille restituée inférieure à 24px vérifient-ils une de ces conditions? Le rapport de contraste entre le texte et son arrière-plan est de 4.5:1, au moins; Un mécanisme permet à l’utilisateur d’afficher le texte avec un rapport de contraste de 4.5:1, au moins.',
				link: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#3.2.1',
				solution: [{
					info1: '1. Retrouver dans le document les textes et les textes en image sans effet de graisse d’une taille restituée inférieure à 24px qui pourraient poser des problèmes de contraste ;',
					info2: '2. Pour chacun de ces textes, vérifier que : Soit le rapport de contraste entre le texte et son arrière-plan est de 4.5:1, au moins; Soit un mécanisme permet à l’utilisateur d’afficher le texte avec un rapport de contraste de 4.5:1, au moins.',
					info3: '3. Si c’est le cas pour chaque texte, le test est validé',
				}],
				expertise: ExpertiseLevelEnum.DESIGN,

			},

		],
	},
	

]
