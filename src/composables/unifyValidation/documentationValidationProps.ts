const RuleGeneralType = `'required' | 'custom'`
const StringRuleType = `'minLength' | 'maxLength' | 'exactLength' | 'email' | 'matchPattern'`
const NumberRuleType = `'min' | 'max'`
const DateRuleType = `'noWeekend' | 'noBeforeToday' | 'notAfterToday' | 'notBeforeDate' | 'notAfterDate' | 'dateExact' | 'isHolidayDay'`

function generateBuiltInRuleType(type: 'base' | 'date' | 'number' | 'string' | 'all' = 'all') {
	switch (type) {
		case 'base':
			return RuleGeneralType
		case 'date':
			return `${RuleGeneralType} | ${DateRuleType}`
		case 'number':
			return `${RuleGeneralType} | ${NumberRuleType}`
		case 'string':
			return `${RuleGeneralType} | ${StringRuleType}`
		case 'all':
			return `${RuleGeneralType} | ${NumberRuleType} | ${StringRuleType} | ${DateRuleType}`
	}
}

export function getValidationDocumentation(type: 'date' | 'number' | 'string' | 'all' = 'all') {
	const builtInRuleType = generateBuiltInRuleType(type)

	return {
		readonly: {
			description: 'Permet de rendre le champ en lecture seule, le champ deviens grisé.',
			control: 'boolean',
			table: {
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
				category: 'props',
			},
		},
		disabled: {
			description: 'Désactive le champ sans changement visuel pour l\'utilisateur.',
			control: 'boolean',
			table: {
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
				category: 'props',
			},
		},
		required: {
			description: 'Indique que le champ est requis.',
			control: 'boolean',
			table: {
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
				category: 'props',
			},
		},
		isValidateOnBlur: {
			description: 'Détermine si la validation doit être déclenchée lors de la saisie ou du blur de l\'input.',
			control: 'boolean',
			table: {
				type: { summary: 'boolean' },
				defaultValue: { summary: 'true' },
				category: 'props',
			},
		},
		showSuccessMessages: {
			description: 'Affiche les messages de succès lorsque la validation est réussie.',
			control: 'boolean',
			table: {
				type: { summary: 'boolean' },
				defaultValue: { summary: 'true' },
				category: 'props',
			},
		},
		disableErrorHandling: {
			description: 'Désactive la gestion des erreurs, utile lorsque vous souhaitez gérer les erreurs manuellement.',
			control: 'boolean',
			table: {
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
				category: 'props',
			},
		},
		useVuetifyValidation: {
			description: 'Indique si la validation doit être gérée par Vuetify (true) ou par Synapse (false).',
			control: 'boolean',
			table: {
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
				category: 'props',
			},
		},
		label: {
			description: 'Le label du champ.',
			control: 'text',
			table: {
				type: { summary: 'string' },
				category: 'props',
			},
		},
		rules: {
			description: 'Les règles de validation Vuetify à appliquer au champ si useVuetifyValidation est true.',
			control: 'object',
			table: {
				type: {
					summary: 'array',
					detail: `
						(value: unknown) => boolean | string
					`,
				},
				category: 'props',
			},
		},
		customRules: {
			description: 'Les règles de validation personnalisées d\'erreur (bloquantes) à appliquer au champ. Elles sont évaluées à partir de la valeur du champ.',
			control: 'object',
			table: {
				type: {
					summary: 'array',
					detail: `
{
	type: ${builtInRuleType},
	options: {
		validate: (value: unknown) => boolean | string,
		message: string,
		[key: string]: unknown
	}
}
					`,
				},
				category: 'props',
			},
		},
		customWarningRules: {
			description: 'Les règles de validation personnalisées d\'avertissement (non bloquantes) à appliquer au champ. Elles sont évaluées à partir de la valeur du champ.',
			control: 'object',
			table: {
				type: {
					summary: 'array',
					detail: `
{
	type: ${builtInRuleType},
	options: {
		validate: (value: unknown) => boolean | string,
		message: string,
		[key: string]: unknown
	}
}
					`,
				},
				category: 'props',
			},
		},
		customSuccessRules: {
			description: 'Les règles de validation personnalisées de succès à appliquer au champ. Elles sont évaluées à partir de la valeur du champ.',
			control: 'object',
			table: {
				type: {
					summary: 'array',
					detail: `
{
	type: ${builtInRuleType},
	options: {
		validate: (value: unknown) => boolean | string,
		message: string,
		[key: string]: unknown
	}
}
					`,
				},
				category: 'props',
			},
		},
		errorMessages: {
			description: 'Permet d\'injecter des messages d\'erreur depuis le parent. Aucun calcul de validation n\'est exécuté.',
			control: 'object',
			table: {
				type: { summary: 'array<string>' },
				category: 'props',
			},
		},
		warningMessages: {
			description: 'Permet d\'injecter des messages d\'avertissement depuis le parent. Aucun calcul de validation n\'est exécuté.',
			control: 'object',
			table: {
				type: { summary: 'array<string>' },
				category: 'props',
			},
		},
		successMessages: {
			description: 'Permet d\'injecter des messages de succès depuis le parent. Aucun calcul de validation n\'est exécuté.',
			control: 'object',
			table: {
				type: { summary: 'array<string>' },
				category: 'props',
			},
		},
		hasError: {
			description: 'Indique si le champ a une erreur, peut être utilisé pour forcer l\'état d\'erreur.',
			control: 'boolean',
			table: {
				type: { summary: 'boolean' },
				category: 'props',
			},
		},
		hasWarning: {
			description: 'Indique si le champ a un avertissement, peut être utilisé pour forcer l\'état d\'avertissement.',
			control: 'boolean',
			table: {
				type: { summary: 'boolean' },
				category: 'props',
			},
		},
		hasSuccess: {
			description: 'Indique si le champ a un succès, peut être utilisé pour forcer l\'état de succès.',
			control: 'boolean',
			table: {
				type: { summary: 'boolean' },
				category: 'props',
			},
		},
		hideDetails: {
			description: 'Masque la section des détails (messages d\'erreur, compteur)',
			control: 'boolean',
			table: {
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
				category: 'props',
			},
		},
		maxErrors: {
			description: 'Le nombre maximum d\'erreurs à afficher, applicable uniquement si useVuetifyValidation est true.',
			control: 'number',
			table: {
				type: { summary: 'number' },
				category: 'props',
			},
		},
	}
}
