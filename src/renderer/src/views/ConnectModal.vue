<template>
    <div tabindex="-1"
        class="fixed top-0 bottom-0 right-0 left-0 z-50 backdrop-blur-sm backdrop-brightness-95 flex items-center justify-center">
        <div class="w-[40rem] h-[20rem] flex flex-col border bg-white rounded p-10 relative shadow-sm">
            <div class="flex flex-row  ">
                <p class="font-medium text-lg"> Connect Local Network</p>
                <button class="right-4 top-2 ml-auto hover:bg-red-500 hover:text-white w-8 h-8 rounded-full" title="close" @click="emit('close-connect-modal')">X</button>
            </div>
            <div class="h-full flex flex-col p-2  w-full items-center  ">
                <slot name="body"></slot>
            </div>
            <div class="mt-auto  flex  w-full p-2 ">
                <button
                    class="w-max shadow-sm px-2.5 py-1 rounded ml-auto active:scale-95 hover:bg-blue-600 font-medium bg-blue-500 text-white text-sm"
                    @click="emit('connect-to-ip')">Connect</button>

            </div>
        </div>

    </div>
</template>

<script setup>
import { ref } from 'vue';
const connectText = ref('Connect')
const emit = defineEmits(['close-connect-modal', 'connect-to-ip'])
</script>

<style lang="scss" scoped></style>