import SyAlert from '../../components/SyAlert/SyAlert.vue'

export default {
	title: 'Démarrer/Enrichir le Design System',
	component: SyAlert,
}

export const InfoIntro = {
	render: () => {
		return {
			components: { SyAlert },
			setup() {
				return {}
			},
			template: `
              <SyAlert type="info" variant="tonal" :closable="false">
                <template #default>
                  Toutes les demandes d'enrichissement sont traitées au fil de l'eau en fonction de la disponibilité de l'activité.<br/>Une première estimation sur le délai de livraison de la solution sera annoncée au moment de sa qualification.
                </template>
              </SyAlert>
            `,
		}
	},
	tags: ['!dev'],
}