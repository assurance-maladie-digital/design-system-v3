import { VIcon } from 'vuetify/components'
import type { StoryObj } from '@storybook/vue3'
import { mdiCheckboxMarkedCircle } from '@mdi/js'
import SyAlert from '../SyAlert/SyAlert.vue'

const checkIcon = mdiCheckboxMarkedCircle

export default {
	title: 'Composants/Navigation/ExternalLinks/Accessibilité',
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
			   
			  
				<div class="mt-4">
					<p>Rapport d’audit manuel : <a href="/audits/ExternalLinks.xlsx" style="color:#0C41BD;">Voir le
						rapport</a></p>
					<p style="color: grey; font-size: 14px">Correctifs associés (<a
						href="https://github.com/assurance-maladie-digital/design-system-v3/issues/808" target="_blank"
						style="color:#0C41BD;"
					>issue #652</a>)</p>
				</div>
			  </div>
            `,
		}
	},
	tags: ['!dev'],
}

export const TanaguruFalsePositives: StoryObj = {
	render: (args) => {
		return {
			components: { SyAlert },
			setup() {
				return { args }
			},
			template: `
			<SyAlert
				type="warning"
			>
				L'outil Tanaguru remonte l'erreur suivante sur ce composant : <br />
				<cite>
				Interactive elements non reachable with keyboard navigation
				</cite>
				<br />
				Tanaguru se basant sur le markup HTML, il n'est pas en mesure de détecter les éléments rendus interactifs par l'usage de JavaScript.<br>
				Les éléments de ce composant sont bien accessibles au clavier, l'erreur est donc considérée comme un faux positif et peut être ignorée sans impact sur l'audit d'accessibilité.
			</SyAlert>
			`,
		}
	},
	tags: ['!dev'],
}
