import { VIcon } from 'vuetify/components'
import type { StoryObj } from '@storybook/vue3'
import { mdiCheckboxMarkedCircle } from '@mdi/js'

const checkIcon = mdiCheckboxMarkedCircle

export default {
	title: 'Composants/Structure/HeaderLoading/Accessibilité',
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
			
			  <div class="mt-4 mb-6">
				  <p>Rapport d’audit manuel : <a href="/audits/HeaderLoding.xlsx" style="color:#0C41BD;">Voir le rapport</a></p>
				  <p style="color: grey; font-size: 14px">Correctifs associés (<a href="https://github.com/orgs/assurance-maladie-digital/projects/8/views/6?pane=issue&itemId=112098733&issue=assurance-maladie-digital%7Cdesign-system-v3%7C639" target="_blank" style="color:#0C41BD;">issue #639</a>)</p>
			  </div>
            `,
		}
	},
	tags: ['!dev'],
}
