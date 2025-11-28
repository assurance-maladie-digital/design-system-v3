<script setup lang="ts">
	import { computed, type PropType, ref, useSlots } from 'vue'
	import AmeliproBtn from '../AmeliproBtn/AmeliproBtn.vue'
	import AmeliproHeaderBar from './AmeliproHeaderBar/AmeliproHeaderBar.vue'
	import type { AmeliproHeaderInfos } from './types'
	import AmeliproIconBtn from '../AmeliproIconBtn/AmeliproIconBtn.vue'
	import AmeliproMenu from '../AmeliproMenu/AmeliproMenu.vue'
	import type { AmeliproMenuItem } from '../AmeliproMenu/types'
	import type { RouteLocationRaw } from 'vue-router'
	import ServiceMenu from '../ServiceMenu/ServiceMenu.vue'
	import StructureMenu from '../StructureMenu/StructureMenu.vue'
	import UserInformationSummary from '../UserInformationSummary/UserInformationSummary.vue'
	import UserMenu from '../UserMenu/UserMenu.vue'
	import { useDisplay } from 'vuetify'

	const props = defineProps({
		ameliproHeaderInfos: {
			type: Object as PropType<AmeliproHeaderInfos>,
			default: undefined,
		},
		backBtnHref: {
			type: String,
			default: undefined,
		},
		backBtnLabel: {
			type: String,
			default: 'Retour',
		},
		backBtnTo: {
			type: [Array, Object, String] as PropType<RouteLocationRaw>,
			default: undefined,
		},
		backoffice: {
			type: Boolean,
			default: false,
		},
		headerTitle: {
			type: String,
			default: undefined,
		},
		homeHref: {
			type: String,
			default: undefined,
		},
		homeLink: {
			type: [Array, Object, String] as PropType<RouteLocationRaw>,
			default: undefined,
		},
		noRightPart: {
			type: Boolean,
			default: false,
		},
		noSubPart: {
			type: Boolean,
			default: false,
		},
		serviceHomeHref: {
			type: String,
			default: undefined,
		},
		serviceHomeTo: {
			type: [Array, Object, String] as PropType<RouteLocationRaw>,
			default: undefined,
		},
		serviceName: {
			type: String,
			default: undefined,
		},
		serviceSubTitle: {
			type: String,
			default: undefined,
		},
		subMenu: {
			type: Boolean,
			default: false,
		},
		subMenuItems: {
			type: Array as PropType<AmeliproMenuItem[]>,
			default: () => [],
		},
		uniqueId: {
			type: String,
			default: undefined,
		},
		unlogged: {
			type: Boolean,
			default: false,
		},
	})

	const slots = useSlots()
	const { smAndDown, smAndUp, width } = useDisplay()

	const innerWidth = computed<string>(() => {
		if (width.value >= 1240) {
			return '1144px'
		}
		return width.value >= 1072 ? '980px' : '100%'
	})

	const serviceDialog = ref(false)
	const structureValue = ref({
		activeTab: (props.ameliproHeaderInfos
			&& props.ameliproHeaderInfos.structureMenuInfos
			&& props.ameliproHeaderInfos.structureMenuInfos.defaultSelected
			? props.ameliproHeaderInfos.structureMenuInfos.defaultSelected.activeTab
			: 0),
		activeValue: (props.ameliproHeaderInfos
			&& props.ameliproHeaderInfos.structureMenuInfos
			&& props.ameliproHeaderInfos.structureMenuInfos.defaultSelected
			&& props.ameliproHeaderInfos.structureMenuInfos.defaultSelected.activeValue
			? props.ameliproHeaderInfos.structureMenuInfos.defaultSelected.activeValue
			: undefined),
		dialog: false,
	})
	const hasUserMenu = computed((): boolean => Boolean(slots.userMenu || props.ameliproHeaderInfos?.userMenuInfos))
	const hasStructureMenu = computed((): boolean => Boolean(slots.structureMenu || props.ameliproHeaderInfos?.structureMenuInfos))
	const hasSignatureMenu = computed<boolean>(() => Boolean(slots.signatureMenu || props.ameliproHeaderInfos?.signatureInfos))
	const structureInfos = computed(() => props.ameliproHeaderInfos?.structureMenuInfos || undefined)
	const hasServiceMenu = computed((): boolean => Boolean(slots.serviceMenu || props.ameliproHeaderInfos?.serviceMenuInfos))
	const servicesInfos = computed(() => props.ameliproHeaderInfos?.serviceMenuInfos || undefined)
	const signatureInfos = computed(() => props.ameliproHeaderInfos?.signatureInfos || undefined)
	const hasNotificationMenu = computed((): boolean => Boolean(slots.notificationMenu))

	const emit = defineEmits(['back-btn-click', 'click-logo'])

	const backBtnEvent = (): void => emit('back-btn-click')
	const clickLogoEvent = (): void => emit('click-logo')

	const logout = (): void => {
		if (props.ameliproHeaderInfos?.userMenuInfos?.logout) {
			props.ameliproHeaderInfos?.userMenuInfos?.logout()
		}
	}

	const account = (): void => {
		if (props.ameliproHeaderInfos?.userMenuInfos?.account) {
			props.ameliproHeaderInfos?.userMenuInfos?.account()
		}
	}

	const cancelStructure = (event: Event): void => {
		if (props.ameliproHeaderInfos?.structureMenuInfos?.cancel) {
			props.ameliproHeaderInfos?.structureMenuInfos?.cancel(event)
			structureValue.value.dialog = false
		}
	}

	const changeStructure = (event: Event): void => {
		if (props.ameliproHeaderInfos?.structureMenuInfos?.change) {
			props.ameliproHeaderInfos?.structureMenuInfos?.change(event)
			structureValue.value.dialog = false
		}
	}

	const inputStructure = (event: Event): void => {
		if (props.ameliproHeaderInfos?.structureMenuInfos?.input) {
			props.ameliproHeaderInfos?.structureMenuInfos?.input(event)
			structureValue.value.dialog = false
		}
	}

	const validateStructure = (event: Event): void => {
		if (props.ameliproHeaderInfos?.structureMenuInfos?.validate) {
			props.ameliproHeaderInfos?.structureMenuInfos?.validate(event)
			structureValue.value.dialog = false
		}
	}

	const clickSignature = (event: Event): void => {
		if (props.ameliproHeaderInfos?.signatureInfos?.clickFn) {
			props.ameliproHeaderInfos?.signatureInfos?.clickFn(event)
		}
	}
</script>

<template>
	<AmeliproHeaderBar
		:home-href="(ameliproHeaderInfos && ameliproHeaderInfos.homeHref) ? ameliproHeaderInfos.homeHref : homeHref"
		:home-link="(ameliproHeaderInfos && ameliproHeaderInfos.homeLink) ? ameliproHeaderInfos.homeLink : homeLink"
		:inner-width="innerWidth"
		:service-sub-title="(ameliproHeaderInfos && ameliproHeaderInfos.serviceSubTitle) ? ameliproHeaderInfos.serviceSubTitle : serviceSubTitle"
		:service-title="(ameliproHeaderInfos && ameliproHeaderInfos.headerTitle) ? ameliproHeaderInfos.headerTitle : headerTitle"
		style="z-index: 1;"
		:theme-amelipro="(ameliproHeaderInfos && ameliproHeaderInfos.headerTitle) || headerTitle ? false : true"
		:unique-id="uniqueId"
		@click-logo="clickLogoEvent"
	>
		<template #default>
			<slot
				v-if="!noRightPart"
				name="rightPart"
			>
				<div
					v-if="!noRightPart"
					class="amelipro-header__right-part"
				>
					<AmeliproIconBtn
						v-if="unlogged"
						class="text-ap-blue"
						icon="aide"
						icon-bg-color="ap-white"
						icon-color="ap-blue"
						icon-hover-bg-color="ap-blue"
						icon-hover-color="ap-white"
						large
						:unique-id="uniqueId ? `${uniqueId}-help-btn` : undefined"
					>
						<template #prepend>
							<span class="text-none">
								Aide
							</span>
						</template>
					</AmeliproIconBtn>

					<nav
						v-if="!unlogged"
						:id="uniqueId ? `${uniqueId}-navigation-wrapper` : undefined"
						class="d-flex align-center amelipro-header__nav"
						role="navigation"
					>
						<div
							v-if="smAndUp"
							:id="uniqueId ? `${uniqueId}-information-wrapper` : undefined"
							class="d-none d-md-block text-right amelipro-header__infos"
						>
							<div class="font-size-xs text-ap-grey-darken-1">
								<slot name="userInformationSummary">
									<div
										v-if="ameliproHeaderInfos && ameliproHeaderInfos.userInformationSummaryInfos"
									>
										<UserInformationSummary
											:unique-id="uniqueId ? `${uniqueId}-user-information-summary` : undefined"
											:user-information-summary-infos="ameliproHeaderInfos.userInformationSummaryInfos"
										/>
									</div>
								</slot>
							</div>
						</div>

						<hr
							v-if="smAndUp"
							class="d-none d-md-block mx-6 border-0 header-separator"
						>

						<ul
							:id="uniqueId ? `${uniqueId}-navigation-list` : undefined"
							class="list-style-none d-flex amelipro-header__nav__list"
						>
							<li
								v-if="hasUserMenu"
								:id="uniqueId ? `${uniqueId}-navigation-user-menu` : undefined"
								class="mr-2 mr-sm-4 amelipro-header__nav__item"
							>
								<slot name="userMenu">
									<div
										v-if="ameliproHeaderInfos && ameliproHeaderInfos.userMenuInfos"
									>
										<UserMenu
											:last-connexion="ameliproHeaderInfos.userMenuInfos.lastConnexion"
											:unique-id="uniqueId ? `${uniqueId}-user-menu` : 'header-user-menu'"
											:user-menu-infos="ameliproHeaderInfos.userMenuInfos"
											@click:account="account"
											@click:logout="logout"
										>
											<template
												v-if="$slots.userMenuComplementaryInfo"
												#complementaryInfo
											>
												<slot name="userMenuComplementaryInfo" />
											</template>

											<template #structureMenu>
												<div
													v-show="smAndDown && structureInfos"
													class="mt-6"
												>
													<AmeliproBtn
														v-if="structureInfos"
														class="text-none"
														text
														underline
														:unique-id="`${structureInfos.uniqueId}-mobile-open-btn`"
														@click="structureValue.dialog = true"
													>
														Changer de structure d'exercice
													</AmeliproBtn>
												</div>
											</template>
										</UserMenu>
									</div>
								</slot>
							</li>

							<li
								v-if="hasStructureMenu && smAndUp"
								:id="uniqueId ? `${uniqueId}-navigation-structure-menu` : undefined"
								class="d-none d-md-block mr-2 mr-sm-4 amelipro-header__nav__item"
							>
								<slot name="structureMenuActivator">
									<AmeliproIconBtn
										v-if="structureInfos"
										btn-label="Sélection de structure"
										icon="localisation"
										icon-bg-color="ap-blue-darken-1"
										icon-color="ap-white"
										icon-hover-bg-color="ap-blue-darken-2"
										icon-hover-color="ap-white"
										size="2rem"
										:unique-id="`${structureInfos.uniqueId}-open-btn`"
										@click="structureValue.dialog = true"
									/>
								</slot>
							</li>

							<li
								v-if="hasServiceMenu"
								:id="uniqueId ? `${uniqueId}-navigation-service-menu` : undefined"
								class="mr-2 mr-sm-4 amelipro-header__nav__item"
							>
								<slot name="serviceMenu">
									<div v-if="servicesInfos">
										<ServiceMenu
											v-model="serviceDialog"
											:icon="servicesInfos.icon"
											:message-to-display="servicesInfos.messageToDisplay"
											:services-contact="servicesInfos.servicesContact"
											:services-patient="servicesInfos.servicesPatient"
											:services-ps="servicesInfos.servicesPs"
											:unique-id="servicesInfos.uniqueId"
										>
											<template
												v-if="$slots.serviceMenuMsg"
												#message
											>
												<slot name="serviceMenuMsg" />
											</template>
										</ServiceMenu>
									</div>
								</slot>
							</li>

							<li
								v-if="hasNotificationMenu && smAndUp"
								:id="uniqueId ? `${uniqueId}-navigation-notification-menu` : undefined"
								class="amelipro-header__nav__item"
							>
								<slot name="notificationMenu" />
							</li>

							<li
								v-if="hasSignatureMenu && smAndUp"
								:id="uniqueId ? `${uniqueId}-signature-menu` : undefined"
								class="amelipro-header__nav__item"
							>
								<slot name="signatureMenu">
									<AmeliproIconBtn
										v-if="signatureInfos"
										btn-title="Gérer ma signature"
										:href="signatureInfos.href ? signatureInfos.href : undefined"
										icon="signature2"
										icon-bg-color="ap-blue-darken-1"
										icon-color="ap-white"
										icon-hover-bg-color="ap-blue-darken-2"
										icon-hover-color="ap-white"
										size="2rem"
										:to="signatureInfos.to ? signatureInfos.to : undefined"
										:unique-id="`${uniqueId}-signature-btn`"
										@click="clickSignature"
									/>
								</slot>
							</li>
						</ul>
						<slot name="structureMenu">
							<StructureMenu
								v-if="structureInfos"
								key="structure-header"
								v-model="structureValue"
								:max-structures-loaded-default="structureInfos.maxStructuresLoadedDefault ? structureInfos.maxStructuresLoadedDefault : 5"
								:structures-tabs="structureInfos.structuresTabs"
								:unique-id="structureInfos.uniqueId"
								:user-adeli="structureInfos.userAdeli"
								:user-name="structureInfos.userName"
								:user-profession="structureInfos.userProfession"
								:user-rpps="structureInfos.userRpps"
								@cancel="cancelStructure"
								@change="changeStructure"
								@update:model-value="inputStructure"
								@validate="validateStructure"
							>
								<template
									v-if="$slots.structureMenuSearchBar"
									#searchBar
								>
									<slot name="structureMenuSearchBar" />
								</template>
							</StructureMenu>
						</slot>
					</nav>
				</div>
			</slot>
		</template>

		<template
			v-if="!noSubPart"
			#navigation-bar-content
		>
			<div
				:id="uniqueId ? `${uniqueId}-sub-bar` : undefined"
				class="d-flex justify-center navigation-bar-content-wrapper w-100 amelipro-header__sub-bar"
			>
				<AmeliproMenu
					v-if="subMenu"
					class="navigation-bar-left-btn"
					:items="subMenuItems"
					:menu-header="ameliproHeaderInfos && ameliproHeaderInfos.serviceName ? ameliproHeaderInfos.serviceName : serviceName"
					:unique-id="uniqueId ? `${uniqueId}-service-menu` : 'header-popin-menu'"
				/>

				<AmeliproIconBtn
					v-else
					:btn-label="backBtnLabel"
					class="navigation-bar-left-btn"
					:href="backBtnHref"
					icon="chevronLeft"
					icon-bg-color="transparent"
					icon-color="ap-white"
					icon-hover-bg-color="transparent"
					icon-hover-color="ap-grey-lighten-5"
					large
					:title="backBtnLabel"
					:to="backBtnTo"
					:unique-id="uniqueId ? `${uniqueId}-back-btn` : undefined"
					@click="backBtnEvent"
				/>

				<h1
					:id="uniqueId ? `${uniqueId}-sub-bar-title` : undefined"
					class="text-ap-white text-service-title"
				>
					<AmeliproBtn
						class="text-service-title"
						color="ap-white"
						hover-color="ap-white"
						:href="serviceHomeHref"
						text
						:to="serviceHomeTo"
						:unique-id="uniqueId ? `${uniqueId}-sub-bar-title-btn` : undefined"
					>
						{{ ameliproHeaderInfos && ameliproHeaderInfos.serviceName ?
							ameliproHeaderInfos.serviceName : serviceName }}

						<span v-if="backoffice || (ameliproHeaderInfos && ameliproHeaderInfos.backoffice)">
							<span v-if="(ameliproHeaderInfos && ameliproHeaderInfos.serviceName) || serviceName">&nbsp;-&nbsp;</span>back office
						</span>
					</AmeliproBtn>
				</h1>
			</div>
		</template>
	</AmeliproHeaderBar>
</template>

<style lang="scss" scoped>
@use '@/assets/amelipro/apTokens';

.header-separator {
	width: 1px;
	height: 38px;
	background-color: apTokens.$ap-blue-darken1;
}

.header-bar-container {
	& :deep(.navigation-bar-content-wrapper) {
		position: relative;
		padding: 0 38px;

		& .v-btn:focus {
			outline-color: apTokens.$ap-white;
		}
	}

	& .navigation-bar-left-btn {
		position: absolute;
		top: calc(50% - 13px);
		left: 0;
	}
}

:deep(.v-btn) {
	&.text-service-title {
		display: block;
	}
}
</style>
