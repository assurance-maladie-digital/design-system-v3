export const itemsChips = [
	{ text: 'VTextField', value: 1 },
	{ text: 'Select', value: 2 },
	{ text: 'Divider', value: 3 },
	{ text: 'Buttons', value: 4 },
	{ text: 'Chips', value: 5 },
	{ text: 'Tooltip', value: 6 },
	{ text: 'Cards', value: 7 },
	{ text: 'Tabs', value: 8 },
	{ text: 'Textarea', value: 9 },
	{ text: 'Sliders', value: 10 },
	{ text: 'Table', value: 11 },
	{ text: 'Expansion panels', value: 12 },
	{ text: 'Breadcrumbs', value: 13 },
	{ text: 'Progress Linear', value: 14 },
	{ text: 'Progress Circular', value: 15 },
	{ text: 'Lists', value: 16 },
	{ text: 'Steppers', value: 17 },
	{ text: 'Lists', value: 16 },
	{ text: 'Combobox', value: 18 },
	{ text: 'Autocomplete ', value: 19 },
	{ text: 'Switches ', value: 20 },
	{ text: 'Checkboxes ', value: 21 },
	{ text: 'RadioButtons ', value: 22 },
	{ text: 'OTP Input ', value: 23 },
	{ text: 'Range Sliders', value: 24 },
	{ text: 'Date Input', value: 25 },

]

export const VuetifyItems = [
	{

		items: [
			{
				value: 1,
				name: 'VTextField',
				errorImportants: ['11.1.1 Un bouton adjacent au champ de formulaire lui fournit une étiquette visible et un élément <label> visuellement caché ou un attribut WAI-ARIA aria-label, aria-labelledby ou title lui fournit un nom accessible.'],
				errorSolutionImportant: ['Voir méthodologie du test 11.1.1 du référenciel RGAA.'],
				errorIndeterminated: [
					'3.2.1 Dans chaque page web, le texte et le texte en image sans effet de graisse d’une taille restituée inférieure à vingt-quatre px vérifient-ils une de ces conditions',
					'11.13.1 La finalité d\'un champs de saisie peut-elle être déduite pour faciliter le remplissage automatique des champs avec les données de l\'utilisateur',
					'12.9 Dans chaque page web, la navigation ne doit pas contenir de piège au clavier.',

				],
				errorSolutionIndeterminated: [
					'Voir méthodologie du test 3.2.1, 11.13.1 et 12.9.1 du référenciel RGAA.',
				],

				solution: [
					{
						name: 'SyTextField',
						href: '/?path=/docs/composants-formulaires-sytextfield--docs',
					},

				],
			},
			{
				value: 2,
				name: 'Select',
				errorImportants: [
					'8.2 Pour chaque page web, le code source généré est-il valide selon le type de document spécifié',
					'11.1.1 Un bouton adjacent au champ de formulaire lui fournit une étiquette visible et un élément <label> visuellement caché ou un attribut WAI-ARIA aria-label, aria-labelledby ou title lui fournit un nom accessible.',
					'12.11 Dans chaque page web, les contenus additionnels apparaissant au survol, à la prise de focus ou à l’activation d’un composant d’interface sont-ils si nécessaire atteignables au clavier',
				],
				errorSolutionImportant: [
					'Voir méthodologie du test 8.2.1, 11.1.1 et 12.11.1 du référenciel RGAA.',
				],
				errorSolutionIndeterminated: [
					'Voir méthodologie du test 3.2.1, 10.8.1, 11.13.1, 11.2.2, 11.2.3, 12.9.1 du référenciel RGAA.',
				],
				errorIndeterminated: [
					'3.2.1 Dans chaque page web, le texte et le texte en image sans effet de graisse d’une taille restituée inférieure à 24px vérifient-ils une de ces conditions',
					'10.8 Pour chaque page web, les contenus cachés ont-ils vocation à être ignorés par les technologies d’assistance',
					'11.13 La finalité d’un champ de saisie peut-elle être déduite pour faciliter le remplissage automatique des champs avec les données de l’utilisateur',
					'11.2.2 Chaque attribut title permet-il de connaître la fonction exacte du champ de formulaire auquel il est associé',
					'11.2.3 Chaque étiquette implémentée via l’attribut WAI-ARIA aria-label permet-elle de connaître la fonction exacte du champ de formulaire auquel elle est associée',
					'12.9 Dans chaque page web, la navigation ne doit pas contenir de piège au clavier.',
				],
				solution: [
					{
						name: 'SySelect',
						href: '/?path=/docs/composants-formulaires-syselect--docs',
					},
					{
						name: 'SyInputSelect',
						href: '/?path=/docs/composants-formulaires-syinputselect--docs',
					},
					{
						name: 'SyBtnSelect',
						href: '/?path=/docs/composants-formulaires-sybtnselect--docs',
					},
				],
			},
			{
				name: 'Divider',
				value: 3,

				errorImportants: [],
				errorIndeterminated: [],
				solution: [{
					name: 'En étude',
				}],
			},
			{
				name: 'Buttons',
				value: 4,

				errorImportants: [

				],
				errorIndeterminated: [

				],
				solution: [{
					name: 'En étude',
				}],
			},
			{
				name: 'Chips',
				value: 5,

				errorImportants: [],
				errorIndeterminated: [],
				solution: [{
					name: 'En étude',
				}],
			},
			{
				name: 'Tooltip',
				value: 6,

				errorImportants: [],
				errorIndeterminated: [],
				solution: [{
					name: 'En étude',
				}],
			},
			{
				name: 'Cards',
				value: 7,
				errorImportants: [
					'3.2.1 Dans chaque page web, le texte et le texte en image sans effet de graisse d’une taille restituée inférieure à 24px vérifient-ils une de ces conditions',
				],
				errorSolutionImportant: [
					'Voir méthodologie du test 3.2.1 du référenciel RGAA.',
				],
				errorIndeterminated: [],
				solution: [{
					name: 'En étude',
				}],
			},
			{
				name: 'Tabs',
				value: 8,
				errorImportants: [
					'12.11 Dans chaque page web, les contenus additionnels apparaissant au survol, à la prise de focus ou à l’activation d’un composant d’interface sont-ils si nécessaire atteignables au clavier',
				],
				errorSolutionImportant: [
					'Voir méthodologie du test 12.11.1 du référenciel RGAA.',
				],
				errorIndeterminated: [

				],
				solution: [{
					name: 'En étude',
				}],
			},
			{
				name: 'Textarea',
				value: 9,
				errorImportants: [
					'11.1.1 Un bouton adjacent au champ de formulaire lui fournit une étiquette visible et un élément <label> visuellement caché ou un attribut WAI-ARIA aria-label, aria-labelledby ou title lui fournit un nom accessible.',
				],
				errorSolutionImportant: [
					'Voir méthodologie du test 11.1.1 du référenciel RGAA.',
				],
				errorIndeterminated: [
					'3.2.1 Dans chaque page web, le texte et le texte en image sans effet de graisse d’une taille restituée inférieure à 24px vérifient-ils une de ces conditions',
					'10.8 Pour chaque page web, les contenus cachés ont-ils vocation à être ignorés par les technologies d’assistance',
					'11.13 La finalité d’un champ de saisie peut-elle être déduite pour faciliter le remplissage automatique des champs avec les données de l’utilisateur',
					'12.9 Dans chaque page web, la navigation ne doit pas contenir de piège au clavier.',

				],
				errorSolutionIndeterminated: [
					'Voir méthodologie du test 3.2.1, 10.8.1, 11.13.1 et 12.9.1 du référenciel RGAA.',

				],
				solution: [{
					name: 'SyTextArea',
					href: '/?path=/docs/composants-formulaires-sytextarea--docs',
				}],
			},
			{
				name: 'Sliders',
				value: 10,
				errorImportants: [
					'11.1.1 Un bouton adjacent au champ de formulaire lui fournit une étiquette visible et un élément <label> visuellement caché ou un attribut WAI-ARIA aria-label, aria-labelledby ou title lui fournit un nom accessible.',
				],
				errorSolutionImportant: [
					'Voir méthodologie du test 11.1.1 du référenciel RGAA.',
				],
				errorIndeterminated: [

				],

				solution: [{
					name: 'En étude',
				}],
			},
			{
				name: 'Table',
				value: 11,
				errorImportants: [
					'5.4 Pour chaque tableau de données ayant un titre, le titre est-il correctement associé au tableau de données',
				],
				errorSolutionImportant: [
					'Voir méthodologie du test 5.4.1 du référenciel RGAA.',

				],
				errorIndeterminated: [],

				solution: [
					{
						name: 'SyTable',
						href: '/?path=/docs/composants-tableaux-sytable--docs',
					},
					{
						name: 'SyServerTable',
						href: '/?path=/docs/composants-tableaux-syservertable--docs',
					},
				],
			},
			{
				name: 'Expansion panels',
				value: 12,
				errorImportants: [
				],

				errorIndeterminated: [
					'10.8 Pour chaque page web, les contenus cachés ont-ils vocation à être ignorés par les technologies d’assistance',

				],
				errorSolutionIndeterminated: [
					'Voir méthodologie du test 10.8.1 du référenciel RGAA.',
				],

				solution: [{
					name: 'Accordion',
					href: '/?path=/docs/composants-données-accordion--docs',
				}],
			},
			{
				name: 'Breadcrumbs',
				value: 13,
				errorImportants: [
					'3.2.1 Dans chaque page web, le texte et le texte en image sans effet de graisse d’une taille restituée inférieure à 24px vérifient-ils une de ces conditions',

				],
				errorSolutionImportant: [
					'Voir méthodologie du test 3.2.1 du référenciel RGAA.',

				],

				errorIndeterminated: [],
				errorSolutionIndeterminated: [],

				solution: [{
					name: 'En étude',
				}],
			},
			{
				name: 'Progress Linear',
				value: 14,
				errorImportants: [
					'8.2 Pour chaque page web, le code source généré est-il valide selon le type de document spécifié',
					'11.1.1 Un bouton adjacent au champ de formulaire lui fournit une étiquette visible et un élément <label> visuellement caché ou un attribut WAI-ARIA aria-label, aria-labelledby ou title lui fournit un nom accessible.',
				],
				errorSolutionImportant: [
					'Voir méthodologie du test 8.2.1 et 11.1.1 du référenciel RGAA.',

				],

				errorIndeterminated: [],
				errorSolutionIndeterminated: [],
				solution: [{
					name: 'En étude',
				}],
			},
			{
				name: 'Progress circular',
				value: 15,
				errorImportants: [
					'1.1.5 Chaque image vectorielle (balise <svg>) porteuse d’information, vérifie-t-elle ces conditions -La balise <svg> possède un attribut WAI-ARIA role="img"',
					'1.2 Chaque image de décoration est-elle correctement ignorée par les technologies d’assistance',
					'8.2 Pour chaque page web, le code source généré est-il valide selon le type de document spécifié',
					'11.1.1 Un bouton adjacent au champ de formulaire lui fournit une étiquette visible et un élément <label> visuellement caché ou un attribut WAI-ARIA aria-label, aria-labelledby ou title lui fournit un nom accessible.',
				],
				errorSolutionImportant: [
					'Utilisez alt="" pour signaler que l\'image est décorative et qu`\'elle ne nécessite pas de description. Ajoutez role="presentation" pour renforcer l`\'intention décorative de l\'image.',
				],

				errorIndeterminated: [],
				errorSolutionIndeterminated: [],
				solution: [{
					name: 'En étude',
				}],
			},
			{
				name: 'Lists',
				value: 16,
				errorImportants: [
					'3.2.1 Dans chaque page web, le texte et le texte en image sans effet de graisse d’une taille restituée inférieure à 24px vérifient-ils une de ces conditions',
					'8.2 Pour chaque page web, le code source généré est-il valide selon le type de document spécifié',
					'11.1.1 Un bouton adjacent au champ de formulaire lui fournit une étiquette visible et un élément <label> visuellement caché ou un attribut WAI-ARIA aria-label, aria-labelledby ou title lui fournit un nom accessible.',
				],
				errorSolutionImportant: [
					'Voir méthodologie du test 3.2.1, 8.2.1 et 11.1.1 du référenciel RGAA.',
				],

				errorIndeterminated: [],
				errorSolutionIndeterminated: [],
				solution: [{
					name: 'En étude',
				}],
			},
			{
				name: 'Steppers',
				value: 17,
				errorImportants: [
					'3.2.1 Dans chaque page web, le texte et le texte en image sans effet de graisse d’une taille restituée inférieure à 24px vérifient-ils une de ces conditions',
				],
				errorSolutionImportant: [
					'Voir méthodologie du test 3.2.1 du référenciel RGAA.',

				],

				errorIndeterminated: [
					'3.1.2 Pour chaque indication de couleur donnée par un texte, l’information ne doit pas être donnée uniquement par la couleur. Cette règle est-elle respectée ?',
					'10.8 Pour chaque page web, les contenus cachés ont-ils vocation à être ignorés par les technologies d’assistance',

				],
				errorSolutionIndeterminated: [
					'Voir méthodologie du test 3.2.1 et 10.8.1 du référenciel RGAA.',

				],

				solution: [{
					name: 'En étude',
				}],
			},
			{
				name: 'Combobox',
				value: 18,
				errorImportants: [
					'8.2 Pour chaque page web, le code source généré est-il valide selon le type de document spécifié',
					'11.1.1 Un bouton adjacent au champ de formulaire lui fournit une étiquette visible et un élément <label> visuellement caché ou un attribut WAI-ARIA aria-label, aria-labelledby ou title lui fournit un nom accessible.',
					'12.11 Dans chaque page web, les contenus additionnels apparaissant au survol, à la prise de focus ou à l’activation d’un composant d’interface sont-ils si nécessaire atteignables au clavier'],
				errorSolutionImportant: [
					'Voir méthodologie du test 8.2.1, 11.1.1 et 12.11.1 du référenciel RGAA.',

				],

				errorIndeterminated: [
					'3.2.1 Dans chaque page web, le texte et le texte en image sans effet de graisse d’une taille restituée inférieure à 24px vérifient-ils une de ces conditions',
					'10.8 Pour chaque page web, les contenus cachés ont-ils vocation à être ignorés par les technologies d’assistance',
					'11.13.1 La finalité d\'un champs de saisie peut-elle être déduite pour faciliter le remplissage automatique des champs avec les données de l\'utilisateur',
				],
				errorSolutionIndeterminated: [
					'Voir méthodologie du test 3.2.1, 10.8.1 et 11.13.1 du référenciel RGAA.',
				],

				solution: [{
					name: 'En étude',
				}],
			},
			{
				name: 'Autocomplete',
				value: 19,
				errorImportants: [
					'8.2 Pour chaque page web, le code source généré est-il valide selon le type de document spécifié',
					'11.1.1 Un bouton adjacent au champ de formulaire lui fournit une étiquette visible et un élément <label> visuellement caché ou un attribut WAI-ARIA aria-label, aria-labelledby ou title lui fournit un nom accessible.',
					'12.11 Dans chaque page web, les contenus additionnels apparaissant au survol, à la prise de focus ou à l’activation d’un composant d’interface sont-ils si nécessaire atteignables au clavier'],
				errorSolutionImportant: [
					'Voir méthodologie du test 8.2.1, 11.1.1 et 12.11.1 du référenciel RGAA.',

				],

				errorIndeterminated: [
					'3.2.1 Dans chaque page web, le texte et le texte en image sans effet de graisse d’une taille restituée inférieure à 24px vérifient-ils une de ces conditions',
					'10.8 Pour chaque page web, les contenus cachés ont-ils vocation à être ignorés par les technologies d’assistance',
					'11.13.1 La finalité d\'un champs de saisie peut-elle être déduite pour faciliter le remplissage automatique des champs avec les données de l\'utilisateur',
				],
				errorSolutionIndeterminated: [
					'Voir méthodologie du test 3.2.1, 10.8.1 et 11.13.1 du référenciel RGAA.',

				],

				solution: [{
					name: 'En étude',
				}],
			},
			{
				name: 'Switches',
				value: 20,
				errorImportants: [
					'8.2 Pour chaque page web, le code source généré est-il valide selon le type de document spécifié',

				],
				errorSolutionImportant: [
					'Voir méthodologie du test 8.2.1 du référenciel RGAA.',
				],

				errorIndeterminated: [
					'10.8 Pour chaque page web, les contenus cachés ont-ils vocation à être ignorés par les technologies d’assistance',
					'11.2.3 Chaque étiquette implémentée via l’attribut WAI-ARIA aria-label permet-elle de connaître la fonction exacte du champ de formulaire auquel elle est associée',
					'12.9 Dans chaque page web, la navigation ne doit pas contenir de piège au clavier.',
				],
				errorSolutionIndeterminated: [
					'Voir méthodologie du test 10.8.1, 11.2.3 et 12.9.1 du référenciel RGAA.',

				],

				solution: [{
					name: 'En étude',
				}],
			},
			{
				name: 'Checkboxes',
				value: 21,
				errorImportants: [
					'8.2 Pour chaque page web, le code source généré est-il valide selon le type de document spécifié',

				],
				errorSolutionImportant: [
					'Voir méthodologie du test 8.2.1 du référenciel RGAA.',
				],

				errorIndeterminated: [
					'10.8 Pour chaque page web, les contenus cachés ont-ils vocation à être ignorés par les technologies d’assistance',
					'11.2.3 Chaque étiquette implémentée via l’attribut WAI-ARIA aria-label permet-elle de connaître la fonction exacte du champ de formulaire auquel elle est associée',
					'12.9 Dans chaque page web, la navigation ne doit pas contenir de piège au clavier.',
				],
				errorSolutionIndeterminated: [
					'Voir méthodologie du test 10.8.1, 11.2.3 et 12.9.1 du référenciel RGAA.',
				],

				solution: [{
					name: 'SyCheckbox',
					href: '/?path=/docs/composants-formulaires-sycheckbox--docs',
				}],
			},
			{
				name: 'RadioButtons',
				value: 22,
				errorImportants: [
					'8.2 Pour chaque page web, le code source généré est-il valide selon le type de document spécifié',

				],
				errorSolutionImportant: [
					'Voir méthodologie du test 8.2.1 du référenciel RGAA.',

				],

				errorIndeterminated: [
					'10.8 Pour chaque page web, les contenus cachés ont-ils vocation à être ignorés par les technologies d’assistance',
					'11.2.3 Chaque étiquette implémentée via l’attribut WAI-ARIA aria-label permet-elle de connaître la fonction exacte du champ de formulaire auquel elle est associée',
					'12.9 Dans chaque page web, la navigation ne doit pas contenir de piège au clavier.',
				],
				errorSolutionIndeterminated: [
					'Voir méthodologie du test 10.8.1, 11.2.3 et 12.9.1 du référenciel RGAA.',

				],

				solution: [{
					name: 'En étude',
				}],
			},
			{
				name: 'OTP Input',
				value: 23,
				errorImportants: [
					'11.1.1 Un bouton adjacent au champ de formulaire lui fournit une étiquette visible et un élément <label> visuellement caché ou un attribut WAI-ARIA aria-label, aria-labelledby ou title lui fournit un nom accessible.',
					'11.4 Dans chaque formulaire, chaque étiquette de champ et son champ associé sont-ils accolés',
				],
				errorSolutionImportant: [
					'Voir méthodologie du test 11.1.1 et 11.4.1 du référenciel RGAA.',
				],

				errorIndeterminated: [
					'10.8 Pour chaque page web, les contenus cachés ont-ils vocation à être ignorés par les technologies d’assistance',
					'11.2.3 Chaque étiquette implémentée via l’attribut WAI-ARIA aria-label permet-elle de connaître la fonction exacte du champ de formulaire auquel elle est associée',
					'11.13.1 La finalité d\'un champs de saisie peut-elle être déduite pour faciliter le remplissage automatique des champs avec les données de l\'utilisateur',
				],
				errorSolutionIndeterminated: [
					'Voir méthodologie du test 10.8.1, 11.2.3 et 11.13.1 du référenciel RGAA.',

				],

				solution: [{
					name: 'En étude',
				}],
			},
			{
				name: 'Range Sliders',
				value: 24,
				errorImportants: [
					'11.1.1 Un bouton adjacent au champ de formulaire lui fournit une étiquette visible et un élément <label> visuellement caché ou un attribut WAI-ARIA aria-label, aria-labelledby ou title lui fournit un nom accessible.',
				],
				errorSolutionImportant: [
					'Voir méthodologie du test 11.1.1 du référenciel RGAA.',
				],

				errorIndeterminated: [

				],
				errorSolutionIndeterminated: [

				],

				solution: [{
					name: 'RangeField',
					href: '/?path=/docs/composants-formulaires-rangefield--docs',
				}],
			},
			{
				name: 'Date Input',
				value: 25,
				errorImportants: [
					'8.2 Pour chaque page web, le code source généré est-il valide selon le type de document spécifié',
					'11.1.1 Un bouton adjacent au champ de formulaire lui fournit une étiquette visible et un élément <label> visuellement caché ou un attribut WAI-ARIA aria-label, aria-labelledby ou title lui fournit un nom accessible.',
				],
				errorSolutionImportant: [
					'Voir méthodologie du test 8.2.1 et 11.1.1 du référenciel RGAA.',
				],

				errorIndeterminated: [
					'3.2.1 Dans chaque page web, le texte et le texte en image sans effet de graisse d’une taille restituée inférieure à 24px vérifient-ils une de ces conditions',
					'10.8 Pour chaque page web, les contenus cachés ont-ils vocation à être ignorés par les technologies d’assistance',
					'11.13.1 La finalité d\'un champs de saisie peut-elle être déduite pour faciliter le remplissage automatique des champs avec les données de l\'utilisateur',
					'12.9 Dans chaque page web, la navigation ne doit pas contenir de piège au clavier.',
				],
				errorSolutionIndeterminated: [
					'Voir méthodologie du test 3.2.1, 10.8.1, 11.13.1 et  12.9.1 du référenciel RGAA.',
				],

				solution: [{
					name: 'DatePicker',
					href: '/?path=/docs/composants-formulaires-datepicker-introduction--docs',
				}],
			},
		],
	},

]
