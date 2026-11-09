import SyAlert from '../../components/SyAlert/SyAlert.vue'

/**
 * Crée un bandeau d'information (SyAlert type="info", bleu) à embarquer dans les pages MDX.
 * `content` est un fragment de template Vue inséré dans le slot par défaut de l'alerte.
 */
export const createInfoNotice = (content: string) => ({
	render: () => ({
		components: { SyAlert },
		template: `
          <SyAlert type="info" variant="tonal" class="mb-4" role="note" :closable="false">
            ${content}
          </SyAlert>
        `,
	}),
	tags: ['!dev'],
})
