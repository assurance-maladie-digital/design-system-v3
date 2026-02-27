import SyAlert from '../../components/SyAlert/SyAlert.vue'

export const createDeprecationNotice = (replacementLabel: string, replacementUrl: string) => ({
	render: () => ({
		components: { SyAlert },
		setup() {
			return { replacementLabel, replacementUrl }
		},
		template: `
			<SyAlert type="warning" variant="tonal" class="mb-4" :closable="false">
				<b>Ce composant est déprécié</b>, il ne sera plus maintenu ou mis à jour.<br/>
				Nous vous recommandons d'utiliser à la place le composant <a class="text-primary" :href="replacementUrl"><code>{{ replacementLabel }}</code></a>.
			</SyAlert>
		`,
	}),
	tags: ['!dev'],
})
