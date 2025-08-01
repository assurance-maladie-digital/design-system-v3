import type { StateTileTypes } from './types'

export const AmeliproStateTileTypes: StateTileTypes = {
	date: {
		bgColor: 'ap-turquoise-lighten-2',
		borderColor: 'ap-turquoise-darken-1',
		downloadable: true,
	},
	done: {
		bgColor: 'ap-blue-darken-1',
		borderColor: 'ap-blue-darken-1',
		downloadable: true,
		textColor: 'ap-white',
	},
	doneNoCertificate: {
		bgColor: 'ap-turquoise-lighten-2',
		borderColor: 'ap-turquoise-darken-1',
		downloadable: true,
	},
	doneNoCertificateBlue: {
		bgColor: 'ap-blue-lighten-3',
		borderColor: 'ap-blue-darken-1',
		downloadable: true,
	},
	doneToCorrect: {
		bgColor: 'ap-turquoise lighten-2',
		borderColor: 'ap-turquoise darken-1',
		downloadable: true,
	},
	optionnal: {
		bgColor: 'ap-blue-lighten-4',
		borderColor: 'ap-blue-darken-1',
		downloadable: false,
		icon: {
			iconBgColor: 'ap-blue-darken-1',
			iconColor: 'ap-white',
			iconName: 'plus',
		},
	},
	toDo: {
		bgColor: 'ap-blue-darken-1',
		borderColor: 'ap-blue-darken-1',
		downloadable: false,
		textColor: 'ap-white',
	},
	toDoNoCertificate: {
		bgColor: 'ap-turquoise-lighten-2',
		borderColor: 'ap-turquoise-darken-1',
		downloadable: false,
	},
	toDoNoCertificateBlue: {
		bgColor: 'ap-blue-lighten-2',
		borderColor: 'ap-blue-darken-1',
		downloadable: false,
	},
}
