<script setup lang="ts">
/**
 * 履歴書 コントロール ボタン コンポーネント
 * 
 * @author ggrtn
 */
interface Props {
    level?: string,
}
const props = withDefaults(defineProps<Props>(), { level: 'primary' });
const buttonClass = ref('text-white text-nowrap bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded text-xs  px-1 py-1 me-1 mb-1  dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800');

if (props.level === 'danger') {
    buttonClass.value = 'text-white text-nowrap bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded text-xs  px-1 py-1 me-1 mb-1  dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800';
}

</script>

<template>
    <button type="button" :class="buttonClass">
        <slot />
    </button>
</template>