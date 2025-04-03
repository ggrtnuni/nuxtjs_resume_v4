<script setup lang="ts">
/**
 * 履歴書 履歴一覧 コンポーネント
 * 
 * @author ggrtn
 */

// props
interface Props {
    name: string,
    top: number,
    step?: number,
    unit?: string,
    maxNumRows: number,
}
const props = withDefaults(defineProps<Props>(), { step: 6, unit: 'mm' });

// 履歴書状態
const resumeState = useResumeState();

// 上流から受け取った name の値によってデータソースを「学歴・職歴」「免許・資格」のどちらかに切り替える。
let target = resumeState.resumeHistory;
let subtitle = '学歴・職歴';
if (props.name === 'resumeLicense') {
    target = resumeState.resumeLicense;
    subtitle = '免許・資格';
}
</script>

<template>
    <div class="table">
        <div class="table-header">
            <div class="resume-year" :style="{ 'top': props.top + props.unit }">
                年
            </div>
            <div class="resume-month" :style="{ 'top': props.top + props.unit }">
                月
            </div>
            <div class="resume-text" :style="{ 'top': props.top + props.unit }">
                {{ subtitle }}
            </div>
        </div>

        <div class="table-body">
            <template v-for="(row, index) in target.rows">
                <div v-if="index < maxNumRows" class="row">
                    <div class="resume-year"
                        :style="{ 'top': (props.top + props.step + index * props.step) + props.unit }">
                        {{ format.year(resumeState.resumeCalender.value, row['resume-year']) }} {{
                            String(row['resume-year']).length > 0 ? '年' : '' }}
                    </div>
                    <div class="resume-month"
                        :style="{ 'top': (props.top + props.step + index * props.step) + props.unit }">
                        {{ row['resume-month'] }}
                    </div>
                    <div class="resume-text"
                        :style="{ 'top': (props.top + props.step + index * props.step) + props.unit, 'text-align': row['right'] ? 'right' : 'inherit' }">
                        {{ row['resume-text'] }}
                    </div>
                </div>
            </template>
            <template v-for="index in (maxNumRows - target.rows.length > 0 ? maxNumRows - target.rows.length : 0)">
                <div class="row">
                    <div class="resume-year"
                        :style="{ 'top': (props.top + props.step + (target.rows.length + index - 1) * props.step) + props.unit }">
                    </div>
                    <div class="resume-month"
                        :style="{ 'top': (props.top + props.step + (target.rows.length + index - 1) * props.step) + props.unit }">
                    </div>
                    <div class="resume-text"
                        :style="{ 'top': (props.top + props.step + (target.rows.length + index - 1) * props.step) + props.unit }">
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<style scoped>
@import url('~/assets/css/resume.css');
</style>