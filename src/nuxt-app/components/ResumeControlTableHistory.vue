<script setup lang="ts">
/**
 * 履歴書 コントロール 履歴一覧 コンポーネント
 * 
 * @author ggrtn
 */
import { type ResumeHistory } from '~/types/resume';

// props
interface Props {
    name: string,
}
const props = defineProps<Props>();

// 履歴書状態
const resumeState = useResumeState();

// 上流から受け取った name の値によってデータソースを「学歴・職歴」「免許・資格」のどちらかに切り替える。
let target: Ref<ResumeHistory, ResumeHistory> = resumeState.resumeHistory;
if (props.name === 'resumeLicense') {
    target = resumeState.resumeLicense;
}


/**
 * 行追加
 */
const addRow = () => {
    target.value.rows.push({ 'resume-year': '', 'resume-month': '', 'resume-text': '', 'right': false })
};

/**
 * 全て削除
 */
const deleteAllRow = () => {
    if (typeof window !== 'undefined') {
        if (confirm('削除しますか？')) {
            while (target.value.rows.pop());
        }
    } else {
        console.warn('ブラウザ環境ではありません。');
        while (target.value.rows.pop());
    }
};

/**
 * 行入れ替え
 */
const swapRow = (index1: number, index2: number) => {
    if (index1 >= 0 && index1 < target.value.rows.length && index2 >= 0 && index2 < target.value.rows.length) {
        let temp = target.value.rows.splice(index1, 1, target.value.rows[index2]);
        target.value.rows.splice(index2, 1, temp[0]);
    }
};

/**
 * 行削除
 */
const deleteRow = (index: number) => {
    if (typeof window !== 'undefined') {
        if (confirm('削除しますか？')) {
            target.value.rows.splice(index, 1);
        }
    } else {
        console.warn('ブラウザ環境ではありません。');
        target.value.rows.splice(index, 1);
    }
};
</script>

<template>
    <div class="space-y-2 mb-2">
        <label :for="props.name" class="block text-gray-700 text-sm font-bold">
            <slot />
        </label>
        <div>
            <ResumeControlButton @click.stop="addRow()">行追加</ResumeControlButton>
            <ResumeControlButton @click.stop="deleteAllRow()" level="danger">全削除
            </ResumeControlButton>
        </div>
        <template v-for="(row, index) in target.rows">
            <div :class="{
                'border': true,
                'mb-1': true,
                'bg-gray-100': true,
                'p-1': true,
                'rounded': true,
                'flex': !resumeState.resumeVisibility.value,
                'items-left': !resumeState.resumeVisibility.value,
            }">
                <div class="flex items-center mb-1">
                    <input v-model="row['resume-year']" type="text"
                        class="shadow appearance-none border rounded w-20 mr-2 py-1 px-3 text-xs text-gray-700 leading-tight focus:outline-none forcus:shadow-outline"
                        placeholder="年" />
                    <input v-model="row['resume-month']" type="text"
                        class="shadow appearance-none border rounded w-20 mr-2 py-1 px-3 text-xs text-gray-700 leading-tight focus:outline-none forcus:shadow-outline"
                        placeholder="月" />
                </div>
                <div
                    :class="{ 'flex': true, 'items-center': true, 'mb-1': true, 'w-full': !resumeState.resumeVisibility.value, 'pr-2': !resumeState.resumeVisibility.value }">
                    <input v-model="row['resume-text']" type="text"
                        class="shadow appearance-none border rounded w-full py-1 px-3 text-xs text-gray-700 leading-tight focus:outline-none forcus:shadow-outline"
                        placeholder="内容" />
                </div>
                <div class="flex items-center">
                    <ResumeControlButton @click.stop="swapRow(index, index - 1)">上へ
                    </ResumeControlButton>
                    <ResumeControlButton @click.stop="swapRow(index, index + 1)">下へ
                    </ResumeControlButton>
                    <ResumeControlButton level="danger" @click.stop="deleteRow(index)">行削除</ResumeControlButton>
                    <div :class="{ 'pl-1': true, 'text-nowrap': true }">
                        <input v-model="row['right']" type="checkbox" :name="props.name" value="1"
                            :id="`${props.name}-${index}`" :checked="row['right']"
                            class="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500" />
                        <label :for="`${props.name}-${index}`"
                            class="ml-2 text-nowrap text-xs font-medium text-gray-900">右寄せ</label>
                    </div>
                </div>
            </div>
        </template>
    </div>

</template>