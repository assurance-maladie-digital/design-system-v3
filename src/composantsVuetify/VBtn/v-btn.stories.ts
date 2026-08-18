import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { mdiArrowRight, mdiClose, mdiPlus } from '@mdi/js'
import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'

const variantOptions = ['elevated', 'flat', 'tonal', 'outlined', 'text', 'plain'] as const
const densityOptions = ['default', 'comfortable', 'compact'] as const
const sizeOptions = ['x-small', 'small', 'default', 'large', 'x-large'] as const

const meta: Meta = {
	title: 'Composants/Composants Vuetify/VBtn',
	tags: ['!dev'],
	argTypes: {
		variant: {
			control: 'select',
			options: [...variantOptions],
		},
		density: {
			control: 'select',
			options: [...densityOptions],
		},
		color: {
			control: 'select',
			options: ['primary', 'secondary', 'success', 'warning', 'error'],
		},
	},
	render: args => ({
		setup() {
			return { args }
		},
		template: `
      <VBtn :color="args.color" :variant="args.variant" :disabled="args.disabled" :loading="args.loading">
        {{ args.label }}
      </VBtn>
    `,
	}),
}

export default meta
type Story = StoryObj<typeof meta>

// --- Primary ---
export const Primary: Story = {
	args: { label: 'Button primary', color: 'primary', variant: 'elevated', disabled: false },
	parameters: { docs: { source: { code: `<VBtn color="primary" variant="elevated">Button</VBtn>` } } },
}
export const PrimaryLoading: Story = {
	args: { label: 'Button primary loading', color: 'primary', variant: 'elevated', disabled: false, loading: true },
	parameters: { docs: { source: { code: `<VBtn color="primary" variant="elevated" loading>Button</VBtn>` } } },
}
export const PrimaryDisabled: Story = {
	args: { label: 'Button primary disabled', color: 'primary', variant: 'elevated', disabled: true },
	parameters: { docs: { source: { code: `<VBtn color="primary" variant="elevated" disabled>Button</VBtn>` } } },
}

// --- Secondary ---
export const Secondary: Story = {
	args: { label: 'Button secondary ', color: 'primary', variant: 'outlined', disabled: false },
	parameters: { docs: { source: { code: `<VBtn color="primary" variant="outlined">Button</VBtn>` } } },
}
export const SecondaryLoading: Story = {
	args: { label: 'Button secondary loading', color: 'primary', variant: 'outlined', disabled: false, loading: true },
	parameters: { docs: { source: { code: `<VBtn color="primary" variant="outlined" loading>Button</VBtn>` } } },
}
export const SecondaryDisabled: Story = {
	args: { label: 'Button secondary disabled', color: 'primary', variant: 'outlined', disabled: true },
	parameters: { docs: { source: { code: `<VBtn color="primary" variant="outlined" disabled>Button</VBtn>` } } },
}

// --- Tertiary ---
export const Tertiary: Story = {
	args: { label: 'Button tertiary', color: 'primary', variant: 'text', disabled: false },
	parameters: { docs: { source: { code: `<VBtn color="primary" variant="text">Button</VBtn>` } } },
}
export const TertiaryLoading: Story = {
	args: { label: 'Button tertiary loading', color: 'primary', variant: 'text', disabled: false, loading: true },
	parameters: { docs: { source: { code: `<VBtn color="primary" variant="text" loading>Button</VBtn>` } } },
}
export const TertiaryDisabled: Story = {
	args: { label: 'Button tertiary disabled', color: 'primary', variant: 'text', disabled: true },
	parameters: { docs: { source: { code: `<VBtn color="primary" variant="text" disabled>Button</VBtn>` } } },
}

// --- Primary ---
export const PrimaryDestructive: Story = {
	args: { label: 'Button primary', color: 'error', variant: 'elevated', disabled: false },
	parameters: { docs: { source: { code: `<VBtn color="error" variant="elevated">Button</VBtn>` } } },
}
export const PrimaryDestructiveLoading: Story = {
	args: { label: 'Button primary loading', color: 'error', variant: 'elevated', disabled: false, loading: true },
	parameters: { docs: { source: { code: `<VBtn color="error" variant="elevated" loading>Button</VBtn>` } } },
}
export const PrimaryDestructiveDisabled: Story = {
	args: { label: 'Button primary disabled', color: 'error', variant: 'elevated', disabled: true },
	parameters: { docs: { source: { code: `<VBtn color="error" variant="elevated" disabled>Button</VBtn>` } } },
}

// --- Secondary ---
export const SecondaryDestructive: Story = {
	args: { label: 'Button secondary ', color: 'error', variant: 'outlined', disabled: false },
	parameters: { docs: { source: { code: `<VBtn color="error" variant="outlined">Button</VBtn>` } } },
}
export const SecondaryDestructiveLoading: Story = {
	args: { label: 'Button secondary loading', color: 'error', variant: 'outlined', disabled: false, loading: true },
	parameters: { docs: { source: { code: `<VBtn color="error" variant="outlined" loading>Button</VBtn>` } } },
}
export const SecondaryDestructiveDisabled: Story = {
	args: { label: 'Button secondary disabled', color: 'error', variant: 'outlined', disabled: true },
	parameters: { docs: { source: { code: `<VBtn color="error" variant="outlined" disabled>Button</VBtn>` } } },
}

// --- Tertiary ---
export const TertiaryDestructive: Story = {
	args: { label: 'Button tertiary', color: 'error', variant: 'text', disabled: false },
	parameters: { docs: { source: { code: `<VBtn color="error" variant="text">Button</VBtn>` } } },
}
export const TertiaryDestructiveLoading: Story = {
	args: { label: 'Button tertiary loading', color: 'error', variant: 'text', disabled: false, loading: true },
	parameters: { docs: { source: { code: `<VBtn color="error" variant="text" loading>Button</VBtn>` } } },
}
export const TertiaryDestructiveDisabled: Story = {
	args: { label: 'Button tertiary disabled', color: 'error', variant: 'text', disabled: true },
	parameters: { docs: { source: { code: `<VBtn color="error" variant="text" disabled>Button</VBtn>` } } },
}

// --- Variants ---
export const Variants: Story = {
	render: () => ({
		setup() {
			return { variants: variantOptions }
		},
		template: `
			<div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
				<VBtn v-for="variant in variants" :key="variant" color="primary" :variant="variant">
					{{ variant }}
				</VBtn>
			</div>
		`,
	}),
	parameters: {
		docs: {
			source: {
				code: `<VBtn variant="elevated">Elevated</VBtn>
<VBtn variant="flat">Flat</VBtn>
<VBtn variant="tonal">Tonal</VBtn>
<VBtn variant="outlined">Outlined</VBtn>
<VBtn variant="text">Text</VBtn>
<VBtn variant="plain">Plain</VBtn>`,
			},
		},
	},
}

export const Densities: Story = {
	render: () => ({
		setup() {
			return { variants: variantOptions, densities: densityOptions }
		},
		template: `
			<div style="display: flex; flex-direction: column; gap: 20px;">
				<div v-for="density in densities" :key="density" style="display: flex; flex-direction: column; gap: 12px;">
					<div style="font-weight: 600; text-transform: capitalize;">{{ density }}</div>
					<div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
						<VBtn v-for="variant in variants" :key="variant + '-' + density" color="primary" :variant="variant" :density="density">
							{{ variant }}
						</VBtn>
					</div>
				</div>
			</div>
		`,
	}),
	parameters: {
		docs: {
			source: {
				code: `<VBtn variant="elevated" density="default">Default</VBtn>
<VBtn variant="outlined" density="comfortable">Comfortable</VBtn>
<VBtn variant="text" density="compact">Compact</VBtn>`,
			},
		},
	},
}

// --- Sizes ---
export const Sizes: Story = {
	render: () => ({
		template: `
            <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
                <VBtn color="primary" variant="elevated" size="x-small">X-Small</VBtn>
                <VBtn color="primary" variant="elevated" size="small">Small</VBtn>
                <VBtn color="primary" variant="elevated" size="default">Default</VBtn>
                <VBtn color="primary" variant="elevated" size="large">Large</VBtn>
                <VBtn color="primary" variant="elevated" size="x-large">X-Large</VBtn>
            </div>
        `,
	}),
	parameters: {
		docs: {
			source: {
				code: `<VBtn size="x-small">X-Small</VBtn>
<VBtn size="small">Small</VBtn>
<VBtn size="default">Default</VBtn>
<VBtn size="large">Large</VBtn>
<VBtn size="x-large">X-Large</VBtn>`,
			},
		},
	},
}

export const SizeDensityMatrix: Story = {
	render: () => ({
		setup() {
			return { densities: densityOptions, sizes: sizeOptions }
		},
		template: `
			<div style="display: grid; grid-template-columns: max-content repeat(3, max-content); gap: 12px; align-items: center;">
				<div></div>
				<div v-for="density in densities" :key="density" style="font-weight: 600; text-align: center;">
					{{ density }}
				</div>
				<template v-for="size in sizes" :key="size">
					<div style="font-weight: 600;">{{ size }}</div>
					<VBtn v-for="density in densities" :key="density" color="primary" variant="elevated" :density="density" :size="size">
						Action
					</VBtn>
				</template>
			</div>
		`,
	}),
	parameters: {
		docs: {
			source: {
				code: `<VBtn size="large" density="default">Action</VBtn>
<VBtn size="large" density="comfortable">Action</VBtn>
<VBtn size="large" density="compact">Action</VBtn>`,
			},
		},
	},
}

// --- Icônes ---
// `prepend-icon`/`append-icon` et `v-icon` nu laissent un `role="img"` sur le <svg> interne
// (VSvgIcon de Vuetify) même avec aria-hidden sur le conteneur : on passe par SyIcon (decorative)
// qui neutralise ce role via la directive v-rgaa-svg-fix.
export const IconOnly: Story = {
	render: () => ({
		components: { SyIcon },
		setup() {
			return { mdiClose }
		},
		template: `
			<VBtn icon color="primary" aria-label="Fermer" title="Fermer">
				<SyIcon :icon="mdiClose" decorative />
			</VBtn>
		`,
	}),
	parameters: {
		docs: {
			source: {
				code: `<VBtn icon color="primary" aria-label="Fermer" title="Fermer">
  <SyIcon :icon="mdiClose" decorative />
</VBtn>`,
			},
		},
	},
}

export const PrependIcon: Story = {
	render: () => ({
		components: { SyIcon },
		setup() {
			return { mdiPlus }
		},
		template: `
			<VBtn color="primary" variant="elevated">
				<template #prepend>
					<SyIcon :icon="mdiPlus" decorative />
				</template>
				Ajouter
			</VBtn>
		`,
	}),
	parameters: {
		docs: {
			source: {
				code: `<VBtn color="primary" variant="elevated">
  <template #prepend>
    <SyIcon :icon="mdiPlus" decorative />
  </template>
  Ajouter
</VBtn>`,
			},
		},
	},
}

export const AppendIcon: Story = {
	render: () => ({
		components: { SyIcon },
		setup() {
			return { mdiArrowRight }
		},
		template: `
			<VBtn color="primary" variant="outlined">
				Continuer
				<template #append>
					<SyIcon :icon="mdiArrowRight" decorative />
				</template>
			</VBtn>
		`,
	}),
	parameters: {
		docs: {
			source: {
				code: `<VBtn color="primary" variant="outlined">
  Continuer
  <template #append>
    <SyIcon :icon="mdiArrowRight" decorative />
  </template>
</VBtn>`,
			},
		},
	},
}
