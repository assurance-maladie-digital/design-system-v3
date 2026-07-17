<script setup lang="ts">
	import { ref } from 'vue'
	import BackBtn from '@/components/BackBtn/BackBtn.vue'
	import SyBtnMenu from '@/components/SyBtnMenu/SyBtnMenu.vue'
	import SelectBtnField from '@/components/Customs/Selects/SelectBtnField/SelectBtnField.vue'
	import FooterBar from '@/components/FooterBar/FooterBar.vue'
	import HeaderMenuBtn from '@/components/HeaderBar/HeaderMenuBtn/HeaderMenuBtn.vue'
	import HeaderMenuItem from '@/components/HeaderBar/HeaderBurgerMenu/HeaderMenuItem/HeaderMenuItem.vue'
	import HeaderLogo from '@/components/HeaderBar/HeaderLogo/HeaderLogo.vue'
	import HeaderNavigationBar from '@/components/HeaderNavigationBar/HeaderNavigationBar.vue'
	import HeaderToolbar from '@/components/HeaderToolbar/HeaderToolbar.vue'
	import SyTabs from '@/components/Customs/SyTabs/SyTabs.vue'
	import SubHeader from '@/components/SubHeader/SubHeader.vue'
	import CollapsibleList from '@/components/CollapsibleList/CollapsibleList.vue'
	import ToolbarContainer from '@/components/ToolbarContainer/ToolbarContainer.vue'
	import ContextualMenu from '@/components/ContextualMenu/ContextualMenu.vue'
	import ExternalLinks from '@/components/ExternalLinks/ExternalLinks.vue'
	import SkipLink from '@/components/SkipLink/SkipLink.vue'
	import SyPagination from '@/components/Customs/SyPagination/SyPagination.vue'
	import BackToTopBtn from '@/components/BackToTopBtn/BackToTopBtn.vue'
	import CopyBtn from '@/components/CopyBtn/CopyBtn.vue'
	import LangBtn from '@/components/LangBtn/LangBtn.vue'
	import DownloadBtn from '@/components/DownloadBtn/DownloadBtn.vue'
	import FranceConnectBtn from '@/components/FranceConnectBtn/FranceConnectBtn.vue'
	import UserMenuBtn from '@/components/UserMenuBtn/UserMenuBtn.vue'
	import SyIconButton from '@/components/Customs/SyIconButton/SyIconButton.vue'
	import SyInputSelect from '@/components/Customs/Selects/SyInputSelect/SyInputSelect.vue'
	import ErrorPage from '@/components/ErrorPage/ErrorPage.vue'
	import SyAlert from '@/components/SyAlert/SyAlert.vue'
	import SyTextArea from '@/components/SyTextArea/SyTextArea.vue'
	import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'
	import type { AxiosResponse } from 'axios'
	import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'
	import { mdiFormatAlignLeft, mdiFormatAlignCenter, mdiFormatAlignRight, mdiPencil } from '@mdi/js'

	// SyTabs
	const tabsItems = [
		{ label: 'Onglet 1', value: 'tab1', content: 'Contenu 1' },
		{ label: 'Onglet 2', value: 'tab2', content: 'Contenu 2' },
		{ label: 'Onglet 3', value: 'tab3', content: 'Contenu 3' },
	]

	// HeaderNavigationBar
	const navItems = [
		{ label: 'Accueil', href: '#' },
		{ label: 'Mon compte', href: '#' },
		{ label: 'Mes remboursements', href: '#' },
	]

	// HeaderToolbar
	const toolbarMenu = [
		{ title: 'Assuré', href: '#' },
		{ title: 'Professionnel de santé', href: '#' },
	]

	// HeaderMenuBtn (bouton menu du HeaderBar)
	const menuOpen = ref(false)

	// ToolbarContainer (calqué sur la story Default : barre d'alignement)
	const justification = ref<string>()
	const justificationDark = ref<string>()

	// ContextualMenu (sommaire de page, avec un niveau imbriqué)
	const contextualHash = ref<string | null>(null)
	const contextualItems = [
		{ text: 'Introduction', hash: '#pg-intro' },
		{ text: 'Prérequis', hash: '#pg-prerequis' },
		{ text: 'Installation', hash: '#pg-install', level: 2 },
		{ text: 'Configuration', hash: '#pg-config', level: 2 },
		{ text: 'Aller plus loin', hash: '#pg-plus' },
	]
	// Instance dark indépendante (hashs distincts pour éviter le highlight croisé).
	const contextualHashDark = ref<string | null>(null)
	const contextualItemsDark = [
		{ text: 'Introduction', hash: '#pg-dark-intro' },
		{ text: 'Prérequis', hash: '#pg-dark-prerequis' },
		{ text: 'Installation', hash: '#pg-dark-install', level: 2 },
		{ text: 'Configuration', hash: '#pg-dark-config', level: 2 },
		{ text: 'Aller plus loin', hash: '#pg-dark-plus' },
	]

	// ExternalLinks (onglet flottant)
	const externalLinksItems = [
		{ text: 'Ameli.fr', href: 'https://www.ameli.fr' },
		{ text: 'Service-public.fr', href: 'https://www.service-public.fr' },
	]

	// SyPagination
	const paginationPage = ref(5)

	// LangBtn
	const lang = ref('fr')
	const langDark = ref('fr')

	// UserMenuBtn
	const userMenuItems = [
		{ text: 'Mon compte', value: 'account' },
		{ text: 'Paramètres', value: 'settings' },
	]

	// SyTextArea
	const textAreaValue = ref('Ceci est un texte de description.')

	// SyTextField
	const textFieldValue = ref('Jean Dupont')

	// SyInputSelect
	const selectItems = [
		{ text: 'Option A', value: 'a' },
		{ text: 'Option B', value: 'b' },
		{ text: 'Option C', value: 'c' },
	]
	const selectValue = ref<Record<string, unknown> | string | null>(null)

	// DownloadBtn (stub de filePromise, pas de vrai téléchargement)
	const downloadPromise = (): Promise<AxiosResponse<Blob>> =>
		Promise.resolve({
			data: new Blob(['Contenu du fichier'], { type: 'text/plain' }),
			headers: { 'content-disposition': 'attachment; filename="exemple.txt"', 'content-type': 'text/plain' },
			status: 200,
			statusText: 'OK',
			config: {} as AxiosResponse['config'],
		})

	// CollapsibleList
	const collapsibleItems = [
		{ text: 'Lien 1', href: '#lien1' },
		{ text: 'Lien 2', href: '#lien2' },
		{ text: 'Lien 3', href: '#lien3' },
	]

	// SelectBtnField
	const column = ref<string | null>(null)
	const inline = ref<string[]>([])

	const contactItems = [
		{ text: 'Email', value: 'email' },
		{ text: 'SMS', value: 'sms' },
		{ text: 'Courrier', value: 'courrier' },
	]

	// SyBtnMenu
	const menuValue = ref<Record<string, unknown> | string | null>(null)
	const menuItems = [
		{ text: 'Mon profil', value: 'profile' },
		{ text: 'Paramètres', value: 'settings' },
	]

	// FooterBar : liens en href (évite les RouterLink vers des routes absentes du playground)
	const footerLinks = [
		{ text: 'Mentions légales', href: '#' },
		{ text: 'Accessibilité', href: '#' },
	]
</script>

<template>
	<v-app>
		<v-main>
			<v-container class="py-8">
				<h1 class="text-h4 mb-2">
					Playground — Focus
				</h1>
				<p class="text-body-2 mb-8">
					Ouvrez un panneau puis naviguez au <strong>clavier (Tab / Shift+Tab</strong>,
					puis flèches dans le SelectBtnField) pour vérifier le ring de focus :
					anneau 2px, offset 3px, <em>primary</em> (ou <em>onPrimary</em> sur fond sombre).
				</p>

				<v-expansion-panels multiple>
					<!-- ============ v-btn (Vuetify natif) ============ -->
					<v-expansion-panel>
						<v-expansion-panel-title>
							v-btn (Vuetify)
						</v-expansion-panel-title>
						<v-expansion-panel-text>
							<v-row>
								<v-col
									cols="12"
									md="6"
								>
									<div class="text-caption mb-2">
										Fond clair
									</div>
									<v-sheet
										color="surface"
										rounded
										class="pa-4"
									>
										<v-btn color="primary">
											Valider
										</v-btn>
									</v-sheet>
								</v-col>
								<v-col
									cols="12"
									md="6"
								>
									<div class="text-caption mb-2">
										Fond primary (prop <code>theme="dark"</code>)
									</div>
									<v-sheet
										color="primary"
										rounded
										class="pa-4"
									>
										<v-btn
											theme="dark"
											variant="outlined"
										>
											Valider
										</v-btn>
									</v-sheet>
								</v-col>
							</v-row>
						</v-expansion-panel-text>
					</v-expansion-panel>

					<!-- ============ BackBtn (gère la prop dark) ============ -->
					<v-expansion-panel>
						<v-expansion-panel-title>
							BackBtn
						</v-expansion-panel-title>
						<v-expansion-panel-text>
							<v-row>
								<v-col
									cols="12"
									md="6"
								>
									<div class="text-caption mb-2">
										Fond clair
									</div>
									<v-sheet
										color="surface"
										rounded
										class="pa-4"
									>
										<BackBtn />
									</v-sheet>
								</v-col>
								<v-col
									cols="12"
									md="6"
								>
									<div class="text-caption mb-2">
										Fond primary (prop <code>dark</code>)
									</div>
									<v-sheet
										color="primary"
										rounded
										class="pa-4"
									>
										<BackBtn dark />
									</v-sheet>
								</v-col>
							</v-row>
						</v-expansion-panel-text>
					</v-expansion-panel>

					<!-- ============ SyBtnMenu (pas de prop dark) ============ -->
					<v-expansion-panel>
						<v-expansion-panel-title>
							SyBtnMenu
						</v-expansion-panel-title>
						<v-expansion-panel-text>
							<v-sheet
								color="surface"
								rounded
								class="pa-4"
							>
								<SyBtnMenu
									v-model="menuValue"
									primary-info="Jean Dupont"
									secondary-info="Administrateur"
									:menu-items="menuItems"
								/>
							</v-sheet>
						</v-expansion-panel-text>
					</v-expansion-panel>

					<!-- ============ SelectBtnField (pas de prop dark) ============ -->
					<v-expansion-panel>
						<v-expansion-panel-title>
							SelectBtnField
						</v-expansion-panel-title>
						<v-expansion-panel-text>
							<p class="text-caption mb-4">
								1er focus = ring englobant le groupe, puis flèches item par item.
							</p>

							<h3 class="text-subtitle-2 mb-2">
								Version en colonne
							</h3>
							<v-sheet
								color="surface"
								rounded
								class="pa-4 mb-6"
							>
								<SelectBtnField
									v-model="column"
									label="Moyen de contact préféré"
									:items="contactItems"
								/>
							</v-sheet>

							<h3 class="text-subtitle-2 mb-2">
								Version en ligne (inline)
							</h3>
							<v-sheet
								color="surface"
								rounded
								class="pa-4"
							>
								<SelectBtnField
									v-model="inline"
									label="Moyens de contact"
									inline
									multiple
									:items="contactItems"
								/>
							</v-sheet>
						</v-expansion-panel-text>
					</v-expansion-panel>

					<!-- ============ HeaderMenuBtn (HeaderBar) ============ -->
					<v-expansion-panel>
						<v-expansion-panel-title>
							HeaderMenuBtn (HeaderBar)
						</v-expansion-panel-title>
						<v-expansion-panel-text>
							<div class="text-caption mb-2">
								Bouton menu du header (fond primary) — ring inset au focus (blanc sur fond primary)
							</div>
							<v-sheet
								color="surface"
								rounded
								class="pa-4"
							>
								<HeaderMenuBtn v-model="menuOpen" />
							</v-sheet>
						</v-expansion-panel-text>
					</v-expansion-panel>

					<!-- ============ HeaderMenuItem (HeaderBar / burger) ============ -->
					<v-expansion-panel>
						<v-expansion-panel-title>
							HeaderMenuItem (HeaderBar)
						</v-expansion-panel-title>
						<v-expansion-panel-text>
							<div class="text-caption mb-2">
								Item de menu pleine largeur — focus = ring inset 2px (visible sur les 4 côtés)
							</div>
							<v-sheet
								color="surface"
								rounded
								class="pa-4"
							>
								<ul class="pa-0">
									<HeaderMenuItem>
										<a href="#">Mon lien</a>
									</HeaderMenuItem>
								</ul>
							</v-sheet>
						</v-expansion-panel-text>
					</v-expansion-panel>

					<!-- ============ HeaderLogo (HeaderBar) ============ -->
					<v-expansion-panel>
						<v-expansion-panel-title>
							HeaderLogo (HeaderBar)
						</v-expansion-panel-title>
						<v-expansion-panel-text>
							<div class="text-caption mb-2">
								Lien logo — ring outset au focus (padding du header, non rogné)
							</div>
							<v-sheet
								color="surface"
								rounded
								class="pa-4"
							>
								<HeaderLogo service-title="Mon service" />
							</v-sheet>
						</v-expansion-panel-text>
					</v-expansion-panel>

					<!-- ============ HeaderNavigationBar ============ -->
					<v-expansion-panel>
						<v-expansion-panel-title>
							HeaderNavigationBar
						</v-expansion-panel-title>
						<v-expansion-panel-text>
							<div class="text-caption mb-2">
								Barre de nav (fond primary) — ring inset onPrimary au focus des liens
							</div>
							<HeaderNavigationBar
								service-title="Ameli"
								:items="navItems"
							/>
						</v-expansion-panel-text>
					</v-expansion-panel>

					<!-- ============ HeaderToolbar ============ -->
					<v-expansion-panel>
						<v-expansion-panel-title>
							HeaderToolbar
						</v-expansion-panel-title>
						<v-expansion-panel-text>
							<div class="text-caption mb-2">
								Ouvre un menu puis navigue aux flèches : ring primary sur l'item actif (aria-activedescendant)
							</div>
							<HeaderToolbar
								:left-menu="toolbarMenu"
								:current-page-index="0"
							/>
						</v-expansion-panel-text>
					</v-expansion-panel>

					<!-- ============ FooterBar (prop light) ============ -->
					<v-expansion-panel>
						<v-expansion-panel-title>
							FooterBar
						</v-expansion-panel-title>
						<v-expansion-panel-text>
							<div class="text-caption mb-2">
								Défaut (sombre) — ring onPrimary
							</div>
							<FooterBar
								class="mb-6"
								:link-items="footerLinks"
							>
								<p class="ma-0">
									Contenu du footer
								</p>
							</FooterBar>

							<div class="text-caption mb-2">
								Mode <code>light</code> — ring primary
							</div>
							<FooterBar
								light
								:link-items="footerLinks"
							>
								<p class="ma-0">
									Contenu du footer
								</p>
							</FooterBar>
						</v-expansion-panel-text>
					</v-expansion-panel>

					<!-- ============ SubHeader ============ -->
					<v-expansion-panel>
						<v-expansion-panel-title>
							SubHeader
						</v-expansion-panel-title>
						<v-expansion-panel-text>
							<div class="text-caption mb-2">
								Fond primary — back button en ring onPrimary (blanc) au focus
							</div>
							<SubHeader title-text="Titre de la page" />
						</v-expansion-panel-text>
					</v-expansion-panel>

					<!-- ============ SyTabs ============ -->
					<v-expansion-panel>
						<v-expansion-panel-title>
							SyTabs
						</v-expansion-panel-title>
						<v-expansion-panel-text>
							<div class="text-caption mb-2">
								Fond clair — ring inset 2px primary
							</div>
							<v-sheet
								color="surface"
								rounded
								class="pa-4 mb-6"
							>
								<SyTabs :items="tabsItems" />
							</v-sheet>

							<div class="text-caption mb-2">
								Fond primary (sheet dark) — ring onPrimary (blanc)
							</div>
							<SyTabs
								:items="tabsItems"
								:vuetify-options="{
									sheet: { color: 'rgb(var(--v-theme-primary))' },
									tab: {
										'base-color': 'rgba(var(--v-theme-onPrimary), 0.7)',
										'active-color': 'rgb(var(--v-theme-onPrimary))',
										'slider-color': 'rgb(var(--v-theme-onPrimary))',
									},
								}"
							/>
						</v-expansion-panel-text>
					</v-expansion-panel>

					<!-- ============ CollapsibleList ============ -->
					<v-expansion-panel>
						<v-expansion-panel-title>
							CollapsibleList
						</v-expansion-panel-title>
						<v-expansion-panel-text>
							<div class="text-caption mb-2">
								Fond clair — ring primary (desktop : liens ; mobile : titre du panel)
							</div>
							<v-sheet
								color="surface"
								rounded
								class="pa-4 mb-6"
							>
								<CollapsibleList
									list-title="Mon titre"
									:items="collapsibleItems"
								/>
							</v-sheet>

							<div class="text-caption mb-2">
								Fond primary (thème dark) — ring onPrimary
							</div>
							<v-sheet
								color="primary"
								rounded
								class="pa-4"
							>
								<div class="v-theme--dark">
									<CollapsibleList
										list-title="Mon titre"
										:items="collapsibleItems"
									/>
								</div>
							</v-sheet>
						</v-expansion-panel-text>
					</v-expansion-panel>

					<!-- ============ ToolbarContainer ============ -->
					<v-expansion-panel>
						<v-expansion-panel-title>
							ToolbarContainer
						</v-expansion-panel-title>
						<v-expansion-panel-text>
							<div class="text-caption mb-2">
								Tab pour entrer, puis flèches (← → / Home / End) entre les outils :
								le ring 2px primary se pose sur l'outil actif (roving tabindex).
							</div>
							<v-sheet
								color="surface"
								rounded
								class="pa-4"
							>
								<ToolbarContainer
									class="d-flex flex-wrap ga-4"
									aria-label="Outils de mise en forme"
								>
									<v-btn-toggle
										v-model="justification"
										class="d-flex flex-wrap ga-2"
										role="radiogroup"
										aria-label="Alignement du texte"
										color="primary"
										style="overflow: visible;"
									>
										<v-btn
											title="ferrer à gauche"
											aria-label="ferrer à gauche"
											role="radio"
											value="left"
											elevation="2"
											size="small"
											:aria-checked="justification === 'left' ? 'true' : 'false'"
										>
											<SyIcon
												:icon="mdiFormatAlignLeft"
												size="x-large"
												decorative
											/>
										</v-btn>
										<v-btn
											title="centrer"
											aria-label="centrer"
											role="radio"
											value="center"
											elevation="2"
											size="small"
											:aria-checked="justification === 'center' ? 'true' : 'false'"
										>
											<SyIcon
												:icon="mdiFormatAlignCenter"
												size="x-large"
												decorative
											/>
										</v-btn>
										<v-btn
											title="ferrer à droite"
											aria-label="ferrer à droite"
											role="radio"
											value="right"
											elevation="2"
											size="small"
											:aria-checked="justification === 'right' ? 'true' : 'false'"
										>
											<SyIcon
												:icon="mdiFormatAlignRight"
												size="x-large"
												decorative
											/>
										</v-btn>
									</v-btn-toggle>
								</ToolbarContainer>
							</v-sheet>

							<div class="text-caption mb-2 mt-6">
								Fond primary (thème dark) — ring onPrimary (blanc) sur l'outil actif
							</div>
							<v-sheet
								color="primary"
								rounded
								class="pa-4"
							>
								<div class="v-theme--dark">
									<ToolbarContainer
										class="d-flex flex-wrap ga-4"
										aria-label="Outils de mise en forme (fond sombre)"
									>
										<v-btn-toggle
											v-model="justificationDark"
											class="d-flex flex-wrap ga-2"
											role="radiogroup"
											aria-label="Alignement du texte"
											color="primary"
											style="overflow: visible;"
										>
											<v-btn
												title="ferrer à gauche"
												aria-label="ferrer à gauche"
												role="radio"
												value="left"
												elevation="2"
												size="small"
												:aria-checked="justificationDark === 'left' ? 'true' : 'false'"
											>
												<SyIcon
													:icon="mdiFormatAlignLeft"
													size="x-large"
													decorative
												/>
											</v-btn>
											<v-btn
												title="centrer"
												aria-label="centrer"
												role="radio"
												value="center"
												elevation="2"
												size="small"
												:aria-checked="justificationDark === 'center' ? 'true' : 'false'"
											>
												<SyIcon
													:icon="mdiFormatAlignCenter"
													size="x-large"
													decorative
												/>
											</v-btn>
											<v-btn
												title="ferrer à droite"
												aria-label="ferrer à droite"
												role="radio"
												value="right"
												elevation="2"
												size="small"
												:aria-checked="justificationDark === 'right' ? 'true' : 'false'"
											>
												<SyIcon
													:icon="mdiFormatAlignRight"
													size="x-large"
													decorative
												/>
											</v-btn>
										</v-btn-toggle>
									</ToolbarContainer>
								</div>
							</v-sheet>
						</v-expansion-panel-text>
					</v-expansion-panel>

					<!-- ============ ContextualMenu ============ -->
					<v-expansion-panel>
						<v-expansion-panel-title>
							ContextualMenu
						</v-expansion-panel-title>
						<v-expansion-panel-text>
							<div class="text-caption mb-2">
								Tab entre les liens : ring 2px primary inset sur le lien focalisé
								(les items sont de simples liens, non couverts par l'override global).
							</div>
							<v-sheet
								color="surface"
								rounded
								class="pa-4"
								style="max-width: 320px;"
							>
								<ContextualMenu
									v-model="contextualHash"
									aria-label="Sommaire de la page"
									:items="contextualItems"
								/>
							</v-sheet>

							<div class="text-caption mb-2 mt-6">
								Fond primary (thème dark) — texte & ring en onPrimary
							</div>
							<v-sheet
								color="primary"
								rounded
								class="pa-4"
								style="max-width: 320px;"
							>
								<div class="v-theme--dark">
									<ContextualMenu
										v-model="contextualHashDark"
										aria-label="Sommaire de la page (fond sombre)"
										:items="contextualItemsDark"
									/>
								</div>
							</v-sheet>
						</v-expansion-panel-text>
					</v-expansion-panel>

					<!-- ============ ExternalLinks ============ -->
					<v-expansion-panel>
						<v-expansion-panel-title>
							ExternalLinks
						</v-expansion-panel-title>
						<v-expansion-panel-text>
							<div class="text-caption mb-2">
								Onglet flottant (fond primary) : ring onPrimary inset au focus.
								Ouvre le menu (survol/clic) → items sur fond blanc, ring primary inset.
								Démo contenue dans une box relative (l'onglet s'ancre à son bord).
							</div>
							<div
								style="position: relative; height: 240px; border: 1px dashed rgba(0, 0, 0, 0.2); border-radius: 4px; overflow: hidden;"
							>
								<ExternalLinks
									:items="externalLinksItems"
									position="top left"
								/>
							</div>
						</v-expansion-panel-text>
					</v-expansion-panel>

					<!-- ============ SkipLink ============ -->
					<v-expansion-panel>
						<v-expansion-panel-title>
							SkipLink
						</v-expansion-panel-title>
						<v-expansion-panel-text>
							<div class="text-caption mb-2">
								Lien d'évitement masqué (sr-only) : Tab dessus → il apparaît en
								barre fixe <strong>en haut du viewport</strong> avec le ring 2px primary inset.
							</div>
							<SkipLink
								label="Aller au contenu principal"
								target="#main"
							/>
						</v-expansion-panel-text>
					</v-expansion-panel>

					<!-- ============ SyPagination ============ -->
					<v-expansion-panel>
						<v-expansion-panel-title>
							SyPagination
						</v-expansion-panel-title>
						<v-expansion-panel-text>
							<div class="text-caption mb-2">
								Tab entre les liens de pagination : ring 2px primary (offset 3px)
								sur le lien focalisé (page, précédent/suivant).
							</div>
							<v-sheet
								color="surface"
								rounded
								class="pa-4"
							>
								<SyPagination
									v-model="paginationPage"
									:pages="10"
									:visible="5"
								/>
							</v-sheet>
						</v-expansion-panel-text>
					</v-expansion-panel>

					<!-- ============ BackToTopBtn ============ -->
					<v-expansion-panel>
						<v-expansion-panel-title>
							BackToTopBtn
						</v-expansion-panel-title>
						<v-expansion-panel-text>
							<div class="text-caption mb-2">
								Bouton flottant déclenché au scroll (<code>threshold: 0</code>) : fais défiler
								la page → il apparaît <strong>en bas à droite</strong>. Tab dessus → ring 2px
								primary standard (offset 3px), fourni par l'override global (VBtn outlined).
							</div>
							<BackToTopBtn :threshold="0" />
						</v-expansion-panel-text>
					</v-expansion-panel>

					<!-- ============ CopyBtn ============ -->
					<v-expansion-panel>
						<v-expansion-panel-title>
							CopyBtn
						</v-expansion-panel-title>
						<v-expansion-panel-text>
							<div class="text-caption mb-2">
								Bouton icône (fond transparent) : Tab dessus → ring 2px primary
								standard (offset 3px), fourni par l'override global.
							</div>
							<v-sheet
								color="surface"
								rounded
								class="pa-4"
							>
								<CopyBtn text-to-copy="Texte à copier" />
							</v-sheet>
						</v-expansion-panel-text>
					</v-expansion-panel>

					<!-- ============ LangBtn ============ -->
					<v-expansion-panel>
						<v-expansion-panel-title>
							LangBtn
						</v-expansion-panel-title>
						<v-expansion-panel-text>
							<div class="text-caption mb-2">
								Sélecteur de langue. Bouton (outlined primary) : ring 2px primary
								standard (offset 3px). Ouvre le menu et navigue : ring inset (−3px)
								sur l'item de langue focalisé.
							</div>
							<v-sheet
								color="surface"
								rounded
								class="pa-4 mb-6"
							>
								<LangBtn
									v-model="lang"
									:available-languages="['fr', 'en', 'es', 'de']"
								/>
							</v-sheet>

							<div class="text-caption mb-2">
								Fond primary (thème dark, ex. header) — bouton en onPrimary, ring onPrimary
							</div>
							<v-sheet
								color="primary"
								rounded
								class="pa-4"
							>
								<div class="v-theme--dark">
									<LangBtn
										v-model="langDark"
										:available-languages="['fr', 'en', 'es', 'de']"
									/>
								</div>
							</v-sheet>
						</v-expansion-panel-text>
					</v-expansion-panel>

					<!-- ============ DownloadBtn ============ -->
					<v-expansion-panel>
						<v-expansion-panel-title>
							DownloadBtn
						</v-expansion-panel-title>
						<v-expansion-panel-text>
							<div class="text-caption mb-2">
								Mode clair (outlined primary) — ring 2px primary, offset 3px
							</div>
							<v-sheet
								color="surface"
								rounded
								class="pa-4 mb-6"
							>
								<DownloadBtn :file-promise="downloadPromise">
									Télécharger
								</DownloadBtn>
							</v-sheet>

							<div class="text-caption mb-2">
								Mode <code>dark</code> (prop) sur fond primary — ring onPrimary (blanc)
							</div>
							<v-sheet
								color="primary"
								rounded
								class="pa-4"
							>
								<DownloadBtn
									:file-promise="downloadPromise"
									dark
								>
									Télécharger
								</DownloadBtn>
							</v-sheet>
						</v-expansion-panel-text>
					</v-expansion-panel>

					<!-- ============ FranceConnectBtn ============ -->
					<v-expansion-panel>
						<v-expansion-panel-title>
							FranceConnectBtn
						</v-expansion-panel-title>
						<v-expansion-panel-text>
							<div class="text-caption mb-2">
								Composant de marque (DSFR) : ring focus <strong>2px #0a76f6</strong>
								(bleu focus officiel de l'État), volontairement <em>pas</em> le primary du DS.
							</div>
							<v-sheet
								color="surface"
								rounded
								class="pa-4 mb-6"
							>
								<FranceConnectBtn href="https://franceconnect.gouv.fr" />
							</v-sheet>

							<div class="text-caption mb-2">
								Mode <code>dark</code> (fond sombre)
							</div>
							<v-sheet
								color="#161616"
								rounded
								class="pa-4"
							>
								<FranceConnectBtn
									href="https://franceconnect.gouv.fr"
									dark
								/>
							</v-sheet>
						</v-expansion-panel-text>
					</v-expansion-panel>

					<!-- ============ UserMenuBtn ============ -->
					<v-expansion-panel>
						<v-expansion-panel-title>
							UserMenuBtn
						</v-expansion-panel-title>
						<v-expansion-panel-text>
							<div class="text-caption mb-2">
								Wrapper de SyBtnMenu. Tab sur le bouton → ring 2px primary standard.
								Ouvre le menu → items (dont Déconnexion) avec ring inset (−3px) via <code>_menus.scss</code>.
							</div>
							<v-sheet
								color="surface"
								rounded
								class="pa-4"
							>
								<UserMenuBtn
									:menu-items="userMenuItems"
									full-name="Jean Dupont"
									additional-information="N° 123456789"
								/>
							</v-sheet>
						</v-expansion-panel-text>
					</v-expansion-panel>

					<!-- ============ SyIconButton ============ -->
					<v-expansion-panel>
						<v-expansion-panel-title>
							SyIconButton
						</v-expansion-panel-title>
						<v-expansion-panel-text>
							<div class="text-caption mb-2">
								Wrapper de <code>&lt;v-btn icon&gt;</code> : Tab dessus → ring 2px primary
								standard (offset 3px), fourni par l'override global.
							</div>
							<v-sheet
								color="surface"
								rounded
								class="pa-4 mb-6"
							>
								<SyIconButton
									:icon="mdiPencil"
									label="Modifier"
									color="primary"
								/>
							</v-sheet>

							<div class="text-caption mb-2">
								Fond primary (thème dark) — ring onPrimary (blanc)
							</div>
							<v-sheet
								color="primary"
								rounded
								class="pa-4"
							>
								<div class="v-theme--dark">
									<SyIconButton
										:icon="mdiPencil"
										label="Modifier"
										color="onPrimary"
									/>
								</div>
							</v-sheet>
						</v-expansion-panel-text>
					</v-expansion-panel>

					<!-- ============ SyInputSelect ============ -->
					<v-expansion-panel>
						<v-expansion-panel-title>
							SyInputSelect
						</v-expansion-panel-title>
						<v-expansion-panel-text>
							<div class="text-caption mb-2">
								Select custom. Tab sur le déclencheur → ring 2px primary outset (offset 3px).
								Ouvre la liste → ring inset (−3px) sur l'option focalisée (liste custom,
								pas couverte par le global).
							</div>
							<v-sheet
								color="surface"
								rounded
								class="pa-4"
								style="max-width: 320px;"
							>
								<SyInputSelect
									v-model="selectValue"
									:items="selectItems"
									label="Sélectionner une option"
								/>
							</v-sheet>
						</v-expansion-panel-text>
					</v-expansion-panel>

					<!-- ============ ErrorPage ============ -->
					<v-expansion-panel>
						<v-expansion-panel-title>
							ErrorPage
						</v-expansion-panel-title>
						<v-expansion-panel-text>
							<div class="text-caption mb-2">
								Wrapper de StatusPage. Le bouton d'action (VBtn) reçoit le ring 2px primary
								standard via l'override global.
							</div>
							<v-sheet
								color="surface"
								rounded
								class="pa-4"
							>
								<ErrorPage
									btn-text="Retour à l'accueil"
									btn-href="#"
								/>
							</v-sheet>
						</v-expansion-panel-text>
					</v-expansion-panel>

					<!-- ============ SyAlert ============ -->
					<v-expansion-panel>
						<v-expansion-panel-title>
							SyAlert
						</v-expansion-panel-title>
						<v-expansion-panel-text>
							<div class="text-caption mb-2">
								Alerte fermable : Tab sur la croix → ring 2px primary (offset 3px).
								Le fond de l'alerte reste clair même en dark → ring primary (pas onPrimary).
							</div>
							<SyAlert
								type="info"
								closable
							>
								Ceci est une alerte d'information fermable.
							</SyAlert>
						</v-expansion-panel-text>
					</v-expansion-panel>

					<!-- ============ SyTextArea ============ -->
					<v-expansion-panel>
						<v-expansion-panel-title>
							SyTextArea
						</v-expansion-panel-title>
						<v-expansion-panel-text>
							<div class="text-caption mb-2">
								Le champ utilise la bordure de focus Vuetify (convention DS des champs).
								Le bouton d'effacement (croix) est un <code>&lt;button&gt;</code> natif → ring
								2px primary standard via l'override global. Tab pour l'atteindre.
							</div>
							<v-sheet
								color="surface"
								rounded
								class="pa-4"
								style="max-width: 480px;"
							>
								<SyTextArea
									v-model="textAreaValue"
									label="Description"
									clearable
								/>
							</v-sheet>
						</v-expansion-panel-text>
					</v-expansion-panel>

					<!-- ============ SyTextField ============ -->
					<v-expansion-panel>
						<v-expansion-panel-title>
							SyTextField
						</v-expansion-panel-title>
						<v-expansion-panel-text>
							<div class="text-caption mb-2">
								Champ : bordure de focus Vuetify en primary.
								Bouton d'effacement (croix, VBtn) → ring 2px primary standard via l'override global.
							</div>
							<v-sheet
								color="surface"
								rounded
								class="pa-4"
								style="max-width: 480px;"
							>
								<SyTextField
									v-model="textFieldValue"
									label="Nom"
									is-clearable
								/>
							</v-sheet>
						</v-expansion-panel-text>
					</v-expansion-panel>
				</v-expansion-panels>
			</v-container>
		</v-main>
	</v-app>
</template>
