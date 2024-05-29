<template>
    <div class="w-full flex flex-col items-center justify-center h-full relative">
        <button type="button" @click="dropdown = !dropdown" ref="mainBtn"
            :class="{ 'bg-gray-600 text-white hover:bg-gray-700': dropdown, 'text-gray-900 bg-white hover:bg-gray-100': !dropdown }"
            class="px-3 py-1 text-sm tracking-wide hover:border-gray-400 active:scale-95  font-medium text-center  rounded-sm  border transition-all focus:outline-none">
            Manage
        </button>

        <div class="h-auto flex flex-col items-start justify-center bg-white z-50  absolute top-[95%] right-0 border shadow-md w-auto"
            v-if="dropdown">
            <button @click="openfolder(props.params.data.filepath)" type="button"
                class=" flex items-start text-md font-medium hover:bg-gray-100 px-5 w-full">Open
                Folder</button>
            <button type="button"
                class=" flex items-start text-md font-medium hover:bg-gray-100 px-5 w-full">Details</button>
            <button type="button"
                class=" flex flex-row justify-center items-center text-md font-medium hover:bg-gray-100 cursor-not-allowed bg-gray-200 text-gray-400 px-5 w-full">
                <font-awesome-icon icon="fa-solid fa-rotate-right " class="me-2" /> <span>Generate Again</span>
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { onClickOutside } from "@vueuse/core";

const mainBtn = ref(null)
onClickOutside(mainBtn, (event) => (dropdown.value = false));
const dropdown = ref(false)

const props = defineProps({
    data: {
        type: Object

    }
})

const openfolder = async (filepath) => {
    const open = await window.ClericalApi.OpenClerical(filepath)

}

</script>

<style lang="scss" scoped></style>