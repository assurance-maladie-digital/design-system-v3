<script setup lang="ts">
	import { ref } from 'vue'
	import BackBtn from '@/components/BackBtn/BackBtn.vue'
	import SyBtnMenu from '@/components/SyBtnMenu/SyBtnMenu.vue'
	import SelectBtnField from '@/components/Customs/Selects/SelectBtnField/SelectBtnField.vue'
	import FooterBar from '@/components/FooterBar/FooterBar.vue'
	import HeaderMenuBtn from '@/components/HeaderBar/HeaderMenuBtn/HeaderMenuBtn.vue'
	import HeaderMenuItem from '@/components/HeaderBar/HeaderBurgerMenu/HeaderMenuItem/HeaderMenuItem.vue'
	import CollapsibleList from '@/components/CollapsibleList/CollapsibleList.vue'

	// HeaderMenuBtn (bouton menu du HeaderBar)
	const menuOpen = ref(false)

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
								Bouton menu du header (fond primary) — ring primary au focus
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
								Item de menu pleine largeur — focus = traits primary haut + bas (pas de ring)
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
				</v-expansion-panels>
			</v-container>
		</v-main>
	</v-app>
</template>
