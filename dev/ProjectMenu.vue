<script setup lang="ts">
	import HeaderComplexMenu from '@/components/HeaderBar/HeaderComplexMenu.vue'
	import HeaderMenuItem from '@/components/HeaderBar/HeaderMenuItem.vue'
	import HeaderMenuSection from '@/components/HeaderBar/HeaderMenuSection.vue'
	import HeaderSubMenu from '@/components/HeaderBar/HeaderSubMenu.vue'
</script>

<template>
	<HeaderComplexMenu>
		<HeaderMenuSection
			title="section 1"
		>
			<HeaderMenuItem>
				<a href="#">home</a>
			</HeaderMenuItem>
			<HeaderMenuItem>
				<a href="#">home</a>
			</HeaderMenuItem>
			<HeaderMenuItem>
				<a href="#">home</a>
			</HeaderMenuItem>
			<HeaderMenuItem>
				<a href="#">home</a>
			</HeaderMenuItem>
			<HeaderMenuItem>
				<a href="#">home</a>
			</HeaderMenuItem>
			<HeaderMenuItem>
				<a href="#">home</a>
			</HeaderMenuItem>
			<HeaderMenuItem>
				<a href="#">home</a>
			</HeaderMenuItem>
			<HeaderMenuItem>
				<a href="#">home</a>
			</HeaderMenuItem>
		</HeaderMenuSection>
		<HeaderMenuSection
			title="section 2"
		>
			<HeaderMenuItem>
				<a href="#">home</a>
			</HeaderMenuItem>
			<HeaderMenuItem>
				<a href="#">home</a>
			</HeaderMenuItem>
			<HeaderMenuItem>
				<a href="#">home</a>
			</HeaderMenuItem>
			<HeaderMenuItem>
				<a>profile</a>
			</HeaderMenuItem>
			<headerMenuItem>
				<headerSubMenu>
					<template #title>
						sub menu
					</template>
					<HeaderMenuSection>
						<HeaderMenuItem>
							<a>sub menu item 1</a>
						</HeaderMenuItem>
						<HeaderMenuItem>
							<a>sub menu item 2</a>
						</HeaderMenuItem>
						<HeaderMenuItem>
							<a>sub menu item 1</a>
						</HeaderMenuItem>
						<HeaderMenuItem>
							<a>sub menu item 2</a>
						</HeaderMenuItem>
						<HeaderMenuItem>
							<a>sub menu item 1</a>
						</HeaderMenuItem>
						<HeaderMenuItem>
							<a>sub menu item 2</a>
						</HeaderMenuItem>
						<HeaderMenuItem>
							<a>sub menu item 1</a>
						</HeaderMenuItem>
						<HeaderMenuItem>
							<a>sub menu item 2</a>
						</HeaderMenuItem>
						<HeaderMenuItem>
							<a>sub menu item 1</a>
						</HeaderMenuItem>
						<HeaderMenuItem>
							<a>sub menu item 2</a>
						</HeaderMenuItem>
						<HeaderMenuItem>
							<a>sub menu item 1</a>
						</HeaderMenuItem>
						<HeaderMenuItem>
							<a>sub menu item 2</a>
						</HeaderMenuItem>
						<HeaderMenuItem>
							<HeaderSubMenu>
								<template #title>
									+sub menu
								</template>
								<HeaderMenuItem>
									<a>+sub menu item 1</a>
								</HeaderMenuItem>
								<HeaderMenuItem>
									<a>+sub menu item 2</a>
								</HeaderMenuItem>
								<HeaderMenuItem>
									<a>+sub menu item 3</a>
								</HeaderMenuItem>
								<HeaderMenuItem>
									<a>+sub menu item 4</a>
								</HeaderMenuItem>
								<HeaderMenuItem>
									<a>+sub menu item 5</a>
								</HeaderMenuItem>
								<HeaderMenuItem>
									<a>+sub menu item 6</a>
								</HeaderMenuItem>
								<HeaderMenuItem>
									<a>+sub menu item 7</a>
								</HeaderMenuItem>
								<HeaderMenuItem>
									<a>+sub menu item 8</a>
								</HeaderMenuItem>
								<HeaderMenuItem>
									<a>+sub menu item 9</a>
								</HeaderMenuItem>
							</HeaderSubMenu>
						</HeaderMenuItem>
					</HeaderMenuSection>
				</headerSubMenu>
			</headerMenuItem>
		</HeaderMenuSection>
	</HeaderComplexMenu>
</template>

<style lang="scss" scoped></style>
