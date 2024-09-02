<template>
    <div class="w-full flex flex-col items-center justify-center h-full relative">
        <button type="button" @click="dropdown = !dropdown" ref="mainBtn"
            :class="{ 'bg-gray-600 text-white hover:bg-gray-700': dropdown, 'text-gray-900 bg-white hover:bg-gray-100': !dropdown }"
            class="px-3 py-1 text-sm tracking-wide hover:border-gray-400 active:scale-95  font-medium text-center  rounded-sm  border transition-all focus:outline-none">
            Manage
        </button>

        <div class="h-auto flex flex-col items-start justify-center bg-white z-50  absolute top-[95%] right-0 border shadow-md w-[10rem]"
            v-if="dropdown">
            <button type="button" disabled
                class=" disabled:bg-gray-100 disabled:hover:cursor-not-allowed flex items-start text-md font-medium hover:bg-gray-100 px-5 w-full">Open
                Document</button>
            <button type="button" disabled
                class=" disabled:bg-gray-100  disabled:hover:cursor-not-allowed flex items-start text-md font-medium hover:bg-gray-100 px-5 w-full">Open
                Folder</button>
            <button type="button" @click="delete_cmd(props.params.data)"
                class=" disabled:bg-gray-100  disabled:hover:cursor-not-allowed flex items-start text-md font-medium hover:bg-gray-100 px-5 w-full">Delete</button>
            <!-- @click="delete_cmd(props.params.data)" -->
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { onClickOutside } from "@vueuse/core";
import { usePetitions } from '../../../../stores/Petition/petitions';

const petitions = usePetitions()

const mainBtn = ref(null)
onClickOutside(mainBtn, (event) => (dropdown.value = false));
const dropdown = ref(false)

const props = defineProps({
    params: {
        type: Object,
        required: true
    }
})

const openfolder = async (filepath) => {
    const open = await window.ClericalApi.OpenClerical(filepath)
}

const delete_cmd = async (data) => {
    const id  = Number(data.id)
    const remove_data = await petitions.remove_petition(id)

}

</script>

<style lang="scss" scoped></style>