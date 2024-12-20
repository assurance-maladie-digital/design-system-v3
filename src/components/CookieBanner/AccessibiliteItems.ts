import { ExpertiseLevelEnum } from './constants/ExpertiseLevelEnum'

export const AccessibiliteItemsIndeterminate = [

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
				expertise: ExpertiseLevelEnum.DEV,

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
				expertise: ExpertiseLevelEnum.DEV,

			},

		],
	},

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
	{
		title: 'Catégorie 11 : Formulaires',
		subtitle: '11.12 Pour chaque formulaire qui modifie ou supprime des données, ou qui transmet des réponses à un test ou à un examen, ou dont la validation a des conséquences financières ou juridiques, les données saisies peuvent-elles être modifiées, mises à jour ou récupérées par l’utilisateur ? ',

		items2: [

			{

				subtitle: '11.2 Chaque étiquette associée à un champ de formulaire est-elle pertinente (hors cas particuliers) ?',
				precision: ' 11.2.3 Chaque étiquette implémentée via l’attribut WAI-ARIA aria-label permet-elle de connaître la fonction exacte du champ de formulaire auquel elle est associée ? ',
				link: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#11.2.3',
				solution: [{
					info1: '1. Retrouver dans le document les champs de formulaire dont l’étiquette est fournie par un attribut WAI-ARIA aria-label ; ',
					info2: '2. Pour chaque champ de formulaire, vérifier que le contenu de l’attribut est pertinent ; ',
					info3: '3. Si c’est le cas pour chaque champ de formulaire, le test est validé.',
				}],
				expertise: ExpertiseLevelEnum.DEV,

			},
			{

				subtitle: '11.9 Dans chaque formulaire, l’intitulé de chaque bouton est-il pertinent (hors cas particuliers) ?',
				precision: '11.9.1 L’intitulé de chaque bouton vérifie-t-il ces conditions (hors cas particuliers) ? '
					+ 'S’il est présent, le contenu de l’attribut WAI-ARIA aria-label est pertinent ; '
					+ 'S’il est présent, le contenu de l’attribut value d’une balise <input> de type submit, reset ou button est pertinent ; '
					+ 'S’il est présent, le contenu de la balise <button> est pertinent ; '
					+ 'S’il est présent, le contenu de l’attribut alt d’une balise <input> de type image est pertinent ; '
					+ 'S’il est présent, le contenu de l’attribut title est pertinent. ',
				link: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#11.9.1',
				solution: [{
					info1: '1. Retrouver dans le document les boutons présents au sein d’un formulaire ; ',
					info2: '2. Pour chaque bouton, vérifier que son intitulé visible et son nom accessible sont pertinents ; ',
					info3: '3. Si c’est le cas pour chaque bouton, le test est validé.',
				}],
				expertise: ExpertiseLevelEnum.DEV,

			},

		],
		items: [
			{
				precision: '11.12.1 Pour chaque formulaire qui modifie ou supprime des données, ou qui transmet des réponses à un test ou un examen, ou dont la validation a des conséquences financières ou juridiques, la saisie des données vérifie-t-elle une de ces conditions ?  ' +
					'L’utilisateur peut modifier ou annuler les données et les actions effectuées sur ces données après la validation du formulaire ; '
					+ 'L’utilisateur peut vérifier et corriger les données avant la validation d’un formulaire en plusieurs étapes ; '
					+ 'Un mécanisme de confirmation explicite, via une case à cocher (balise <input> de type checkbox ou balise ayant un attribut WAI-ARIA role="checkbox") ou une étape supplémentaire, est présent.',
				link: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#11.12.1',
				solution: [{
					info1: '1. Retrouver dans le document les formulaires qui modifient ou suppriment des données, ou qui transmettent des réponses à un test ou un examen, ou dont la validation a des conséquences financières ou juridiques ; ',
					info2: '2. Pour chaque formulaire, vérifier que l’utilisateur peut : ' +
						'Soit modifier ou annuler les données et les actions effectuées sur ces données après la validation du formulaire ; ' +
						'Soit vérifier et corriger les données avant la validation d’un formulaire en plusieurs étapes ; ' +
						'Soit disposer d’un mécanisme de confirmation explicite (par exemple, une case à cocher ou une étape supplémentaire). ',
					info3: '3. Si c’est le cas pour chaque champ de formulaire retrouvé, le test est validé.',
				}],
				expertise: ExpertiseLevelEnum.DEV,

			},
			{
				precision: '11.12.2 Chaque formulaire dont la validation modifie ou supprime des données à caractère financier, juridique ou personnel vérifie-t-il une de ces conditions ? ' +
					'Un mécanisme permet de récupérer les données supprimées ou modifiées par l’utilisateur ; ' +
					'Un mécanisme de demande de confirmation explicite de la suppression ou de la modification, via un champ de formulaire ou une étape supplémentaire, est proposé. ',
				link: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#11.12.2',
				solution: [{
					info1: '1. Retrouver dans le document les formulaires qui modifient ou suppriment des données à caractère financier, juridique ou personnel ; ',
					info2: '2. Pour chaque formulaire, vérifier que l’utilisateur dispose : ' +
						'Soit d’un mécanisme qui permet de récupérer les données supprimées ou modifiées ; ' +
						'Soit d’un mécanisme de demande de confirmation explicite de la suppression ou de la modification (par exemple, une case à cocher ou une étape supplémentaire). ',
					info3: '3. Si c’est le cas pour chaque champ de formulaire retrouvé, le test est validé.',
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
		title: 'Catégorie 5 : Tableaux',
		subtitle: '5.6 Pour chaque tableau de données, chaque en-tête de colonne et chaque en-tête de ligne sont-ils correctement déclarés ? ',

		items: [

			{
				precision: '5.6.1 our chaque tableau de données, chaque en-tête de colonne s’appliquant à la totalité de la colonne vérifie-t-il une de ces conditions ? '
					+ 'L’en-tête de colonnes est structuré au moyen d’une balise <th> ; '
					+ 'L’en-tête de colonnes est structuré au moyen d’une balise pourvue d’un attribut WAI-ARIA role="columnheader". ',
				link: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#5.6.1',
				solution: [{
					info1: '1. Retrouver dans le document les tableaux de données ; ',
					info2: '2. Pour chaque en-tête de colonnes s’appliquant à la totalité de la colonne, vérifier que l’en-tête de colonne est structuré au moyen : ' +
						'Soit d’un élément <th> ; ' +
						'Soit d’un élément pourvu d’un attribut WAI-ARIA role="columnheader".',
					info3: '3. Si c’est le cas pour chaque en-tête de colonne s’appliquant à la totalité de la colonne, le test est validé.',
				}],
				expertise: ExpertiseLevelEnum.DESIGN,

			},

		],
		items2: [

			{
				subtitle: '5.1 Chaque tableau de données complexe a-t-il un résumé ? ',
				precision: '5.1.1 Pour chaque tableau de données complexe, un résumé est-il disponible ? ',
				link: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#5.1.1',
				solution: [{
					info1: '1. Retrouver dans le document les tableaux de données complexes (tableau de données - élément <table> ou élément pourvu d’un attribut WAI-ARIA role="table" - contenant des en-têtes qui ne sont pas répartis uniquement sur la première ligne et/ou la première colonne de la grille ou dont la portée n’est pas valable pour l’ensemble de la colonne ou de la ligne) ; ',
					info2: '2. Pour chaque tableau de données complexe, vérifier qu’un passage de texte permettant de comprendre la nature et la structure du tableau, est présent : ' +
						'Soit dans l’élément <caption> ; ' +
						'Soit dans l’attribut summary de l’élément <table> (dans les versions de HTML et de XHTML antérieures à HTML 5) ; ' +
						'Soit dans un passage de texte lié au tableau avec l’attribut aria-describedby. ',
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
			{
				precision: '11.2.5 Chaque champ de formulaire ayant un intitulé visible vérifie-t-il ces conditions (hors cas particuliers) ? '
					+ 'S’il est présent, le contenu de l’attribut WAI-ARIA aria-label du champ de formulaire contient au moins l’intitulé visible ; '
					+ 'S’il est présent, le passage de texte lié au champ de formulaire via un attribut WAI-ARIA aria-labelledby contient au moins l’intitulé visible ; '
					+ 'S’il est présent, le contenu de l’attribut title du champ de formulaire contient au moins l’intitulé visible ; '
					+ 'S’il est présent le contenu de la balise <label> associé au champ de formulaire contient au moins l’intitulé visible.',
				link: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#11.2.5',
				solution: [{
					info1: '1. Retrouver dans le document les champs de formulaire dont l’étiquette est fournie à la fois par un intitulé visible et par le contenu soit d’un élément <label>, soit d’un attribut title ou d’un attribut aria-label ou d’un attribut aria-labelledby ; ',
					info2: '2. Pour chaque champ de formulaire, vérifier que le contenu de l’élément <label> ou de l’attribut title ou de l’attribut aria-label ou de l’attribut aria-labelledby contient l’intitulé visible ; ',
					info3: '3. Si c’est le cas pour chaque champ de formulaire, le test est validé. ',
				}],
				expertise: ExpertiseLevelEnum.DESIGN,

			},
		],

		items2: [
			{
				subtitle: '11.1 Chaque champ de formulaire a-t-il une étiquette ',
				precision: '11.1.1 Chaque champ de formulaire vérifie-t-il une de ces conditions ? '
					+ 'Le champ de formulaire possède un attribut WAI-ARIA aria-labelledby référençant un passage de texte identifié ; '
					+ 'Le champ de formulaire possède un attribut WAI-ARIA aria-label ; '
					+ 'Une balise <label> ayant un attribut for est associée au champ de formulaire ; '
					+ 'Le champ de formulaire possède un attribut title ; '
					+ 'Un bouton adjacent au champ de formulaire lui fournit une étiquette visible et un élément <label> visuellement caché ou un attribut WAI-ARIA aria-label, aria-labelledby ou title lui fournit un nom accessible.',
				link: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#11.1.1',
				solution: [{
					info1: '1. Retrouver dans le document les champs de formulaire ; ',
					info2: '2. Pour chaque champ de formulaire, vérifier que le champ de formulaire : '
						+ 'Possède un attribut WAI-ARIA aria-labelledby référençant un passage de texte identifié ; '
						+ 'Possède un attribut WAI-ARIA aria-label ; '
						+ 'Est associé à un élément <label> ayant un attribut for ; '
						+ 'Possède un attribut title ; '
						+ 'Un bouton adjacent au champ de formulaire lui fournit une étiquette visible et un élément <label> visuellement caché ou un attribut WAI-ARIA aria-label, aria-labelledby ou title lui fournit un nom accessible. ',
					info3: '3. Si c’est le cas pour champ de formulaire, le test est validé. ',
				}],
				expertise: ExpertiseLevelEnum.DESIGN,

			},

		],

	},

]
