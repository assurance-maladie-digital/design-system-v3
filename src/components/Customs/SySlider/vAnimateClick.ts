function addClass(el: MouseEvent) {
	if (!(el.currentTarget instanceof HTMLElement)) return
	el.currentTarget.classList.add('animate-click')
}

function removeClass(el: MouseEvent) {
	if (!(el.currentTarget instanceof HTMLElement)) return
	el.currentTarget.classList.remove('animate-click')
}

export const vAnimateClick = {
	mounted: (el: HTMLElement) => {
		el.addEventListener('mousedown', addClass)
		el.addEventListener('mouseup', removeClass)
		el.addEventListener('mouseleave', removeClass)
	},
	beforeUnmounted: (el: HTMLElement) => {
		el.removeEventListener('mousedown', addClass)
		el.removeEventListener('mouseup', removeClass)
		el.removeEventListener('mouseleave', removeClass)
	},
}
