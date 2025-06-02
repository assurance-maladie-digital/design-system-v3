import { ExpertiseLevelEnum } from '@/common/constants/ExpertiseLevelEnum'

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
		title: 'Catégorie 9 : Structuration de l’information',
		subtitle: '9.2.1 Dans chaque page web, la structure du document vérifie-t-elle ces conditions (hors cas particuliers) ? '
			+ 'La zone d’en-tête de la page est structurée via une balise <header> ; '
			+ 'Les zones de navigation principales et secondaires sont structurées via une balise <nav> ; '
			+ 'La balise <nav> est réservée à la structuration des zones de navigation principales et secondaires ; '
			+ 'La zone de contenu principal est structurée via une balise <main> ; '
			+ 'La structure du document utilise une balise <main> visible unique ; '
			+ 'La zone de pied de page est structurée via une balise <footer>.',
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
	{
		title: 'Catégorie 11 : Formulaires',
		subtitle: '11.13 La finalité d’un champ de saisie peut-elle être déduite pour faciliter le remplissage automatique des champs avec les données de l’utilisateur ?  ',

		items: [

			{
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
		subtitle: '5.6 Pour chaque tableau de données, chaque en-tête de colonne et chaque en-tête de ligne sont-ils correctement déclarés ?',
		items: [
			{
				precision: '5.6.1 Pour chaque tableau de données, chaque en-tête de colonne s’appliquant à la totalité de la colonne vérifie-t-il une de ces conditions ?  L’en-tête de colonnes est structuré au moyen d’une balise <th> ; L’en-tête de colonnes est structuré au moyen d’une balise pourvue d’un attribut WAI-ARIA role="columnheader". ',
				link: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#5.6.1',
				solution: [{
					info1: '1. Retrouver dans le document les tableaux de données ; ',
					info2: '2. Pour chaque en-tête de colonnes s’appliquant à la totalité de la colonne, vérifier que l’en-tête de colonne est structuré au moyen : Soit d’un élément <th> ; Soit d’un élément pourvu d’un attribut WAI-ARIA role="columnheader". ',
					info3: '3. Si c’est le cas pour chaque en-tête de colonne s’appliquant à la totalité de la colonne, le test est validé.',
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
