

export const VuetifyItems = [
	{
		items: [
			{
				name: 'VTextField',
				errorImportants: ['11.1.1 Un bouton adjacent au champ de formulaire lui fournit une étiquette visible et un élément <label> visuellement caché ou un attribut WAI-ARIA aria-label, aria-labelledby ou title lui fournit un nom accessible.'],
				errorIndeterminated: [
					"3.2.1 Dans chaque page web, le texte et le texte en image sans effet de graisse d’une taille restituée inférieure à 24px vérifient-ils une de ces conditions",
					"11.13.1 La finalité d'un champs de saisie peut-elle être déduite pour faciliter le remplissage automatique des champs avec les données de l'utilisateur",
					"12.9 Dans chaque page web, la navigation ne doit pas contenir de piège au clavier."

				],
				solution: [
					{
						name: "SyTextField",
						href: "/?path=/docs/composants-formulaires-customtextfield--docs"
					},

				]
			},
			{
				name: 'Select',
				errorImportants: [

					'8.2 Pour chaque page web, le code source généré est-il valide selon le type de document spécifié',
					'11.1.1 Un bouton adjacent au champ de formulaire lui fournit une étiquette visible et un élément <label> visuellement caché ou un attribut WAI-ARIA aria-label, aria-labelledby ou title lui fournit un nom accessible.',
					'12.11 Dans chaque page web, les contenus additionnels apparaissant au survol, à la prise de focus ou à l’activation d’un composant d’interface sont-ils si nécessaire atteignables au clavier'

				],
				errorIndeterminated: [
					"3.2.1 Dans chaque page web, le texte et le texte en image sans effet de graisse d’une taille restituée inférieure à 24px vérifient-ils une de ces conditions",
					"10.8 Pour chaque page web, les contenus cachés ont-ils vocation à être ignorés par les technologies d’assistance",
					"11.13 La finalité d’un champ de saisie peut-elle être déduite pour faciliter le remplissage automatique des champs avec les données de l’utilisateur",
					"11.2.2 Chaque attribut title permet-il de connaître la fonction exacte du champ de formulaire auquel il est associé",
					"11.2.3 Chaque étiquette implémentée via l’attribut WAI-ARIA aria-label permet-elle de connaître la fonction exacte du champ de formulaire auquel elle est associée",
					"12.9 Dans chaque page web, la navigation ne doit pas contenir de piège au clavier."

				],
				// solution: 'SySelect',
				// href: '/?path=/docs/composants-formulaires-customselect--docs'
				solution: [
					{
						name: "SySelect",
						href: "/?path=/docs/composants-formulaires-customselect--docs"
					},
					{
						name: "SyInputSelect",
						href: "/?path=/docs/composants-formulaires-custominputselect--docs"
					},
					{
						name: "SyButtonSelect",
						href: "/?path=/docs/composants-formulaires-custombtnselect--docs"
					}
				]
			},
			{
				name: 'Divider',
				errorImportants: [

				],
				errorIndeterminated: [



				],
				solution: '',
			},
			{
				name: 'Buttons',
				errorImportants: [


				],
				errorIndeterminated: [

				],
				solution: '',
			},
			{
				name: 'Chips',
				errorImportants: [

				],
				errorIndeterminated: [

				],
				solution: '',
			},
			{
				name: 'Tooltip',
				errorImportants: [


				],
				errorIndeterminated: [

				],
				solution: '',
			},
			{
				name: 'Cards',
				errorImportants: [
					"3.2.1 Dans chaque page web, le texte et le texte en image sans effet de graisse d’une taille restituée inférieure à 24px vérifient-ils une de ces conditions",
					'8.2 Pour chaque page web, le code source généré est-il valide selon le type de document spécifié',
					'11.1.1 Un bouton adjacent au champ de formulaire lui fournit une étiquette visible et un élément <label> visuellement caché ou un attribut WAI-ARIA aria-label, aria-labelledby ou title lui fournit un nom accessible.',
				],
				errorIndeterminated: [

				],
				solution: '',
			},
			{
				name: 'Tabs',
				errorImportants: [
					'12.11 Dans chaque page web, les contenus additionnels apparaissant au survol, à la prise de focus ou à l’activation d’un composant d’interface sont-ils si nécessaire atteignables au clavier',
				],
				errorIndeterminated: [

				],
				solution: '',
			},

			{
				name: 'Textarea',
				errorImportants: [
					'11.1.1 Un bouton adjacent au champ de formulaire lui fournit une étiquette visible et un élément <label> visuellement caché ou un attribut WAI-ARIA aria-label, aria-labelledby ou title lui fournit un nom accessible.',
				],
				errorIndeterminated: [

					"3.2.1 Dans chaque page web, le texte et le texte en image sans effet de graisse d’une taille restituée inférieure à 24px vérifient-ils une de ces conditions",
					"10.8 Pour chaque page web, les contenus cachés ont-ils vocation à être ignorés par les technologies d’assistance",
					"11.13 La finalité d’un champ de saisie peut-elle être déduite pour faciliter le remplissage automatique des champs avec les données de l’utilisateur",
					"12.9 Dans chaque page web, la navigation ne doit pas contenir de piège au clavier."

				],
				solution: '',
			},

			{
				name: 'Sliders',
				errorImportants: [
					'11.1.1 Un bouton adjacent au champ de formulaire lui fournit une étiquette visible et un élément <label> visuellement caché ou un attribut WAI-ARIA aria-label, aria-labelledby ou title lui fournit un nom accessible.',
				],
				errorIndeterminated: [

				],
				solution: '',
			},
			{
				name: 'Table',
				errorImportants: [
					'5.4 Pour chaque tableau de données ayant un titre, le titre est-il correctement associé au tableau de données',
				],
				errorIndeterminated: [

				],
				solution: '',
			},
			{
				name: 'Expansion panels',
				errorImportants: [

				],
				errorIndeterminated: [

					"10.8 Pour chaque page web, les contenus cachés ont-ils vocation à être ignorés par les technologies d’assistance",

				],
				solution: '',
			},
			{
				name: 'Breadcrumbs',
				errorImportants: [
					"3.2.1 Dans chaque page web, le texte et le texte en image sans effet de graisse d’une taille restituée inférieure à 24px vérifient-ils une de ces conditions",
				],
				errorIndeterminated: [

				],
				solution: '',
			},

			{
				name: 'Progress Linear',
				errorImportants: [
					"8.2 Pour chaque page web, le code source généré est-il valide selon le type de document spécifié",
					'11.1.1 Un bouton adjacent au champ de formulaire lui fournit une étiquette visible et un élément <label> visuellement caché ou un attribut WAI-ARIA aria-label, aria-labelledby ou title lui fournit un nom accessible.'
				],
				errorIndeterminated: [

				],
				solution: '',
			},
			{
				name: 'Progress circular',
				errorImportants: [
					'1.1.5 Chaque image vectorielle (balise <svg>) porteuse d’information, vérifie-t-elle ces conditions -La balise <svg> possède un attribut WAI-ARIA role="img" ;',
					"1.2 Chaque image de décoration est-elle correctement ignorée par les technologies d’assistance",
					"8.2 Pour chaque page web, le code source généré est-il valide selon le type de document spécifié",
					'11.1.1 Un bouton adjacent au champ de formulaire lui fournit une étiquette visible et un élément <label> visuellement caché ou un attribut WAI-ARIA aria-label, aria-labelledby ou title lui fournit un nom accessible.'
				],
				errorIndeterminated: [

				],
				solution: '',
			},

			{
				name: 'Lists',
				errorImportants: [
					"3.2.1 Dans chaque page web, le texte et le texte en image sans effet de graisse d’une taille restituée inférieure à 24px vérifient-ils une de ces conditions",
					"7.4 Pour chaque script qui initie un changement de contexte, l’utilisateur est-il averti ou en a-t-il le contrôle",
					"8.2 Pour chaque page web, le code source généré est-il valide selon le type de document spécifié",
					'11.1.1 Un bouton adjacent au champ de formulaire lui fournit une étiquette visible et un élément <label> visuellement caché ou un attribut WAI-ARIA aria-label, aria-labelledby ou title lui fournit un nom accessible.'
				],
				errorIndeterminated: [

				],
				solution: '',
			},
			{
				name: 'Steppers',
				errorImportants: [
					"3.2.1 Dans chaque page web, le texte et le texte en image sans effet de graisse d’une taille restituée inférieure à 24px vérifient-ils une de ces conditions",

				],
				errorIndeterminated: [
					"3.1.2 Pour chaque indication de couleur donnée par un texte, l’information ne doit pas être donnée uniquement par la couleur. Cette règle est-elle respectée ?"
				],
				solution: '',
			},
			{
				name: 'Combobox',
				errorImportants: [
					"8.2 Pour chaque page web, le code source généré est-il valide selon le type de document spécifié",
					'11.1.1 Un bouton adjacent au champ de formulaire lui fournit une étiquette visible et un élément <label> visuellement caché ou un attribut WAI-ARIA aria-label, aria-labelledby ou title lui fournit un nom accessible.',
					'12.11 Dans chaque page web, les contenus additionnels apparaissant au survol, à la prise de focus ou à l’activation d’un composant d’interface sont-ils si nécessaire atteignables au clavier'
				],
				errorIndeterminated: [
					"3.2.1 Dans chaque page web, le texte et le texte en image sans effet de graisse d’une taille restituée inférieure à 24px vérifient-ils une de ces conditions",
					"10.8 Pour chaque page web, les contenus cachés ont-ils vocation à être ignorés par les technologies d’assistance",
					"11.13.1 La finalité d'un champs de saisie peut-elle être déduite pour faciliter le remplissage automatique des champs avec les données de l'utilisateur",

				],
				solution: '',
			},
			{
				name: 'Autocomplete',
				errorImportants: [
					"3.2.1 Dans chaque page web, le texte et le texte en image sans effet de graisse d’une taille restituée inférieure à 24px vérifient-ils une de ces conditions",
					"8.2 Pour chaque page web, le code source généré est-il valide selon le type de document spécifié",
					'11.1.1 Un bouton adjacent au champ de formulaire lui fournit une étiquette visible et un élément <label> visuellement caché ou un attribut WAI-ARIA aria-label, aria-labelledby ou title lui fournit un nom accessible.',
					'12.11 Dans chaque page web, les contenus additionnels apparaissant au survol, à la prise de focus ou à l’activation d’un composant d’interface sont-ils si nécessaire atteignables au clavier'
				],
				errorIndeterminated: [
					"3.2.1 Dans chaque page web, le texte et le texte en image sans effet de graisse d’une taille restituée inférieure à 24px vérifient-ils une de ces conditions",
					"10.8 Pour chaque page web, les contenus cachés ont-ils vocation à être ignorés par les technologies d’assistance",
					"11.13.1 La finalité d'un champs de saisie peut-elle être déduite pour faciliter le remplissage automatique des champs avec les données de l'utilisateur",

				],
				solution: '',
			},
			{
				name: 'Switches',
				errorImportants: [
					"8.2 Pour chaque page web, le code source généré est-il valide selon le type de document spécifié",

				],
				errorIndeterminated: [
					"10.8 Pour chaque page web, les contenus cachés ont-ils vocation à être ignorés par les technologies d’assistance",
					"11.2.3 Chaque étiquette implémentée via l’attribut WAI-ARIA aria-label permet-elle de connaître la fonction exacte du champ de formulaire auquel elle est associée",
					"12.9 Dans chaque page web, la navigation ne doit pas contenir de piège au clavier."

				],
				solution: '',
			},
			{
				name: 'Checkboxes',
				errorImportants: [
					"8.2 Pour chaque page web, le code source généré est-il valide selon le type de document spécifié",

				],
				errorIndeterminated: [
					"10.8 Pour chaque page web, les contenus cachés ont-ils vocation à être ignorés par les technologies d’assistance",
					"11.2.3 Chaque étiquette implémentée via l’attribut WAI-ARIA aria-label permet-elle de connaître la fonction exacte du champ de formulaire auquel elle est associée",
					"12.9 Dans chaque page web, la navigation ne doit pas contenir de piège au clavier."

				],
				solution: '',
			},
			{
				name: 'RadioButtons',
				errorImportants: [
					"8.2 Pour chaque page web, le code source généré est-il valide selon le type de document spécifié",

				],
				errorIndeterminated: [
					"10.8 Pour chaque page web, les contenus cachés ont-ils vocation à être ignorés par les technologies d’assistance",
					"11.2.3 Chaque étiquette implémentée via l’attribut WAI-ARIA aria-label permet-elle de connaître la fonction exacte du champ de formulaire auquel elle est associée",
					"12.9 Dans chaque page web, la navigation ne doit pas contenir de piège au clavier."

				],
				solution: '',
			},
			{
				name: 'OTP Input',
				errorImportants: [
					"11.1 Chaque champ de formulaire a-t-il une étiquette",
					"11.4 Dans chaque formulaire, chaque étiquette de champ et son champ associé sont-ils accolés"

				],
				errorIndeterminated: [
					"10.8 Pour chaque page web, les contenus cachés ont-ils vocation à être ignorés par les technologies d’assistance",
					"11.2.3 Chaque étiquette implémentée via l’attribut WAI-ARIA aria-label permet-elle de connaître la fonction exacte du champ de formulaire auquel elle est associée",
					"11.13.1 La finalité d'un champs de saisie peut-elle être déduite pour faciliter le remplissage automatique des champs avec les données de l'utilisateur",

				],
				solution: '',
			},
		],
	},

]
