<template>
	<div>
		<h2 style="margin-bottom: 24px; border-bottom: 1px solid rgba(38, 85, 115, 0.15); color: rgb(46, 52, 56); font-family: &quot;Nunito Sans&quot;, -apple-system, &quot;.SFNSText-Regular&quot;, &quot;San Francisco&quot;, BlinkMacSystemFont, &quot;Segoe UI&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;">
			Exemples d'intégration des couleurs
		</h2>

		<div style="margin-bottom: 32px;">
			Avec une classe Vuetify :
			<h1 class="text-secondary">
				Contenu
			</h1>
			<div style="margin-top: 16px; padding: 12px; background-color: #f5f5f5; border-radius: 4px;">
				<pre style="margin: 0; font-size: 12px; color: #333;"><code>&lt;h1 class="text-secondary"&gt;Playground&lt;/h1&gt;</code></pre>
			</div>
		</div>

		<div>
			Avec un style personnalisé :
			<h1 class="text-secondary my-color">
				Contenu
			</h1>
			<div style="margin-top: 16px; padding: 12px; background-color: #f5f5f5; border-radius: 4px;">
				<pre style="margin: 0; font-size: 12px; color: #333;"><code>&lt;h1 class="text-secondary myColor"&gt;Playground&lt;/h1&gt;</code></pre>
			</div>
			<div style="margin-top: 16px; padding: 12px; background-color: #f5f5f5; border-radius: 4px;">
				<pre style="margin: 0; font-size: 12px; color: #333;"><code>@use '@/designTokens/tokens' as tokens;

.my-color {
    color: tokens.$yellow-lighten-40 !important;
 }</code></pre>
			</div>
		</div>
	</div>
	<br>
</template>

<style lang="scss" scoped>
@use '@/assets/tokens' as tokens;

.my-color {
	color: tokens.$yellow-lighten-40 !important;
}
</style>
