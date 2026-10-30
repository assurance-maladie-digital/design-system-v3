export const locales = {
	navLabel: 'Navigation secondaire',
	subMenuLabel: (label: string): string => `Sous-menu ${label}`,
	openSubMenu: (label: string): string => `${label} : afficher le sous-menu`,
	closeSubMenu: (label: string): string => `${label} : masquer le sous-menu`,
	actionLabel: (action: string, item: string): string => `${action} (${item})`,
}
