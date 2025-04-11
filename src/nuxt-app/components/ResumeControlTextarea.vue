<script setup lang="ts">
/**
 * 履歴書 コントロール テキストエリア コンポーネント
 * 
 * TODO  * SSR でのビルドだとサーバ側とクライアント側に不一致が起こり、コンソールログに警告が表示されるが、対処方法不明
 * [Vue warn]: Hydration text content mismatch on 
 * <textarea id=​"resumeMotivation" 
 *            name=​"resumeMotivation" 
 *            class=​"shadow appearance-none border rounded w-full py-1 px-3 text-xs text-gray-700 leading-tight focus:​outline-none forcus:​shadow-outline" 
 *            rows=​"10">
 * ​</textarea>​
 * 
 * 応急処置として textarea 要素のみ <ClientOnly></ClientOnly> で囲んでいる。
 * 
 * @author ggrtn
 */
import { ClientOnly } from '#components';

// props
interface Props {
    modelValue: Ref<string, string>,
    name: string,
}
const props = defineProps<Props>();

// event
const emit = defineEmits(['input']);

// states
const inputValue = ref<string>(props.modelValue.value);
const inputClass = ref<string>('shadow appearance-none border rounded w-full py-1 px-3 text-xs text-gray-700 leading-tight focus:outline-none forcus:shadow-outline');

watch(props.modelValue, (newValue) => {
    inputValue.value = newValue;
});
</script>

<template>
    <div class="space-y-2 mb-2">
        <label :for="props.name" class="block text-gray-700 text-sm font-bold">
            <slot />
        </label>
        <!-- [Vue warn]: Hydration text content mismatch on textarea -->
        <ClientOnly>
            <textarea v-model="inputValue" :id="props.name" :name="props.name" :class="inputClass" rows="10"
                @input="$emit('input', inputValue)">
        </textarea>
        </ClientOnly>
    </div>
</template>