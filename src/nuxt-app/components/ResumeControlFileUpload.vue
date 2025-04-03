<script setup lang="ts">
/**
 * 履歴書 コントロール ファイルアップロード コンポーネント
 * 
 * サーバへのアップロードは行わず、Javascript 内から操作可能な File オブジェクトを得るのみ。
 * 
 * @author ggrtn
 */

// props
interface Props {
    formId?: string,
    accept?: string,
    asDataUrl?: boolean,
    buttonLabel?: string,
}
const props = withDefaults(defineProps<Props>(), { formId: 'file-input', accept: '*', asDataUrl: false, buttonLabel: 'アップロード' });

// event
const emit = defineEmits(['upload']);

// states
const selectedFile = ref<File | null>(null);
const isDragOver = ref(false);
const errorMessage = ref('');
const isUploading = ref(false);


/**
 * ドラックオーバーイベントのハンドラ
 * @param event 
 */
const handleDragOver = (event: DragEvent) => {
    isDragOver.value = true;
    event.preventDefault();
};

/**
 * ドラック開始イベントのハンドラ
 * @param event 
 */
const handleDragEnter = (event: DragEvent) => {
    isDragOver.value = true;
    event.preventDefault();
};

/**
 * ドラッグ離脱イベントのハンドラ
 */
const handleDragLeave = () => {
    isDragOver.value = false;
};

/**
 * ドロップイベントのハンドラ
 * @param event 
 */
const handleDrop = (event: DragEvent) => {
    isDragOver.value = false;
    errorMessage.value = '';
    if (event && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length > 0) {
        const file = event.dataTransfer.files[0];
        selectedFile.value = file;
    }
};

/**
 * ファイル変更イベントのハンドラ
 * ※ 「ファイルを選択」ボタンを押して開いたダイアログでファイルを選択したあと
 * @param event 
 */
const handleFileChange = (event: Event) => {
    errorMessage.value = '';
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
        selectedFile.value = target.files[0];
    }
};

/**
 * 選択中のファイルをクリアする
 */
const clearFile = () => {
    selectedFile.value = null;
    errorMessage.value = '';
    const fileInput = document.getElementById(props.formId) as HTMLInputElement;
    if (fileInput) {
        fileInput.value = '';
    }
};

/**
 * ファイルアプロードのハンドラ
 * ※ サーバへのアップロードは行っていない、File オブジェクトを得るのみ
 */
const handleUpload = async () => {
    if (!selectedFile.value) {
        errorMessage.value = 'アップロードするファイルを選択してください。';
        return;
    }

    isUploading.value = true;

    const file = selectedFile.value;
    if (file) {
        // ファイルが存在する場合、FileReader を使ってテキストとして読み込む
        const reader = new FileReader();

        reader.onload = function (e) {
            try {
                // 上流に通知
                if (e && e.target) {
                    // console.log(e.target.result)
                    emit('upload', { data: String(e.target.result) });
                } else {
                    console.error("ファイルのアップロードに失敗しました");
                }
                isUploading.value = false;
            } catch (error) {
                console.error("JSON ファイルのパースに失敗しました:", error);
                isUploading.value = false;
            }
        }

        reader.onerror = function (error) {
            console.error("ファイルの読み込みに失敗しました:", error);
            isUploading.value = false;
        }

        if (props.asDataUrl) {
            reader.readAsDataURL(file);
        } else {
            reader.readAsText(file);
        }
    } else {
        console.error("ファイルが選択されていません");
        isUploading.value = false;
    }
}
</script>

<template>
    <div class="file-upload-container">
        <label :for="props.formId" class="file-upload-label" :class="{ 'drag-over': isDragOver }"
            @dragover.prevent="handleDragOver" @dragenter.prevent="handleDragEnter" @dragleave.prevent="handleDragLeave"
            @drop.prevent="handleDrop">
            <div v-if="!selectedFile">
                <p>ドラッグ＆ドロップでファイルを選択、<br />または</p>
                <p class=" browse-button">ファイルを選択</p>
            </div>
            <div v-else class="file-info">
                <p>選択されたファイル:</p>
                <p class="file-name">{{ selectedFile.name }}</p>
                <button @click="clearFile" class="clear-button">
                    ×
                </button>
            </div>
        </label>
        <input type="file" :id="props.formId" class="file-input" @change="handleFileChange" :accept="props.accept" />
        <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
        </div>
        <div class="button-container">
            <button @click="handleUpload" :disabled="!selectedFile || isUploading">
                {{ props.buttonLabel }}
            </button>
        </div>
    </div>
</template>

<style scoped>
.file-upload-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 2px dashed #ccc;
    border-radius: 10px;
    background-color: #f8f8f8;
    padding-top: 2mm;
    padding-bottom: 2mm;
}

.file-upload-label {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s ease;
    text-align: center;
}

.file-upload-label.drag-over {
    background-color: rgba(0, 123, 255, 0.1);
    border-color: #007bff;
}

.file-upload-label:hover {
    background-color: #e9ecef;
}

.file-input {
    display: none;
}

.file-info {
    display: flex;
    align-items: center;
    width: 100%;
    background-color: #fff;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    margin-top: 10px;
    justify-content: space-between;
}

.file-name {
    margin-right: 10px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: 200px;
}

.browse-button {
    color: #007bff;
    text-decoration: underline;
    cursor: pointer;
    margin-top: 5px;
}

button {
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.2s ease;
    font-size: 1em;
    width: 200px;
}

button:hover {
    background-color: #0056b3;
}

button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

button:hover {
    background-color: #ccc;
}

.clear-button {
    background-color: #dc3545;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 0;
    width: 6mm;
}

.clear-button:hover {
    background-color: #c82333;
}

.error-message {
    color: #dc3545;
    font-size: 0.9em;
}
</style>