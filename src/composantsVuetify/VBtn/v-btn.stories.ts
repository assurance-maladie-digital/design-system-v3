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
      <v-btn :color="args.color" :variant="args.variant" :disabled="args.disabled" :loading="args.loading">
        {{ args.label }}
      </v-btn>
    `,
	}),
}

export default meta
type Story = StoryObj<typeof meta>

// --- Primary ---
export const Primary: Story = {
	args: { label: 'Button primary', color: 'primary', variant: 'elevated', disabled: false },
	parameters: { docs: { source: { code: `<v-btn color="primary" variant="elevated">Button</v-btn>` } } },
}
export const PrimaryLoading: Story = {
	args: { label: 'Button primary loading', color: 'primary', variant: 'elevated', disabled: false, loading: true },
	parameters: { docs: { source: { code: `<v-btn color="primary" variant="elevated" loading>Button</v-btn>` } } },
}
export const PrimaryDisabled: Story = {
	args: { label: 'Button primary disabled', color: 'primary', variant: 'elevated', disabled: true },
	parameters: { docs: { source: { code: `<v-btn color="primary" variant="elevated" disabled>Button</v-btn>` } } },
}

// --- Secondary ---
export const Secondary: Story = {
	args: { label: 'Button secondary ', color: 'primary', variant: 'outlined', disabled: false },
	parameters: { docs: { source: { code: `<v-btn color="primary" variant="outlined">Button</v-btn>` } } },
}
export const SecondaryLoading: Story = {
	args: { label: 'Button secondary loading', color: 'primary', variant: 'outlined', disabled: false, loading: true },
	parameters: { docs: { source: { code: `<v-btn color="primary" variant="outlined" loading>Button</v-btn>` } } },
}
export const SecondaryDisabled: Story = {
	args: { label: 'Button secondary disabled', color: 'primary', variant: 'outlined', disabled: true },
	parameters: { docs: { source: { code: `<v-btn color="primary" variant="outlined" disabled>Button</v-btn>` } } },
}

// --- Tertiary ---
export const Tertiary: Story = {
	args: { label: 'Button tertiary', color: 'primary', variant: 'text', disabled: false },
	parameters: { docs: { source: { code: `<v-btn color="primary" variant="text">Button</v-btn>` } } },
}
export const TertiaryLoading: Story = {
	args: { label: 'Button tertiary loading', color: 'primary', variant: 'text', disabled: false, loading: true },
	parameters: { docs: { source: { code: `<v-btn color="primary" variant="text" loading>Button</v-btn>` } } },
}
export const TertiaryDisabled: Story = {
	args: { label: 'Button tertiary disabled', color: 'primary', variant: 'text', disabled: true },
	parameters: { docs: { source: { code: `<v-btn color="primary" variant="text" disabled>Button</v-btn>` } } },
}

// --- Primary ---
export const PrimaryDestructive: Story = {
	args: { label: 'Button primary', color: 'error', variant: 'elevated', disabled: false },
	parameters: { docs: { source: { code: `<v-btn color="error" variant="elevated">Button</v-btn>` } } },
}
export const PrimaryDestructiveLoading: Story = {
	args: { label: 'Button primary loading', color: 'error', variant: 'elevated', disabled: false, loading: true },
	parameters: { docs: { source: { code: `<v-btn color="error" variant="elevated" loading>Button</v-btn>` } } },
}
export const PrimaryDestructiveDisabled: Story = {
	args: { label: 'Button primary disabled', color: 'error', variant: 'elevated', disabled: true },
	parameters: { docs: { source: { code: `<v-btn color="error" variant="elevated" disabled>Button</v-btn>` } } },
}

// --- Secondary ---
export const SecondaryDestructive: Story = {
	args: { label: 'Button secondary ', color: 'error', variant: 'outlined', disabled: false },
	parameters: { docs: { source: { code: `<v-btn color="error" variant="outlined">Button</v-btn>` } } },
}
export const SecondaryDestructiveLoading: Story = {
	args: { label: 'Button secondary loading', color: 'error', variant: 'outlined', disabled: false, loading: true },
	parameters: { docs: { source: { code: `<v-btn color="error" variant="outlined" loading>Button</v-btn>` } } },
}
export const SecondaryDestructiveDisabled: Story = {
	args: { label: 'Button secondary disabled', color: 'error', variant: 'outlined', disabled: true },
	parameters: { docs: { source: { code: `<v-btn color="error" variant="outlined" disabled>Button</v-btn>` } } },
}

// --- Tertiary ---
export const TertiaryDestructive: Story = {
	args: { label: 'Button tertiary', color: 'error', variant: 'text', disabled: false },
	parameters: { docs: { source: { code: `<v-btn color="error" variant="text">Button</v-btn>` } } },
}
export const TertiaryDestructiveLoading: Story = {
	args: { label: 'Button tertiary loading', color: 'error', variant: 'text', disabled: false, loading: true },
	parameters: { docs: { source: { code: `<v-btn color="error" variant="text" loading>Button</v-btn>` } } },
}
export const TertiaryDestructiveDisabled: Story = {
	args: { label: 'Button tertiary disabled', color: 'error', variant: 'text', disabled: true },
	parameters: { docs: { source: { code: `<v-btn color="error" variant="text" disabled>Button</v-btn>` } } },
}

// --- Variants ---
export const Variants: Story = {
	render: () => ({
		setup() {
			return { variants: variantOptions }
		},
		template: `
			<div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
				<v-btn v-for="variant in variants" :key="variant" color="primary" :variant="variant">
					{{ variant }}
				</v-btn>
			</div>
		`,
	}),
	parameters: {
		docs: {
			source: {
				code: `<v-btn variant="elevated">Elevated</v-btn>
<v-btn variant="flat">Flat</v-btn>
<v-btn variant="tonal">Tonal</v-btn>
<v-btn variant="outlined">Outlined</v-btn>
<v-btn variant="text">Text</v-btn>
<v-btn variant="plain">Plain</v-btn>`,
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
						<v-btn v-for="variant in variants" :key="variant + '-' + density" color="primary" :variant="variant" :density="density">
							{{ variant }}
						</v-btn>
					</div>
				</div>
			</div>
		`,
	}),
	parameters: {
		docs: {
			source: {
				code: `<v-btn variant="elevated" density="default">Default</v-btn>
<v-btn variant="outlined" density="comfortable">Comfortable</v-btn>
<v-btn variant="text" density="compact">Compact</v-btn>`,
			},
		},
	},
}

// --- Sizes ---
export const Sizes: Story = {
	render: () => ({
		template: `
            <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
                <v-btn color="primary" variant="elevated" size="x-small">X-Small</v-btn>
                <v-btn color="primary" variant="elevated" size="small">Small</v-btn>
                <v-btn color="primary" variant="elevated" size="default">Default</v-btn>
                <v-btn color="primary" variant="elevated" size="large">Large</v-btn>
                <v-btn color="primary" variant="elevated" size="x-large">X-Large</v-btn>
            </div>
        `,
	}),
	parameters: {
		docs: {
			source: {
				code: `<v-btn size="x-small">X-Small</v-btn>
<v-btn size="small">Small</v-btn>
<v-btn size="default">Default</v-btn>
<v-btn size="large">Large</v-btn>
<v-btn size="x-large">X-Large</v-btn>`,
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
					<v-btn v-for="density in densities" :key="density" color="primary" variant="elevated" :density="density" :size="size">
						Action
					</v-btn>
				</template>
			</div>
		`,
	}),
	parameters: {
		docs: {
			source: {
				code: `<v-btn size="large" density="default">Action</v-btn>
<v-btn size="large" density="comfortable">Action</v-btn>
<v-btn size="large" density="compact">Action</v-btn>`,
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
			<v-btn icon color="primary" aria-label="Fermer" title="Fermer">
				<SyIcon :icon="mdiClose" decorative />
			</v-btn>
		`,
	}),
	parameters: {
		docs: {
			source: {
				code: `<v-btn icon color="primary" aria-label="Fermer" title="Fermer">
  <SyIcon :icon="mdiClose" decorative />
</v-btn>`,
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
			<v-btn color="primary" variant="elevated">
				<template #prepend>
					<SyIcon :icon="mdiPlus" decorative />
				</template>
				Ajouter
			</v-btn>
		`,
	}),
	parameters: {
		docs: {
			source: {
				code: `<v-btn color="primary" variant="elevated">
  <template #prepend>
    <SyIcon :icon="mdiPlus" decorative />
  </template>
  Ajouter
</v-btn>`,
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
			<v-btn color="primary" variant="outlined">
				Continuer
				<template #append>
					<SyIcon :icon="mdiArrowRight" decorative />
				</template>
			</v-btn>
		`,
	}),
	parameters: {
		docs: {
			source: {
				code: `<v-btn color="primary" variant="outlined">
  Continuer
  <template #append>
    <SyIcon :icon="mdiArrowRight" decorative />
  </template>
</v-btn>`,
			},
		},
	},
}
