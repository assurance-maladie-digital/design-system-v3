import { VIcon } from 'vuetify/components'
import type { StoryObj } from '@storybook/vue3'
import { mdiCheckboxMarkedCircle } from '@mdi/js'

const checkIcon = mdiCheckboxMarkedCircle

export default {
	title: 'Composants/Formulaires/RangeField/Accessibilité',
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
				<div class="mt-4">
					<p>Rapport d’audit manuel : <a href="/audits/RangeField.xlsx" style="color:#0C41BD;">Voir le rapport</a></p>
					<p style="color: grey; font-size: 14px">Correctifs associés (<a href="https://github.com/assurance-maladie-digital/design-system-v3/issues/908" target="_blank" style="color:#0C41BD;">issue #908</a>)</p>
				</div>
			  </div>
            `,
		}
	},
	tags: ['!dev'],
}
