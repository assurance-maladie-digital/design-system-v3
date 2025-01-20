function addClass(el: MouseEvent | TouchEvent) {
	if (!(el.currentTarget instanceof HTMLElement)) return
	el.currentTarget.classList.add('animate-click')
}

function removeClass(el: MouseEvent | TouchEvent) {
	if (!(el.currentTarget instanceof HTMLElement)) return
	el.currentTarget.classList.remove('animate-click')
}

export const vAnimateClick = {
	mounted: (el: HTMLElement) => {
		el.addEventListener('mousedown', addClass)
		el.addEventListener('mouseup', removeClass)
		el.addEventListener('mouseleave', removeClass)

		el.addEventListener('touchstart', addClass)
		el.addEventListener('touchend', removeClass)
		el.addEventListener('touchcancel', removeClass)
	},
}
