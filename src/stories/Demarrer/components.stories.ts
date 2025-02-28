import SyAlert from '../../components/SyAlert/SyAlert.vue'

export default {
	title: 'Démarrer/Créer une issue',
	component: SyAlert,
}
export const Info = {
	render: () => {
		return {
			components: { SyAlert },
			setup() {
				return {}
			},
			template: `
              <SyAlert type="info" variant="tonal" :closable="false">
                <template #default>Lorsque vous créez une reproduction minimale, supprimez tous les éléments,
                  propriétés, variables, données et autres qui ne sont pas nécessaires pour reproduire le bug. Cela
                  facilitera le traitement du rapport et le temps qu’il faudra pour identifier puis résoudre le bug.
                </template>
              </SyAlert>
            `,
		}
	},
	tags: ['!dev'],
}
