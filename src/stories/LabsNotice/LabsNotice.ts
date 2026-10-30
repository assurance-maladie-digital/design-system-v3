import SyAlert from '../../components/SyAlert/SyAlert.vue'

export const createLabsNotice = () => ({
	render: () => ({
		components: { SyAlert },
		template: `
          <SyAlert type="info" variant="tonal" class="mb-4" role="note" :closable="false">
            <b>Composant Labs</b> : ce composant est en cours de validation.
            Son API (props, événements, slots) peut encore évoluer dans une version mineure ; chaque changement est signalé dans les notes de version.
            <a class="text-primary" href="/?path=/docs/labs-introduction--docs">En savoir plus sur les Labs</a>.
          </SyAlert>
        `,
	}),
	tags: ['!dev'],
})
