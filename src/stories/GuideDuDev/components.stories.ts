import Alert from '../../components/Alert/Alert.vue'

export default {
	title: 'Guide Du Dev/Rapport de bug',
	component: Alert,
}
export const Info = {
	render: () => {
		return {
			components: { Alert },
			setup() {
				return { }
			},
			template: `
				<Alert type="info" variant="tonal" :closable="false">
					<template #default>Lorsque vous créez une reproduction minimale, supprimez tous les éléments, propriétés, variables, données et autres qui ne sont pas nécessaires pour reproduire le bug. Cela facilitera le traitement du rapport et le temps qu’il faudra pour identifier puis résoudre le bug.
					</template>
				</Alert>
			`,
		}
	},
	tags: ['!dev'],
}
