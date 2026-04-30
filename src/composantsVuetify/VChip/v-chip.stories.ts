import type {Meta, StoryObj} from '@storybook/vue3'

const meta: Meta = {
    title: 'Composants/Composants Vuetify/VChip',
    tags: ['!dev'],
    render: args => ({
        setup() {
            return {args}
        },
        template: `
          <v-chip :color="args.color" :variant="args.variant" :closable="args.closable" :label="args.label"
                  :append-icon="args.append"
                  :prepend-icon="args.prepend"
          >
            {{ args.title }}
          </v-chip>
        `,
    }),
}

export default meta
type Story = StoryObj<typeof meta>

// --- Colors ---
export const Primary: Story = {
    args: {title: 'Chip primary', color: 'primary', variant: 'elevated', closable: false},
    parameters: {docs: {source: {code: `<v-chip color="primary" variant="elevated">Chip</v-chip>`}}},
}
export const Secondary: Story = {
    args: {title: 'Chip secondary', color: 'secondary', variant: 'elevated', closable: false},
    parameters: {docs: {source: {code: `<v-chip color="secondary" variant="elevated">Chip</v-chip>`}}},
}
export const Tertiary: Story = {
    args: {title: 'Chip tertiary', color: 'tertiary', variant: 'elevated', closable: false},
    parameters: {docs: {source: {code: `<v-chip color="tertiary" variant="elevated">Chip</v-chip>`}}},
}
export const Success: Story = {
    args: {title: 'Chip success', color: 'success', variant: 'elevated', closable: false},
    parameters: {docs: {source: {code: `<v-chip color="success" variant="elevated">Chip</v-chip>`}}},
}

export const Info: Story = {
    args: {title: 'Chip info', color: 'info', variant: 'elevated', closable: false},
    parameters: {docs: {source: {code: `<v-chip color="info" variant="elevated">Chip</v-chip>`}}},
}
export const Warning: Story = {
    args: {title: 'Chip warning', color: 'warning', variant: 'elevated', closable: false},
    parameters: {docs: {source: {code: `<v-chip color="warning" variant="elevated">Chip</v-chip>`}}},
}
export const Error: Story = {
    args: {title: 'Chip error', color: 'error', variant: 'elevated', closable: false},
    parameters: {docs: {source: {code: `<v-chip color="error" variant="elevated">Chip</v-chip>`}}},
}

export const RisquePro: Story = {
    args: {title: 'Chip risquePro', color: 'risquePro', variant: 'elevated', closable: false},
    parameters: {docs: {source: {code: `<v-chip color="risquePro" variant="elevated">Chip</v-chip>`}}},
}
export const PrimaryTonal: Story = {
    args: {title: 'Chip primary tonal', color: 'primary', variant: 'tonal', closable: false},
    parameters: {docs: {source: {code: `<v-chip color="primary" variant="tonal">Chip</v-chip>`}}},
}

export const SecondaryTonal: Story = {
    args: {title: 'Chip secondary tonal', color: 'secondary', variant: 'tonal', closable: false},
    parameters: {docs: {source: {code: `<v-chip color="secondary" variant="tonal">Chip</v-chip>`}}},
}

export const TertiaryTonal: Story = {
    args: {title: 'Chip tertiary tonal', color: 'tertiary', variant: 'tonal', closable: false},
    parameters: {docs: {source: {code: `<v-chip color="tertiary" variant="tonal">Chip</v-chip>`}}},
}
export const SuccessTonal: Story = {
    args: {title: 'Chip success tonal', color: 'success', variant: 'tonal', closable: false},
    parameters: {docs: {source: {code: `<v-chip color="success" variant="tonal">Chip</v-chip>`}}},
}

export const InfoTonal: Story = {
    args: {title: 'Chip info tonal', color: 'info', variant: 'tonal', closable: false},
    parameters: {docs: {source: {code: `<v-chip color="info" variant="tonal">Chip</v-chip>`}}},
}

export const WarningTonal: Story = {
    args: {title: 'Chip warning tonal', color: 'warning', variant: 'tonal', closable: false},
    parameters: {docs: {source: {code: `<v-chip color="warning" variant="tonal">Chip</v-chip>`}}},
}

export const ErrorTonal: Story = {
    args: {title: 'Chip error tonal', color: 'error', variant: 'tonal', closable: false},
    parameters: {docs: {source: {code: `<v-chip color="error" variant="tonal">Chip</v-chip>`}}},
}

// --- Closable ---

export const PrimaryElevatedClosable: Story = {
    args: {title: 'Chip primary closable', color: 'primary', variant: 'elevated', closable: true},
    parameters: {docs: {source: {code: `<v-chip color="primary" variant="elevated" closable>Chip</v-chip>`}}},
}

export const PrimaryTonalClosable: Story = {
    args: {title: 'Chip primary tonal closable', color: 'primary', variant: 'tonal', closable: true},
    parameters: {docs: {source: {code: `<v-chip color="primary" variant="tonal" closable>Chip</v-chip>`}}},
}


// --- titles ---
export const PrimaryElevatedLabel: Story = {
    args: {title: 'Chip primary', color: 'primary', variant: 'elevated', label: true},
    parameters: {docs: {source: {code: `<v-chip color="primary" variant="elevated" label>Chip</v-chip>`}}},
}

export const PrimaryTonalLabel: Story = {
    args: {title: 'Chip primary tonal', color: 'primary', variant: 'tonal', label: true},
    parameters: {docs: {source: {code: `<v-chip color="primary" variant="tonal" label>Chip</v-chip>`}}},
}

// --- icons ---
export const PrimaryPrependIcon: Story = {
    args: {title: 'Chip primary', color: 'primary', variant: 'elevated', prepend: "mdi-account-circle"},
    parameters: {docs: {source: {code: `<v-chip color="primary" variant="elevated">Chip</v-chip>`}}},
}

export const PrimaryAppendIcon: Story = {
    args: {title: 'Chip primary tonal', color: 'primary', variant: 'elevated', append: "mdi-star"},
    parameters: {docs: {source: {code: `<v-chip color="primary" variant="elevated">Chip</v-chip>`}}},
}
export const PrimaryIcons: Story = {
    args: {
        title: 'Chip primary tonal',
        color: 'primary',
        variant: 'elevated',
        append: "mdi-star",
        prepend: "mdi-account-circle"
    },
    parameters: {docs: {source: {code: `<v-chip color="primary" variant="elevated">Chip</v-chip>`}}},
}
