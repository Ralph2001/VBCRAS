<template>
    <div class="fixed top-0 bottom-0 left-0 right-0 z-50 bg-black bg-opacity-50 flex items-center p-4 min-w-md justify-center"
        role="dialog" aria-modal="true" aria-labelledby="modal-title" aria-describedby="modal-description">

        <div class="h-auto py-6 w-[50rem] rounded bg-white flex flex-col p-4">
            <p class="font-medium text-2xl">⚠️ Warning!</p>
            <div class="mt-2 px-6 flex flex-col">
                <p class=" text-md mt-1">Petition Number: <span class="font-semibold text-gray-800">{{
                    props.data.petition_number }}</span></p>
                <p class=" text-md mt-1">Petitioner Name: <span class="font-semibold text-gray-800">{{
                    props.data.petitioner_name }}</span></p>
                <p class=" text-md mt-1">Petition Type: <span class="font-semibold text-gray-800">{{
                    props.data.petition_type }}</span></p>
                <p class=" text-md mt-1">Event Type: <span class="font-semibold text-gray-800">{{
                    props.data.event_type }}</span></p>
            </div>

            <p class="mt-4 text-md font-sans px-6 text-justify">
                You can use this option if the previously generated files contain **errors** or some files were **not
                generated correctly**.
            </p>
            <p class="mt-4 text-md font-sans px-6 text-justify">
                Regenerating the document will <span class="font-medium text-red-500">permanently overwrite</span> the
                existing file. This action **cannot be undone**.
                Please ensure that <span class="font-medium">all open Word documents are closed</span> before proceeding
                to prevent file conflicts or corruption.
            </p>

            <p class="mt-4 text-md font-sans px-6 text-justify">
                The **dates and existing data will remain unchanged** as stored in the database.
                If you need to modify the dates or any other details, please <span class="font-medium">edit them
                    first</span>
                before regenerating the document.
            </p>

       

            <p class="mt-4 text-md font-sans px-6 text-justify text-red-500 font-medium">
                ⚠️ **Double-check all details before proceeding!**
            </p>

            <div class="mt-auto flex flex-row gap-2 justify-end">
                <button @click="emits('cancel')"
                    class="rounded outline-none ring-0 py-1.5 px-2 bg-red-500 text-white font-medium hover:bg-red-600">
                    Cancel</button>
                <button @click="emits('proceed')"
                    class="rounded outline-none ring-0 py-1.5 px-2 bg-green-500 hover:bg-green-600 font-medium text-white">
                    Proceed</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';

const emits = defineEmits(['cancel', 'proceed'])

const props = defineProps({
    data: Object
})

onMounted(() => {
    console.log(props.data)
})
</script>

<style lang="scss" scoped></style>
