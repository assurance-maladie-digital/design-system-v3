export type A11yComplianceType = 'non-compliant' | 'partially-compliant' | 'fully-compliant'

export const A11yComplianceEnum: Record<A11yComplianceType, A11yComplianceType> = {
	'non-compliant': 'non-compliant',
	'partially-compliant': 'partially-compliant',
	'fully-compliant': 'fully-compliant',
}

export const A11Y_COMPLIANCE_ENUM_VALUES = Object.values(A11yComplianceEnum)
