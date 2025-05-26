<template>
    <div class="w-full flex flex-col items-center justify-center h-full relative ">

        <button type="button" @click="dropdown = !dropdown" ref="mainBtn"
            :class="{ 'bg-[#3255AB]/80 text-white': dropdown, 'bg-[#3255AB] hover:bg-[#3255AB]/80 text-white': !dropdown }"
            class="px-3 py-1 text-sm tracking-wide  active:scale-95  font-medium text-center  rounded   transition-all focus:outline-none">
            Manage
        </button>

        <div class="h-auto flex flex-col items-start justify-center bg-white z-50  absolute top-[95%] right-0 border shadow-md w-[12rem]"
            v-if="dropdown">

            <button type="button" @click="props.params.onViewLocal(props.params.data)"
                class="disabled:bg-gray-100 disabled:hover:cursor-not-allowed flex items-start text-md font-medium hover:bg-gray-100 w-full">
                <div class="w-10 ">
                    <font-awesome-icon icon="fa-solid fa-expand" />

                </div>
                <div class="flex-1  flex text-start px-1">
                    View Document
                </div>
            </button>

            <button type="button" @click="props.params.onCopy(props.params.data)"
                class="disabled:bg-gray-100 disabled:hover:cursor-not-allowed flex items-start text-md font-medium hover:bg-gray-100 w-full">
                <div class="w-10 ">
                    <font-awesome-icon icon="fa-solid fa-copy" />


                </div>
                <div class="flex-1  flex text-start px-1">
                    Copy
                </div>
            </button>
            <button type="button" @click="props.params.onEdit(props.params.data)"
                class="disabled:bg-gray-100 disabled:hover:cursor-not-allowed flex items-start text-md font-medium hover:bg-gray-100 w-full">
                <div class="w-10 ">
                    <font-awesome-icon icon="fa-solid fa-pen-to-square" />


                </div>
                <div class="flex-1  flex text-start px-1">
                    Edit Information
                </div>
            </button>
            <button type="button" @click="props.params.onRemove(props.params.data.id)"
                class="disabled:bg-gray-100 disabled:hover:cursor-not-allowed flex items-start text-md font-medium hover:bg-gray-100 w-full">
                <div class="w-10 ">
                    <font-awesome-icon icon="fa-solid fa-trash" />

                </div>
                <div class="flex-1  flex text-start px-1">
                    Remove
                </div>
            </button>



        </div>
    </div>
</template>

<script setup>
import { onClickOutside } from '@vueuse/core';
import { onMounted, ref } from 'vue';

const props = defineProps({
    params: {
        type: Object,
        required: true
    }
})

const dropdown = ref(false)
const mainBtn = ref(null)
onClickOutside(mainBtn, (event) => (dropdown.value = false));
</script>

<style lang="scss" scoped></style>