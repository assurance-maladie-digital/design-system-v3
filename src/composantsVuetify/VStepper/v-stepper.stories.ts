import type { Meta, StoryObj } from '@storybook/vue3'
import { VStepper, VStepperHeader, VStepperItem, VStepperWindow, VStepperWindowItem } from 'vuetify/components'
import { VBtn } from 'vuetify/components'
import { ref } from 'vue'

const meta: Meta<typeof VStepper> = {
	title: 'Composants/Composants Vuetify/VStepper',
	tags: ['!dev'],
	component: VStepper,
	parameters: {
		docs: {
			source: {
				transform: (src: string) =>
					src
						.replace(/VStepper/g, 'v-stepper')
						.replace(/VStepperHeader/g, 'v-stepper-header')
						.replace(/VStepperItem/g, 'v-stepper-item')
						.replace(/VStepperWindow/g, 'v-stepper-window')
						.replace(/VStepperWindowItem/g, 'v-stepper-window-item')
						.replace(/VBtn/g, 'v-btn'),
			},
		},
	},
	argTypes: {
		color: {
			control: { type: 'text' },
			description: 'Couleur du stepper',
		},
		disabled: {
			control: { type: 'boolean' },
			description: 'Désactive le stepper',
		},
		altLabels: {
			control: { type: 'boolean' },
			description: 'Affiche les labels en dessous des étapes',
		},
		flat: {
			control: { type: 'boolean' },
			description: 'Supprime l\'élévation du stepper',
		},
		hideActions: {
			control: { type: 'boolean' },
			description: 'Masque les boutons d\'action',
		},
	},
}

export default meta

type Story = StoryObj<typeof VStepper>

// Primary

export const Primary: Story = {
	render: args => ({
		components: { VStepper, VStepperHeader, VStepperItem, VStepperWindow, VStepperWindowItem, VBtn },
		setup() {
			const step = ref(1)
			return { args, step }
		},
		template: `
            <VStepper v-bind="args" v-model="step">
                <VStepperHeader>
                    <VStepperItem title="Étape 1" :value="1" color="primary" />
                    <VStepperItem title="Étape 2" :value="2" color="primary" />
                    <VStepperItem title="Étape 3" :value="3" color="primary" />
                </VStepperHeader>
                
                <VStepperWindow>
                    <VStepperWindowItem :value="1">
                        <div style="padding: 24px;">
                            <h3>Contenu de l'étape 1</h3>
                            <p>Ceci est le contenu de la première étape.</p>
                        </div>
                    </VStepperWindowItem>
                    
                    <VStepperWindowItem :value="2">
                        <div style="padding: 24px;">
                            <h3>Contenu de l'étape 2</h3>
                            <p>Ceci est le contenu de la deuxième étape.</p>
                        </div>
                    </VStepperWindowItem>
                    
                    <VStepperWindowItem :value="3">
                        <div style="padding: 24px;">
                            <h3>Contenu de l'étape 3</h3>
                            <p>Ceci est le contenu de la troisième étape.</p>
                        </div>
                    </VStepperWindowItem>
                </VStepperWindow>
                
                <template v-slot:actions>
                    <VBtn v-if="step > 1" @click="step--" variant="text" color="primary">Précédent</VBtn>
                    <VBtn v-if="step < 3" @click="step++" variant="tonal" color="primary">Suivant</VBtn>
                    <VBtn v-if="step === 3" variant="tonal" color="primary">Terminer</VBtn>
                </template>
            </VStepper>
        `,
	}),
	args: {
		color: 'primary',
	},
	parameters: {
		docs: {
			source: {
				code: `<v-stepper v-model="step" color="primary">
    <!-- Contenu du stepper -->
</v-stepper>`,
			},
		},
	},
}

export const PrimaryAltLabels: Story = {
	render: args => ({
		components: { VStepper, VStepperHeader, VStepperItem, VStepperWindow, VStepperWindowItem, VBtn },
		setup() {
			const step = ref(2)
			return { args, step }
		},
		template: `
            <VStepper v-bind="args" v-model="step">
                <VStepperHeader>
                    <VStepperItem title="Étape 1" subtitle="Description" :value="1" color="primary" />
                    <VStepperItem title="Étape 2" subtitle="Description" :value="2" color="primary" />
                    <VStepperItem title="Étape 3" subtitle="Description" :value="3" color="primary" />
                </VStepperHeader>
                
                <VStepperWindow>
                    <VStepperWindowItem :value="1">
                        <div style="padding: 24px;">
                            <h3>Contenu de l'étape 1</h3>
                            <p>Labels alternatifs affichés en dessous.</p>
                        </div>
                    </VStepperWindowItem>
                    
                    <VStepperWindowItem :value="2">
                        <div style="padding: 24px;">
                            <h3>Contenu de l'étape 2</h3>
                            <p>Labels alternatifs affichés en dessous.</p>
                        </div>
                    </VStepperWindowItem>
                    
                    <VStepperWindowItem :value="3">
                        <div style="padding: 24px;">
                            <h3>Contenu de l'étape 3</h3>
                            <p>Labels alternatifs affichés en dessous.</p>
                        </div>
                    </VStepperWindowItem>
                </VStepperWindow>
                
                <template v-slot:actions>
                    <VBtn v-if="step > 1" @click="step--" variant="text" color="primary">Précédent</VBtn>
                    <VBtn v-if="step < 3" @click="step++" variant="tonal" color="primary">Suivant</VBtn>
                    <VBtn v-if="step === 3" variant="tonal" color="primary">Terminer</VBtn>
                </template>
            </VStepper>
        `,
	}),
	args: {
		color: 'primary',
		altLabels: true,
	},
	parameters: {
		docs: {
			source: {
				code: `<v-stepper v-model="step" color="primary" alt-labels>
    <!-- Contenu du stepper -->
</v-stepper>`,
			},
		},
	},
}

export const PrimaryFlat: Story = {
	render: args => ({
		components: { VStepper, VStepperHeader, VStepperItem, VStepperWindow, VStepperWindowItem, VBtn },
		setup() {
			const step = ref(3)
			return { args, step }
		},
		template: `
            <VStepper v-bind="args" v-model="step">
                <VStepperHeader>
                    <VStepperItem title="Étape 1" :value="1" color="primary" />
                    <VStepperItem title="Étape 2" :value="2" color="primary" />
                    <VStepperItem title="Étape 3" :value="3" color="primary" />
                </VStepperHeader>
                
                <VStepperWindow>
                    <VStepperWindowItem :value="1">
                        <div style="padding: 24px;">
                            <h3>Contenu de l'étape 1</h3>
                            <p>Stepper sans élévation (flat).</p>
                        </div>
                    </VStepperWindowItem>
                    
                    <VStepperWindowItem :value="2">
                        <div style="padding: 24px;">
                            <h3>Contenu de l'étape 2</h3>
                            <p>Stepper sans élévation (flat).</p>
                        </div>
                    </VStepperWindowItem>
                    
                    <VStepperWindowItem :value="3">
                        <div style="padding: 24px;">
                            <h3>Contenu de l'étape 3</h3>
                            <p>Stepper sans élévation (flat).</p>
                        </div>
                    </VStepperWindowItem>
                </VStepperWindow>
                
                <template v-slot:actions>
                    <VBtn v-if="step > 1" @click="step--" variant="text" color="primary">Précédent</VBtn>
                    <VBtn v-if="step < 3" @click="step++" variant="tonal" color="primary">Suivant</VBtn>
                    <VBtn v-if="step === 3" variant="tonal" color="primary">Terminer</VBtn>
                </template>
            </VStepper>
        `,
	}),
	args: {
		color: 'primary',
		flat: true,
	},
	parameters: {
		docs: {
			source: {
				code: `<v-stepper v-model="step" color="primary" flat>
    <!-- Contenu du stepper -->
</v-stepper>`,
			},
		},
	},
}

export const PrimaryDisabled: Story = {
	render: args => ({
		components: { VStepper, VStepperHeader, VStepperItem, VStepperWindow, VStepperWindowItem },
		setup() {
			const step = ref()
			return { args, step }
		},
		template: `
            <VStepper v-bind="args" v-model="step">
                <VStepperHeader>
                    <VStepperItem title="Étape 1" :value="1" color="primary" />
                    <VStepperItem title="Étape 2" :value="2" color="primary" />
                    <VStepperItem title="Étape 3" :value="3" color="primary" />
                </VStepperHeader>
                
                <VStepperWindow>
                    <VStepperWindowItem :value="1">
                        <div style="padding: 24px;">
                            <h3>Contenu de l'étape 1</h3>
                            <p>Stepper désactivé.</p>
                        </div>
                    </VStepperWindowItem>
                    
                    <VStepperWindowItem :value="2">
                        <div style="padding: 24px;">
                            <h3>Contenu de l'étape 2</h3>
                            <p>Stepper désactivé.</p>
                        </div>
                    </VStepperWindowItem>
                    
                    <VStepperWindowItem :value="3">
                        <div style="padding: 24px;">
                            <h3>Contenu de l'étape 3</h3>
                            <p>Stepper désactivé.</p>
                        </div>
                    </VStepperWindowItem>
                </VStepperWindow>
            </VStepper>
        `,
	}),
	args: {
		color: 'primary',
		disabled: true,
	},
	parameters: {
		docs: {
			source: {
				code: `<v-stepper v-model="step" color="primary" disabled>
    <!-- Contenu du stepper -->
</v-stepper>`,
			},
		},
	},
}

export const PrimaryWithIcons: Story = {
	render: args => ({
		components: { VStepper, VStepperHeader, VStepperItem, VStepperWindow, VStepperWindowItem, VBtn },
		setup() {
			const step = ref(2)
			return { args, step }
		},
		template: `
            <VStepper v-bind="args" v-model="step">
                <VStepperHeader>
                    <VStepperItem title="Informations" :value="1" color="primary">
                        <template v-slot:icon>
                            <span style="font-size: 20px;">👤</span>
                        </template>
                    </VStepperItem>
                    <VStepperItem title="Adresse" :value="2" color="primary">
                        <template v-slot:icon>
                            <span style="font-size: 20px;">📍</span>
                        </template>
                    </VStepperItem>
                    <VStepperItem title="Confirmation" :value="3" color="primary">
                        <template v-slot:icon>
                            <span style="font-size: 20px;">✓</span>
                        </template>
                    </VStepperItem>
                </VStepperHeader>
                
                <VStepperWindow>
                    <VStepperWindowItem :value="1">
                        <div style="padding: 24px;">
                            <h3>Informations personnelles</h3>
                            <p>Saisissez vos informations personnelles.</p>
                        </div>
                    </VStepperWindowItem>
                    
                    <VStepperWindowItem :value="2">
                        <div style="padding: 24px;">
                            <h3>Adresse</h3>
                            <p>Saisissez votre adresse.</p>
                        </div>
                    </VStepperWindowItem>
                    
                    <VStepperWindowItem :value="3">
                        <div style="padding: 24px;">
                            <h3>Confirmation</h3>
                            <p>Vérifiez et confirmez vos informations.</p>
                        </div>
                    </VStepperWindowItem>
                </VStepperWindow>
                
                <template v-slot:actions>
                    <VBtn v-if="step > 1" @click="step--" variant="text" color="primary">Précédent</VBtn>
                    <VBtn v-if="step < 3" @click="step++" variant="tonal" color="primary">Suivant</VBtn>
                    <VBtn v-if="step === 3" variant="tonal" color="primary">Terminer</VBtn>
                </template>
            </VStepper>
        `,
	}),
	args: {
		color: 'primary',
	},
	parameters: {
		docs: {
			source: {
				code: `<v-stepper v-model="step" color="primary">
    <v-stepper-header>
        <v-stepper-item title="Informations" :value="1" color="primary">
            <template v-slot:icon>
                <span style="font-size: 20px;">👤</span>
            </template>
        </v-stepper-item>
        <!-- ... autres items avec icônes -->
    </v-stepper-header>
    <!-- Contenu et actions -->
</v-stepper>`,
			},
		},
	},
}

export const PrimaryWithError: Story = {
	render: args => ({
		components: { VStepper, VStepperHeader, VStepperItem, VStepperWindow, VStepperWindowItem, VBtn },
		setup() {
			const step = ref(2)
			return { args, step }
		},
		template: `
            <VStepper v-bind="args" v-model="step">
                <VStepperHeader>
                    <VStepperItem title="Étape 1" :value="1" color="primary" complete />
                    <VStepperItem title="Étape 2" :value="2" color="primary" error />
                    <VStepperItem title="Étape 3" :value="3" color="primary" />
                </VStepperHeader>
                
                <VStepperWindow>
                    <VStepperWindowItem :value="1">
                        <div style="padding: 24px;">
                            <h3>Contenu de l'étape 1</h3>
                            <p>Cette étape est complétée.</p>
                        </div>
                    </VStepperWindowItem>
                    
                    <VStepperWindowItem :value="2">
                        <div style="padding: 24px;">
                            <h3>Contenu de l'étape 2</h3>
                            <p style="color: rgb(var(--v-theme-error));">Cette étape contient des erreurs.</p>
                        </div>
                    </VStepperWindowItem>
                    
                    <VStepperWindowItem :value="3">
                        <div style="padding: 24px;">
                            <h3>Contenu de l'étape 3</h3>
                            <p>Ceci est le contenu de la troisième étape.</p>
                        </div>
                    </VStepperWindowItem>
                </VStepperWindow>
                
                <template v-slot:actions>
                    <VBtn v-if="step > 1" @click="step--" variant="text" color="primary">Précédent</VBtn>
                    <VBtn v-if="step < 3" @click="step++" variant="tonal" color="primary">Suivant</VBtn>
                    <VBtn v-if="step === 3" variant="tonal" color="primary">Terminer</VBtn>
                </template>
            </VStepper>
        `,
	}),
	args: {
		color: 'primary',
	},
	parameters: {
		docs: {
			source: {
				code: `<v-stepper v-model="step" color="primary">
    <v-stepper-header>
        <v-stepper-item title="Étape 1" :value="1" color="primary" complete />
        <v-stepper-item title="Étape 2" :value="2" color="primary" error />
        <v-stepper-item title="Étape 3" :value="3" color="primary" />
    </v-stepper-header>
    <!-- Contenu et actions -->
</v-stepper>`,
			},
		},
	},
}

// Secondary

export const Secondary: Story = {
	render: args => ({
		components: { VStepper, VStepperHeader, VStepperItem, VStepperWindow, VStepperWindowItem, VBtn },
		setup() {
			const step = ref(1)
			return { args, step }
		},
		template: `
            <VStepper v-bind="args" v-model="step">
                <VStepperHeader>
                    <VStepperItem title="Étape 1" :value="1" color="secondary" />
                    <VStepperItem title="Étape 2" :value="2" color="secondary" />
                    <VStepperItem title="Étape 3" :value="3" color="secondary" />
                </VStepperHeader>
                
                <VStepperWindow>
                    <VStepperWindowItem :value="1">
                        <div style="padding: 24px;">
                            <h3>Contenu de l'étape 1</h3>
                            <p>Ceci est le contenu de la première étape.</p>
                        </div>
                    </VStepperWindowItem>
                    
                    <VStepperWindowItem :value="2">
                        <div style="padding: 24px;">
                            <h3>Contenu de l'étape 2</h3>
                            <p>Ceci est le contenu de la deuxième étape.</p>
                        </div>
                    </VStepperWindowItem>
                    
                    <VStepperWindowItem :value="3">
                        <div style="padding: 24px;">
                            <h3>Contenu de l'étape 3</h3>
                            <p>Ceci est le contenu de la troisième étape.</p>
                        </div>
                    </VStepperWindowItem>
                </VStepperWindow>
                
                <template v-slot:actions>
                    <VBtn v-if="step > 1" @click="step--" variant="text" color="secondary">Précédent</VBtn>
                    <VBtn v-if="step < 3" @click="step++" variant="tonal" color="secondary">Suivant</VBtn>
                    <VBtn v-if="step === 3" variant="tonal" color="secondary">Terminer</VBtn>
                </template>
            </VStepper>
        `,
	}),
	args: {
		color: 'secondary',
	},
	parameters: {
		docs: {
			source: {
				code: `<v-stepper v-model="step" color="secondary">
    <!-- Contenu du stepper -->
</v-stepper>`,
			},
		},
	},
}

export const SecondaryAltLabels: Story = {
	render: args => ({
		components: { VStepper, VStepperHeader, VStepperItem, VStepperWindow, VStepperWindowItem, VBtn },
		setup() {
			const step = ref(2)
			return { args, step }
		},
		template: `
            <VStepper v-bind="args" v-model="step">
                <VStepperHeader>
                    <VStepperItem title="Étape 1" subtitle="Description" :value="1" color="secondary" />
                    <VStepperItem title="Étape 2" subtitle="Description" :value="2" color="secondary" />
                    <VStepperItem title="Étape 3" subtitle="Description" :value="3" color="secondary" />
                </VStepperHeader>
                
                <VStepperWindow>
                    <VStepperWindowItem :value="1">
                        <div style="padding: 24px;">
                            <h3>Contenu de l'étape 1</h3>
                            <p>Labels alternatifs affichés en dessous.</p>
                        </div>
                    </VStepperWindowItem>
                    
                    <VStepperWindowItem :value="2">
                        <div style="padding: 24px;">
                            <h3>Contenu de l'étape 2</h3>
                            <p>Labels alternatifs affichés en dessous.</p>
                        </div>
                    </VStepperWindowItem>
                    
                    <VStepperWindowItem :value="3">
                        <div style="padding: 24px;">
                            <h3>Contenu de l'étape 3</h3>
                            <p>Labels alternatifs affichés en dessous.</p>
                        </div>
                    </VStepperWindowItem>
                </VStepperWindow>
                
                <template v-slot:actions>
                    <VBtn v-if="step > 1" @click="step--" variant="text" color="secondary">Précédent</VBtn>
                    <VBtn v-if="step < 3" @click="step++" variant="tonal" color="secondary">Suivant</VBtn>
                    <VBtn v-if="step === 3" variant="tonal" color="secondary">Terminer</VBtn>
                </template>
            </VStepper>
        `,
	}),
	args: {
		color: 'secondary',
		altLabels: true,
	},
	parameters: {
		docs: {
			source: {
				code: `<v-stepper v-model="step" color="secondary" alt-labels>
    <!-- Contenu du stepper -->
</v-stepper>`,
			},
		},
	},
}

export const SecondaryDisabled: Story = {
	render: args => ({
		components: { VStepper, VStepperHeader, VStepperItem, VStepperWindow, VStepperWindowItem },
		setup() {
			const step = ref(2)
			return { args, step }
		},
		template: `
            <VStepper v-bind="args" v-model="step">
                <VStepperHeader>
                    <VStepperItem title="Étape 1" :value="1" color="secondary" />
                    <VStepperItem title="Étape 2" :value="2" color="secondary" />
                    <VStepperItem title="Étape 3" :value="3" color="secondary" />
                </VStepperHeader>
                
                <VStepperWindow>
                    <VStepperWindowItem :value="1">
                        <div style="padding: 24px;">
                            <h3>Contenu de l'étape 1</h3>
                            <p>Stepper désactivé.</p>
                        </div>
                    </VStepperWindowItem>
                    
                    <VStepperWindowItem :value="2">
                        <div style="padding: 24px;">
                            <h3>Contenu de l'étape 2</h3>
                            <p>Stepper désactivé.</p>
                        </div>
                    </VStepperWindowItem>
                    
                    <VStepperWindowItem :value="3">
                        <div style="padding: 24px;">
                            <h3>Contenu de l'étape 3</h3>
                            <p>Stepper désactivé.</p>
                        </div>
                    </VStepperWindowItem>
                </VStepperWindow>
            </VStepper>
        `,
	}),
	args: {
		color: 'secondary',
		disabled: true,
	},
	parameters: {
		docs: {
			source: {
				code: `<v-stepper v-model="step" color="secondary" disabled>
    <!-- Contenu du stepper -->
</v-stepper>`,
			},
		},
	},
}

export const SecondaryWithIcons: Story = {
	render: args => ({
		components: { VStepper, VStepperHeader, VStepperItem, VStepperWindow, VStepperWindowItem, VBtn },
		setup() {
			const step = ref(2)
			return { args, step }
		},
		template: `
            <VStepper v-bind="args" v-model="step">
                <VStepperHeader>
                    <VStepperItem title="Informations" :value="1" color="secondary">
                        <template v-slot:icon>
                            <span style="font-size: 20px;">👤</span>
                        </template>
                    </VStepperItem>
                    <VStepperItem title="Adresse" :value="2" color="secondary">
                        <template v-slot:icon>
                            <span style="font-size: 20px;">📍</span>
                        </template>
                    </VStepperItem>
                    <VStepperItem title="Confirmation" :value="3" color="secondary">
                        <template v-slot:icon>
                            <span style="font-size: 20px;">✓</span>
                        </template>
                    </VStepperItem>
                </VStepperHeader>
                
                <VStepperWindow>
                    <VStepperWindowItem :value="1">
                        <div style="padding: 24px;">
                            <h3>Informations personnelles</h3>
                            <p>Saisissez vos informations personnelles.</p>
                        </div>
                    </VStepperWindowItem>
                    
                    <VStepperWindowItem :value="2">
                        <div style="padding: 24px;">
                            <h3>Adresse</h3>
                            <p>Saisissez votre adresse.</p>
                        </div>
                    </VStepperWindowItem>
                    
                    <VStepperWindowItem :value="3">
                        <div style="padding: 24px;">
                            <h3>Confirmation</h3>
                            <p>Vérifiez et confirmez vos informations.</p>
                        </div>
                    </VStepperWindowItem>
                </VStepperWindow>
                
                <template v-slot:actions>
                    <VBtn v-if="step > 1" @click="step--" variant="text" color="secondary">Précédent</VBtn>
                    <VBtn v-if="step < 3" @click="step++" variant="tonal" color="secondary">Suivant</VBtn>
                    <VBtn v-if="step === 3" variant="tonal" color="secondary">Terminer</VBtn>
                </template>
            </VStepper>
        `,
	}),
	args: {
		color: 'secondary',
	},
	parameters: {
		docs: {
			source: {
				code: `<v-stepper v-model="step" color="secondary">
    <v-stepper-header>
        <v-stepper-item title="Informations" :value="1" color="secondary">
            <template v-slot:icon>
                <span style="font-size: 20px;">👤</span>
            </template>
        </v-stepper-item>
        <!-- ... autres items avec icônes -->
    </v-stepper-header>
    <!-- Contenu et actions -->
</v-stepper>`,
			},
		},
	},
}

export const SecondaryWithError: Story = {
	render: args => ({
		components: { VStepper, VStepperHeader, VStepperItem, VStepperWindow, VStepperWindowItem, VBtn },
		setup() {
			const step = ref(2)
			return { args, step }
		},
		template: `
            <VStepper v-bind="args" v-model="step">
                <VStepperHeader>
                    <VStepperItem title="Étape 1" :value="1" color="secondary" complete />
                    <VStepperItem title="Étape 2" :value="2" color="secondary" error />
                    <VStepperItem title="Étape 3" :value="3" color="secondary" />
                </VStepperHeader>
                
                <VStepperWindow>
                    <VStepperWindowItem :value="1">
                        <div style="padding: 24px;">
                            <h3>Contenu de l'étape 1</h3>
                            <p>Cette étape est complétée.</p>
                        </div>
                    </VStepperWindowItem>
                    
                    <VStepperWindowItem :value="2">
                        <div style="padding: 24px;">
                            <h3>Contenu de l'étape 2</h3>
                            <p style="color: rgb(var(--v-theme-error));">Cette étape contient des erreurs.</p>
                        </div>
                    </VStepperWindowItem>
                    
                    <VStepperWindowItem :value="3">
                        <div style="padding: 24px;">
                            <h3>Contenu de l'étape 3</h3>
                            <p>Ceci est le contenu de la troisième étape.</p>
                        </div>
                    </VStepperWindowItem>
                </VStepperWindow>
                
                <template v-slot:actions>
                    <VBtn v-if="step > 1" @click="step--" variant="text" color="secondary">Précédent</VBtn>
                    <VBtn v-if="step < 3" @click="step++" variant="tonal" color="secondary">Suivant</VBtn>
                    <VBtn v-if="step === 3" variant="tonal" color="secondary">Terminer</VBtn>
                </template>
            </VStepper>
        `,
	}),
	args: {
		color: 'secondary',
	},
	parameters: {
		docs: {
			source: {
				code: `<v-stepper v-model="step" color="secondary">
    <v-stepper-header>
        <v-stepper-item title="Étape 1" :value="1" color="secondary" complete />
        <v-stepper-item title="Étape 2" :value="2" color="secondary" error />
        <v-stepper-item title="Étape 3" :value="3" color="secondary" />
    </v-stepper-header>
    <!-- Contenu et actions -->
</v-stepper>`,
			},
		},
	},
}
