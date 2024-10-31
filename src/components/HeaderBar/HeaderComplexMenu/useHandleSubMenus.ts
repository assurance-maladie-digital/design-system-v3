import { computed, provide, ref, watch, type DeepReadonly, type Ref } from 'vue'
import { registerSubMenuKey } from './conts'

export default function useHandleSubMenus(openStatus: DeepReadonly<Ref<boolean>>) {
	type SubMenu = { id: string, status: Ref<boolean>, close: () => void }
	const subMenus: Ref<SubMenu[]> = ref([])

	function registerSubMenu(status: Ref<boolean>, close: () => void) {
		const id = String(subMenus.value.length)
		const newSubMenu = { id, status, close }

		// Register the new submenu
		subMenus.value.push(newSubMenu)

		// Watch for changes to the status of this specific submenu
		watch(status, (newStatus) => {
			if (newStatus) {
				closeOtherSubMenus(newSubMenu)
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
