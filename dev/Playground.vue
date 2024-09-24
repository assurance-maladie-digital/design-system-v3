<script setup lang="ts">
import PageContainer from '@/components/PageContainer/PageContainer.vue'
</script>

<template>
  <VApp>
    <main>
      <PageContainer size="s" color="blue">
        <h1>Playground</h1>
      </PageContainer>
      <PageContainer size="m" color="red">
        <h1>Playground</h1>
      </PageContainer>
      <PageContainer size="l" color="orange">
        <h1>Playground</h1>
      </PageContainer>
      <PageContainer size="xl" color="pink">
        <h1>Playground</h1>
      </PageContainer>
      <PageContainer color="yellow" spacing="sm">
        <h1>Playground</h1>
      </PageContainer>
    </main>
  </VApp>
</template>