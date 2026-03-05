import { computed } from 'vue'
import SyAlert from '../../components/SyAlert/SyAlert.vue'

type Replacement = {
	label: string
	url: string
}

export const createDeprecationNotice = (replacements: Replacement[]) => ({
	render: () => ({
		components: { SyAlert },
		setup() {
			const isMultiple = computed(() => replacements.length > 1)

			return {
				replacements,
				isMultiple,
			}
		},
		template: `
          <SyAlert type="warning" variant="tonal" class="mb-4" :closable="false">
            <b>
              Ce<span v-if="isMultiple">s</span> composant<span v-if="isMultiple">s</span>
              <span v-if="isMultiple"> sont</span>
              <span v-else>est</span> déprécié<span v-if="isMultiple">s</span>
            </b>,
            <span v-if="isMultiple">ils ne seront</span>
            <span v-else>il ne sera</span> plus maintenu<span v-if="isMultiple">s</span> ou mis à jour.<br/>

            Nous vous recommandons d'utiliser à la place :
            <span v-for="(item, index) in replacements" :key="item.label">
          <a class="text-primary" :href="item.url">
            <code>{{ item.label }}</code>
          </a>
          <span v-if="index < replacements.length - 1">, </span>
        </span>.
          </SyAlert>
        `,
	}),
	tags: ['!dev'],
})
