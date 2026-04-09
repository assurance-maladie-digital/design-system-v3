import { cnamAdditionalContextual, cnamIncludeContainerAliases, cnamSemanticValues } from '../cnam/cnamVariantConfig'

// PA shares the same semantic palette and contextual tokens as CNAM
export const paSemanticValues: Record<string, string> = { ...cnamSemanticValues }
export const paAdditionalContextual: Record<string, string> = { ...cnamAdditionalContextual }
export const paIncludeContainerAliases = cnamIncludeContainerAliases
