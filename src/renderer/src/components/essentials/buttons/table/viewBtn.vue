<template>
    <div class="w-full flex flex-col items-center justify-center h-full relative ">

        <Teleport to="body">
            <PathWarning :path="missing_path" v-if="path_missing" @cancel="path_missing = false" />
        </Teleport>

        <PDFViewerCCE v-if="pdf_viewer" :pdf_data="data_pdfs" @exit-btn="pdf_viewer = false" :details="props.params.data" />
        <button type="button" @click="dropdown = !dropdown" ref="mainBtn"
            :class="{ 'bg-gray-600 text-white hover:bg-gray-700': dropdown, 'text-gray-900 bg-white hover:bg-gray-100': !dropdown }"
            class="px-3 py-1 text-sm tracking-wide hover:border-gray-400 active:scale-95  font-medium text-center  rounded-sm  border transition-all focus:outline-none">
            Manage


        </button>

        <div class="h-auto flex flex-col items-start justify-center bg-white z-50  absolute top-[95%] right-0 border shadow-md w-[10rem]"
            v-if="dropdown">
            <button type="button" @click="opendocuments(props.params.data)"
                class=" disabled:bg-gray-100 disabled:hover:cursor-not-allowed flex items-start text-md font-medium hover:bg-gray-100 px-5 w-full">Open
                Document</button>
<!-- 
            <button type="button" @click="openfolder(props.params.data)"
                class=" disabled:bg-gray-100  disabled:hover:cursor-not-allowed flex items-start text-md font-medium hover:bg-gray-100 px-5 w-full">Open
                Folder</button> -->
            <button v-if="user.user_role === 1" type="button" @click="delete_cmd(props.params.data)"
                class=" disabled:bg-gray-100  disabled:hover:cursor-not-allowed flex items-start text-md font-medium hover:bg-gray-100 px-5 w-full">Delete</button>
            <!-- @click="delete_cmd(props.params.data)" -->
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { onClickOutside } from "@vueuse/core";
import { usePetitions } from '../../../../stores/Petition/petitions';
import PDFViewerCCE from '../../../PDFViewerCCE.vue';
import PathWarning from '../../../client/modal/PathWarning.vue';
import { AuthStore } from '../../../../stores/Authentication';


const user = AuthStore()

onMounted(()=>{
    user.isAuthenticated()
})
const path_missing = ref(false)
const missing_path = ref()


const petitions = usePetitions()

const pdf_viewer = ref(false)
const data_pdfs = ref(null)

const mainBtn = ref(null)
onClickOutside(mainBtn, (event) => (dropdown.value = false));
const dropdown = ref(false)

const props = defineProps({
    params: {
        type: Object,
        required: true
    }
})

const opendocuments = async (param) => {
    try {
        const check = await window.ClericalApi.OpenClericalFiles(param.file_path);
        if (!check.error) {
            console.log(check)
            data_pdfs.value = check
            pdf_viewer.value = !pdf_viewer.value
            return
        }
        path_missing.value = true
        missing_path.value = param.file_path
    } catch (error) {
        path_missing.value = true
        missing_path.value = param.file_path
    }
}

// const openfolder = async (param) => {
//     try {
//         const open = await window.ClericalApi.OpenClerical(param.file_path)
//     } catch (error) {
//         console.log(error)
//         path_missing.value = true
//         missing_path.value = param.file_path
//     }
// }

const delete_cmd = async (data) => {
    const id = Number(data.id)
    const remove_data = await petitions.remove_petition(id)
}

</script>

<style lang="scss" scoped></style>