import { classToHex } from './classToHex'
import { isCssColor } from './isCssColor'

export const convertToHex = (color: string | undefined): string => {
	if (typeof color !== 'string') {
		return '#000'
	}

	if (isCssColor(color)) {
		return color
	}

	switch (color) {
		case 'white':
			return '#FFF'
		case 'black':
			return '#000'
		case 'transparent':
			return 'transparent'
		default:
			return classToHex(color) || '#000'
	}
}
