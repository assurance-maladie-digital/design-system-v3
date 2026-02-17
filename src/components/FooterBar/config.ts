import type { VariantType, DensityType } from '@/types/vuetifyTypes'

export const config = {
    footer: {
        elevation: 3,
        color: 'var(--footer-background)',
        height: 'auto',
    },
    goTopBtn: {
        elevation: 0,
        density: 'compact' as DensityType,
        icon: 'true',
        variant: 'text' as VariantType,
        color: 'var(--footer-background)',
    },
    goTopBtnIcon: {
        color: 'white',
    },
}
