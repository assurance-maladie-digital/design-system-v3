import { ExpertiseLevelEnum } from '@/common/constants/ExpertiseLevelEnum'

export const AccessibiliteItemsIndeterminate = [
	{
		title: 'Catégorie 1 : Images',
		subtitle: '1.6  Chaque image porteuse d’information a-t-elle, si nécessaire, une description détaillée ?',

		items2: [
			{
				subtitle: '1.1  Chaque image porteuse d’information a-t-elle une alternative textuelle ? ',
				precision: '1.1.5 Chaque image vectorielle (balise <svg>) porteuse d’information, vérifie-t-elle ces conditions ? '
					+ 'La balise <svg> possède un attribut WAI-ARIA role="img" ; '
					+ 'La balise <svg> a une alternative textuelle.',
				link: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#1.1.5',
				solution: [{
					info1: '1. Retrouver dans le document les éléments <svg> ; Pour chaque élément <svg>, déterminer si l’image est porteuse d’information ; ',
					info2: '2. S’assurer que l’élément <svg> est pourvu d’un attribut WAI-ARIA role="img" ; Si ce n’est pas le cas, le test est invalidé.',
					info3: '3. Le cas échéant, vérifier que l’élément <svg> est pourvu au moins d’une alternative textuelle parmi les suivantes : '
						+ 'Contenu de l’élément <title> ; '
						+ 'Passage de texte associé via l’attribut WAI-ARIA aria-labelledby ; '
						+ 'Contenu de l’attribut WAI-ARIA aria-label ;',
					info4: '4. Si au moins une alternative textuelle est trouvée, le test est validé. ',
				}],
				expertise: ExpertiseLevelEnum.DEV,

			},
			{
				subtitle: '1.3 Pour chaque image porteuse d’information ayant une alternative textuelle, cette alternative est-elle pertinente (hors cas particuliers) ?  ',
				precision: '1.3.9 Pour chaque image porteuse d’information et ayant une alternative textuelle, l’alternative textuelle est-elle courte et concise (hors cas particuliers) ? ',
				link: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#1.3.9',
				solution: [{
					info1: '1. Retrouver dans le document les images pourvues d’une alternative textuelle ; ',
					info2: '2. Pour chaque image, vérifier l’alternative textuelle est courte et concise ;',
					info3: '3. Si c’est le cas pour chaque image, le test est validé',
				}],
				expertise: ExpertiseLevelEnum.DEV,

			},
		],
		items: [
			{
				precision: '1.6.1 Chaque image (balise <img>) porteuse d’information, qui nécessite une description détaillée, vérifie-t-elle une de ces conditions ? '
					+ 'Il existe un attribut longdesc qui donne l’adresse (URL) d’une page ou d’un emplacement dans la page contenant la description détaillée ; '
					+ 'Il existe une alternative textuelle contenant la référence à une description détaillée adjacente à l’image ; '
					+ 'Il existe un lien ou un bouton adjacent permettant d’accéder à la description détaillée.',
				link: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#1.6.1',
				solution: [{
					info1: '1. Retrouver dans le document les images structurées au moyen d’un élément <img> (ou d’un élément possédant l’attribut WAI-ARIA role="img") porteuses d’information qui nécessitent une description détaillée ; ',
					info2: '2. Pour chaque image, vérifier qu’il existe : '
						+ 'Soit un attribut longdesc qui donne l’adresse (url) d’une page ou d’un emplacement dans la page contenant la description détaillée ; '
						+ 'Soit une alternative textuelle contenant la référence à une description détaillée adjacente à l’image ; '
						+ 'Soit un lien ou un bouton adjacent permettant d’accéder à la description détaillée.',
					info3: '3. Si c’est le cas pour chaque image, le test est validé',
				}],
				expertise: ExpertiseLevelEnum.DEV,

			},
			{
				precision: '1.6.5 Chaque image vectorielle (balise <svg>) porteuse d’information, qui nécessite une description détaillée, vérifie-t-elle une de ces conditions ? '
					+ 'Il existe un attribut WAI-ARIA aria-label contenant l’alternative textuelle et une référence à une description détaillée adjacente ; '
					+ 'Il existe un attribut WAI-ARIA aria-labelledby associant un passage de texte faisant office d’alternative textuelle et un autre faisant office de description détaillée ; '
					+ 'Il existe un attribut WAI-ARIA aria-describedby associant un passage de texte faisant office de description détaillée ; '
					+ 'Il existe un lien ou un bouton adjacent permettant d’accéder à la description détaillée.',
				link: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#1.6.5',
				solution: [{
					info1: '1. Retrouver dans le document les éléments <svg> porteurs d’information qui nécessitent une description détaillée ; ',
					info2: '2. Pour chaque élément <svg>, vérifier qu’il existe : '
						+ 'Soit un attribut WAI-ARIA aria-label contenant l’alternative textuelle et une référence à une description détaillée adjacente ; '
						+ 'Soit un attribut WAI-ARIA aria-labelledby associant un passage de texte faisant office d’alternative textuelle et un autre faisant office de description détaillée ; '
						+ 'Soit un attribut WAI-ARIA aria-describedby associant un passage de texte faisant office de description détaillée ; '
						+ 'Soit un lien ou un bouton adjacent permettant d’accéder à la description détaillée.',
					info3: '3. Si c’est le cas pour chaque élément <svg>, le test est validé.',
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
		items2: [
			{
				subtitle: '1.1  Chaque image porteuse d’information a-t-elle une alternative textuelle ? ',
				precision: '1.1.5 Chaque image vectorielle (balise <svg>) porteuse d’information, vérifie-t-elle ces conditions ? '
					+ 'La balise <svg> possède un attribut WAI-ARIA role="img" ; '
					+ 'La balise <svg> a une alternative textuelle.',
				link: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#1.1.5',
				solution: [{
					info1: '1. Retrouver dans le document les éléments <svg> ; Pour chaque élément <svg>, déterminer si l’image est porteuse d’information ; ',
					info2: '2. S’assurer que l’élément <svg> est pourvu d’un attribut WAI-ARIA role="img" ; Si ce n’est pas le cas, le test est invalidé.',
					info3: '3. Le cas échéant, vérifier que l’élément <svg> est pourvu au moins d’une alternative textuelle parmi les suivantes : '
						+ 'Contenu de l’élément <title> ; '
						+ 'Passage de texte associé via l’attribut WAI-ARIA aria-labelledby ; '
						+ 'Contenu de l’attribut WAI-ARIA aria-label ;',
					info4: '4. Si au moins une alternative textuelle est trouvée, le test est validé. ',
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
