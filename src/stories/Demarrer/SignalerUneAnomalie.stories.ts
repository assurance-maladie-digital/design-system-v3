import SyAlert from '../../components/SyAlert/SyAlert.vue'

export default {
	title: 'Démarrer/Signaler une anomalie',
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
                  Après qualification, les anomalies mineures sont embarquées au fil de l'eau dans les sprints successifs selon la disponibilité de l'activité.<br/>À l'inverse, les anomalies majeures sont embarquées si l'activité le permet dès le prochain sprint.<br/>Aucune anomalie ne peut être embarquée en cours de sprint sauf dérogation.
                </template>
              </SyAlert>
            `,
		}
	},
	tags: ['!dev'],
}

export const InfoPratiques = {
	render: () => {
		return {
			components: { SyAlert },
			setup() {
				return {}
			},
			template: `
              <SyAlert type="info" variant="tonal" :closable="false">
                <template #default>Lorsque vous créez une reproduction minimale, supprimez tous les éléments,
                  propriétés, variables, données et autres qui ne sont pas nécessaires pour reproduire l'anomalie. Cela
                  facilitera le traitement du rapport et le temps qu’il faudra pour identifier puis résoudre l'anomalie.
                </template>
              </SyAlert>
            `,
		}
	},
	tags: ['!dev'],
}
