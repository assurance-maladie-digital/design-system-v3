import type { IndexedObject } from '../../../types'
import { LogoSizeEnum } from './LogoSizeEnum'

export const logoDimensionsMapping: IndexedObject<IndexedObject> = {
	[LogoSizeEnum.X_SMALL]: {
		width: '112',
		height: '34',
	},
	[LogoSizeEnum.SMALL]: {
		width: '164',
		height: '52',
	},
	[LogoSizeEnum.NORMAL]: {
		width: '211',
		height: '64',
	},
}
