import { ExpertiseLevelEnum } from '@/common/constants/ExpertiseLevelEnum'

export const AccessibiliteItemsIndeterminate = [

	{
		title: 'Catégorie 10 : Présentation de l’information',
		subtitle: '10.1 Dans le site web, des feuilles de styles sont-elles utilisées pour contrôler la présentation de l’information  ?',
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
		subtitle: '11.2 Chaque étiquette associée à un champ de formulaire est-elle pertinente (hors cas particuliers) ? ',

		items2: [

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
		subtitle: '11.1 Chaque champ de formulaire a-t-il une étiquette ',
		items: [
			{
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
