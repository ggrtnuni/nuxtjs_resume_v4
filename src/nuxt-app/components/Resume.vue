<script setup lang="ts">

/**
 * 履歴書 コンポーネント
 * 
 * @author ggrtn
 */

// 履歴書状態
const resumeState = useResumeState();

/**
 * 証明写真を反映する
 * @param dataUri 
 */
const applyIdPhoto = async (dataUri: string) => {
    if (typeof window !== 'undefined') {
        await nextTick(); // DOM 描画後を待つ
        const imagePreview = document.querySelector('.resume-photo-img');
        if (imagePreview) {
            if (dataUri && dataUri.length > 0) {
                if (imagePreview) {
                    imagePreview.innerHTML = '';

                    const photoImage = document.createElement('img');
                    photoImage.src = dataUri;
                    imagePreview.append(photoImage);
                }
            } else {
                imagePreview.innerHTML = '';
            }
        }
    }
}

// 証明写真の反映
watch(resumeState.resumeIdPhoto, (newValue, oldValue) => {
    applyIdPhoto(newValue);
}, { immediate: true, deep: true, once: false });
</script>

<template>
    <div>
        <article v-show="resumeState.resumeVisibility.value" class="resume container" ref="resume">
            <div class="page">
                <div class="page-content relative">
                    <div class="resume-photo-img"></div>

                    <section class="panel resume-info-meta">
                        <h1 class="resume-title">履歴書</h1>
                        <div class="resume-date">{{ resumeState.resumeDateText() }}</div>
                    </section>

                    <section class="panel resume-info-general">
                        <ResumeCard class="resume-name-kana" label="ふりがな" :value="resumeState.resumeNameKana" />
                        <ResumeCard class="resume-name" label="氏名" :value="resumeState.resumeName" />
                        <ResumeCard class="resume-gender" label="性別" :value="resumeState.resumeGenderText()" />
                        <ResumeCard class="resume-birthday" label="生年月日" :value="resumeState.resumeBirthdayText()" />
                        <ResumeCard class="resume-address-kana" label="ふりがな" :value="resumeState.resumeAddressKana" />
                        <ResumeCard class="resume-address" label="現住所" :value="resumeState.resumeAddressText()"
                            :preLike="true" />
                        <ResumeCard class="resume-email" label="E-mail" :value="resumeState.resumeEmail"
                            :contactEffectLabel="true" :contactEffectValue="true" />
                        <ResumeCard class="resume-tel" label="自宅電話" :value="resumeState.resumeTel" />
                        <ResumeCard class="resume-mobile" label="携帯電話" :value="resumeState.resumeMobile"
                            :contactEffectValue="true" />
                        <div v-show="resumeState.resumeContact.value">
                            <ResumeCard class="resume-contact-address-kana" label="ふりがな"
                                :value="resumeState.resumeContactAddressKana" />
                            <ResumeCard class="resume-contact-address" label="連絡先"
                                :value="resumeState.resumeContactAddressText()" :preLike="true" />
                            <ResumeCard class="resume-contact-tel" label="連絡先電話"
                                :value="resumeState.resumeContactTel" />
                        </div>
                    </section>

                    <section class="panel resume-info-history">
                        <ResumeTableHistory class="resume-history" name="resumeHistory"
                            :maxNumRows="26 + (resumeState.resumeContact.value ? 0 : 3)"
                            :top="90 - (resumeState.resumeContact.value ? 0 : 18)" />
                    </section>
                </div>
            </div>

            <div class="page">
                <div class="page-content">
                    <section class="panel resume-info-license">
                        <ResumeTableHistory class="resume-license" name="resumeLicense" :maxNumRows="10" :top="0" />
                    </section>

                    <section class="panel resume-info-motivation">
                        <ResumeCard class="resume-motivation" label="志望の動機、特技、好きな学科、アピールポイントなど"
                            :value="resumeState.resumeMotivation" :preLike="true" />
                    </section>

                    <section class="panel resume-info-wish">
                        <ResumeCard class="resume-wish" label="本人希望記入欄（特に給料・職種・勤務時間・勤務地・その他についての希望などがあれば記入）"
                            :value="resumeState.resumeWish" :preLike="true" />
                    </section>
                </div>
            </div>
        </article>
    </div>
</template>

<style scoped>
@import url('~/assets/css/resume.css');
</style>