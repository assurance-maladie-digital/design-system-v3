import { ExpertiseLevelEnum } from './constants/ExpertiseLevelEnum'

export const AccessibiliteItemsIndeterminate = [
	{
		title: 'Catégorie 3 : Couleurs',
		subtitle: '3.1 Dans chaque page web, l’information ne doit pas être donnée uniquement par la couleur. Cette règle est-elle respectée ?',
		items: [
			{
				precision: '3.1.2 Pour chaque indication de couleur donnée par un texte, l’information ne doit pas être donnée uniquement par la couleur. Cette règle est-elle respectée ?',
				link: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#3.1.2',
				solution: [{
					info1: '1. Retrouver dans le document les textes et les textes en image sans effet de graisse d’une taille restituée inférieure à 24px qui pourraient poser des problèmes de contraste ;',
					info2: '2. Pour chacun de ces textes, vérifier que : Soit le rapport de contraste entre le texte et son arrière-plan est de 4.5:1, au moins; Soit un mécanisme permet à l’utilisateur d’afficher le texte avec un rapport de contraste de 4.5:1, au moins.',
					info3: '3. Si c’est le cas pour chaque texte, le test est validé',
				}],
				expertise: ExpertiseLevelEnum.DEV,

			},

		],
	},
	{
		title: 'Catégorie 6 : Liens',
		subtitle: ' 6.1 Chaque lien est-il explicite',
		items: [
			{

				precision: ' 6.1.5 Pour chaque lien ayant un intitulé visible, le nom accessible du lien contient-il au moins l’intitulé visible (hors cas particuliers) ? '
					+ 'L’intitulé de lien seul permet d’en comprendre la fonction et la destination ; '
					+ 'L’intitulé de lien additionné au contexte du lien permet d’en comprendre la fonction et la destination.',
				link: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#6.1.1',
				solution: [{
					info1: '1. Retrouver dans le document les liens autres que SVG dont le contenu est fourni à la fois par un intitulé visible et par le contenu soit d’un attribut title ou d’un attribut aria-label ou d’un attribut aria-labelledby ; ',
					info2: '2. Pour chaque lien, vérifier que le contenu de l’attribut title ou de l’attribut aria-label ou de l’attribut aria-labelledby contient l’intitulé visible ; ',
					info3: '3. Si c’est le cas pour chaque lien, le test est validé pour les liens autres que SVG. ',
					info4: '4. Retrouver dans le document les liens SVG dont le contenu est fourni à la fois par un intitulé visible et par le contenu soit d’un attribut aria-labelledby, ou d’un attribut aria-label ou d’un élément title (enfant direct de l’élément <svg>) ou d’un attribut x-link:title (SVG 1.1) ou d’un ou plusieurs éléments <text>; ',
					info5: '5. Pour chaque lien SVG, vérifier que le contenu de l’attribut aria-labelledby ou de l’attribut aria-label ou de l’élément <title> ou de l’attribut x-link:title ou d’un ou plusieurs éléments <text> contient l’intitulé visible ; ',
					info6: '6. Si c’est le cas pour chaque lien SVG, le test est validé pour les liens SVG. ',
					info7: '7. Si le test est validé à la fois pour les liens non SVG et pour les liens SVG, le test est globalement validé. ',

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
	{
		title: 'Catégorie 6 : Liens',
		subtitle: '6.2 Dans chaque page web, chaque lien a-t-il un intitulé ? ',
		items: [
			{

				precision: ' 6.2.1 Dans chaque page web, chaque lien a-t-il un intitulé entre <a> et </a> ?',
				link: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#6.2.1',
				solution: [{
					info1: '1. Retrouver dans le document les liens quels qu’ils soient ; ',
					info2: '2. Pour chaque lien, vérifier que le contenu de l’élément <a> (ou d’un élément pourvu d’un attribut WAI-ARIA role=link) contient un intitulé (texte ou alternative) ; ',
					info3: '3. Si c’est le cas pour chaque lien, le test est validé.',
				}],
				expertise: ExpertiseLevelEnum.DESIGN,

			},

		],
	},

]
