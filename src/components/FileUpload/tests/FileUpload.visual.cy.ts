import FileUpload from '../FileUpload.vue'

describe('FileUpload - Visual regression tests', () => {
	it('displays the file upload zone by default', () => {
		cy.mountWithVuetify(FileUpload, {
			props: { modelValue: [] },
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('file-upload-default', cy.get('.v-application'))
	})

	it('displays the file upload zone in disabled state', () => {
		cy.mountWithVuetify(FileUpload, {
			props: {
				modelValue: [],
				disabled: true,
			},
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('file-upload-disabled', cy.get('.v-application'))
	})

	it('displays the file upload zone with multiple files allowed', () => {
		cy.mountWithVuetify(FileUpload, {
			props: {
				modelValue: [],
				multiple: true,
			},
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('file-upload-multiple', cy.get('.v-application'))
	})
})
