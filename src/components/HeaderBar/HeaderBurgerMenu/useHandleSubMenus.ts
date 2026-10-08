import { computed, onScopeDispose, provide, ref, watch, type DeepReadonly, type Ref } from 'vue'
import { registerSubMenuKey } from './conts'

export default function useHandleSubMenus(openStatus: DeepReadonly<Ref<boolean>>) {
	type SubMenu = { id: string, status: Ref<boolean>, close: () => void }
	const subMenus: Ref<SubMenu[]> = ref([])
	let subMenuCounter = 0

	function registerSubMenu(status: Ref<boolean>, close: () => void) {
		// Incremental counter (not array length) to avoid id collisions after unregister
		const id = String(subMenuCounter++)
		const newSubMenu = { id, status, close }

		// Register the new submenu
		subMenus.value.push(newSubMenu)

		// Watch for changes to the status of this specific submenu
		watch(status, (newStatus) => {
			if (newStatus) {
				closeOtherSubMenus(newSubMenu)
			}
		})

		// Unregister when the calling component (HeaderSubMenu) unmounts :
		// avoids stale refs in subMenus (dead watchers, close() on unmounted submenus)
		onScopeDispose(() => {
			const index = subMenus.value.indexOf(newSubMenu)
			if (index !== -1) {
				subMenus.value.splice(index, 1)
			}
		})
	}

	function closeOtherSubMenus(subMenu: SubMenu) {
		subMenus.value.forEach((otherSubMenu) => {
			if (otherSubMenu.id !== subMenu.id && otherSubMenu.status) {
				otherSubMenu.close()
			}
		})
	}

	// When the current menu is closed, close its submenus
	watch(openStatus, (newOpenStatus) => {
		if (!newOpenStatus) {
			subMenus.value.forEach((subMenu) => {
				if (subMenu.status) {
					subMenu.close()
				}
			})
		}
	})

	const haveOpenSubMenu = computed(() => subMenus.value.some(subMenu => subMenu.status))

	provide(registerSubMenuKey, registerSubMenu)

	return {
		haveOpenSubMenu,
	}
}
