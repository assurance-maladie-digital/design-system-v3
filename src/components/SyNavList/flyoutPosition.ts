// Côté d'ouverture d'un sous-niveau, dans le sens de lecture : 'end' à droite en français, à gauche en RTL.
export type SyNavListSide = 'start' | 'end'

// Marge gardée entre un sous-niveau et le bord de la fenêtre
const VIEWPORT_MARGIN = 8

export interface FlyoutGeometry {
	// Bords gauche et droit du niveau qui contient l'entrée
	listLeft: number
	listRight: number
	// Sous-niveau tel qu'affiché avant ajustement (côté préféré, sans décalage vertical)
	flyoutWidth: number
	flyoutTop: number
	flyoutHeight: number
	viewportWidth: number
	viewportHeight: number
	preferredSide: SyNavListSide
	rtl: boolean
}

export interface FlyoutPosition {
	side: SyNavListSide
	// Remontée en pixels, pour que le bas du sous-niveau reste dans la fenêtre
	shift: number
}

// Le sous-niveau garde le côté préféré (celui de son parent) tant qu'il y tient ; sinon il passe de l'autre
// côté si la place y est plus grande. Il remonte s'il dépasse le bas de la fenêtre, sans en dépasser le haut.
export function resolveFlyoutPosition(geometry: FlyoutGeometry): FlyoutPosition {
	const spaceRight = geometry.viewportWidth - geometry.listRight - VIEWPORT_MARGIN
	const spaceLeft = geometry.listLeft - VIEWPORT_MARGIN
	const space = {
		end: geometry.rtl ? spaceLeft : spaceRight,
		start: geometry.rtl ? spaceRight : spaceLeft,
	}
	const other: SyNavListSide = geometry.preferredSide === 'end' ? 'start' : 'end'
	const side = geometry.flyoutWidth > space[geometry.preferredSide] && space[other] > space[geometry.preferredSide]
		? other
		: geometry.preferredSide

	const overflowBottom = geometry.flyoutTop + geometry.flyoutHeight - (geometry.viewportHeight - VIEWPORT_MARGIN)
	const roomAbove = geometry.flyoutTop - VIEWPORT_MARGIN
	const shift = Math.max(0, Math.min(overflowBottom, roomAbove))

	return { side, shift }
}
