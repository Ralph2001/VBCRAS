<template>
    <div tabindex="-1" class="fixed top-0 bottom-0 right-0 left-0 z-50  flex items-center justify-center backdrop-brightness-75">
        <div class="w-[40rem] h-auto flex flex-col border border-gray-400 bg-white rounded p-10 relative shadow-sm">
            <div class="flex flex-row  ">
                <p class="font-medium text-lg"> Connect Local Network</p>
                <button class="right-4 top-2 ml-auto hover:bg-red-500 hover:text-white w-8 h-8 rounded-full"
                    title="close" @click="emit('close-connect-modal')">X</button>
            </div>
            <div class="h-full flex flex-col  w-full items-center ">
                <slot name="body"></slot>
            </div>
            <div class="mt-auto  flex  w-full p-2 ">
                <slot name="footer"></slot>

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