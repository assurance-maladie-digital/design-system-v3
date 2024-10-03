<script lang="ts">
</script>

<template>
	<v-col
		cols="2"
		class="d-flex flex-column ga-3 mx-auto"
	>
		<h1 class="text-center">
			Test Heading
		</h1>
		<VBtn color="primary">
			Primary Button
		</VBtn>
		<VBtn color="secondary">
			Secondary Button
		</VBtn>
		<VBtn color="accent">
			Accent Button
		</VBtn>
		<VBtn color="warning">
			Warning Button
		</VBtn>
		<VBtn color="success">
			Success Button
		</VBtn>
		<VBtn color="error">
			Error Button
		</VBtn>
		<VBtn color="info">
			Info Button
		</VBtn>
		<VBtn color="risquePro">
			RisquePro Button
		</VBtn>
		<VBtn color="backgroundAssure">
			Assure Button
		</VBtn>
		<VBtn color="transparentBlue18">
			TransparentBlue18 Button
		</VBtn>
		<VBtn color="transparentBlue8">
			TransparentBlue8 Button
		</VBtn>
		<VBtn color="transparentBlue0">
			TransparentBlue0 Button
		</VBtn>
		<VBtn color="toto">
			Toto Button
		</VBtn>
		<div>
			<div
				class="border-xl"
				style="height: 64px; width: 64px;"
			>
				<div class="text-caption">
					border-xl
				</div>
			</div>
		</div>
		<div>
			<v-card-title class="title">
				Titre
			</v-card-title>
			<v-card-title class="alt-title">
				Titre Alternatif
			</v-card-title>
			<v-card-text class="body-text">
				Ceci est un corps de texte.
			</v-card-text>
			<v-btn class="link-label">
				Lien ou libellé
			</v-btn>
		</div>
	</v-col>
	<div />
</template>

<style lang="scss" scoped>
@import '../assets/tokens';

h1 {
  color: $orange-base;
}

button {
  background-color: $blue-base;
  color: $white-base;
  border-radius: $radius-rounded;
  //padding: $padding-10 $padding-4;
}
</style>
