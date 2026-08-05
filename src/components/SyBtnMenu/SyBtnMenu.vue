<script lang="ts" setup>
	import { ref, watch, computed, onMounted, useSlots, useId, type PropType, nextTick } from 'vue'
	import { useDisplay } from 'vuetify'
	import slugify from 'slugify'
	import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'

	type Item = string | Record<string, unknown>

	const props = defineProps({
		modelValue: {
			type: [Object, String, null],
			default: null,
		},
		menuItems: {
			type: Array as PropType<Item[]>,
			default: () => [],
		},
		label: {
			type: String,
			default: 'Menu utilisateur',
		},
		required: {
			type: Boolean,
			default: false,
		},
		menuId: {
			type: String,
			default: 'custom-btn-select-menu',
		},
		textKey: {
			type: String,
			default: 'text',
		},
		valueKey: {
			type: String,
			default: 'value',
		},
		iconKey: {
			type: String,
			default: 'icon',
		},
		primaryInfo: {
			type: String,
			default: 'Information principale',
		},
		secondaryInfo: {
			type: String,
			default: undefined,
		},
		hideIcon: {
			type: Boolean,
			default: false,
		},
		hideLogoutBtn: {
			type: Boolean,
			default: false,
		},
		isMobileView: {
			type: Boolean,
			default: false,
		},
		iconOnly: {
			type: Boolean,
			default: false,
		},
		showIdentityInList: {
			type: Boolean,
			default: false,
		},
		options: {
			type: Object,
			default: () => ({ menu: {}, btn: {}, list: {} }),
		},
	})

	const emit = defineEmits(['update:modelValue', 'logout'])
	const slots = useSlots()
	const { smAndDown } = useDisplay()

	const isOpen = ref(false)
	const selectedItem = ref<Record<string, unknown> | string | null>(props.modelValue as Record<string, unknown> | string | null)
	const buttonRef = ref<HTMLElement | null>(null)
	const buttonWidth = ref('')

	onMounted(() => {
		if (buttonRef.value && !isMobileVersion.value) {
			buttonWidth.value = `${buttonRef.value.getBoundingClientRect().width}px`
		}
	})

	const selectItem = (item: Item | null) => {
		selectedItem.value = item
		emit('update:modelValue', item)
		isOpen.value = false
	}

	const formattedItems = computed(() => {
		return props.menuItems.map((item) => {
			if (typeof item === 'string') {
				return { [props.textKey]: item, [props.valueKey]: item }
			}
			return item
		})
	})

	const btnPadding = computed(() => {
		if (props.hideIcon) {
			return 'pa-1 pa-sm-2'
		}
		return isMobileVersion.value ? 'pa-1' : 'pa-1 pa-sm-3'
	})

	// Bloc d'identité (primaryInfo / secondaryInfo) affiché en tête du menu déroulant
	// lorsque le bouton est en mode icône seule (iconOnly) : l'identité, masquée dans
	// l'activateur, est alors reportée dans le menu pour rester accessible.
	const hasIdentityInList = computed(() => {
		return props.showIdentityInList && props.iconOnly && Boolean(props.primaryInfo)
	})

	const activatorLabel = computed(() => {
		if (props.iconOnly) {
			return [props.label, props.primaryInfo, props.secondaryInfo].filter(Boolean).join(', ')
		}

		if (isMobileVersion.value) {
			return [props.label, props.secondaryInfo].filter(Boolean).join(', ')
		}

		return props.label
	})

	const hasListContent = computed(() => {
		return Boolean(slots.default || !props.hideLogoutBtn || hasIdentityInList.value)
	})

	const isMobileVersion = computed(() => {
		return props.isMobileView || smAndDown.value || props.iconOnly
	})

	watch(() => props.modelValue, (newValue) => {
		selectedItem.value = newValue
	})

	const generatedId = ref(`custom-btn-select-${useId()}`)

	function getSelectedValue() {
		if (!selectedItem.value) return undefined
		if (typeof selectedItem.value === 'string') return selectedItem.value
		return selectedItem.value[props.textKey] as string
	}

	const menu = ref<InstanceType<typeof import('vuetify/components').VList> | null>(null)

	watch(isOpen, async (newVal) => {
		if (newVal) {
			await nextTick()
			if (menu.value?.$el) {
				menu.value.$el.querySelector('[role="menuitem"]')?.focus()
			}
		}
		else {
			await nextTick()
			document.getElementById(generatedId.value)!.focus()
		}
	})

	defineExpose({
		isOpen,
		formattedItems,
		selectedItem,
	})
</script>

<template>
	<div
		ref="buttonRef"
		class="sy-user-menu-btn-ctn d-inline-block"
	>
		<VMenu
			:id="$props.menuId"
			v-model="isOpen"
			class="sy-user-menu"
			:disabled="!hasListContent"
			location="bottom end"
			transition="fade-transition"
			offset="8"
			v-bind="props.options['menu']"
			scroll-strategy="none"
			z-index="9999"
		>
			<template #activator="{ props: menuProps }">
				<VBtn
					:id="generatedId"
					:class="[btnPadding, { 'rounded-circle': iconOnly }]"
					:height="iconOnly ? 'auto' : undefined"
					:icon="iconOnly"
					:size="iconOnly ? 'x-large' : 'default'"
					:width="iconOnly ? 'auto' : undefined"
					class="sy-user-menu-btn"
					v-bind="{
						...menuProps,
						// VMenu pose `aria-controls` et `aria-owns` en permanence,
						// alors que l'overlay n'est monté qu'à la première ouverture : tant que le menu
						// est fermé, ces attributs pointent vers un identifiant absent du document.
						// On ne les expose donc que lorsque la cible existe réellement.
						'aria-controls': isOpen ? menuProps['aria-controls'] : undefined,
						'aria-owns': isOpen ? menuProps['aria-owns'] : undefined,
						...props.options['btn'],
					}"
				>
					<span
						:class="['text-'+props?.options['btn']?.color]"
						class="d-flex align-center ga-2"
					>
						<slot name="prepend-icon" />
						<span class="d-sr-only">{{ activatorLabel }}</span>
						<span
							v-if="!isMobileVersion && !iconOnly"
							class="d-flex flex-column align-end py-1"
						>
							<span
								:class="`text-${props?.options['btn']?.textColor}`"
								class="text-h6 font-weight-bold"
							>
								{{ props.primaryInfo }}
							</span>
							<span
								:class="`text-${props?.options['btn']?.textColor}`"
								class="subtitle text-grey-darken-2 font-weight-regular"
							>
								{{ props.secondaryInfo }}
							</span>
						</span>
						<span
							v-if="isMobileVersion && !iconOnly"
							:class="`text-${props?.options['btn']?.textColor}`"
							class="font-weight-bold text-caption"
						>
							{{ props.primaryInfo }}
						</span>
						<slot name="append-icon" />
					</span>
				</VBtn>
			</template>
			<slot name="content">
				<VList
					v-if="hasListContent"
					ref="menu"
					tag="ul"
					role="menu"
					v-bind="props.options['list']"
					:aria-labelledby="generatedId"
					:aria-activedescendant="getSelectedValue() ? `item-${slugify(getSelectedValue()!)}` : undefined"
				>
					<slot
						v-if="hasIdentityInList"
						name="header-list-item"
					>
						<!-- `role="menu"` n'admet que des `menuitem`, `group` et `separator` : ce bloc
							est un rappel visuel de l'identité, déjà portée par le nom accessible de
							l'activateur (`activatorLabel`). On le retire donc de l'arbre d'accessibilité
							plutôt que de l'y exposer comme un enfant non conforme, ce qui fausserait aussi
							le nombre d'éléments annoncé pour le menu. -->
						<li
							class="sy-user-menu-identity px-4 py-3"
							role="presentation"
							aria-hidden="true"
							v-bind="props.options['identityListItem']"
						>
							<p class="text-body-2 font-weight-bold mb-0">
								{{ props.primaryInfo }}
							</p>
							<p
								v-if="secondaryInfo"
								class="text-caption text-grey-darken-3 font-weight-regular mb-0"
							>
								{{ props.secondaryInfo }}
							</p>
						</li>
					</slot>

					<VListItem
						v-for="(item, index) in formattedItems"
						:id="`item-${slugify(item[props.textKey] as string)}`"
						:key="index"
						tag="li"
						:class="`text-${props?.options['list']?.textColor}`"
						v-bind="props.options['list']"
						:href="item.link"
						:to="item.to"
						:tabindex="0"
						role="menuitem"
						:aria-current="selectedItem === item ? 'page' : undefined"
						@click="selectItem(item)"
					>
						<template
							v-if="item[props.iconKey]"
							#prepend
						>
							<SyIcon
								:icon="item[props.iconKey] as string"
								decorative
							/>
						</template>
						<VListItemTitle
							class="item-title"
						>
							{{ item[props.textKey] }}
						</VListItemTitle>
					</VListItem>
					<slot />
					<slot name="footer-list-item" />
				</VList>
			</slot>
		</VMenu>
	</div>
</template>

<style lang="scss" scoped>
.sy-user-menu-btn-ctn {
	position: relative;
	z-index: 1;

	.v-btn.v-btn--density-default {
		height: auto !important;
	}

	.v-btn {
		text-transform: none !important;
	}
}

.sy-user-menu-btn {
	padding: 12px !important;

	.subtitle {
		font-size: 0.875rem;
		line-height: 1.5;
	}
}

.sy-user-menu-btn:hover :deep(.v-btn__overlay) {
	background: rgba(var(--v-theme-interactionDark), 0.2) !important;
}

.sy-user-menu-btn:active :deep(.v-btn__overlay) {
	background: rgba(var(--v-theme-interactionDark), 0.4) !important;
}

.sy-user-menu-btn[aria-expanded='true'] :deep(.v-btn__overlay) {
	background: rgba(var(--v-theme-interactionDark), 0.2) !important;
	opacity: 1;
}

.item-title {
	white-space: wrap;
}

:deep(.v-list-item__prepend) {
	display: unset !important;
}

// Le contenu du VMenu est téléporté hors du composant, mais ce bloc est rendu par son propre
// template : il porte l'attribut de scope, les styles scopés l'atteignent donc sans passer par
// un override global.
// Le fond reprend le niveau d'interaction de l'activateur (survol / menu ouvert), et l'encart est
// détaché des bords de la liste — le padding vertical de `.v-list` fournit l'espace en haut, la
// marge celui des côtés et du bas.
.sy-user-menu-identity {
	margin: 0 8px 8px;
	background: rgba(var(--v-theme-interactionDark), 0.2);

	// Même arrondi que la liste : Vuetify pose 4px sur `.v-menu > .v-overlay__content` et la
	// `.v-list` en hérite. `inherit` reprend donc la valeur calculée du parent et suivra
	// automatiquement si l'arrondi du menu change.
	border-radius: inherit;
}
</style>
