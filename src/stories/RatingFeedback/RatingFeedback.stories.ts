import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { VBtn } from 'vuetify/components'
import RatingPicker from '@/components/RatingPicker/RatingPicker.vue'
import { RatingEnum } from '@/components/RatingPicker/Rating'
import SyTextArea from '@/components/SyTextArea/SyTextArea.vue'
import { locales } from '../../../.storybook/addons/rating-feedback/locales'

const feedbackEndpoint = 'https://storybook.free.beeceptor.com/'

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
		components: { RatingPicker, SyTextArea, VBtn },
		setup() {
			const rating = ref(-1)
			const comment = ref('')
			const status = ref<'idle' | 'pending' | 'success' | 'error'>('idle')

			const submit = async () => {
				status.value = 'pending'

				try {
					const response = await fetch(feedbackEndpoint, {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							comment: comment.value,
							component: args.component,
							rating: rating.value,
							submittedAt: new Date().toISOString(),
						}),
					})

					if (!response.ok) throw new Error(`HTTP ${response.status}`)
					status.value = 'success'
				}
				catch {
					status.value = 'error'
				}
			}

			return { comment, locales, rating, RatingEnum, status, submit }
		},
		template: `
			<div style="width: min(500px, calc(100vw - 48px)); padding: 8px;">
				<RatingPicker
					v-model="rating"
					:type="RatingEnum.STARS"
					:label="locales.ratingLabel"
					center
				/>
				<SyTextArea
					v-model="comment"
					:label="locales.commentLabel"
					class="mt-6"
					hide-details
					rows="4"
				/>
				<VBtn
					:disabled="rating === -1 || status === 'pending'"
					:loading="status === 'pending'"
					class="mt-6"
					color="primary"
					@click="submit"
				>
					{{ status === 'pending' ? locales.sending : locales.send }}
				</VBtn>
				<p
					v-if="status === 'success'"
					class="mt-4 text-success"
					role="status"
				>
					{{ locales.success }}
				</p>
				<p
					v-if="status === 'error'"
					class="mt-4 text-error"
					role="alert"
				>
					{{ locales.error }}
				</p>
			</div>
		`,
	}),
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
