<template>
    <div
        class="w-full flex flex-col items-center justify-center h-full relative"
    >
        <Teleport to="body">
            <PathWarning
                :path="missing_path"
                v-if="path_missing"
                @cancel="path_missing = false"
            />
        </Teleport>

        <Teleport to="body" v-if="isDialogVisible">
            <Transition>
                <Dialog
                    :data="data_information"
                    @cancel-dialog="cancel_removal"
                    @proceed-removal="proceed_removal"
                />
            </Transition>
        </Teleport>

        <PDFViewerCCE
            v-if="pdf_viewer"
            :pdf_data="data_pdfs"
            @exit-btn="pdf_viewer = false"
            :details="props.params.data"
        />
        <button
            type="button"
            @click="dropdown = !dropdown"
            ref="mainBtn"
            :class="{
                'bg-gray-600 text-white hover:bg-gray-700': dropdown,
                'text-gray-900 bg-white hover:bg-gray-100': !dropdown
            }"
            class="px-3 py-1 text-sm tracking-wide hover:border-gray-400 active:scale-95 font-medium text-center rounded-sm border transition-all focus:outline-none"
        >
            Manage
        </button>

        <div
            class="h-auto flex flex-col items-start justify-center bg-white z-50 absolute top-[95%] right-0 border shadow-md w-[12rem]"
            v-if="dropdown"
        >
            <button
                type="button"
                @click="approve_petition()"
                v-if="props.params.data.status === 'PENDING'"
                class="disabled:bg-gray-100 bg-yellow-200 hover:bg-yellow-300 items-center disabled:hover:cursor-not-allowed flex text-md font-medium w-full"
            >
                <div class="w-10">
                    <font-awesome-icon icon="fa-solid fa-plus" />
                </div>
                <div class="flex-1 flex text-start px-1">
                    <p>Create Finality</p>
                </div>
            </button>
            <button
                type="button"
                @click="opendocuments(props.params.data)"
                class="disabled:bg-gray-100 disabled:hover:cursor-not-allowed flex items-start text-md font-medium hover:bg-gray-100 w-full"
            >
                <div class="w-10">
                    <font-awesome-icon icon="fa-solid fa-expand" />
                </div>
                <div class="flex-1 flex text-start px-1">
                    <p>View Document</p>
                </div>
            </button>
            <button
                type="button"
                @click="props.params.onClick(props.params.data)"
                class="disabled:bg-gray-100 disabled:hover:cursor-not-allowed flex items-start text-md font-medium hover:bg-gray-100 w-full"
            >
                <div class="w-10">
                    <font-awesome-icon icon="fa-solid fa-pen-to-square" />
                </div>
                <div class="flex-1 flex text-start px-1">
                    <p>Edit Document</p>
                </div>
            </button>

            <button
                type="button"
                @click="props.params.onRegenerate(props.params.data)"
                class="disabled:bg-gray-100 disabled:hover:cursor-not-allowed flex items-start text-md font-medium hover:bg-gray-100 w-full"
            >
                <div class="w-10">
                    <font-awesome-icon icon="fa-solid fa-arrows-rotate" />
                </div>
                <div class="flex-1 flex text-start px-1">
                    <p>ReGenerate</p>
                </div>
            </button>

            <button
                v-if="
                    user.user_role === 1 ||
                    user.user_id === props.params.data.created_by
                "
                type="button"
                @click="removeItem()"
                class="disabled:bg-gray-100 disabled:hover:cursor-not-allowed flex items-center text-md font-medium hover:bg-red-500 hover:text-white w-full"
            >
                <div class="w-10">
                    <font-awesome-icon icon="fa-solid fa-trash" />
                </div>
                <div class="flex-1 flex text-start px-1">
                    <p>Delete</p>
                </div>
            </button>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { usePetitions } from '../../../../stores/Petition/petitions'
import PDFViewerCCE from '../../../PDFViewerCCE.vue'
import PathWarning from '../../../client/modal/PathWarning.vue'
import { AuthStore } from '../../../../stores/Authentication'
import Dialog from '../../../Dialog.vue'
import { format } from 'date-fns'
import { useRouter } from 'vue-router'

const router = useRouter()
const user = AuthStore()

onMounted(() => {
    user.isAuthenticated()
})

const approve_petition = () => {
    router.push('/pages/cce_approval/' + props.params.data.id)
}

const isDialogVisible = ref(false)

const removeItem = () => {
    isDialogVisible.value = true
}

const cancel_removal = () => {
    isDialogVisible.value = false
}
const proceed_removal = async () => {
    const id = Number(props.params.data.id)
    const remove_data = await petitions.remove_petition(id)
}

const path_missing = ref(false)
const missing_path = ref()

const petitions = usePetitions()

const pdf_viewer = ref(false)
const data_pdfs = ref(null)

const mainBtn = ref(null)
onClickOutside(mainBtn, (event) => (dropdown.value = false))
const dropdown = ref(false)

const props = defineProps({
    params: {
        type: Object,
        required: true
    }
})

const data_information = ref([
    {
        label: 'Type:',
        value: `${props.params.data.republic_act_number} ${props.params.data.petition_type} ${props.params.data.event_type}`
    },
    { label: 'Petition Number:', value: props.params.data.petition_number },
    {
        label: 'Document Owner:',
        value:
            props.params.data.document_owner === 'N/A'
                ? props.params.data.petitioner_name
                : props.params.data.document_owner
    },
    { label: 'Affiant Name:', value: props.params.data.petitioner_name },
    {
        label: 'Created at:',
        value: format(props.params.data.created_at, 'PPpp')
    },
    { label: 'Prepared by:', value: props.params.data.created_by_user.username }
])

const opendocuments = async (param) => {
    try {
        const check = await window.ClericalApi.OpenClericalFiles(
            param.file_path
        )
        console.log(check)
        if (check.length) {
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

const delete_cmd = async (data) => {
    const id = Number(data.id)
    const remove_data = await petitions.remove_petition(id)
}
</script>

<style lang="scss" scoped></style>
