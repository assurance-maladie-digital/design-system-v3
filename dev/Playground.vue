<script setup lang="ts">
	import FranceConnectBtn from '@/components/FranceConnectBtn/FranceConnectBtn.vue'
</script>

<template>
	<VApp>
		<main>
			<div class="pa-10">
				<v-row>
					<v-col>
						<FranceConnectBtn href="/" />
					</v-col>
					<v-col>
						<FranceConnectBtn
							href="/"
							is-connect-plus
						/>
					</v-col>
				</v-row>
			</div>

			<br>

			<v-theme-provider
				class="pa-10"
				theme="dark"
				with-background
			>
				<v-row>
					<v-col>
						<FranceConnectBtn
							href="/"
							disabled
						/>
					</v-col>
					<v-col>
						<FranceConnectBtn
							href="/"
							is-connect-plus
							disabled
						/>
					</v-col>
				</v-row>
			</v-theme-provider>
		</main>
	</VApp>
</template>
