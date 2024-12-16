import { ExpertiseLevelEnum } from './constants/ExpertiseLevelEnum'

export const AccessibiliteItemsIndeterminate = [
	
	{
		title: 'Catégorie 10 : Présentation de l’information',
		subtitle: '10.8 Pour chaque page Web, les contenus cachés ont-ils vocation à être ignorés par les technologies d’assistance ?',
		items: [

			{
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

		],
	},

	{
		title: 'Catégorie 7 : Scripts',
		subtitle: '7.1 Chaque script est-il, si nécessaire, compatible avec les technologies d’assistance ?',
		items: [
			{

				precision: ' 7.1.1 Chaque script qui génère ou contrôle un composant d’interface vérifie-t-il, si nécessaire, une de ces conditions ? '
					+ ' Le nom, le rôle, la valeur, le paramétrage et les changements d’états sont accessibles aux technologies d’assistance via une API d’accessibilité ;'
					+ ' Un composant d’interface accessible permettant d’accéder aux mêmes fonctionnalités est présent dans la page ;'
					+ ' Une alternative accessible permet d’accéder aux mêmes fonctionnalités.',
				link: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#7.1.1',
				solution: [{
					info1: '1. Vérifier que : Le composant possède un rôle cohérent avec son usage (généralement un bouton ou un lien) ;'
						+ ' Le composant possède un nom explicite ;'
						+ ' Le nom du composant est cohérent avec l’état de la fonctionnalité ou des contenus contrôlés (par exemple pour une fonctionnalité permettant d’afficher ou de masquer une zone de contenu).',
					info2: '2. Sinon, vérifier la présence d’un composant d’interface accessible permettant d’accéder aux mêmes fonctionnalités',
					info3: '3. Si c’est le cas le test est validé',
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
