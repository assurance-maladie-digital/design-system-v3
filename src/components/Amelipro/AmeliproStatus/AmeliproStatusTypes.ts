import type { StatusTypes } from './types'

export const AmeliproStatusTypes: StatusTypes = {
	action: {
		defaultLabel: 'À finaliser',
		bgColor: 'bg-ap-blue-lighten-2',
	},
	archive: {
		defaultLabel: 'Archivé',
		bgColor: 'bg-ap-grey-lighten-2',
	},
	canceled: {
		defaultLabel: 'Annulé',
		borderColor: 'bg-ap-grey-lighten-1',
	},
	closed: {
		defaultLabel: 'Clôturé',
		bgColor: 'bg-ap-parme',
	},
	draft: {
		defaultLabel: 'Brouillon',
		bgColor: 'bg-ap-yellow-lighten-3',
	},
	failure: {
		defaultLabel: 'Refusé',
		bgColor: 'bg-ap-red-lighten-2',
	},
	progress: {
		defaultLabel: 'En cours',
		bgColor: 'bg-ap-red-lighten-3',
	},
	success: {
		defaultLabel: 'Validé',
		bgColor: 'bg-ap-green-lighten-2',
	},
}
