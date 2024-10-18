import { createApp } from 'vue'

const app = createApp({})

// Click Outside Directive
app.directive('click-outside', {
	beforeMount(el, binding) {
		el.clickOutsideEvent = function (event: Event) {
			// Check if the click is outside the element
			if (!(el === event.target || el.contains(event.target))) {
				// If so, call the method provided in the binding
				binding.value(event)
			}
		}
		// Attach the event listener
		document.addEventListener('click', el.clickOutsideEvent)
	},
	unmounted(el) {
		// Clean up the event listener
		document.removeEventListener('click', el.clickOutsideEvent)
	},
})

app.mount('#app')
