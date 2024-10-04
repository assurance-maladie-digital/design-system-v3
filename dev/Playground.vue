<script setup lang="ts">
	import DownloadBtn from '@/components/DownloadBtn/DownloadBtn.vue'
	import axios from 'axios'

	function download() {
		return axios.get('https://run.mocky.io/v3/63e571d5-1134-4f51-82ac-fa7cc8045124')
	}

</script>

<template>
	<div>
		<DownloadBtn
			:file-promise="download"
			:btn="{ color: 'primary'}"
			@error="console.error"
			@success="console.info"
		>
			Download
		</DownloadBtn>
	</div>

	<VApp>
		<VThemeProvider theme="dark">
			<VContainer>
				<VCard
					width="600px"
				>
					<VCardTitle>Votre attestation</VCardTitle>
					<VCardText>
						<p>Téléchargez un fichier d'attestation</p>
						<p>Cette attestion est valable 2 ans a partir de sa date d'émission</p>
					</VCardText>
					<VCardActions>
						<DownloadBtn
							:file-promise="download"
							@error="console.error"
							@success="console.info"
						>
							Download
						</DownloadBtn>
					</VCardActions>
				</VCard>
			</VContainer>
		</VThemeProvider>
	</VApp>
</template>
