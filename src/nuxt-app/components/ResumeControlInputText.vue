<script setup lang="ts">
/**
 * 履歴書 コントロール テキストボックス コンポーネント
 * 
 * @author ggrtn
 */

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
        <input v-model="inputValue" type="text" :id="props.name" :name="props.name" :class="inputClass"
            @input="$emit('input', inputValue)" />
    </div>
</template>