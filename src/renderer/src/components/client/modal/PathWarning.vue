<template>
    <div
        class="fixed right-0 top-0 bottom-0 left-0 backdrop-brightness-75 backdrop-blur-sm z-50 items-center flex justify-center">
        <div class="w-[40rem] bg-white h-[20rem] rounded flex flex-col p-4">
            <div class="flex flex-row">
                <p class="font-semibold text-lg">Path Not Found</p>

                <button class="ml-auto" @click="emit('cancel')">X</button>
            </div>

            <div class="flex flex-col gap-4 mt-10">
                <p class="text-sm font-normal text-gray-800 text-justify ">
                    The system could not find the specified file path. Please check that the file is stored on the
                    shared drive and not locally. Make sure you are connected to the shared network, as this feature
                    only works when files are accessible on the shared drive.</p>
                <p class="text-sm font-normal text-gray-800 text-justify ">
                    If the issue continues, contact your system administrator or IT representative for assistance.
                </p>
            </div>
            <div class="flex flex-col gap-2 mt-auto">
                <p class=" font-medium font-mono text-sm flex flex-row gap-2 items-center">Last Saved Path:
                    <span class="text-xs text-gray-800">
                        <div v-if="isSupported">
                            <span v-if="!copied"></span>
                            <span v-else>Copied!</span>
                        </div>

                    </span>

                </p>


                <div class="flex items-center w-full h-10 bg-gray-50 shadow-inner rounded-md px-2 hover:cursor-pointer" @click="copy(path_to_copy)">
                    <p class="text-xs  font-medium text-gray-600" >{{ props.path }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useClipboard } from '@vueuse/core'
import { onMounted, ref } from 'vue';

const path_to_copy = ref()
const { text, copy, copied, isSupported } = useClipboard({ path_to_copy })

onMounted(() => {
    path_to_copy.value = props.path
})

const emit = defineEmits(['cancel'])
const props = defineProps({
    path: String,
})
</script>

<style lang="scss" scoped></style>