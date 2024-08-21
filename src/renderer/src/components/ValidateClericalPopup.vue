<template>
    <div
        class="fixed top-0 bottom-0 right-0 left-0 z-50 backdrop-blur-sm backdrop-brightness-75 flex justify-center items-center">
        <div class=" h-auto w-[50rem] rounded-md border shadow  bg-white p-7 flex flex-col gap-2">
            <p class="text-lg font-medium text-gray-700">Validate Layout</p>
            <p class="text-justify text-gray-900 font-normal">Check the output layout and design before proceeding. The petition
                will open in Microsoft Word or another editor for you to fix any errors. After editing, save and close
                the document completely, then click 'Proceed'.</p>

            <p class="text-justify text-gray-900 font-normal">Use <span class="font-medium">'Save'</span>, not<span class="font-medium"> 'Save As'</span>, and make sure to close the
                document before clicking <span class="font-medium">'Proceed'</span> to avoid system errors that could lead to data loss.</p>

            <p class="text-justify text-gray-900 font-normal mt-5">
                <span class="font-medium text-lg">Please Note:</span> <br> Changes made in the document won't update the data that
                will be inserted into the database. If the data is incorrect, fix it in the input form, not in Word. The
                validation is for layout only. Press 'Return' if the data is wrong to keep everything consistent.
            </p>


            <p class="mt-5 text-sm text-gray-600">Document didn't open? <button class="underline text-blue-600">Click Here</button> to try
                again.</p>


            <div class="mt-auto flex flex-row items-center gap-2">
                <button type="button" @click="cancel_btn"
                    class="ml-auto border rounded shadow px-2 py-1.5 bg-red-500 text-white hover:bg-red-600 text-sm">Return</button>
                <button type="button" @click="proceed"
                    class="border rounded shadow px-2 py-1.5 bg-green-500 text-white hover:bg-green-600 text-sm">Proceed</button>
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
</script>

<style lang="scss" scoped></style>