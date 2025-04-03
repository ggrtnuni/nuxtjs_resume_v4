<script setup lang="ts">
/**
 * 履歴書 カード コンポーネント
 * 
 * @author ggrtn
 */

// props
interface Props {
    label: string,
    value: string | Ref<string, string>,
    preLike?: boolean | null,
    contactEffectLabel?: boolean | null,
    contactEffectValue?: boolean | null,
}
const props = withDefaults(defineProps<Props>(), { preLike: false, contactEffectLabel: false, contactEffectValue: false });

// 履歴書状態
const resumeState = useResumeState();
</script>

<template>
    <div class="card">
        <h2 :class="{ 'card-without-contact': contactEffectLabel && !resumeState.resumeContact.value }">{{ props.label
            }}</h2>
        <div
            :class="{ 'pre-like': props.preLike, 'card-without-contact': contactEffectValue && !resumeState.resumeContact.value }">
            {{ props.value }}</div>
    </div>
</template>

<style scoped>
@import url('~/assets/css/resume.css');
</style>