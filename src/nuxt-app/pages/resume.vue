<script setup lang="ts">
definePageMeta({
    layout: false
})
</script>

<template>
    <div>
        <NuxtLayout name="resume">
            <div class="flex justify-start">
                <Resume />
                <ResumeControl />
            </div>
        </NuxtLayout>
    </div>
</template>
