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
	{
		title: 'Catégorie 9 : Structuration de l’information',
		subtitle: '9.2.1 Dans chaque page web, la structure du document vérifie-t-elle ces conditions (hors cas particuliers) ? ' +
    				'La zone d’en-tête de la page est structurée via une balise <header> ; ' +
    				'Les zones de navigation principales et secondaires sont structurées via une balise <nav> ; ' +
    				'La balise <nav> est réservée à la structuration des zones de navigation principales et secondaires ; ' +
    				'La zone de contenu principal est structurée via une balise <main> ; ' +
    				'La structure du document utilise une balise <main> visible unique ; ' +
    				'La zone de pied de page est structurée via une balise <footer>.',
		items: [
			{

				precision: '9.1.1 Dans chaque page web, la hiérarchie entre les titres (balise <hx> ou balise possédant un attribut WAI-ARIA role="heading" associé à un attribut WAI-ARIA aria-level) est-elle pertinente ?',
				link: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#9.2.1',
				solution: [{
					info1: '1. Vérifier que la zone d’en-tête est structurée au moyen d’un élément <header> ; ',
					info2: '2. Vérifier que les zones de navigation principales et secondaires sont structurées au moyen d’un élément <nav> ; ',
					info3: '3. Vérifier que l’élément <nav> n’est pas utilisé en dehors de la structuration des zones de navigation principales et secondaires ; ',
					info4: '4. Vérifier que la zone de contenu principal est structurée au moyen d’un élément <main> ; ',
					info5: '5. Si le document possède plusieurs éléments <main>, vérifier qu’un seul de ces éléments est visible (les autres occurrences de l’élément sont pourvues d’un attribut hidden) ; ',
					info6: '6. Vérifier que la zone de pied de page est structurée au moyen d’un élément <footer>. ',
					info7: '7. Si c’est le cas pour chaque zone de contenu, le test est validé. ',

				}],
				expertise: ExpertiseLevelEnum.DEV,

			},

		],
	},
	{
		title: 'Catégorie 10 : Présentation de l’information',
		subtitle: '10.1 Dans le site web, des feuilles de styles sont-elles utilisées pour contrôler la présentation de l’information ? ?',
		items: [

			{
				precision: '10.1.1 Dans chaque page web, les balises servant à la présentation de l’information ne doivent pas être présentes dans le code source généré des pages. Cette règle est-elle respectée ? ',
				link: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#10.1.1',
				solution: [{
					info1: '1. Vérifier l’absence des éléments de présentation <basefont>, <big>, <blink>, <center>, <font>, <marquee>, <s>, <strike>, <tt> ; ',
					info2: '2. Vérifier l’absence de l’élément <u> uniquement si le DOCTYPE du document ne correspond pas à HTML 5 ; ',
					info3: '3. Si c’est le cas, le test est validé',
				}],
				expertise: ExpertiseLevelEnum.DEV,

			},

		],
	},
]

export const AccessibiliteItemsValidated = [
	{
		title: 'Catégorie 1 : Images',
		subtitle: '1.2 Chaque image de décoration est-elle correctement ignorée par les technologies d’assistance ?',
		items: [

			{
				precision: '1.2.4 Chaque image vectorielle (balise <svg>) de décoration, sans légende, vérifie-t-elle ces conditions ?'
					+ ' La balise <svg> possède un attribut WAI-ARIA aria-hidden="true" ;'
					+ ' La balise <svg> et ses enfants sont dépourvus d’alternative textuelle ;'
					+ ' Les balises <title> et <desc> sont absentes ou vides ;'
					+ ' La balise <svg> et ses enfants sont dépourvus d’attribut title.',
				link: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#1.2.4',
				solution: [{
					info1: '1. Retrouver dans le document les images décoratives dépourvues de légende structurées au moyen d’un élément <svg> ;',
					info2: '2. Pour chaque image, vérifier que l’élément <svg> ne possède pas d’attributs aria-labelledby ou aria-label et qu’il :'
						+ ' Possède un attribut WAI-ARIA aria-hidden="true" ;'
						+ ' Et est dépourvu d’alternative textuelle (ainsi que ses éléments enfants) ;'
						+ ' Et ne contient pas d’éléments <title> et <desc> à moins que vides de contenu ;'
						+ ' Et est dépourvu d’attribut title (ainsi que ses éléments enfants).',
					info3: '3. Si c’est le cas pour chaque image, le test est validé',
				}],
				expertise: ExpertiseLevelEnum.DESIGN,

			},

		],
	},
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
			{
				precision: ' 3.2.4 Dans chaque page web, le texte et le texte en image en gras d’une taille restituée supérieure ou égale à 18,5px vérifient-ils une de ces conditions (hors cas particuliers) ? '
					+ 'Le rapport de contraste entre le texte et son arrière-plan est de 3:1, au moins ; '
					+ 'Un mécanisme permet à l’utilisateur d’afficher le texte avec un rapport de contraste de 3:1, au moins. ',
				link: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#3.2.4',
				solution: [{
					info1: '1. Retrouver dans le document les textes et les textes en image en gras d’une taille restituée supérieure ou égale à 18,5px qui pourraient poser des problèmes de contraste ; ',
					info2: '2. Pour chacun de ces textes, vérifier que :  Soit le rapport de contraste entre le texte et son arrière-plan est de 3:1, au moins ; Soit un mécanisme permet à l’utilisateur d’afficher le texte avec un rapport de contraste de 3:1, au moins. ',
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
	{
		title: 'Catégorie 8 : Eléments Obligatoires',
		subtitle: '8.9 Dans chaque page web, les balises ne doivent pas être utilisées uniquement à des fins de présentation',
		items: [

			{
				precision: ' 8.9.1 Dans chaque page web les balises (à l’exception de <div>, <span> et <table>) ne doivent pas être utilisées uniquement à des fins de présentation. Cette règle est-elle respectée',
				link: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#8.9.1',
				solution: [{
					info1: '1. Retrouver dans le document l’ensemble des éléments sémantiques utilisés à des fins de présentation ;',
					info2: '2. Pour chacun de ces éléments, vérifier que :'
						+ 'L’élément est pourvu d’un attribut role=“presentation” ;'
						+ 'L’utilisation de cet élément à des fins de présentation reste justifée',
					info3: '3. Si c’est le cas, le test est validé',
				}],
				expertise: ExpertiseLevelEnum.DESIGN,

			},

		],
	},
]
