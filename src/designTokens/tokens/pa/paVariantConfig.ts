import { cnamAdditionalContextual, cnamSemanticValues } from '../cnam/cnamVariantConfig'

// PA shares the same semantic palette, contextual tokens and spacing as CNAM
export const paSemanticValues: Record<string, string> = { ...cnamSemanticValues }
export const paAdditionalContextual: Record<string, string> = { ...cnamAdditionalContextual }
export { cnamSpacingTokens as paSpacingTokens } from '../cnam/cnamVariantConfig'
export { paColorsTokens } from './paColors'
export { paContextualTokens } from './paContextual'
