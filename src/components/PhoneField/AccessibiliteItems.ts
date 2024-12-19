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

		],
	},
	{
		title: 'Catégorie 10 : Présentation de l’information',
		items2: [

			{
				subtitle: '10.1 Dans le site web, des feuilles de styles sont-elles utilisées pour contrôler la présentation de l’information ? ?',
				precision: '10.1.1 Dans chaque page web, les balises servant à la présentation de l’information ne doivent pas être présentes dans le code source généré des pages. Cette règle est-elle respectée ? ',
				link: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#10.1.1',
				solution: [{
					info1: '1. Vérifier l’absence des éléments de présentation <basefont>, <big>, <blink>, <center>, <font>, <marquee>, <s>, <strike>, <tt> ; ',
					info2: '2. Vérifier l’absence de l’élément <u> uniquement si le DOCTYPE du document ne correspond pas à HTML 5 ; ',
					info3: '3. Si c’est le cas, le test est validé',
				}],
				expertise: ExpertiseLevelEnum.DEV,

			},
			{
				subtitle: '10.8 Pour chaque page web, les contenus cachés ont-ils vocation à être ignorés par les technologies d’assistance ?',
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

	{
		title: 'Catégorie 11 : Formulaires',
		subtitle: '11.2 Chaque étiquette associée à un champ de formulaire est-elle pertinente (hors cas particuliers) ? ',

		items: [
			{
				precision: '11.2.2 Chaque attribut title permet-il de connaître la fonction exacte du champ de formulaire auquel il est associé',
				link: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#11.2.2',
				solution: [{
					info1: '1. Retrouver dans le document les champs de formulaire dont l’étiquette est fournie par un attribut title ; ',
					info2: '2. Pour chaque champ de formulaire, vérifier que le contenu de l’attribut est pertinent ; ',
					info3: '3. Si c’est le cas pour chaque champ de formulaire, le test est validé.',
				}],
				expertise: ExpertiseLevelEnum.DEV,

			},
			{
				precision: '11.2.3 Chaque étiquette implémentée via l’attribut WAI-ARIA aria-label permet-elle de connaître la fonction exacte du champ de formulaire auquel elle est associée ? ',
				link: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#11.2.3',
				solution: [{
					info1: '1. Retrouver dans le document les champs de formulaire dont l’étiquette est fournie par un attribut WAI-ARIA aria-label ; ',
					info2: '2. Pour chaque champ de formulaire, vérifier que le contenu de l’attribut est pertinent ; ',
					info3: '3. Si c’est le cas pour chaque champ de formulaire, le test est validé.',
				}],
				expertise: ExpertiseLevelEnum.DEV,

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
				expertise: ExpertiseLevelEnum.DEV,

			},
		],
		items2: [
			{
				subtitle: '11.10.2 La finalité d’un champ de saisie peut-elle être déduite pour faciliter le remplissage automatique des champs avec les données de l’utilisateur ?  ',
				precision: '11.13.1 Chaque champ de formulaire dont l’objet se rapporte à une information concernant l’utilisateur vérifie-t-il ces conditions ? '
					+ 'Le champ de formulaire possède un attribut autocomplete ; '
					+ 'L’attribut autocomplete est pourvu d’une valeur présente dans la liste des valeurs possibles pour l’attribut autocomplete associés à un champ de formulaire ; '
					+ 'La valeur indiquée pour l’attribut autocomplete est pertinente au regard du type d’information attendu. ',
				link: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#11.13.1',
				solution: [{
					info1: '1. Retrouver dans le document les champs de formulaire qui se rapportent à une information concernant l’utilisateur (nom, prénom, numéro de téléphone, etc.) ; ',
					info2: '2. Pour chaque champ de formulaire, vérifier que : Le champ de formulaire possède un attribut autocomplete ; L’attribut autocomplete est pourvu d’une valeur présente dans la liste des valeurs possibles; La valeur indiquée pour l’attribut autocomplete est pertinente au regard du type d’information attendu.',
					info3: '3. Si c’est le cas pour chaque champ de formulaire retrouvé, le test est validé.',
				}],
				expertise: ExpertiseLevelEnum.DEV,

			},
			{
				subtitle: '11.13 La finalité d’un champ de saisie peut-elle être déduite pour faciliter le remplissage automatique des champs avec les données de l’utilisateur ?  ',
				precision: '11.13.1 Chaque champ de formulaire dont l’objet se rapporte à une information concernant l’utilisateur vérifie-t-il ces conditions ? '
					+ 'Le champ de formulaire possède un attribut autocomplete ; '
					+ 'L’attribut autocomplete est pourvu d’une valeur présente dans la liste des valeurs possibles pour l’attribut autocomplete associés à un champ de formulaire ; '
					+ 'La valeur indiquée pour l’attribut autocomplete est pertinente au regard du type d’information attendu. ',
				link: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#11.13.1',
				solution: [{
					info1: '1. Retrouver dans le document les champs de formulaire qui se rapportent à une information concernant l’utilisateur (nom, prénom, numéro de téléphone, etc.) ; ',
					info2: '2. Pour chaque champ de formulaire, vérifier que : Le champ de formulaire possède un attribut autocomplete ; L’attribut autocomplete est pourvu d’une valeur présente dans la liste des valeurs possibles; La valeur indiquée pour l’attribut autocomplete est pertinente au regard du type d’information attendu.',
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

				precision: '12.9.1 Dans chaque page web, chaque élément recevant le focus vérifie-t-il une de ces conditions ? Il est possible d’atteindre l’élément suivant ou précédent pouvant recevoir le focus avec la touche de tabulation ; L’utilisateur est informé d’un mécanisme fonctionnel permettant d’atteindre au clavier l’élément suivant ou précédent pouvant recevoir le focus.',
				link: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#12.9.1',
				solution: [{
					info1: '1. Retrouver dans le document l’ensemble des éléments d’interface susceptibles de recevoir le focus (au moyen de la tabulation ou au moyen d’un script) ;',
					info2: '2. Pour chaque élément d’interface, vérifier que l’utilisateur peut atteindre l’élément suivant ou précédent pouvant recevoir le focus : Soit au moyen de la touche de tabulation (Tab ou Maj+Tab) ; Soit au moyen d’une autre interaction clavier dont l’utilisateur est informé (par exemple, les flèches de direction).',
					info3: '3. Si c’est le cas pour chaque élément d’interface, le test est validé.',
				}],
				expertise: ExpertiseLevelEnum.DEV,

			},

		],
	},
]

export const AccessibiliteItemsValidated = [
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
