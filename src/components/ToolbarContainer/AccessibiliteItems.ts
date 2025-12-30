import { ExpertiseLevelEnum } from '@/common/constants/ExpertiseLevelEnum'

export const AccessibiliteItemsIndeterminate = [
	{
		title: 'Categorie 7.1 : Scripts',
		subtitle: '7.1 Chaque script est-il, si nécessaire, compatible avec les technologies d’assistance ? ',
		items: [
			{
				precision: '7.1.3 Chaque script qui génère ou contrôle un composant d’interface vérifie-t-il ces conditions (hors cas particuliers) ?',
				link: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#7.1.3',
				solution: [
					{
						info1: '1. Recenser les sections, boutons et toggles utilises dans la toolbar ;',
						info2: '2. Verifier que chaque controle est accessible au clavier et aux lecteurs d ecran ;',
						info3: '3. Verifier que les roles ARIA sont adaptes a chaque controle ;',
						info4: '4. Verifier que les proprietes ARIA sont mises a jour dynamiquement en fonction de l etat des controles (ex : aria-pressed pour les boutons bascules) ;',
					},
				],
				expertise: ExpertiseLevelEnum.DEV,
			},
		],
	},
	{
		title: 'Categorie 10 : Présentation de l’information',
		subtitle: '10.7 Dans chaque page web, pour chaque élément recevant le focus, la prise de focus est-elle visible ?',
		items: [
			{
				precision: '10.7.1 Pour chaque élément recevant le focus, la prise de focus vérifie-t-elle une de ces conditions ?',
				link: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#10.7.1',
				solution: [
					{
						info1: '1. Verifier que chaque controle interactif (boutons, toggles, sections) affiche un indicateur de focus visible lorsque l utilisateur navigue au clavier ;',
						info2: '2. Verifier que l indicateur de focus est suffisamment contrasté par rapport a l arriere-plan pour etre visible par tous les utilisateurs ;',
						info3: '3. Verifier que l indicateur de focus est cohérent sur tous les controles de la toolbar pour une experience utilisateur uniforme ;',
					},
				],
				expertise: ExpertiseLevelEnum.DEV,
			},
		],
	},
]

export const AccessibiliteItemsValidated = [
	{
		title: 'Categorie 12 : Navigation',
		subtitle: '12.8 Dans chaque page web, l’ordre de tabulation est-il cohérent ?',
		items: [
			{
				precision: '12.8.2 La toolbar est exposee avec role="toolbar" et gere le deplacement entre controles via les fleches et les touches Home/End.',
				link: 'https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#12.8.2',
				solution: [
					{
						info1: '1. Le composant ajoute automatiquement role="toolbar" et tabindex="0" au conteneur ;',
						info2: '2. Le composant gère le roving tabindex.',
						info3: '3. Les fleches gauche/droite et haut/bas deplacent le focus entre les controles.',
						info4: '4. Les touches Home et End deplacent le focus vers le premier ou le dernier controle.',
					},
				],
				expertise: ExpertiseLevelEnum.DEV,
			},
		],
	},
]
