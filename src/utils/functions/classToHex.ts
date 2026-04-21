import { apLightTheme2026 } from '@/designTokens/tokens/amelipro/apLightTheme2026'
import { apColorsTokens2026 } from '@/designTokens/tokens/amelipro/apColors2026'
import { AmeliproColors } from './ameliproColors/ameliproColors'
import { createHexResolver } from './createHexResolver'

export const classToHex = createHexResolver(
	apLightTheme2026,
	apColorsTokens2026 as unknown as Record<string, Record<string, string>>,
	AmeliproColors,
)
