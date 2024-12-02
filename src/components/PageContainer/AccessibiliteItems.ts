import { ExpertiseLevelEnum } from './constants/ExpertiseLevelEnum'

export const AccessibiliteItemsIndeterminate = [
	{
		title: 'Catégorie 9 : Structuration de l’information',
		subtitle: '9.1 Dans chaque page web, l’information est-elle structurée par l’utilisation appropriée de titres',
		items: [
			{
	
				precision: '9.1.1 Dans chaque page web, la hiérarchie entre les titres (balise <hx> ou balise possédant un attribut WAI-ARIA role="heading" associé à un attribut WAI-ARIA aria-level) est-elle pertinente ?',
				link: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#9.1.1',
				solution: [{
					info1: '1. Retrouver dans le document les titres (balise <hx> ou balise possédant un attribut WAI-ARIA role="heading" associé à un attribut WAI-ARIA aria-level) ;',
					info2: '2. Vérifier que la hiérarchie entre les titres est pertinente ;',
					info3: '3. Si c’est le cas, le test est validé',
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

				precision: '3.2.4 Dans chaque page web, le texte et le texte en image en gras d’une taille restituée supérieure ou égale à 18,5px vérifient-ils une de ces conditions ?' +
				'Le rapport de contraste entre le texte et son arrière-plan est de 3:1, au moins ; '+
				'Un mécanisme permet à l’utilisateur d’afficher le texte avec un rapport de contraste de 3:1, au moins.',
				link: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#3.2.4',
				solution: [{
					info1: '1. Retrouver dans le document les textes et les textes en image en gras d’une taille restituée supérieure ou égale à 18,5px qui pourraient poser des problèmes de contraste ;',
					info2: '2. Pour chacun de ces textes, vérifier que : '+
    							'Soit le rapport de contraste entre le texte et son arrière-plan est de 3:1, au moins ; '+
    							'Soit un mécanisme permet à l’utilisateur d’afficher le texte avec un rapport de contraste de 3:1, au moins.',
					info3: '3. Si c’est le cas pour chaque texte, le test est validé',
				}],
				expertise: ExpertiseLevelEnum.DESIGN,

			},

		],
	},
	

]