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
	import DatePicker from '@/components/DatePicker/CalendarMode/DatePicker.vue'
	import DiacriticPicker from '@/components/DiacriticPicker/DiacriticPicker.vue'
	import Captcha from '@/components/Captcha/Captcha.vue'
	import NirField from '@/components/NirField/NirField.vue'
	import PasswordField from '@/components/PasswordField/PasswordField.vue'
	import FileUpload from '@/components/FileUpload/FileUpload.vue'
	import UploadWorkflow from '@/components/UploadWorkflow/UploadWorkflow.vue'
	import FileList from '@/components/FileList/FileList.vue'
	import FilePreview from '@/components/FilePreview/FilePreview.vue'
	import PhoneField from '@/components/PhoneField/PhoneField.vue'
	import RangeField from '@/components/RangeField/RangeField.vue'
	import LunarCalendar from '@/components/LunarCalendar/LunarCalendar.vue'
	import MonthPicker from '@/components/MonthPicker/MonthPicker.vue'
	import SyAutocomplete from '@/components/Customs/Selects/SyAutocomplete/SyAutocomplete.vue'
	import SySelect from '@/components/Customs/Selects/SySelect/SySelect.vue'
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

	// DatePicker (CalendarMode)
	const dateValue = ref<string | null>(null)

	// DiacriticPicker
	const diacriticValue = ref('')

	// Captcha
	const captchaValue = ref('')

	// NirField
	const nirValue = ref('')

	// PasswordField
	const passwordValue = ref('MonMotDePasse123')

	// FileUpload
	const uploadedFiles = ref([])

	// UploadWorkflow
	const uploadWorkflowList = [
		{ id: 'id', title: 'Carte d\'identité', state: 'initial', showUploadBtn: true },
		{ id: 'bill', title: 'Facture de soin', state: 'success', fileName: 'facture.pdf' },
	]

	// FileList
	const fileListItems = [
		{ id: '1', title: 'Carte vitale', state: 'initial', showUploadBtn: true },
		{ id: '2', title: 'Justificatif de domicile', state: 'success', fileName: 'justificatif.pdf', showDeleteBtn: true },
		{ id: '3', title: 'Ordonnance', state: 'error' },
	]

	// FilePreview : vrai PDF minimal (1 page « Apercu PDF ») pour montrer les deux modes.
	const PREVIEW_PDF_B64
		= 'JVBERi0xLjQKMSAwIG9iago8PCAvVHlwZSAvQ2F0YWxvZyAvUGFnZXMgMiAwIFIgPj4KZW5kb2JqCjIgMCBvYmoKPDwgL1R5cGUgL1BhZ2VzIC9LaWRzIFszIDAgUl0gL0NvdW50IDEgPj4KZW5kb2JqCjMgMCBvYmoKPDwgL1R5cGUgL1BhZ2UgL1BhcmVudCAyIDAgUiAvTWVkaWFCb3ggWzAgMCAzMDAgMjAwXSAvQ29udGVudHMgNCAwIFIgL1Jlc291cmNlcyA8PCAvRm9udCA8PCAvRjEgNSAwIFIgPj4gPj4gPj4KZW5kb2JqCjQgMCBvYmoKPDwgL0xlbmd0aCA0MSA+PgpzdHJlYW0KQlQgL0YxIDI0IFRmIDQwIDExMCBUZCAoQXBlcmN1IFBERikgVGogRVQKZW5kc3RyZWFtCmVuZG9iago1IDAgb2JqCjw8IC9UeXBlIC9Gb250IC9TdWJ0eXBlIC9UeXBlMSAvQmFzZUZvbnQgL0hlbHZldGljYSA+PgplbmRvYmoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDA5IDAwMDAwIG4gCjAwMDAwMDAwNTggMDAwMDAgbiAKMDAwMDAwMDExNSAwMDAwMCBuIAowMDAwMDAwMjQxIDAwMDAwIG4gCjAwMDAwMDAzMzIgMDAwMDAgbiAKdHJhaWxlcgo8PCAvU2l6ZSA2IC9Sb290IDEgMCBSID4+CnN0YXJ0eHJlZgo0MDIKJSVFT0Y='
	const previewFile = new File(
		[Uint8Array.from(atob(PREVIEW_PDF_B64), c => c.charCodeAt(0))],
		'apercu.pdf',
		{ type: 'application/pdf' },
	)

	// PhoneField
	const phoneValue = ref('0612345678')

	// RangeField
	const rangeValue = ref([20, 80])

	// LunarCalendar
	const lunarValue = ref('15/08/1990')

	// MonthPicker
	const monthValue = ref('03/2025')

	// SyAutocomplete
	const autocompleteValue = ref('paris')
	const autocompleteItems = [
		{ text: 'Paris', value: 'paris' },
		{ text: 'Lyon', value: 'lyon' },
		{ text: 'Marseille', value: 'marseille' },
	]

	// SySelect
	const selectFocusValue = ref('a')
	const selectFocusItems = [
		{ text: 'Option A', value: 'a' },
		{ text: 'Option B', value: 'b' },
		{ text: 'Option C', value: 'c' },
	]

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

					<!-- ============ DatePicker (CalendarMode) ============ -->
					<v-expansion-panel>
						<v-expansion-panel-title>
							DatePicker
						</v-expansion-panel-title>
						<v-expansion-panel-text>
							<div class="text-caption mb-2">
								Ouvre le calendrier puis navigue au clavier (flèches + Tab). Tous les boutons
								(jours, mois/année, navigation, « Aujourd'hui ») reçoivent le ring primary via
								l'override global. Dans la <strong>grille dense</strong>, l'offset est réduit
								à 1px (au lieu du 3px global) pour ne pas déborder sur les cellules voisines.
							</div>
							<v-sheet
								color="surface"
								rounded
								class="pa-4"
								style="max-width: 360px;"
							>
								<DatePicker
									v-model="dateValue"
									label="Date de naissance"
								/>
							</v-sheet>
						</v-expansion-panel-text>
					</v-expansion-panel>

					<!-- ============ DiacriticPicker ============ -->
					<v-expansion-panel>
						<v-expansion-panel-title>
							DiacriticPicker
						</v-expansion-panel-title>
						<v-expansion-panel-text>
							<div class="text-caption mb-2">
								Tab s'arrête sur l'<strong>input du champ</strong> (bordure primary) puis sur
								le bouton d'ouverture. Le conteneur <code>role="textbox"</code> qui enveloppe
								l'input est en <code>tabindex="-1"</code> (plus d'arrêt de Tab ni de ring
								conteneur en trop).
								Le bouton et les caractères de la boîte de dialogue reçoivent le ring primary
								via l'override global.
							</div>
							<v-sheet
								color="surface"
								rounded
								class="pa-4"
								style="max-width: 360px;"
							>
								<DiacriticPicker v-model="diacriticValue">
									<SyTextField
										v-model="diacriticValue"
										label="Nom avec accents"
									/>
								</DiacriticPicker>
							</v-sheet>
						</v-expansion-panel-text>
					</v-expansion-panel>

					<!-- ============ Captcha ============ -->
					<v-expansion-panel>
						<v-expansion-panel-title>
							Captcha
						</v-expansion-panel-title>
						<v-expansion-panel-text>
							<v-sheet
								color="surface"
								rounded
								class="pa-4"
								style="max-width: 480px;"
							>
								<Captcha
									v-model="captchaValue"
									url-create="https://free.mockerapi.com/mock/0adac32b-e832-4553-aa7f-0011b7f35f0c"
									url-get-image="/captcha/captcha.png"
									url-get-audio="/captcha/captcha.mp3"
								/>
							</v-sheet>
						</v-expansion-panel-text>
					</v-expansion-panel>

					<!-- ============ NirField ============ -->
					<v-expansion-panel>
						<v-expansion-panel-title>
							NirField
						</v-expansion-panel-title>
						<v-expansion-panel-text>
							<div class="text-caption mb-2">
								NirField ne porte <strong>aucun style de focus propre</strong> : il assemble
								deux <code>SyTextField</code> (numéro + clé) qui gèrent tout. Au Tab :
								input → bordure primary du champ ; icône <em>info</em> (tooltip) → ring DS de
								SyTextField ; bouton <em>clear</em> → <code>.v-btn</code> couvert par le global.
							</div>
							<v-sheet
								color="surface"
								rounded
								class="pa-4"
								style="max-width: 480px;"
							>
								<NirField
									v-model="nirValue"
									label="Identifiant d'assuré"
									nir-tooltip="Numéro de sécurité sociale à 13 chiffres"
									key-tooltip="Clé de contrôle à 2 chiffres"
									clearable
								/>
							</v-sheet>
						</v-expansion-panel-text>
					</v-expansion-panel>

					<!-- ============ PasswordField ============ -->
					<v-expansion-panel>
						<v-expansion-panel-title>
							PasswordField
						</v-expansion-panel-title>
						<v-expansion-panel-text>
							<div class="text-caption mb-2">
								Au Tab : input (bordure primary), bouton <em>clear</em> et bouton
								<em>afficher/masquer</em>. Les deux boutons portaient un box-shadow bleu codé
								en dur → remplacés par le ring DS primary (2px, offset 2px). Le clear est un
								<code>&lt;button&gt;</code> natif, le toggle un <code>.v-btn</code> ; les deux
								sont serrés dans le bord du champ (offset 2px pour ne pas déborder).
							</div>
							<v-sheet
								color="surface"
								rounded
								class="pa-4"
								style="max-width: 480px;"
							>
								<PasswordField
									v-model="passwordValue"
									label="Mot de passe"
									clearable
								/>
							</v-sheet>
						</v-expansion-panel-text>
					</v-expansion-panel>

					<!-- ============ FileUpload ============ -->
					<v-expansion-panel>
						<v-expansion-panel-title>
							FileUpload
						</v-expansion-panel-title>
						<v-expansion-panel-text>
							<div class="text-caption mb-2">
								La zone de dépôt est un <code>role="button"</code> custom (pas un
								<code>.v-btn</code>) → non couverte par le global. Au Tab elle reçoit un ring
								DS primary (2px, offset 2px) <strong>au clavier uniquement</strong>
								(<code>:focus-visible</code>) ; le fond gris existant reste au survol / focus /
								drag. L'input fichier caché est hors séquence Tab (<code>tabindex="-1"</code>).
							</div>
							<v-sheet
								color="surface"
								rounded
								class="pa-4"
								style="max-width: 480px;"
							>
								<FileUpload v-model="uploadedFiles" />
							</v-sheet>
						</v-expansion-panel-text>
					</v-expansion-panel>

					<!-- ============ UploadWorkflow ============ -->
					<v-expansion-panel>
						<v-expansion-panel-title>
							UploadWorkflow
						</v-expansion-panel-title>
						<v-expansion-panel-text>
							<div class="text-caption mb-2">
								UploadWorkflow ne porte <strong>aucun style de focus propre</strong> : il
								compose FileUpload (dropzone → ring DS scopé), FileList (actions =
								<code>.v-btn</code> → ring global), SySelect et DialogBox (focus gérés par eux).
								Au Tab : les actions de chaque ligne puis la dropzone.
							</div>
							<v-sheet
								color="surface"
								rounded
								class="pa-4"
								style="max-width: 560px;"
							>
								<UploadWorkflow :upload-list="uploadWorkflowList" />
							</v-sheet>
						</v-expansion-panel-text>
					</v-expansion-panel>

					<!-- ============ FileList ============ -->
					<v-expansion-panel>
						<v-expansion-panel-title>
							FileList
						</v-expansion-panel-title>
						<v-expansion-panel-text>
							<div class="text-caption mb-2">
								Les actions de chaque ligne (envoyer / prévisualiser / supprimer) sont des
								<code>.v-btn</code> → ring primary via l'override global <code>_btns.scss</code>.
								FileList / UploadItem ne portent aucun style de focus propre.
							</div>
							<v-sheet
								color="surface"
								rounded
								class="pa-4"
								style="max-width: 560px;"
							>
								<FileList :upload-list="fileListItems" />
							</v-sheet>
						</v-expansion-panel-text>
					</v-expansion-panel>

					<!-- ============ FilePreview ============ -->
					<v-expansion-panel>
						<v-expansion-panel-title>
							FilePreview
						</v-expansion-panel-title>
						<v-expansion-panel-text>
							<div class="text-caption mb-2">
								<strong>Mode classique</strong> (<code>&lt;object&gt;</code>, visionneuse PDF
								native du navigateur) : pas de focusable DS spécifique. <strong>Mode pdfjs</strong>
								(readonly / suivi de consultation) : le visualiseur est un
								<code>role="document"</code> focusable au clavier, qui porte <strong>déjà</strong>
								le ring DS (2px primary, offset -2px inset — adapté au conteneur scrollable).
							</div>
							<v-row>
								<v-col
									cols="12"
									md="6"
								>
									<div class="text-caption font-weight-medium mb-1">
										Mode classique
									</div>
									<v-sheet
										color="surface"
										rounded
										class="pa-2"
									>
										<FilePreview
											:file="previewFile"
											:options="{ pdf: { height: '200px' } }"
										/>
									</v-sheet>
								</v-col>
								<v-col
									cols="12"
									md="6"
								>
									<div class="text-caption font-weight-medium mb-1">
										Mode pdfjs (readonly)
									</div>
									<v-sheet
										color="surface"
										rounded
										class="pa-2"
									>
										<FilePreview
											:file="previewFile"
											readonly
											:options="{ pdf: { height: '200px' } }"
										/>
									</v-sheet>
								</v-col>
							</v-row>
						</v-expansion-panel-text>
					</v-expansion-panel>

					<!-- ============ PhoneField ============ -->
					<v-expansion-panel>
						<v-expansion-panel-title>
							PhoneField
						</v-expansion-panel-title>
						<v-expansion-panel-text>
							<div class="text-caption mb-2">
								Au Tab : le sélecteur d'indicatif (SySelect) puis le champ numéro
								(SyTextField) — focus gérés par ces composants (bordure primary). Le bouton
								<em>clear</em> est un <code>&lt;button&gt;</code> natif → ring DS primary scopé
								(2px, offset 1px), au lieu du focus navigateur par défaut.
							</div>
							<v-sheet
								color="surface"
								rounded
								class="pa-4"
								style="max-width: 480px;"
							>
								<PhoneField
									v-model="phoneValue"
									label="Téléphone"
									with-country-code
									is-clearable
								/>
							</v-sheet>
						</v-expansion-panel-text>
					</v-expansion-panel>

					<!-- ============ RangeField ============ -->
					<v-expansion-panel>
						<v-expansion-panel-title>
							RangeField
						</v-expansion-panel-title>
						<v-expansion-panel-text>
							<div class="text-caption mb-2">
								Au Tab : les deux champs numériques (min/max, SyTextField → bordure primary)
								et les deux <em>thumbs</em> du slider (<code>role="slider"</code>). Chaque thumb
								affiche un cadre de focus DS (2px primary) <strong>au clavier uniquement</strong>
								(<code>:focus-visible</code>) ; au drag souris, seul le cercle s'agrandit.
								Utilise les flèches pour déplacer un thumb focus.
							</div>
							<v-sheet
								color="surface"
								rounded
								class="pa-4 pt-10"
								style="max-width: 480px;"
							>
								<RangeField
									v-model="rangeValue"
									:min="0"
									:max="100"
								/>
							</v-sheet>
						</v-expansion-panel-text>
					</v-expansion-panel>

					<!-- ============ LunarCalendar ============ -->
					<v-expansion-panel>
						<v-expansion-panel-title>
							LunarCalendar
						</v-expansion-panel-title>
						<v-expansion-panel-text>
							<div class="text-caption mb-2">
								Simple wrapper autour d'un <code>SyTextField</code> masqué
								(<code>##/##/####</code>) : aucun style de focus propre. Au Tab, focus sur
								l'input (bordure primary) ; le bouton <em>clear</em> (VBtn) et l'icône info
								éventuelle sont gérés par SyTextField (ring global / scopé de SyTextField).
							</div>
							<v-sheet
								color="surface"
								rounded
								class="pa-4"
								style="max-width: 480px;"
							>
								<LunarCalendar
									v-model="lunarValue"
									label="Date de naissance (calendrier lunaire)"
									is-clearable
								/>
							</v-sheet>
						</v-expansion-panel-text>
					</v-expansion-panel>

					<!-- ============ MonthPicker ============ -->
					<v-expansion-panel>
						<v-expansion-panel-title>
							MonthPicker
						</v-expansion-panel-title>
						<v-expansion-panel-text>
							<div class="text-caption mb-2">
								Le champ délègue à SyTextField ; le <strong>bouton calendrier</strong>
								(<code>&lt;button&gt;</code> natif) reçoit un ring DS scopé. Ouvre le picker :
								les grilles mois/année sont en <strong>roving tabindex</strong> (flèches), et
								le bouton actif reçoit le ring primary au clavier (<code>:focus-visible</code>).
								Le YearSelector utilisait <code>accentPrimary</code> → corrigé en <code>primary</code>.
							</div>
							<v-sheet
								color="surface"
								rounded
								class="pa-4"
								style="max-width: 480px;"
							>
								<MonthPicker
									v-model="monthValue"
									label="Mois de début"
								/>
							</v-sheet>
						</v-expansion-panel-text>
					</v-expansion-panel>

					<!-- ============ SyAutocomplete ============ -->
					<v-expansion-panel>
						<v-expansion-panel-title>
							SyAutocomplete
						</v-expansion-panel-title>
						<v-expansion-panel-text>
							<div class="text-caption mb-2">
								Combobox : le focus reste sur l'input (SyTextField → bordure primary) ;
								l'option active du menu est signalée via <code>aria-activedescendant</code>.
								Ouvre le menu et navigue aux flèches : l'option active reçoit un ring DS
								primary inset (avant, le token <code>borderAccentPrimary</code> invalide
								n'affichait rien). Le bouton <em>clear</em> est un <code>&lt;button&gt;</code>
								natif → ring DS primary scopé (2px, offset 1px).
							</div>
							<v-sheet
								color="surface"
								rounded
								class="pa-4"
								style="max-width: 480px;"
							>
								<SyAutocomplete
									v-model="autocompleteValue"
									:items="autocompleteItems"
									label="Ville"
									clearable
								/>
							</v-sheet>
						</v-expansion-panel-text>
					</v-expansion-panel>

					<!-- ============ SySelect ============ -->
					<v-expansion-panel>
						<v-expansion-panel-title>
							SySelect
						</v-expansion-panel-title>
						<v-expansion-panel-text>
							<div class="text-caption mb-2">
								Combobox : focus sur l'input (bordure primary). Ouvre le menu et navigue aux
								flèches → l'option active reçoit un <strong>anneau primary sans fond gris</strong>
								(le fond gris reste au survol et sur la sélection). Le bouton <em>clear</em> est
								un <code>&lt;button&gt;</code> natif → ring DS primary scopé (2px, offset 1px).
							</div>
							<v-sheet
								color="surface"
								rounded
								class="pa-4"
								style="max-width: 480px;"
							>
								<SySelect
									v-model="selectFocusValue"
									:items="selectFocusItems"
									label="Choisir une option"
									clearable
								/>
							</v-sheet>
						</v-expansion-panel-text>
					</v-expansion-panel>
				</v-expansion-panels>
			</v-container>
		</v-main>
	</v-app>
</template>
