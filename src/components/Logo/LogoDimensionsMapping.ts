import type { IndexedObject, Dimensions } from './types'
import { LogoSize } from './LogoSize'

const createDimensions = (width: string, height: string): Dimensions => ({ width, height })

export const logoDimensionsMapping: IndexedObject<Dimensions> = {
	[LogoSize.X_SMALL]: createDimensions('105', '32'),
	[LogoSize.SMALL]: createDimensions('131', '40'),
	[LogoSize.NORMAL]: createDimensions('211', '64'),
}

export const logoAvatarDimensionsMapping: IndexedObject<Dimensions> = {
	[LogoSize.X_SMALL]: createDimensions('32', '32'),
	[LogoSize.SMALL]: createDimensions('40', '40'),
	[LogoSize.NORMAL]: createDimensions('64', '64'),
}
