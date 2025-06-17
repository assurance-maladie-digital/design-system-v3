<script setup lang="ts">
	import { type PropType, computed } from 'vue'
	import AmeliproBtn from '../AmeliproBtn/AmeliproBtn.vue'
	import AmeliproDropdownMenu from './AmeliproDropdownMenu/AmeliproDropdownMenu.vue'
	import AmeliproMessagingMenuBtn from './AmeliproMessagingMenuBtn/AmeliproMessagingMenuBtn.vue'
	import type { DropdownItem } from './AmeliproDropdownMenu/types'
	import type { IndexedObject } from '../types'
	import type { MessagingMenuTypes } from './types'
	import { convertToHex } from '@/utils/functions/convertToHex'
	import { useDisplay } from 'vuetify'

	const props = defineProps({
		items: {
			type: Array as PropType<MessagingMenuTypes[]>,
			default: () => [],
		},
		mainContentBg: {
			type: String,
			default: 'ap-grey-lighten-5',
		},
		menuWidth: {
			type: String,
			default: '255px',
		},
		newMessageDisable: {
			type: Boolean,
			default: false,
		},
		uniqueId: {
			type: String,
			required: true,
		},
	})

	const { mdAndUp } = useDisplay()
	const menuItems = computed<DropdownItem[]>(() => {
		return props.items.map(item => (
			{
				active: item.active,
				href: item.href,
				label: item.label,
				to: item.to,
			}
		))
	})

	const menuStyles = computed<IndexedObject>(() => {
		const styles: IndexedObject = {}
		if (mdAndUp.value) {
			styles.minWidth = (props.menuWidth)
		}
		else {
			styles.minWidth = '100%'
		}

		return styles
	})

	const mainContentStyles = computed<IndexedObject>(() => ({ backgroundColor: `${convertToHex(props.mainContentBg)}` }))
	const emit = defineEmits(['click-new-message'])
	const emitNewMessageEvent = (): void => {
		emit('click-new-message')
	}
</script>

<template>
	<div
		:id="uniqueId"
		class="d-flex flex-column flex-md-row amelipro-messaging-layout"
	>
		<nav
			:id="`${uniqueId}-menu`"
			aria-label="Menu messagerie"
			class="bg-ap-blue-darken-1 d-block d-sm-flex d-md-block align-sm-center messaging-menu"
			role="navigation"
			:style="menuStyles"
		>
			<div class="messaging-menu__new-message">
				<AmeliproBtn
					bordered
					class="font-weight-semibold px-5 messaging-menu__new-message-btn"
					:color="newMessageDisable ? 'ap-grey-lighten-2' : 'ap-blue-darken-1'"
					:disabled="newMessageDisable"
					:hover-color="newMessageDisable ? 'ap-grey-lighten-2' : 'ap-blue-darken-2'"
					:icon-color="newMessageDisable ? 'ap-grey' : 'ap-white'"
					icon-left
					icon-name="pencilNoCircle"
					:text-color="newMessageDisable ? 'ap-grey' : 'ap-white'"
					:unique-id="`${uniqueId}-new-message-btn`"
					@click="emitNewMessageEvent"
				>
					Nouveau message
				</AmeliproBtn>
			</div>

			<div
				v-if="mdAndUp"
				:id="`${uniqueId}-messaging-menu-desktop`"
				class="w-100 messaging-menu--desktop"
			>
				<ul
					:id="`${uniqueId}-messaging-menu-list`"
					class="list-style-none"
				>
					<li
						v-for="(item, index) in items"
						:key="index"
					>
						<AmeliproMessagingMenuBtn
							:active="item.active"
							:href="item.href"
							:icon="item.icon"
							:label="item.label"
							:to="item.to"
							:unique-id="`${uniqueId}-menu-btn-${index}`"
							:unread-number="item.unreadNumber"
						/>
					</li>
				</ul>
			</div>

			<div
				v-else
				:id="`${uniqueId}-messaging-menu-mobile`"
				class="w-100 messaging-menu__dropdown-menu"
			>
				<AmeliproDropdownMenu
					:items="menuItems"
					label="Menu de la messagerie"
					:unique-id="`${uniqueId}-dropdown`"
				/>
			</div>
		</nav>

		<div
			:id="`${uniqueId}-content`"
			class="w-100 amelipro-messaging-layout__content"
			:style="mainContentStyles"
		>
			<slot />
		</div>
	</div>
</template>

<style lang="scss" scoped>
@use '@/assets/amelipro/apTokens';

.messaging-menu {
	@media #{apTokens.$media-only-xs} {
		padding: 0 10px 24px;
	}

	@media #{apTokens.$media-only-sm} {
		padding: 10px 16px;
	}
}

.messaging-menu__new-message {
	@media #{apTokens.$media-up-md} {
		display: flex;
		justify-content: center;
		width: 100%;
		margin: 38px auto;
	}

	@media #{apTokens.$media-only-xs} {
		width: 100%;
		margin: 24px 0 16px;
	}

	@media #{apTokens.$media-only-sm} {
		margin-right: 20px;
	}
}

.messaging-menu__new-message-btn {
	@media #{apTokens.$media-only-xs} {
		width: 100%;
	}

	&:disabled {
		opacity: 1 !important;
	}
}

.messaging-menu--desktop {
	@media #{apTokens.$media-up-md} {
		margin-bottom: 30px;
	}
}
</style>
