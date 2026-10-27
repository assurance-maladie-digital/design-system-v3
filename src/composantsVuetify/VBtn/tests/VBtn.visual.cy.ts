import { h } from 'vue'
import { VBtn, VIcon } from 'vuetify/components'
import { mdiBellOutline } from '@mdi/js'

// Pastille de notification placée dans le slot par défaut, comme dans l'issue #2695.
const badge = () => h('span', {
	class: 'badge',
	style: {
		position: 'absolute',
		top: '-3px',
		right: '-6px',
		width: '20px',
		height: '20px',
		borderRadius: '50%',
		backgroundColor: 'red',
	},
})

// L'élément absolu doit être positionné par rapport au bouton, et non par rapport à `.v-btn__content`.
const expectBadgeAtButtonCorner = () => {
	cy.get('.v-btn').then(($btn) => {
		const btn = $btn[0]!.getBoundingClientRect()
		cy.get('.badge').then(($badge) => {
			const badgeRect = $badge[0]!.getBoundingClientRect()
			expect(Math.round(badgeRect.top - btn.top), 'top').to.equal(-3)
			expect(Math.round(badgeRect.right - btn.right), 'right').to.equal(6)
		})
	})
}

describe('VBtn - absolute content in the default slot (issue #2695)', () => {
	const variants = ['elevated', 'flat'] as const

	variants.forEach((variant) => {
		it(`positions an absolute element relative to the ${variant} button`, () => {
			cy.mountWithVuetify(VBtn, {
				props: { color: 'primary', variant },
				slots: { default: () => ['Notifications', badge()] },
			})

			expectBadgeAtButtonCorner()
		})
	})

	it('positions an absolute element relative to an icon button', () => {
		cy.mountWithVuetify(VBtn, {
			props: { color: 'primary', icon: true },
			slots: { default: () => [h(VIcon, { icon: mdiBellOutline }), badge()] },
		})

		expectBadgeAtButtonCorner()
	})
})
