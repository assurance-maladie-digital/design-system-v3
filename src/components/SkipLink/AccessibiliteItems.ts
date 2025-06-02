import { ExpertiseLevelEnum } from '@/common/constants/ExpertiseLevelEnum'

export const AccessibiliteItemsIndeterminate = [
	{
		title: 'Catégorie 6 : Liens',
		subtitle: ' 6.1 Chaque lien est-il explicite',
		items: [
			{

				precision: ' 6.1.1 Chaque lien texte vérifie-t-il une de ces conditions (hors cas particuliers) ? '
					+ 'L’intitulé de lien seul permet d’en comprendre la fonction et la destination ; '
					+ 'L’intitulé de lien additionné au contexte du lien permet d’en comprendre la fonction et la destination.',
				link: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#6.1.1',
				solution: [{
					info1: '1. Retrouver dans le document les liens texte ;',
					info2: '2. Pour chaque lien texte, vérifier que ce qui permet d’en comprendre la fonction et la destination est : '
						+ ' Soit l’intitulé du lien seul, soit le contexte du lien.',
					info3: '3. Si c’est le cas pour chaque lien texte, le test est validé.',
				}],
				expertise: ExpertiseLevelEnum.DEV,

			},

		],
	},
	{
		title: 'Catégorie 10 : Présentation de l\'information',
		subtitle: '10.8 Pour chaque page web, les contenus cachés ont-ils vocation à être ignorés par les technologies d’assistance',
		items: [
			{

				precision: '10.8.1 Le contenu caché a vocation à être ignoré par les technologies d’assistance , il n’a pas vocation à être ignoré par les technologies d’assistance et est rendu restituable par les technologies d’assistance suite à une action de l’utilisateur réalisable au clavier ou par tout dispositif de pointage sur un élément précédent le contenu caché ou suite à un repositionnement du focus dessus',
				link: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#10.8.1',
				solution: [{
					info1: '1. Retrouver les contenus cachés (éléments pourvus de l’attribut hidden ou de l’attribut WAI-ARIA aria-hidden, ou bien d’une classe ou d’un ensemble de styles CSS susceptibles de masquer le contenu)',
					info2: '2. Pour chaque contenu caché, vérifier que :'
						+ 'Soit le contenu caché a vocation à être ignoré par les technologies d’assistance (un élément statistique de visites par exemple) ;'
						+ 'Soit le contenu caché n’a pas vocation à être ignoré par les technologies d’assistance, et dans ce cas il est rendu restituable par les technologies d’assistance au moyen :'
						+ 'Soit d’une action de l’utilisateur réalisable au clavier ou par tout dispositif de pointage sur un élément précédent le contenu caché ;'
						+ 'Soit d’une fonction de programmation qui repositionne le focus sur le contenu',
					info3: '3. Si c’est le cas pour chaque contenu caché, le test est validé',
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

]
