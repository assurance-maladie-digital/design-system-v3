// Variant configurations for the SCSS token generator.
// Token definitions live in src/designTokens/tokens/{brand}/variantConfig.ts
// This file is a thin assembler that re-exports them for the generator script.

import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadTsModule } from './loadTsModule.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

const cnam = loadTsModule(path.join(rootDir, 'src/designTokens/tokens/cnam/cnamVariantConfig.ts'))
const pa = loadTsModule(path.join(rootDir, 'src/designTokens/tokens/pa/paVariantConfig.ts'))
const ap = loadTsModule(path.join(rootDir, 'src/designTokens/tokens/amelipro/apVariantConfig.ts'))

export const cnamVariantConfig = {
	colors: cnam.cnamColorsTokens,
	contextual: cnam.cnamContextualTokens,
	semanticValues: cnam.cnamSemanticValues,
	additionalContextual: cnam.cnamAdditionalContextual,
	spacingTokens: cnam.cnamSpacingTokens,
	extraPrimitives: cnam.cnamExtraPrimitives,
}

export const paVariantConfig = {
	colors: pa.paColorsTokens,
	contextual: pa.paContextualTokens,
	semanticValues: pa.paSemanticValues,
	additionalContextual: pa.paAdditionalContextual,
	spacingTokens: pa.paSpacingTokens,
	extraPrimitives: cnam.cnamExtraPrimitives,
}

export const apVariantConfig = {
	colors: ap.apColorsTokens,
	contextual: ap.apContextualTokens,
	semanticValues: ap.apSemanticValues,
	additionalContextual: ap.apAdditionalContextual,
}
