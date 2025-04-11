<script setup lang="ts">
/**
 * 履歴書 コントロール チェックボックス コンポーネント
 * 
 * @author ggrtn
 */

// props
interface Props {
    modelValue: Ref<boolean, boolean>,
    name: string,
    label?: string,
    value?: string,
}
const props = withDefaults(defineProps<Props>(), { label: '', value: '1' });

// event
const emit = defineEmits(['change']);

// states
const inputValue = ref<boolean>(props.modelValue.value);

watch(props.modelValue, (newValue) => {
    inputValue.value = newValue;
});
</script>

<template>
    <div class="mb-2">
        <label :for="`${name}-label`" class="block text-nowrap text-gray-700 text-sm font-bold">
            <slot />
        </label>
        <div class="flex items-center">
            <input v-model="inputValue" type="checkbox" :name="props.name" :value="value" :id="props.name"
                class="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500"
                @change="$emit('change', inputValue)" />
            <label :for="props.name" class="ml-2 text-xs font-medium text-gray-900">
                {{ label }}
            </label>
        </div>
    </div>
</template>