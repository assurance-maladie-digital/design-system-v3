import type { Meta, StoryObj } from '@storybook/vue3'
import SelectBtnField from './SelectBtnField.vue'
import SyAlert from '../SyAlert/SyAlert.vue'
import { VBtn } from 'vuetify/components'
import { ref } from 'vue'

const meta = {
	title: 'Composants/Formulaires/SelectBtnField',
	component: SelectBtnField,
	decorators: [
		() => ({
			template: '<div style="padding: 20px;"><story/></div>',
		}),
	],
	parameters: {
		layout: 'fullscreen',
		controls: { exclude: ['copy'] },
	},
	argTypes: {
		modelValue: {
			control: { SelectBtnField },
			default: null,
		},
		items: {
			control: { Array },
			default: [],
		},
		label: {
			control: { type: 'text' },
			default: null,
		},
		multiple: {
			control: { type: 'boolean' },
			default: false,
		},
		inline: {
			control: { type: 'boolean' },
			default: false,
		},
		hint: {
			control: { type: 'text' },
			default: undefined,
		},
		error: {
			control: { type: 'boolean' },
			default: false,
		},
		errorMessages: {
			control: { type: 'text' },
			default: undefined,
		},
		readonly: {
			control: { type: 'boolean' },
			default: false,
		},
		vuetifyOptions: {
			control: { type: 'object' },
			description: 'Options pour personnaliser les composants Vuetify utilisés en interne.',
			table: {
				type: {
					summary: 'object',
					detail: `{
btnToggle: 'VBtnToggle',
	btn: 'VBtn',
	spacer: 'VSpacer',
	icon: 'VIcon'
}`,
				},
				defaultValue: {
					summary: 'config',
					detail: ` {
	btn: {
		height: 'auto',
		minHeight: '40px',
		activeClass: 'text-white',
		class: 'py-2 d-flex align-items-center',
	},
	icon: {
		class: 'text-white flex-shrink-0 ml-1',
	},
}`,
				},
				category: 'props',
			},
		},
	},
} satisfies Meta<typeof SelectBtnField>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<div style="max-width: 400px">
		<SelectBtnField
			v-model="args.modelValue"
			:items="args.items"
			label="Moyen de contact"
		/>
	</div>
</template>
                `,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
    import { SelectBtnField } from '@cnamts/synapse'
    import { ref } from 'vue'
	
	const value = ref([])
	const items = [
		{
			text: 'Email',
			value: 'email',
		},
		{
			text: 'Courrier',
			value: 'courrier',
		},
		{
			text: 'SMS',
			value: 'sms',
		},
	]
    
</script>
                `,
			},
		],
	},
	args: {
		modelValue: null,
		items: [
			{
				text: 'Email',
				value: 'email',
			},
			{
				text: 'Courrier',
				value: 'courrier',
			},
			{
				text: 'SMS',
				value: 'sms',
			},
		],
		label: 'Moyen de contact',
		multiple: false,
		inline: false,
		hint: undefined,
		error: false,
		errorMessages: undefined,
		readonly: false,
	},
	render: (args) => {
		return {
			components: { SelectBtnField },
			setup() {
				return { args }
			},
			template: `
				<div style="max-width: 400px">
                    <SelectBtnField
						v-model="args.modelValue"
						:items="args.items"
						label="Moyen de contact"
					/>
				</div>
            `,
		}
	},
}

export const Multiple: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<div style="max-width: 400px">
	   <SelectBtnField
			v-model="args.modelValue"
			:items="args.items"
			label="Moyen de contact"
			multiple
		/>
	</div>
</template>
                `,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
     import { SelectBtnField } from '@cnamts/synapse'
    import { ref } from 'vue'
	
	const value = ref([])
	const items = [
		{
			text: 'Email',
			value: 'email',
		},
		{
			text: 'Courrier',
			value: 'courrier',
		},
		{
			text: 'SMS',
			value: 'sms',
		},
	]
</script>
                `,
			},
		],
	},
	args: {
		modelValue: null,
		items: [
			{
				text: 'Email',
				value: 'email',
			},
			{
				text: 'Courrier',
				value: 'courrier',
			},
			{
				text: 'SMS',
				value: 'sms',
			},
		],
		label: 'Moyen de contact',
		multiple: true,
	},
	render: (args) => {
		return {
			components: { SelectBtnField },
			setup() {
				return { args }
			},
			template: `
			<div style="max-width: 400px">
				<SelectBtnField
					v-model="args.modelValue"
					:items="args.items"
					label="Moyen de contact"
					:multiple="args.multiple"
				/>
			</div>
            `,
		}
	},
}

export const inline: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<div style="max-width: 400px">
	   <SelectBtnField
			v-model="args.modelValue"
			:items="args.items"
			label="Moyen de contact"
			inline
		/>
	</div>
</template>
                `,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
     import { SelectBtnField } from '@cnamts/synapse'
    import { ref } from 'vue'
	
	const value = ref([])
	const items = [
		{
			text: 'Email',
			value: 'email',
		},
		{
			text: 'Courrier',
			value: 'courrier',
		},
		{
			text: 'SMS',
			value: 'sms',
		},
	]
</script>
                `,
			},
		],
	},
	args: {
		modelValue: null,
		items: [
			{
				text: 'Email',
				value: 'email',
			},
			{
				text: 'Courrier',
				value: 'courrier',
			},
			{
				text: 'SMS',
				value: 'sms',
			},
		],
		label: 'Moyen de contact',
		inline: true,
	},
	render: (args) => {
		return {
			components: { SelectBtnField },
			setup() {
				return { args }
			},
			template: `
				<div style="max-width: 400px">
					<SelectBtnField
						v-model="args.modelValue"
						:items="args.items"
						label="Moyen de contact"
						:inline="args.inline"
					/>
				</div>
            `,
		}
	},
}

export const itemUnique: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<div style="max-width: 400px">
	   <SelectBtnField
			v-model="args.modelValue"
			:items="args.items"
			label="Moyen de contact"
			multiple
		/>
	</div>
</template>
                `,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
     import { SelectBtnField } from '@cnamts/synapse'
    import { ref } from 'vue'
	
	const value = ref([])
	const items = [
		{
			text: 'Email',
			value: 'email',
		},
		{
			text: 'Courrier',
			value: 'courrier',
		},
		{
			text: 'SMS',
			value: 'sms',
		},
        {
				text: 'Autre',
				value: 'other',
				unique: true
			}
	]
</script>
                `,
			},
		],
	},
	args: {
		modelValue: null,
		items: [
			{
				text: 'Email',
				value: 'email',
			},
			{
				text: 'Courrier',
				value: 'courrier',
			},
			{
				text: 'SMS',
				value: 'sms',
			},
			{
				text: 'Autre',
				value: 'other',
				unique: true,
			},
		],
		label: 'Moyen de contact',
		multiple: true,
	},
	render: (args) => {
		return {
			components: { SelectBtnField },
			setup() {
				return { args }
			},
			template: `
				<div style="max-width: 400px">
					<SelectBtnField
						v-model="args.modelValue"
						:items="args.items"
						label="Moyen de contact"
						:multiple="args.multiple"
					/>
				</div>
            `,
		}
	},
}

export const messageAide: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<div style="max-width: 400px">
	   <SelectBtnField
			v-model="args.modelValue"
			:items="args.items"
			label="Moyen de contact"
			hint="Par défaut, le moyen de contact est l’email."
		/>
	</div>
</template>
                `,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
     import { SelectBtnField } from '@cnamts/synapse'
    import { ref } from 'vue'
	
	const value = ref([])
	const items = [
		{
			text: 'Email',
			value: 'email',
		},
		{
			text: 'Courrier',
			value: 'courrier',
		},
		{
			text: 'SMS',
			value: 'sms',
		},
	]
</script>
                `,
			},
		],
	},
	args: {
		modelValue: null,
		items: [
			{
				text: 'Email',
				value: 'email',
			},
			{
				text: 'Courrier',
				value: 'courrier',
			},
			{
				text: 'SMS',
				value: 'sms',
			},
		],
		label: 'Moyen de contact',
		hint: 'Par défaut, le moyen de contact est l’email.',
	},
	render: (args) => {
		return {
			components: { SelectBtnField },
			setup() {
				return { args }
			},
			template: `
				<div style="max-width: 400px">
					<SelectBtnField
						v-model="args.modelValue"
						:items="args.items"
						label="Moyen de contact"
						:hint="args.hint"
					/>
				</div>
            `,
		}
	},
}

export const erreur: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<div style="max-width: 400px">
		<SelectBtnField
			v-model="args.modelValue"
			:items="args.items"
			label="Moyen de contact"
			v-model:error="true"
		/>
		<VBtn
			color="primary"
			class="mt-3"
			@click="resetExample"
		>
			Réinitialiser
		</VBtn>      
	</div> 
</template>
                `,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
     import { SelectBtnField } from '@cnamts/synapse'
    import { ref } from 'vue'
		const value = ref([])
	const error = ref(true)
	const items = [
		{
			text: 'Email',
			value: 'email',
		},
		{
			text: 'Courrier',
			value: 'courrier',
		},
		{
			text: 'SMS',
			value: 'sms',
		},
	]
	function resetExample() {
		value.value = null
		error.value = true
	}
</script>
                `,
			},
		],
	},
	args: {
		modelValue: null,
		items: [
			{
				text: 'Email',
				value: 'email',
			},
			{
				text: 'Courrier',
				value: 'courrier',
			},
			{
				text: 'SMS',
				value: 'sms',
			},
		],
		label: 'Moyen de contact',
		error: true,
	},
	render: (args) => {
		return {
			components: { SelectBtnField, VBtn },
			setup() {
				const error = ref(args.error)
				const value = ref(args.modelValue)

				function resetExample() {
					error.value = true
					value.value = null
				}
				return { args, resetExample, error, value }
			},
			template: `
				<div style="max-width: 400px">
					<SelectBtnField
						v-model="value"
						:items="args.items"
						label="Moyen de contact"
						v-model:error="error"
					/>
					<VBtn
						color="primary"
						class="mt-3"
						@click="resetExample"
					>
						Réinitialiser
					</VBtn>       
				</div>
            `,
		}
	},
}

export const messageErreur: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<div style="max-width: 400px">
        <SelectBtnField
			v-model="args.modelValue"
			:items="args.items"
			label="Moyen de contact"
			v-model:error="true"
		    v-model:error-messages="Le champ est requis."
		/>
		<VBtn
			color="primary"
			class="mt-3"
			@click="resetExample"
		>
			Réinitialiser
		</VBtn>       
    </div>
</template>
            `,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
 import { SelectBtnField } from '@cnamts/synapse'
import { ref } from 'vue'
    const value = ref([])
const error = ref(true)
const errorMessages = ref(['Le champ est requis.'])
const items = [
    {
        text: 'Email',
        value: 'email',
    },
    {
        text: 'Courrier',
        value: 'courrier',
    },
    {
        text: 'SMS',
        value: 'sms',
    },
]
	function resetExample() {
		value.value = null
		error.value = true
		errorMessages.value = [
			'Le champ est requis.',
		]
	}
</script>
            `,
			},
		],
	},
	args: {
		modelValue: null,
		items: [
			{
				text: 'Email',
				value: 'email',
			},
			{
				text: 'Courrier',
				value: 'courrier',
			},
			{
				text: 'SMS',
				value: 'sms',
			},
		],
		label: 'Moyen de contact',
		error: true,
		errorMessages: [
			'Le champ est requis.',
		],
	},
	render: (args) => {
		return {
			components: { SelectBtnField, VBtn },
			setup() {
				const error = ref(args.error)
				const value = ref(args.modelValue)
				const errorMessages = ref(args.errorMessages)

				function resetExample() {
					error.value = true
					value.value = null
					errorMessages.value = ['Le champ est requis.']
				}
				return { args, resetExample, error, value, errorMessages }
			},
			template: `
				<div style="max-width: 400px">
					<SelectBtnField
						v-model="value"
						:items="args.items"
						label="Moyen de contact"
						v-model:error="error"
						v-model:error-messages="errorMessages"
					/>
					<VBtn
						color="primary"
						class="mt-3"
						@click="resetExample"
					>
						Réinitialiser
					</VBtn>
			</div>
        `,
		}
	},
}
export const Info: Story = {
	render: (args) => {
		return {
			components: { SyAlert },
			setup() {
				return { args }
			},
			template: `
                <SyAlert v-model="args.modelValue" :type="args.type" :variant="tonal" :closable="false">
                    <template #default>Vous pouvez utiliser le modificateur v-model:error pour réinitialiser l’erreur lorsque l’utilisateur modifie la valeur du champ.
                    </template>
                </SyAlert>
            `,
		}
	},
	tags: ['!dev'],
}
