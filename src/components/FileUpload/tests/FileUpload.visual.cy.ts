import FileUpload from '../FileUpload.vue'

// Déclenche `:focus-visible` via l'option native focus({ focusVisible: true }).
const focusVisible = (selector: string) =>
	cy.get(selector).then(($el) => {
		($el[0] as HTMLElement).focus({ focusVisible: true } as FocusOptions)
	})

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

	// Dropzone (`role="button"` custom) : ring DS primary scopé au clavier (2px, offset 2px),
	// en plus du fond `:focus-within` existant.
	it('shows the DS ring on the focused dropzone', () => {
		cy.mountWithVuetify(FileUpload, {
			props: { modelValue: [] },
		})

		focusVisible('.sy-file-upload')
		cy.wait(150)
		cy.matchImageSnapshot('file-upload-dropzone-focus', cy.get('.v-application'))
	})
})
