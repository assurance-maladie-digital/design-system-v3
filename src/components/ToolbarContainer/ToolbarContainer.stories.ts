import type { Meta, StoryObj } from '@storybook/vue3-vite'
import ToolbarContainer from './ToolbarContainer.vue'
import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'
import { VBtn, VBtnToggle, VCheckbox, VDivider } from 'vuetify/components'
import { mdiFormatAlignRight, mdiFormatAlignLeft, mdiFormatAlignCenter, mdiFormatAlignJustify, mdiFormatBold, mdiFormatItalic, mdiFormatUnderline, mdiFormatColorText, mdiFormatColorFill } from '@mdi/js'
import { ref } from 'vue'

const meta = {
	title: 'Composants/Layout/ToolbarContainer',
	component: ToolbarContainer,
	argTypes: {
		default: {
			control: false,
			description: 'Contenu de la barre d\'outils',
		},
	},
} satisfies Meta<typeof ToolbarContainer>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	render: (args) => {
		return {
			components: { VBtn, VBtnToggle, ToolbarContainer, SyIcon },
			setup() {
				const justification = ref<string>()
				return { args, justification, mdiFormatAlignRight, mdiFormatAlignLeft, mdiFormatAlignCenter }
			},
			template: `
				<div>
					<ToolbarContainer
						class="d-flex flex-wrap ga-4"
						aria-label="Outils de mise en forme"
					>
						<VBtnToggle
							class="d-flex flex-wrap ga-2"
							role="radiogroup"
							aria-label="Alignement du texte"
							v-model="justification"
							color="primary"
							style="overflow: visible;"
						>
							<VBtn
								title="ferrer à gauche"
								aria-label="ferrer à gauche"
								role="radio"
								value="left"
								elevation="2"
								size="small"
								:aria-checked="justification === 'left' ? 'true' : 'false'"
							>
								<SyIcon :icon="mdiFormatAlignLeft" size="x-large" decorative />
							</VBtn>
							<VBtn
								title="centrer"
								aria-label="centrer"
								role="radio"
								value="center"
								elevation="2"
								size="small"
								:aria-checked="justification === 'center' ? 'true' : 'false'"
							>
								<SyIcon :icon="mdiFormatAlignCenter" size="x-large" decorative />
							</VBtn>
							<VBtn
								title="ferrer a droite"
								aria-label="ferrer a droite"
								role="radio"
								value="right"
								elevation="2"
								size="small"
								:aria-checked="justification === 'right' ? 'true' : 'false'"
							>
								<SyIcon :icon="mdiFormatAlignRight" size="x-large" decorative />
							</VBtn>
						</VBtnToggle>
					</ToolbarContainer>
				</div>
			`,
		}
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
					<div>
						<ToolbarContainer
							class="d-flex flex-wrap ga-4"
							aria-label="Outils de mise en forme"
						>
							<VBtnToggle
								class="d-flex flex-wrap ga-2"
								role="radiogroup"
								aria-label="Alignement du texte"
								v-model="justification"
								color="primary"
								style="overflow: visible;"
							>
								<VBtn
									title="ferrer à gauche"
									aria-label="ferrer à gauche"
									role="radio"
									value="left"
									elevation="2"
									size="small"
									:aria-checked="justification === 'left' ? 'true' : 'false'"
								>
									<SyIcon :icon="mdiFormatAlignLeft" size="x-large" decorative />
								</VBtn>
								<VBtn
									title="centrer"
									aria-label="centrer"
									role="radio"
									value="center"
									elevation="2"
									size="small"
									:aria-checked="justification === 'center' ? 'true' : 'false'"
								>
									<SyIcon :icon="mdiFormatAlignCenter" size="x-large" decorative />
								</VBtn>
								<VBtn
									title="ferrer a droite"
									aria-label="ferrer a droite"
									role="radio"
									value="right"
									elevation="2"
									size="small"
									:aria-checked="justification === 'right' ? 'true' : 'false'"
								>
									<SyIcon :icon="mdiFormatAlignRight" size="x-large" decorative />
								</VBtn>
							</VBtnToggle>
						</ToolbarContainer>
					</div>
				</template>

				<script setup lang="ts">
				import { ref } from 'vue'
				import { VBtn, VBtnToggle } from 'vuetify/components'
				import ToolbarContainer from '@/components/ToolbarContainer/ToolbarContainer.vue'
				import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'
				import { mdiFormatAlignRight, mdiFormatAlignLeft, mdiFormatAlignCenter } from '@mdi/js'

				const justification = ref<string>()
				</script>`,
			},
		],
	},
}

export const WithCheckboxes: Story = {
	render: (args) => {
		return {
			components: { VCheckbox, ToolbarContainer, SyIcon },
			setup() {
				return { args }
			},
			template: `
				<ToolbarContainer
					class="d-flex flex-wrap ga-4"
					aria-label="Options d'envoi"
				>
					<div
						class="d-flex flex-wrap ga-4"
						role="group"
						aria-label="Avertissements"	
					>
						<VCheckbox
							label="Envoyer une copie"
							color="primary"
							hide-details
						/>
						<VCheckbox
							label="Envoyer en copie cachée"
							color="primary"
							hide-details
						/>
					</div>
					<div
						class="d-flex flex-wrap ga-4"
						role="group"
						aria-label="Confirmations"
					>
						<VCheckbox
							label="Confirmer la lecture"
							color="primary"
							hide-details
						/>
					</div>
				</ToolbarContainer>
			`,
		}
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
					<ToolbarContainer
						class="d-flex flex-wrap ga-4"
						aria-label="Options d'envoi"
					>
						<div
							class="d-flex flex-wrap ga-4"
							role="group"
							aria-label="Avertissements"
						>
							<VCheckbox
								label="Envoyer une copie"
								color="primary"
								hide-details
							/>
							<VCheckbox
								label="Envoyer en copie cachée"
								color="primary"
								hide-details
							/>
						</div>
						<div
							class="d-flex flex-wrap ga-4"
							role="group"
							aria-label="Confirmations"
						>
							<VCheckbox
								label="Confirmer la lecture"
								color="primary"
								hide-details
							/>
						</div>
					</ToolbarContainer>
				</template>`,
			},
		],
	},
}

export const ManySections: Story = {
	render: (args) => {
		return {
			components: { VBtn, VDivider, ToolbarContainer, SyIcon, VBtnToggle },
			setup() {
				const justification = ref()
				const textDecoration = ref([])
				return { args, justification, textDecoration, mdiFormatAlignRight, mdiFormatAlignLeft, mdiFormatAlignCenter, mdiFormatAlignJustify, mdiFormatBold, mdiFormatItalic, mdiFormatUnderline, mdiFormatColorText, mdiFormatColorFill }
			},
			template: `
				<ToolbarContainer
					class="d-flex flex-wrap ga-4 align-center"
					aria-label="Outils d'édition"
				>
					<VBtnToggle
						class="d-flex flex-wrap ga-2"
						role="radiogroup"
						aria-label="Outils d'alignement"
						v-model="justification"
						color="primary"
						style="overflow: visible;"
					>
						<VBtn
							title="ferrer à gauche"
							aria-label="ferrer à gauche"
							role="radio"
							value="left"
							elevation="2"
							size="small"
							height="48"
							:aria-checked="justification === 'left' ? 'true' : 'false'"
						>
							<SyIcon :icon="mdiFormatAlignLeft" size="x-large" decorative />
						</VBtn>
						<VBtn
							title="justifier"
							aria-label="justifier"
							role="radio"
							value="justify"
							elevation="2"
							size="small"
							height="48"
							:aria-checked="justification === 'justify' ? 'true' : 'false'"
						>
							<SyIcon :icon="mdiFormatAlignJustify" size="x-large" decorative />
						</VBtn>
						<VBtn
							title="centrer"
							aria-label="centrer"
							role="radio"
							value="center"
							elevation="2"
							size="small"
							:aria-checked="justification === 'center' ? 'true' : 'false'"
						>
							<SyIcon :icon="mdiFormatAlignCenter" size="x-large" decorative />
						</VBtn>
						<VBtn
							title="ferrer a droite"
							aria-label="ferrer a droite"
							role="radio"
							value="right"
							elevation="2"
							size="small"
							:aria-checked="justification === 'right' ? 'true' : 'false'"
						>
							<SyIcon :icon="mdiFormatAlignRight" size="x-large" decorative />
						</VBtn>
					</VBtnToggle>
					<span style="height: 48px; width: 2px; background-color: #999"></span>
					<VBtnToggle
						class="d-flex flex-wrap ga-2"
						role="group"
						aria-label="Style du texte"
						v-model="textDecoration"
						color="primary"
						style="overflow: visible;"
						multiple
					>
						<VBtn
							title="gras"
							aria-label="gras"
							elevation="2"
							size="small"
							value="bold"
							:aria-pressed="textDecoration.includes('bold') ? 'true' : 'false'"
						>
							<SyIcon :icon="mdiFormatBold" size="x-large" decorative />
						</VBtn>
						<VBtn
							title="italique"
							aria-label="italique"
							elevation="2"
							size="small"
							value="italic"
							:aria-pressed="textDecoration.includes('italic') ? 'true' : 'false'"
						>
							<SyIcon :icon="mdiFormatItalic" size="x-large" decorative />
						</VBtn>
						<VBtn
							title="souligné"
							aria-label="souligné"
							elevation="2"
							size="small"
							value="underline"
							:aria-pressed="textDecoration.includes('underline') ? 'true' : 'false'"
						>
							<SyIcon :icon="mdiFormatUnderline" size="x-large" decorative />
						</VBtn>
					</VBtnToggle>
					<span style="height: 48px; width: 2px; background-color: #999"></span>
					<div
						class="d-flex flex-wrap ga-2"
						role="group"
						aria-label="Couleurs"
					>
						<VBtn
							title="couleur du texte"
							aria-label="couleur du texte"
							size="small"
							height="48"
						>
							<SyIcon :icon="mdiFormatColorText" size="x-large" decorative />
						</VBtn>
						<VBtn
							title="couleur de fond"
							aria-label="couleur de fond"
							size="small"
							height="48"
						>
							<SyIcon :icon="mdiFormatColorFill" size="x-large" decorative />
						</VBtn>
					</div>
				</ToolbarContainer>
			`,
		}
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
					<ToolbarContainer
						class="d-flex flex-wrap ga-4 align-center"
						aria-label="Outils d'édition"
					>
						<VBtnToggle
							class="d-flex flex-wrap ga-2"
							role="radiogroup"
							aria-label="Outils d'alignement"
							v-model="justification"
							color="primary"
							style="overflow: visible;"
						>
							<VBtn
								title="ferrer à gauche"
								aria-label="ferrer à gauche"
								role="radio"
								value="left"
								elevation="2"
								size="small"
								:aria-checked="justification === 'left' ? 'true' : 'false'"
							>
								<SyIcon :icon="mdiFormatAlignLeft" size="x-large" decorative />
							</VBtn>
							<VBtn
								title="justifier"
								aria-label="justifier"
								role="radio"
								value="justify"
								elevation="2"
								size="small"
								:aria-checked="justification === 'justify' ? 'true' : 'false'"
							>
								<SyIcon :icon="mdiFormatAlignJustify" size="x-large" decorative />
							</VBtn>
							<VBtn
								title="centrer"
								aria-label="centrer"
								role="radio"
								value="center"
								elevation="2"
								size="small"
								:aria-checked="justification === 'center' ? 'true' : 'false'"
							>
								<SyIcon :icon="mdiFormatAlignCenter" size="x-large" decorative />
							</VBtn>
							<VBtn
								title="ferrer a droite"
								aria-label="ferrer a droite"
								role="radio"
								value="right"
								elevation="2"
								size="small"
								:aria-checked="justification === 'right' ? 'true' : 'false'"
							>
								<SyIcon :icon="mdiFormatAlignRight" size="x-large" decorative />
							</VBtn>
						</VBtnToggle>
						<span style="height: 48px; width: 2px; background-color: #999"></span>
						<VBtnToggle
							class="d-flex flex-wrap ga-2"
							role="group"
							aria-label="Style du texte"
							v-model="textDecoration"
							color="primary"
							style="overflow: visible;"
							multiple
						>
							<VBtn
								title="gras"
								aria-label="gras"
								elevation="2"
								size="small"
								value="bold"
								:aria-pressed="textDecoration.includes('bold') ? 'true' : 'false'"
							>
								<SyIcon :icon="mdiFormatBold" size="x-large" decorative />
							</VBtn>
							<VBtn
								title="italique"
								aria-label="italique"
								elevation="2"
								size="small"
								value="italic"
								:aria-pressed="textDecoration.includes('italic') ? 'true' : 'false'"
							>
								<SyIcon :icon="mdiFormatItalic" size="x-large" decorative />
							</VBtn>
							<VBtn
								title="souligné"
								aria-label="souligné"
								elevation="2"
								size="small"
								value="underline"
								:aria-pressed="textDecoration.includes('underline') ? 'true' : 'false'"
							>
								<SyIcon :icon="mdiFormatUnderline" size="x-large" decorative />
							</VBtn>
						</VBtnToggle>
						<span style="height: 48px; width: 2px; background-color: #999"></span>
						<div
							class="d-flex flex-wrap ga-2"
							role="group"
							aria-label="Couleurs"
						>
							<VBtn
								title="couleur du texte"
								aria-label="couleur du texte"
								size="small"
								height="48"
							>
								<SyIcon :icon="mdiFormatColorText" size="x-large" decorative />
							</VBtn>
							<VBtn
								title="couleur de fond"
								aria-label="couleur de fond"
								size="small"
								height="48"
							>
								<SyIcon :icon="mdiFormatColorFill" size="x-large" decorative />
							</VBtn>
						</div>
					</ToolbarContainer>
				</template>

				<script setup lang="ts">
				import { ref } from 'vue'
				import { VBtn, VBtnToggle } from 'vuetify/components'
				import ToolbarContainer from '@/components/ToolbarContainer/ToolbarContainer.vue'
				import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'
				import { mdiFormatAlignRight, mdiFormatAlignLeft, mdiFormatAlignCenter, mdiFormatAlignJustify, mdiFormatBold, mdiFormatItalic, mdiFormatUnderline, mdiFormatColorText, mdiFormatColorFill } from '@mdi/js'

				const justification = ref<string>()
				const textDecoration = ref<string[]>([])
				</script>`,
			},
		],
	},
}

export const Vertical: Story = {
	render: (args) => {
		return {
			components: { VBtn, ToolbarContainer, SyIcon, VBtnToggle },
			setup() {
				const justification = ref<string>()
				const textDecoration = ref<string[]>([])
				return { args, justification, textDecoration, mdiFormatAlignRight, mdiFormatAlignLeft, mdiFormatAlignCenter, mdiFormatAlignJustify, mdiFormatBold, mdiFormatItalic, mdiFormatUnderline, mdiFormatColorText, mdiFormatColorFill }
			},
			template: `
				<ToolbarContainer
					class="d-flex flex-column flex-wrap ga-4"
					style="width: min-content;"
					aria-label="Outils d'édition verticaux"
					aria-orientation="vertical"
				>
					<VBtnToggle
						class="d-flex flex-column flex-wrap ga-4"
						role="radiogroup"
						direction="vertical"
						style="overflow: visible;"
						color="primary"
						aria-label="Outils d'alignement"
						v-model="justification"
					>
						<VBtn
							title="ferrer à gauche"
							aria-label="ferrer à gauche"
							role="radio"
							value="left"
							elevation="2"
							size="small"
							height="48"
							:aria-checked="justification === 'left' ? 'true' : 'false'"
						>
							<SyIcon :icon="mdiFormatAlignLeft" size="x-large" decorative />
						</VBtn>
						<VBtn
							title="justifier"
							aria-label="justifier"
							role="radio"
							value="justify"
							elevation="2"
							size="small"
							height="48"
							:aria-checked="justification === 'justify' ? 'true' : 'false'"
						>
							<SyIcon :icon="mdiFormatAlignJustify" size="x-large" decorative />
						</VBtn>
						<VBtn
							title="centrer"
							aria-label="centrer"
							role="radio"
							value="center"
							elevation="2"
							size="small"
							height="48"
							:aria-checked="justification === 'center' ? 'true' : 'false'"
						>
							<SyIcon :icon="mdiFormatAlignCenter" size="x-large" decorative />
						</VBtn>
						<VBtn
							title="ferrer a droite"
							aria-label="ferrer a droite"
							role="radio"
							value="right"
							elevation="2"
							size="small"
							height="48"
							:aria-checked="justification === 'right' ? 'true' : 'false'"
						>
							<SyIcon :icon="mdiFormatAlignRight" size="x-large" decorative />
						</VBtn>
					</VBtnToggle>
					<span style="height: 2px; width: 48px; background-color: #999"></span>
					<VBtnToggle
						class="d-flex flex-column flex-wrap ga-4"
						role="group"
						direction="vertical"
						aria-label="Style du texte"
						v-model="textDecoration"
						color="primary"
						style="overflow: visible;"
						multiple
					>
						<VBtn
							title="gras"
							aria-label="gras"
							elevation="2"
							size="small"
							height="48"
							value="bold"
							:aria-pressed="textDecoration.includes('bold') ? 'true' : 'false'"
						>
							<SyIcon :icon="mdiFormatBold" size="x-large" decorative />
						</VBtn>
						<VBtn
							title="italique"
							aria-label="italique"
							elevation="2"
							size="small"
							height="48"
							value="italic"
							:aria-pressed="textDecoration.includes('italic') ? 'true' : 'false'"
						>
							<SyIcon :icon="mdiFormatItalic" size="x-large" decorative />
						</VBtn>
						<VBtn
							title="souligné"
							aria-label="souligné"
							elevation="2"
							size="small"
							height="48"
							value="underline"
							:aria-pressed="textDecoration.includes('underline') ? 'true' : 'false'"
						>
							<SyIcon :icon="mdiFormatUnderline" size="x-large" decorative />
						</VBtn>
					</VBtnToggle>
					<span style="height: 2px; width: 48px; background-color: #999"></span>
					<div
						class="d-flex flex-column flex-wrap ga-4"
						role="group"
						aria-label="Couleurs"
					>
						<VBtn
							title="couleur du texte"
							aria-label="couleur du texte"
							size="small"
							height="48"
						>
							<SyIcon :icon="mdiFormatColorText" size="x-large" decorative />
						</VBtn>
						<VBtn
							title="couleur de fond"
							aria-label="couleur de fond"
							size="small"
							height="48"
						>
							<SyIcon :icon="mdiFormatColorFill" size="x-large" decorative />
						</VBtn>
					</div>
				</ToolbarContainer>
			`,
		}
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
					<ToolbarContainer
						class="d-flex flex-column flex-wrap ga-4"
						style="width: min-content;"
						aria-label="Outils d'édition verticaux"
						aria-orientation="vertical"
					>
						<VBtnToggle
							class="d-flex flex-column flex-wrap ga-4"
							role="radiogroup"
							direction="vertical"
							style="overflow: visible;"
							color="primary"
							aria-label="Outils d'alignement"
							v-model="justification"
						>
							<VBtn
								title="ferrer à gauche"
								aria-label="ferrer à gauche"
								role="radio"
								value="left"
								elevation="2"
								size="small"
								:aria-checked="justification === 'left' ? 'true' : 'false'"
							>
								<SyIcon :icon="mdiFormatAlignLeft" size="x-large" decorative />
							</VBtn>
							<VBtn
								title="justifier"
								aria-label="justifier"
								role="radio"
								value="justify"
								elevation="2"
								size="small"
								:aria-checked="justification === 'justify' ? 'true' : 'false'"
							>
								<SyIcon :icon="mdiFormatAlignJustify" size="x-large" decorative />
							</VBtn>
							<VBtn
								title="centrer"
								aria-label="centrer"
								role="radio"
								value="center"
								elevation="2"
								size="small"
								height="48"
								:aria-checked="justification === 'center' ? 'true' : 'false'"
							>
								<SyIcon :icon="mdiFormatAlignCenter" size="x-large" decorative />
							</VBtn>
							<VBtn
								title="ferrer a droite"
								aria-label="ferrer a droite"
								role="radio"
								value="right"
								elevation="2"
								size="small"
								height="48"
								:aria-checked="justification === 'right' ? 'true' : 'false'"
							>
								<SyIcon :icon="mdiFormatAlignRight" size="x-large" decorative />
							</VBtn>
						</VBtnToggle>
						<span style="height: 2px; width: 48px; background-color: #999"></span>
						<VBtnToggle
							class="d-flex flex-column flex-wrap ga-4"
							role="group"
							direction="vertical"
							aria-label="Style du texte"
							v-model="textDecoration"
							color="primary"
							style="overflow: visible;"
							multiple
						>
							<VBtn
								title="gras"
								aria-label="gras"
								elevation="2"
								size="small"
								height="48"
								value="bold"
								:aria-pressed="textDecoration.includes('bold') ? 'true' : 'false'"
							>
								<SyIcon :icon="mdiFormatBold" size="x-large" decorative />
							</VBtn>
							<VBtn
								title="italique"
								aria-label="italique"
								elevation="2"
								size="small"
								height="48"
								value="italic"
								:aria-pressed="textDecoration.includes('italic') ? 'true' : 'false'"
							>
								<SyIcon :icon="mdiFormatItalic" size="x-large" decorative />
							</VBtn>
							<VBtn
								title="souligné"
								aria-label="souligné"
								elevation="2"
								size="small"
								height="48"
								value="underline"
								:aria-pressed="textDecoration.includes('underline') ? 'true' : 'false'"
							>
								<SyIcon :icon="mdiFormatUnderline" size="x-large" decorative />
							</VBtn>
						</VBtnToggle>
						<span style="height: 2px; width: 48px; background-color: #999"></span>
						<div
							class="d-flex flex-column flex-wrap ga-4"
							role="group"
							aria-label="Couleurs"
						>
							<VBtn
								title="couleur du texte"
								aria-label="couleur du texte"
								size="small"
								height="48"
							>
								<SyIcon :icon="mdiFormatColorText" size="x-large" decorative />
							</VBtn>
							<VBtn
								title="couleur de fond"
								aria-label="couleur de fond"
								size="small"
								height="48"
							>
								<SyIcon :icon="mdiFormatColorFill" size="x-large" decorative />
							</VBtn>
						</div>
					</ToolbarContainer>
				</template>

				<script setup lang="ts">
					import { ref } from 'vue'
					import { VBtn, VBtnToggle } from 'vuetify/components'
					import ToolbarContainer from '@/components/ToolbarContainer/ToolbarContainer.vue'
					import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'
					import { mdiFormatAlignRight, mdiFormatAlignLeft, mdiFormatAlignCenter, mdiFormatAlignJustify, mdiFormatBold, mdiFormatItalic, mdiFormatUnderline, mdiFormatColorText, mdiFormatColorFill } from '@mdi/js'

					const justification = ref<string>()
					const textDecoration = ref<string[]>([])
				</script>`,
			},
		],
	},
}
