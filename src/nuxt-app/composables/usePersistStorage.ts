import { ref, watch } from 'vue';
import { type Serializer, StorageSerializers, useStorage } from '@vueuse/core';

interface UseLocalStorageOptions<T> {
    // serializer?: StorageSerializers<T>;
    serializer?: Serializer<T>;
    immediate?: boolean;
    deep?: boolean;
    once?: boolean;
    prefix?: string;
    session?: boolean;
}

export function usePersistStorage<T>(key: string, initialValue: T, options: UseLocalStorageOptions<T> = {}) {
    const {
        serializer = StorageSerializers.object,
        immediate = true,
        deep = true,
        once = false,
        prefix = '',
        session = false,
    } = options;

    const storedValue = ref<T>(initialValue);

    if (typeof window !== 'undefined') {
        let storage = localStorage;
        let storageName = 'localStorage';
        if (session) {
            storage = sessionStorage;
            storageName = 'sessionStorage';
        }

        const stored = storage.getItem(prefix + key);
        if (stored !== null) {
            try {
                storedValue.value = serializer.read(stored);
            } catch (error) {
                console.error(`Failed to parse ${storageName} value for key "${prefix + key}".`, error);
                storage.removeItem(prefix + key);
            }
        }
    }

    const updateStorage = () => {
        if (typeof window !== 'undefined') {
            let storage = localStorage;
            let storageName = 'localStorage';
            if (session) {
                storage = sessionStorage;
                storageName = 'sessionStorage';
            }

            try {
                const serialized = serializer.write(storedValue.value);
                storage.setItem(prefix + key, serialized);
            } catch (e) {
                console.error(`Failed to set ${storageName} value for key "${prefix + key}".`, e);
            }
        }
    };

    watch(storedValue, updateStorage, {
        immediate,
        deep,
        once,
    });

    return storedValue;
}