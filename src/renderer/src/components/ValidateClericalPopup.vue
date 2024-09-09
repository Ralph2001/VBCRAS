<template>
    <div
        class="fixed top-0 bottom-0 right-0 left-0 z-50 backdrop-blur-sm backdrop-brightness-75 flex justify-center items-center">
        <div class=" h-auto w-[50rem] rounded-md border shadow  bg-white p-7 flex flex-col gap-2">
            <p class="text-lg font-medium text-gray-700">Validate Layout</p>
            <p class="text-justify text-gray-900 font-normal">Before you continue, please check the layout and design of
                the petition. It will open in a program like Microsoft Word so you can fix any mistakes. Once you’re
                done editing, save your changes and close the document. Then, click <span
                    class="font-medium text-lg italic text-blue-600"> "Proceed"</span>.</p>
            <p class="text-justify text-gray-900 font-normal ">
                <span class="font-medium text-lg italic">Please Note:</span> <br> Any changes you make in the document
                won’t
                change the information that will be saved in the database. If something is wrong, please fix it in the
                form, not in Word. We’re only checking the layout. If you find any mistakes with the information, just
                press <span class="font-medium ">"Return"</span> to keep everything the same.


            </p>


            <div class="mt-5 ">
                <p class="text-sm text-gray-600">Document didn't open? <button class="underline text-blue-600"
                        @click="open_file(props.path)">Click
                        Here</button> to open again.</p>
                <p class=" text-xs text-gray-600"> <button class="underline text-blue-600"
                        @click="open_folder_instead(props.path)">Open Folder Instead</button> </p>

            </div>

            <div class="mt-auto flex flex-row items-center gap-1">
                <button type="button" @click="cancel_btn"
                    class="ml-auto border rounded shadow px-3 py-1.5 hover:bg-gray-200 text-sm outline-none ring-0">Return
                    to Form Editor </button>
                <button type="button" @click="proceed"
                    class="border rounded shadow px-3 py-1.5 bg-blue-500 text-white hover:bg-blue-600 text-sm">Proceed</button>
            </div>
        </div>
    </div>
</template>

<script setup>


const emit = defineEmits(['proceed', 'cancel'])

const proceed = () => {
    emit('proceed')
}
const cancel_btn = () => {
    emit('cancel')
}

const props = defineProps({
    path: String,
    default: ''
})

const open_folder_instead = async (path) => {
    await window.ClericalApi.OpenClerical(path)
}
const open_file = async (path) => {
    await window.ClericalApi.OpenClerical(path + `petition.docx`)
}
</script>

<style lang="scss" scoped></style>