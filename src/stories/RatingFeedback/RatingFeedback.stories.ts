import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { VBtn, VSelect } from 'vuetify/components'
import RatingPicker from '@/components/RatingPicker/RatingPicker.vue'
import { RatingEnum } from '@/components/RatingPicker/Rating'
import SyTextArea from '@/components/SyTextArea/SyTextArea.vue'
import { locales } from '../../../.storybook/addons/rating-feedback/locales'

const feedbackRecipient = 'studio-design.cnam@assurance-maladie.fr'

const meta = {
	title: 'Internes/RatingFeedback',
	parameters: {
		layout: 'centered',
		options: { showPanel: false },
	},
	args: {
		component: '',
	},
	render: args => ({
		components: { RatingPicker, SyTextArea, VBtn, VSelect },
		setup() {
			const rating = ref(-1)
			const comment = ref('')
			const issueType = ref(locales.issueTypes[4])
			const status = ref<'idle' | 'sending'>('idle')

			const submit = () => {
				status.value = 'sending'
				const subject = encodeURIComponent(issueType.value)
				const body = encodeURIComponent([
					`Composant : ${args.component}`,
					`Note : ${rating.value}/5`,
					'',
					`Commentaire : ${comment.value || 'Aucun commentaire.'}`,
				].join('\n'))

				window.parent.postMessage({ type: 'rating-feedback-sent' }, window.location.origin)
				window.location.href = `mailto:${feedbackRecipient}?subject=${subject}&body=${body}`
			}

			return { comment, issueType, locales, rating, RatingEnum, status, submit }
		},
		template: `
			<div style="width: min(500px, calc(100vw - 48px)); padding: 8px;">
				<RatingPicker
					v-model="rating"
					:type="RatingEnum.STARS"
					:label="locales.ratingLabel"
					center
				/>
				<VSelect
					v-model="issueType"
					:items="locales.issueTypes"
					:label="locales.issueTypeLabel"
					class="mt-6"
					density="comfortable"
				/>
				<SyTextArea
					v-model="comment"
					:label="locales.commentLabel"
					class="mt-6"
					hide-details
					rows="4"
				/>
				<VBtn
					:disabled="rating === -1 || status === 'sending'"
					class="mt-6"
					color="primary"
					@click="submit"
				>
					{{ status === 'sending' ? locales.sending : locales.send }}
				</VBtn>
			</div>
		`,
	}),
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
