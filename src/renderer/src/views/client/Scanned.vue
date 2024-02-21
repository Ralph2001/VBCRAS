<template>
    <div class="flex flex-col  py-3 relative justify-center" @dragenter="handleDragEnter()">
        <div class="h-[calc(100vh-155px)]">
            <ScannedDatatable title="Scanned Documents" :types="types" :data="Documents.scanned" />
        </div>
        <DropZone v-if="dropzone" @dragleave="handleDragLeave()" @drop="handleDrop" @dragover.prevent />


        <Dialog v-model:visible="visible" modal header="Scanned Document" :style="{ width: '30rem' }"
            :breakpoints="{ '2000px': '75vw', '575px': '90vw' }">
            <div class="flex flex-col gap-2 ">
                <InputField label="Filename" :class="`w-full`" />
            </div>
        </Dialog>
        <!-- Footer -->
        <div class="pr-10  h-auto flex  flex-row bottom-0 fixed w-full left-0 p-2 justify-between items-center mx-auto">
            <div class="flex flex-row items-center gap-2">
                <button class="rounded-full py-2 px-3  active:bg-gray-200 hover:bg-gray-200 ">
                    <font-awesome-icon icon="fa-solid fa-gear" class="text-gray-400" />
                </button>

                <p class="text-sm font-normal text-gray-400 italic">
                    <font-awesome-icon icon="fa-solid fa-desktop" class="text-italic" /> {{ desktop.desktop_name }}
                </p>
            </div>

            <p class="text-sm font-medium text-gray-900 select-all">
                <span class="italic font-normal text-gray-500">As of {{ Documents.asOf }},</span> Total Records (<span
                    class="text-blue-600">{{
                        Number(Documents.totalCount).toLocaleString()
                    }}</span>)
            </p>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useScannedDocuments } from '../../stores/scanned'
import ScannedDatatable from '../../components/client/ScannedDatatable.vue';
import { useComputerStore } from '../../stores/computer';
import DropZone from '../../components/client/DropZone.vue'
import { AuthStore } from '../../stores/clientAuth'
import Dialog from 'primevue/dialog';
import InputField from '../../components/client/InputField.vue';

const auth = AuthStore()
const Documents = useScannedDocuments();
const desktop = useComputerStore();

const visible = ref(true)
const dropzone = ref(false)

const types = ref([
    "Birth", "Death", "Marriage", "Legal", "Other"
])
onMounted(() => {
    Documents.getScanned()
    Documents.getTime()
})


const handleDragEnter = () => {
    dropzone.value = true
}
const handleDragLeave = () => {
    dropzone.value = false
}
function handleDrop(event) {
    event.preventDefault();
    const files = event.dataTransfer.files;

    const uploaded_by = auth.user;
    const device_used = desktop.desktop_name;

    const data = [];
    for (const file of files) {
        if (file.type != "application/pdf") {
            swal({
                icon: "error",
                title: "Upload PDF only!",
                text: "File",
            });
            return;
        }

        data.push({
            name: file.name,
            filepath: file.path.replace('C:\\Users\\' + desktop.desktop_name + '\\', ''),
            type: 'Birth',
            uploaded_by: uploaded_by,
            device_used: device_used,
            year: '2024'
        });

    }

    Documents.multipleAdd(data)
    dropzone.value = false

}

</script>

<style lang="scss" scoped></style>