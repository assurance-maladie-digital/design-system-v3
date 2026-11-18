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

/**
 * Décorateur Storybook : affiche le même bandeau d'information au-dessus de la story
 * décorée. Variante de `createInfoNotice` pour l'usage direct dans les stories.
 * `content` est un fragment de template Vue inséré dans le slot par défaut de l'alerte.
 */
export const createInfoNoticeDecorator = (content: string) => () => ({
	components: { SyAlert },
	template: `
		<div>
			<SyAlert type="info" variant="tonal" class="mb-4" role="note" :closable="false">
				${content}
			</SyAlert>
			<story/>
		</div>
	`,
})
