import { ExpertiseLevelEnum } from '@/common/constants/ExpertiseLevelEnum'

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
		title: 'Catégorie 11 : Formulaires',
		subtitle: '11.2 Chaque étiquette associée à un champ de formulaire est-elle pertinente (hors cas particuliers) ? ',

		items: [
			{
				precision: '11.2.1 Chaque balise <label> permet-elle de connaître la fonction exacte du champ de formulaire auquel elle est associée ?',
				link: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#11.2.1',
				solution: [{
					info1: '1. Retrouver dans le document les champs de formulaire dont l’étiquette est fournie par un élément <label> ; ',
					info2: '2. Pour chaque champ de formulaire, vérifier que le contenu de l’élément est pertinent ; ',
					info3: '3. Si c’est le cas pour chaque champ de formulaire, le test est validé.',
				}],
				expertise: ExpertiseLevelEnum.DEV,

			},
		],

	},
	{
		title: 'Catégorie 12 : Navigation',
		subtitle: '12.9 Dans chaque page web, la navigation ne doit pas contenir de piège au clavier. Cette règle est-elle respectée ?',
		items: [
			{

				precision: '12.9.1 Dans chaque page web, chaque élément recevant le focus vérifie-t-il une de ces conditions ? '
					+ 'Il est possible d’atteindre l’élément suivant ou précédent pouvant recevoir le focus avec la touche de tabulation ;'
					+ 'L’utilisateur est informé d’un mécanisme fonctionnel permettant d’atteindre au clavier l’élément suivant ou précédent pouvant recevoir le focus.',
				link: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#12.9.1',
				solution: [{
					info1: '1. Retrouver dans le document l’ensemble des éléments d’interface susceptibles de recevoir le focus (au moyen de la tabulation ou au moyen d’un script) ;',
					info2: '2. Pour chaque élément d’interface, vérifier que l’utilisateur peut atteindre l’élément suivant ou précédent pouvant recevoir le focus : '
						+ 'Soit au moyen de la touche de tabulation (Tab ou Maj+Tab) ;'
						+ 'Soit au moyen d’une autre interaction clavier dont l’utilisateur est informé (par exemple, les flèches de direction).',
					info3: '3. Si c’est le cas pour chaque élément d’interface, le test est validé.',
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
				precision: '1.2.4 Chaque image vectorielle (balise <svg>) de décoration, sans légende, vérifie-t-elle ces conditions ? '
					+ ' La balise <svg> possède un attribut WAI-ARIA aria-hidden="true" ;'
					+ ' La balise <svg> et ses enfants sont dépourvus d’alternative textuelle ;'
					+ ' Les balises <title> et <desc> sont absentes ou vides ;'
					+ ' La balise <svg> et ses enfants sont dépourvus d’attribut title.',
				link: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#1.2.4',
				solution: [{
					info1: '1. Pour chaque image, vérifier que l’élément <svg> ne possède pas d’attributs aria-labelledby ou aria-label et qu’il :'
						+ ' Possède un attribut WAI-ARIA aria-hidden="true" ;'
						+ ' Et est dépourvu d’alternative textuelle (ainsi que ses éléments enfants) ;'
						+ ' Et ne contient pas d’éléments <title> et <desc> à moins que vides de contenu ;'
						+ ' Et est dépourvu d’attribut title (ainsi que ses éléments enfants).'
						+ ' Le nom du composant est cohérent avec l’état de la fonctionnalité ou des contenus contrôlés (par exemple pour une fonctionnalité permettant d’afficher ou de masquer une zone de contenu).',
					info2: '2. Sinon, vérifier la présence d’un composant d’interface accessible permettant d’accéder aux mêmes fonctionnalités',
					info3: '3. Si c’est le cas pour chaque image, le test est validé.',
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
		title: 'Catégorie 5 : Tableaux',
		subtitle: '5.1 Chaque tableau de données complexe a-t-il un résumé ? ',
		items: [

			{
				precision: '5.1.1 Pour chaque tableau de données complexe, un résumé est-il disponible ? ',
				link: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#5.1.1',
				solution: [{
					info1: '1. Retrouver dans le document les tableaux de données complexes (tableau de données - élément <table> ou élément pourvu d’un attribut WAI-ARIA role="table" - contenant des en-têtes qui ne sont pas répartis uniquement sur la première ligne et/ou la première colonne de la grille ou dont la portée n’est pas valable pour l’ensemble de la colonne ou de la ligne) ; ',
					info2: '2. Pour chaque tableau de données complexe, vérifier qu’un passage de texte permettant de comprendre la nature et la structure du tableau, est présent : '
						+ 'Soit dans l’élément <caption> ; '
						+ 'Soit dans l’attribut summary de l’élément <table> (dans les versions de HTML et de XHTML antérieures à HTML 5) ; '
						+ 'Soit dans un passage de texte lié au tableau avec l’attribut aria-describedby. ',
					info3: '3. Si c’est le cas pour chaque tableau de données complexe, le test est validé.',
				}],
				expertise: ExpertiseLevelEnum.DESIGN,

			},

		],
	},
	{
		title: 'Catégorie 7 : Scripts',
		subtitle: '7.1 Chaque script est-il, si nécessaire, compatible avec les technologies d’assistance ?',
		items: [

			{
				precision: ' 7.1.3 Chaque script qui génère ou contrôle un composant d’interface vérifie-t-il ces conditions : '
					+ 'Le composant possède un nom pertinent ;'
					+ 'Le nom accessible du composant contient au moins l’intitulé visible ;'
					+ 'Le composant possède un rôle pertinent.',

				link: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#7.1.3',
				solution: [{
					info1: '1. Pour chacun des composants d’interface ayant validé le test 7.1.1, vérifier que le composant d’interface possède : ',
					info2: '2. Un nom pertinent (intitulé visible) et un rôle pertinent',
					info3: '3. Si le composant d’interface possède un nom accessible, vérifier que ce nom est pertinent et contient au moins l’intitulé visible.',
				}],
				expertise: ExpertiseLevelEnum.DESIGN,

			},

		],
	},
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
