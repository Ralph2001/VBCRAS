<template>
    <div class="flex flex-row justify-between w-full h-[3rem] items-center p-1">
        <p
            :class="{
                'font-semibold': isBold,
                ' text-md font-normal ': !isBold,
            }"
            class="antialiased text-md tracking-wide"
        >
            <slot></slot>
            {{ label }}
        </p>
        <div class="text-end flex items-center justify-center">
            <Loading v-if="isLoading" />
            <OpenFile
                :isLoading="LoadingBtn"
                :label="isFolder ? 'Open Folder' : 'Open'"
                v-if="!isLoading"
                :isFolder="props.isFolder"
                @click="open(props.filepath)"
            />
        </div>
    </div>
</template>

<script setup>
import OpenFile from '../buttons/OpenFile.vue'
import Loading from '../others/Loading.vue'
import { ref } from 'vue'
const props = defineProps({
    label: {
        type: String,
        required: true,
    },
    isLoading: {
        type: Boolean,
        default: false,
        required: true,
    },
    openLink: {
        type: [String, Number],
        default: '',
    },
    isBold: {
        type: Boolean,
        default: false,
    },
    isFolder: {
        type: Boolean,
        default: false,
    },
    filepath: {
        type: String,
        default: null,
    },
})

const LoadingBtn = ref()

const open = async (filepath) => {
    LoadingBtn.value = true
    const open = await window.ClericalApi.OpenClerical(filepath)
    if (open) {
        LoadingBtn.value = false
    }
}
</script>
