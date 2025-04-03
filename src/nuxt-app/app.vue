<script setup lang="ts">
// nuxt v3.16 example: pages
// https://nuxt.com/docs/examples/routing/pages

const router = useRouter()

const nav = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
]
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>