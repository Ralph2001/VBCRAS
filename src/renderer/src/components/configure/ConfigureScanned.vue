<template>
    <div class="flex flex-col h-full">
        <div class="flex flex-col p-4 px-10 border gap-4 items-center">
            <div class="flex flex-col">
                <p class="font-mono">Add Document Types <span class="italic">ex. Birth</span></p>
                <p class="font-mono text-xs italic text-gray-800">Note: You can add later</p>
            </div>
            <div class="flex flex-row w-[20rem] gap-2">
                <input type="text" class="w-full rounded border-gray-200 font-medium" v-model="data">
                <button class="px-2 border hover:bg-gray-100 transition-all" @click="add">Add</button>
            </div>

            <div class="h-[15rem] bg-gray-50 w-[20rem] overflow-y-scroll shadow-inner p-3 gap-1 flex flex-col">
                <p v-for="type in setup.scanned_types" :key="type.id" class="font-semibold p-1 hover:bg-blue-50">
                    {{ type.name }}
                </p>
            </div>
        </div>
        <p class="text-2xl p-4">How it works?</p>
        <div class="flex flex-col gap-2 mt-2 px-10 text-justify text-pretty text-gray-800 tracking-wide">

            <p class="">The <span class="font-bold"> scanned documents system</span> is specifically designed
                to
                handle PDF files, ensuring a streamlined and
                organized approach to document management. Unlike traditional systems that save the actual files, this
                system only stores the file paths. This means that the original PDF files remain on the local server
                storage, making them easily accessible to other users. By using local server storage, the system ensures
                that all users can access and share the documents efficiently.
            </p>
            <p>
                Here's how the system works in detail: Users can drag and drop one or more PDF files into the system.
                Once
                the files are uploaded, users are prompted to define important details such as the document type, the
                year,
                and the month. This categorization helps in better searching and organizing the documents later on.
            </p>
            <p> Another key feature of the system is its ability to track user interactions with the PDFs. It saves
                records
                of who views each PDF and who prints them. This tracking functionality is particularly useful for
                maintaining accountability and ensuring that the usage of sensitive documents is monitored. By knowing
                who
                accessed or printed a document, organizations can enhance their security and compliance measures.</p>
            <p> However, it's important to note that the system relies on the integrity of the stored file paths. If a
                PDF
                file is deleted, moved, or renamed, the path stored in the system will no longer be valid, and the
                document
                will not be accessible through the system. This highlights the importance of maintaining a stable and
                consistent file storage environment. Users and administrators need to be aware of these limitations to
                ensure smooth operation and avoid issues related to missing files.</p>
            <p> In summary, the scanned documents system provides a robust and user-friendly solution for managing PDF
                files. By storing file paths instead of the actual files, it optimizes storage and access. The
                drag-and-drop
                feature, along with detailed categorization options, makes organizing documents simple and efficient.
                Additionally, the system’s ability to log user interactions with the PDFs adds an extra layer of
                accountability and security. However, maintaining the integrity of file paths is crucial for the
                system's
                effectiveness, as any changes to the original files can disrupt access and functionality.</p>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useSetup } from '../../stores/Setting/setup';

const setup = useSetup()
const data = ref()

onMounted(() => {
    setup.getScannedType()
})
const add = () => {
    const name = data.value
    if (data.value === '' || data.value == null) {
        return
    }
    const add = setup.addScannedType({ name })
    if (add) {
        data.value = ''
    }
}

</script>

<style lang="scss" scoped></style>