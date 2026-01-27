import { VIcon } from 'vuetify/components'
import type { StoryObj } from '@storybook/vue3'
import { mdiCheckboxMarkedCircle } from '@mdi/js'

const checkIcon = mdiCheckboxMarkedCircle

export default {
	title: 'Composants/Formulaires/UploadWorkflow/Accessibilité',
}

export const Legende: StoryObj = {
	args: {
		icon: checkIcon,
	},
	render: (args) => {
		return {
			components: { VIcon },
			setup() {
				return { args }
			},
			template: `
			  <p style="color: grey;font-size: 11px; margin-bottom: 12px;">Date de conception: 20/11/2024</p>
			  <div>
				<p>Le tableau ci-dessous liste nos recommandations suivant les <a target="blank" style="color:#0C41BD;" href="https://www.numerique.gouv.fr/publications/rgaa-accessibilite/#contenu">catégories du RGAA</a>.</p>
				<p style="margin-bottom: 12px;font-weight:bold;">Pour rappel le composant seul ne garantie pas
				   l'accessibilité du site.</p>
			</div>
			  </div>
            `,
		}
	},
	tags: ['!dev'],
}
