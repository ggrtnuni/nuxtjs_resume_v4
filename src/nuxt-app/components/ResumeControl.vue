<script setup lang="ts">
/**
 * 履歴書 コントロール コンポーネント
 * 
 * @author ggrtn
 */

// 履歴書状態
const resumeState = useResumeState();

// コントロール DOM ツリーへの参照
const control = useTemplateRef('control');

const showSectionLoad = ref(false);
const showSectionOption = ref(false);
const showSectionPhoto = ref(false);
const showSectionGeneral = ref(false);
const showSectionHistory = ref(false);
const showSectionLicense = ref(false);
const showSectionMotivation = ref(false);
const showSectionWish = ref(false);

watch(resumeState.resumeVisibility, (newValue, oldValue) => {
    if (newValue === true) {
        if (control.value) {
            control.value.classList.remove('w-full', 'control-wide');
        }
    } else {
        if (control.value) {
            control.value.classList.add('w-full', 'control-wide');
        }
    }
    showSectionLoad.value = !newValue;
    showSectionOption.value = !newValue;
    showSectionPhoto.value = !newValue;
    showSectionGeneral.value = !newValue;
    showSectionHistory.value = !newValue;
    showSectionLicense.value = !newValue;
    showSectionMotivation.value = !newValue;
    showSectionWish.value = !newValue;
});

/**
 * 証明写真を反映 (サイズ調整あり)
 */
const applyIdPhoto = (dataUri: string | null) => {
    if (typeof window !== 'undefined') {
        if (dataUri) {
            // アスペクト比を 3:4 としてトリミング
            const img = new Image();
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (ctx) {
                img.style.display = 'none';
                canvas.style.display = 'none';
                document.body.appendChild(img);
                document.body.appendChild(canvas);

                img.onload = function () {
                    const mimeType = 'image/png';

                    let offsetWidth = 0;
                    let offsetHeight = 0;
                    let cropedWidth = img.naturalWidth;
                    let cropedHeight = img.naturalHeight;
                    if (img.naturalWidth / img.naturalHeight >= (3 / 4)) {
                        // 3/4よりも横長 or 長方形
                        cropedWidth = Math.ceil(img.naturalHeight * (3 / 4));
                        offsetWidth = Math.ceil((img.naturalWidth - cropedWidth) / 2);
                    } else {
                        // 3/4よりも縦長
                        cropedHeight = Math.ceil(img.naturalWidth * (4 / 3));
                        offsetHeight = Math.ceil((img.naturalHeight - cropedHeight) / 2);
                    }

                    // 354 x 472 で保存する (dataUri が長くなりすぎないように)
                    canvas.width = 354;
                    canvas.height = 472;
                    ctx.drawImage(img, offsetWidth, offsetHeight, cropedWidth, cropedHeight, 0, 0, 354, 472);
                    const dataUri = canvas.toDataURL(mimeType);

                    resumeState.resumeIdPhoto.value = dataUri;

                    // 不要になった要素を削除
                    document.body.removeChild(img);
                    document.body.removeChild(canvas);
                }
                img.src = dataUri;
            }
        }
    } else {
        console.warn('ブラウザ環境ではありません。');
    }
}

/**
 * 印刷ボタンのハンドラ
 */
const printPage = () => {
    if (typeof window !== 'undefined') {
        window.print();
    } else {
        console.warn('ブラウザ環境ではありません。');
    }
};

/**
 * 保存(JSON)ボタンのハンドラ
 */
const confirmSave = () => {
    if (typeof window !== 'undefined') {
        // if ($data.isEmpty()) { window.alert('未入力です。'); } else { $data.downloadJSON() }
        const now = new Date();
        const saveFilename = resumeState.resumeSaveFilename.value.length > 0 ? resumeState.resumeSaveFilename.value : 'resume-v4';
        const filename = String(now.getFullYear()) + String(now.getMonth() + 1).padStart(2, '0') + String(now.getDate()).padStart(2, '0')
            + '-' + String(now.getHours()).padStart(2, '0') + String(now.getMinutes()).padStart(2, '0') + String(now.getSeconds()).padStart(2, '0')
            + '-' + saveFilename + '.json';

        const json = resumeState.toJSON();
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url); // メモリリークを防ぐ

    } else {
        console.warn('ブラウザ環境ではありません。');
    }
};

/**
 * 消去ボタンのハンドラ
 */
const confirmClearAll = () => {
    if (typeof window !== 'undefined') {
        if (confirm('記載した履歴書の情報を削除しますか？')) {
            resumeState.empty();
        }
    } else {
        console.warn('ブラウザ環境ではありません。');
    }
};

/**
 * 読込(JSON)のハンドラ
 */
const handleUploadJson = (response: any) => {
    // console.log(response.data)
    const jsonData = JSON.parse(response.data);
    // console.log("展開された JSON データ:", Object.keys(jsonData));
    resumeState.loadResumeFromJson(jsonData);
}

/**
 * 証明写真アップロードのハンドラ
 * @param image 
 */
const handleUploadIdPhoto = (response: any) => {
    applyIdPhoto(response.data);
}
</script>

<template>
    <div class="no-print control" ref="control">
        <div class="float-right text-indigo-500 cursor-pointer"
            @click.stop="resumeState.resumeVisibility.value = !resumeState.resumeVisibility.value">
            {{ resumeState.resumeVisibility.value ? '■' : '×' }}
        </div>
        <span class="tex-gray-700">コントロール</span>
        <div style="font-size: 9pt;margin-bottom: 6mm;">
            <div style="font-size: 9pt;margin-bottom: 6mm;">
                （コントロールは印刷されません）
            </div>
            <hr />
            <div style="font-size: 9pt;margin-bottom: 6mm;">
                <div>
                    <ResumeControlButton v-show="resumeState.resumeVisibility" @click.stop="printPage()">
                        印刷
                    </ResumeControlButton>
                    <ResumeControlButton @click.stop="confirmSave()">
                        保存(JSON)
                    </ResumeControlButton>
                    <ResumeControlButton level="danger" @click.stop="confirmClearAll()">
                        消去
                    </ResumeControlButton>
                </div>
            </div>

            <hr />
            <div style="font-size: 9pt;margin-bottom: 6mm;">
                <div>
                    <div class="flex items-left">
                        <h2 class="text-sm font-bold text-gray-700">読込 (JSON)</h2>
                        <div class="text-sm text-indigo-500 cursor-pointer" @click="showSectionLoad = !showSectionLoad">
                            {{ showSectionLoad ? '▲' : '▼' }}
                        </div>
                    </div>
                    <div v-show="showSectionLoad" x-transition>
                        <!-- <input type="file" id="jsonUpload" accept="application/json"> -->
                        <ResumeControlFileUpload formId="jsonUpload" accept="application/json"
                            @upload="handleUploadJson" buttonLabel="反映" />
                    </div>
                </div>
            </div>

            <hr />
            <div style="font-size: 9pt;margin-bottom: 6mm;">
                <div>
                    <div class="flex items-left">
                        <h2 class="text-sm font-bold text-gray-700">オプション</h2>
                        <div class="text-sm text-indigo-500 cursor-pointer"
                            @click="showSectionOption = !showSectionOption">
                            {{ showSectionOption ? '▲' : '▼' }}
                        </div>
                    </div>
                    <div v-show="showSectionOption" x-transition>
                        <ResumeControlInputRadio v-model="resumeState.resumeCalender" name="resumeCalender" :items="[
                            { 'label': '西暦', 'value': 'en' },
                            { 'label': '和暦', 'value': 'jp' },
                        ]" @change="(value) => { resumeState.resumeCalender.value = value }">
                            年表記
                        </ResumeControlInputRadio>
                        <ResumeControlInputCheckbox v-model="resumeState.resumeContact" name="resumeContact"
                            label="表示する" @change="(value) => { resumeState.resumeContact.value = value }">
                            連絡先
                        </ResumeControlInputCheckbox>
                        <ResumeControlInputText v-model="resumeState.resumeSaveFilename" name="resumeSaveFilename"
                            @input="(value) => { resumeState.resumeSaveFilename.value = value }">
                            保存時のファイル名
                        </ResumeControlInputText>
                    </div>
                </div>
            </div>

            <hr />
            <div style="font-size: 9pt;margin-bottom: 6mm;">
                <div>
                    <div class="flex items-left">
                        <h2 class="text-sm font-bold text-gray-700">証明写真</h2>
                        <div class="text-sm text-indigo-500 cursor-pointer"
                            @click="showSectionPhoto = !showSectionPhoto">
                            {{ showSectionPhoto ? '▲' : '▼' }}
                        </div>
                    </div>
                    <div v-show="showSectionPhoto" x-transition>
                        <!-- <input type="file" id="imageUpload" accept="image/*"> -->
                        <ResumeControlFileUpload formId="imageUpload" accept="image/*" @upload="handleUploadIdPhoto"
                            buttonLabel="反映" :asDataUrl="true" />
                    </div>
                </div>
            </div>

            <hr />
            <div style="font-size: 9pt;margin-bottom: 6mm;">
                <div>
                    <div class="flex items-left">
                        <h2 class="text-sm font-bold text-gray-700">基本情報</h2>
                        <div class="text-sm text-indigo-500 cursor-pointer"
                            @click="showSectionGeneral = !showSectionGeneral">
                            {{ showSectionGeneral ? '▲' : '▼' }}
                        </div>
                    </div>
                    <div v-show="showSectionGeneral" x-transition>
                        <ResumeControlInputText v-model="resumeState.resumeDate" name="resumeDate"
                            @input="(value) => { resumeState.resumeDate.value = value }">
                            記入日
                        </ResumeControlInputText>
                        <ResumeControlInputText v-model="resumeState.resumeNameKana" name="resumeNameKana"
                            @input="(value) => { resumeState.resumeNameKana.value = value }">
                            氏名ふりがな
                        </ResumeControlInputText>
                        <ResumeControlInputText v-model="resumeState.resumeName" name="resumeName"
                            @input="(value) => { resumeState.resumeName.value = value }">
                            氏名
                        </ResumeControlInputText>

                        <ResumeControlInputRadio v-model="resumeState.resumeGender" name="resumeGender" :items="[
                            { 'label': '未回答', 'value': '0' },
                            { 'label': '男', 'value': '1' },
                            { 'label': '女', 'value': '2' },
                        ]" @change="(value) => { resumeState.resumeGender.value = value }">
                            性別
                        </ResumeControlInputRadio>
                        <ResumeControlInputText v-model="resumeState.resumeBirthday" name="resumeBirthday"
                            @input="(value) => { resumeState.resumeBirthday.value = value }">
                            生年月日
                        </ResumeControlInputText>
                        <ResumeControlInputText v-model="resumeState.resumePostalcode" name="resumePostalcode"
                            @input="(value) => { resumeState.resumePostalcode.value = value }">
                            郵便番号
                        </ResumeControlInputText>
                        <ResumeControlInputText v-model="resumeState.resumeAddressKana" name="resumeAddressKana"
                            @input="(value) => { resumeState.resumeAddressKana.value = value }">
                            住所ふりがな
                        </ResumeControlInputText>
                        <ResumeControlInputText v-model="resumeState.resumeAddress" name="resumeAddress"
                            @input="(value) => { resumeState.resumeAddress.value = value }">
                            住所
                        </ResumeControlInputText>
                        <ResumeControlInputText v-model="resumeState.resumeEmail" name="resumeEmail"
                            @input="(value) => { resumeState.resumeEmail.value = value }">
                            E-mail
                        </ResumeControlInputText>
                        <ResumeControlInputText v-model="resumeState.resumeTel" name="resumeTel"
                            @input="(value) => { resumeState.resumeTel.value = value }">
                            自宅電話
                        </ResumeControlInputText>
                        <ResumeControlInputText v-model="resumeState.resumeMobile" name="resumeMobile"
                            @input="(value) => { resumeState.resumeMobile.value = value }">
                            携帯電話
                        </ResumeControlInputText>
                        <ResumeControlInputText v-model="resumeState.resumeContactPostalcode"
                            name="resumeContactPostalcode"
                            @input="(value) => { resumeState.resumeContactPostalcode.value = value }">
                            連絡先郵便番号
                        </ResumeControlInputText>
                        <ResumeControlInputText v-model="resumeState.resumeContactAddressKana"
                            name="resumeContactAddressKana"
                            @input="(value) => { resumeState.resumeContactAddressKana.value = value }">
                            連絡先住所ふりがな</ResumeControlInputText>
                        <ResumeControlInputText v-model="resumeState.resumeContactAddress" name="resumeContactAddress"
                            @input="(value) => { resumeState.resumeContactAddress.value = value }">
                            連絡先住所
                        </ResumeControlInputText>
                        <ResumeControlInputText v-model="resumeState.resumeContactTel" name="resumeContactTel"
                            @input="(value) => { resumeState.resumeContactTel.value = value }">
                            連絡先電話
                        </ResumeControlInputText>
                    </div>
                </div>
            </div>
        </div>

        <hr />
        <div style="font-size: 9pt;margin-bottom: 6mm;">
            <div>
                <div class="flex items-left">
                    <h2 class="text-sm font-bold text-gray-700">学歴・職歴</h2>
                    <div class="text-sm text-indigo-500 cursor-pointer"
                        @click="showSectionHistory = !showSectionHistory">
                        {{ showSectionHistory ? '▲' : '▼' }}
                    </div>
                </div>
                <div v-show="showSectionHistory" x-transition>
                    <ResumeControlTableHistory name="resumeHistory" />
                </div>
            </div>
        </div>

        <hr />
        <div style="font-size: 9pt;margin-bottom: 6mm;">
            <div>
                <div class="flex items-left">
                    <h2 class="text-sm font-bold text-gray-700">免許・資格</h2>
                    <div class="text-sm text-indigo-500 cursor-pointer"
                        @click="showSectionLicense = !showSectionLicense">
                        {{ showSectionLicense ? '▲' : '▼' }}
                    </div>
                </div>
                <div v-show="showSectionLicense" x-transition>
                    <ResumeControlTableHistory name="resumeLicense" />
                </div>
            </div>
        </div>

        <hr />
        <div style="font-size: 9pt;margin-bottom: 6mm;">
            <div>
                <div class="flex items-left">
                    <h2 class="text-sm font-bold text-gray-700">志望動機</h2>
                    <div class="text-sm text-indigo-500 cursor-pointer"
                        @click="showSectionMotivation = !showSectionMotivation">
                        {{ showSectionMotivation ? '▲' : '▼' }}
                    </div>
                </div>
                <div v-show="showSectionMotivation" x-transition>
                    <ResumeControlTextarea v-model="resumeState.resumeMotivation" name="resumeMotivation"
                        @input="(value) => { resumeState.resumeMotivation.value = value }">
                    </ResumeControlTextarea>
                </div>
            </div>
        </div>

        <hr />
        <div style="font-size: 9pt;margin-bottom: 6mm;">
            <div>
                <div class="flex items-left">
                    <h2 class="text-sm font-bold text-gray-700">本人希望記入欄</h2>
                    <div class="text-sm text-indigo-500 cursor-pointer" @click="showSectionWish = !showSectionWish">
                        {{ showSectionWish ? '▲' : '▼' }}
                    </div>
                </div>
                <div v-show="showSectionWish" x-transition>
                    <ResumeControlTextarea v-model="resumeState.resumeWish" name="resumeWish"
                        @input="(value) => { resumeState.resumeWish.value = value }">
                    </ResumeControlTextarea>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@import url('~/assets/css/control.css');
</style>