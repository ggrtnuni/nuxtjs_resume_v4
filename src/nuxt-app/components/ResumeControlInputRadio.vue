<script setup lang="ts">
/**
 * 履歴書 コントロール ラジオボタン コンポーネント
 * 
 * @author ggrtn
 */

// props
interface Props {
    modelValue: Ref<string, string>,
    name: string,
    items: Array<{ 'label': string, 'value': string }>,
}
const props = defineProps<Props>();

// event
const emit = defineEmits(['change']);
</script>

<template>
    <div class="mb-2">
        <label for="resume-gender" class="block text-gray-700 text-sm font-bold">
            <slot />
        </label>
        <div class="flex items-center">
            <template v-for="(item, index) in props.items">
                <div class="flex items-center">
                    <input type="radio" class="w-3 h-3 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                        :id="`${props.name}-${index}`" :value="item.value" :name="props.name"
                        :checked="item.value === props.modelValue.value" @change="$emit('change', item.value)" />
                    <label :for="`${props.name}-${index}`" class="mr-2 text-xs font-medium text-gray-900">
                        {{ item.label }}
                    </label>
                </div>
            </template>
        </div>
    </div>
</template>