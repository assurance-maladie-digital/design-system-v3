<script setup lang="ts">

</script>

<template>
	<div>
		<v-list
			border="0"
			elevation="0"
			rounded="0"
		>
			<v-list-item
				v-for="i in 5"
				:key="i"
				link
			>
				<v-list-item-title>Item {{ i }}</v-list-item-title>
				<template #append>
					<v-icon
						icon="mdi-menu-right"
						size="x-small"
					/>
				</template>

				<v-menu
					activator="parent"
					open-on-click
					border="0"
					rounded="0"
					elevation="0"
					location="top end"
					origin="top start"
					location-strategy="connected"
					submenu
					:target="[menuLeft+150, menuTop+90]"
				>
					<v-list
						border="0"
						elevation="0"
						rounded="0"
					>
						<v-list-item
							v-for="j in 5"
							:key="j"
							link
						>
							<v-list-item-title>Item {{ i }} - {{ j }}</v-list-item-title>
							<template #append>
								<v-icon
									icon="mdi-menu-right"
									size="x-small"
								/>
							</template>

							<v-menu
								activator="parent"
								open-on-click
								border="0"
								rounded="0"
								elevation="0"
								location-strategy="(data, props, contentStyle) => {}"
								location="top end"
								origin="top start"
								:target="[menuLeft+300, menuTop+90]"
								submenu
							>
								<v-list
									border="0"
									elevation="0"
									rounded="0"
								>
									<v-list-item
										v-for="k in 5"
										:key="k"
										link
									>
										<v-list-item-title>Item {{ i }} - {{ j }} - {{ k }}</v-list-item-title>
									</v-list-item>
								</v-list>
							</v-menu>
						</v-list-item>
					</v-list>
				</v-menu>
			</v-list-item>
		</v-list>
	</div>
</template>

<style lang="scss" scoped></style>
