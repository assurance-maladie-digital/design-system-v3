<script setup lang="ts">
	import { computed, type PropType, ref } from 'vue'
	import AmeliproBtn from '../AmeliproBtn/AmeliproBtn.vue'
	import AmeliproIconBtn from '../AmeliproIconBtn/AmeliproIconBtn.vue'
	import UserMenuDetails from './UserMenuDetails/UserMenuDetails.vue'
	import type { UserMenuInfos } from './types'
	import { useDisplay } from 'vuetify'

	const props = defineProps({
		icon: {
			type: String,
			default: 'utilisateur',
		},
		lastConnexion: {
			type: String,
			default: undefined,
		},
		uniqueId: {
			type: String,
			required: true,
		},
		userMenuInfos: {
			type: Object as PropType<UserMenuInfos>,
			default: undefined,
		},
	})

	const { mdAndUp, mdAndDown } = useDisplay()
	const isOpen = ref(false)
	const currentWidth = computed<string>(() => (mdAndUp.value ? '366px' : '280px'))
	const lastConnexionValue = computed<string>(() => (props.lastConnexion || props.userMenuInfos?.lastConnexion || ''))

	const emit = defineEmits(['click:account', 'click:logout'])

	const emitEventAccount = (): void => {
		emit('click:account')
	}

	const emitEventLogout = (): void => {
		emit('click:logout')
	}
</script>

<template>
	<div
		:id="uniqueId"
		class="user-menu"
	>
		<AmeliproIconBtn
			btn-label="infos utilisateur"
			:icon="icon"
			icon-bg-color="ap-blue-darken-1"
			icon-color="ap-white"
			icon-hover-bg-color="ap-blue-darken-2"
			icon-hover-color="ap-white"
			size="2rem"
			:unique-id="`${uniqueId}-open-btn`"
			@click="isOpen = !isOpen"
		/>
		<VMenu
			v-model="isOpen"
			:activator="`${uniqueId}-open-btn`"
			:attach="`#${uniqueId}`"
			:close-on-content-click="false"
			:max-width="currentWidth"
			:min-width="currentWidth"
			scroll-strategy="reposition"
			transition="slide-y-transition"
			:width="currentWidth"
		>
			<div
				:id="`${uniqueId}-content`"
				class="user-menu-popover bg-ap-white"
			>
				<div class="pa-4">
					<slot>
						<div v-if="userMenuInfos !== undefined && userMenuInfos !== null && userMenuInfos.userMenuDetailsInfos !== undefined && userMenuInfos.userMenuDetailsInfos !== null">
							<UserMenuDetails
								:unique-id="`${uniqueId}-details`"
								:user-menu-details-infos="userMenuInfos.userMenuDetailsInfos"
							/>
						</div>
					</slot>

					<slot name="complementaryInfo" />

					<slot
						v-if="mdAndDown"
						name="structureMenu"
					/>

					<p
						v-if="lastConnexionValue !== ''"
						:id="`${uniqueId}-last-connexion`"
						class="mt-6 mb-0 user-menu-last-connexion"
					>
						Dernière connexion : {{ lastConnexionValue }}
					</p>
				</div>

				<div
					:id="`${uniqueId}-footer`"
					class="d-flex justify-space-between bg-ap-blue-lighten-3 user-menu__btn-wrapper"
				>
					<AmeliproBtn
						class="text-none font-weight-bold user-menu__btn--account"
						hover-underline
						text-color="ap-blue-darken-1"
						:unique-id="`${uniqueId}-account-btn`"
						variant="text"
						@click="emitEventAccount()"
					>
						Mon Compte
					</AmeliproBtn>

					<AmeliproBtn
						class="text-none font-weight-bold user-menu__btn--logout"
						hover-underline
						text-color="ap-blue-darken-1"
						:unique-id="`${uniqueId}-logout-btn`"
						variant="text"
						@click="emitEventLogout()"
					>
						Déconnexion
					</AmeliproBtn>
				</div>
			</div>
		</VMenu>
	</div>
</template>

<style lang="scss" scoped>
	@use '@/assets/amelipro/apTokens';

	.v-btn :deep(.v-btn__content) {
		opacity: 1 !important;
	}

	:deep(.v-overlay__content) {
		top: 40px;
		left: -200px;
		transform-origin: left top 0;
		z-index: 8;
		border-radius: 4px;
	}

	.user-menu {
		position: relative;
		overflow-wrap: break-word;
	}

	.user-menu-popover {
		border-radius: 4px;
	}

	.user-menu-last-connexion {
		font-size: apTokens.$font-size-xs;
	}

	.user-menu__btn--account,
	.user-menu__btn--logout {
		padding: 1rem 1.5rem !important;
		border-radius: 0 !important;
	}

	.user-menu__btn-wrapper {
		border-bottom-left-radius: 4px;
		border-bottom-right-radius: 4px;
	}
</style>
