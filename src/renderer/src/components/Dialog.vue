<template>
    <div
        class="fixed flex items-center justify-center h-full backdrop-blur-sm backdrop-brightness-50   w-full top-0 z-[999999999] bottom-0 right-0 left-0 ">
        <div class="flex flex-col w-[40rem]  h-[20rem] bg-white border p-4 rounded-lg">
            <div class="flex flex-row items-center justify-center p-2 px-5 gap-4">

                <p class="text-md text-gray-800 font-medium">Are you sure you want to delete this record?
                    This
                    action cannot be undone.</p>
            </div>
            <div class="h-full w-full flex flex-row px-10 gap-3">
                <div class="w-[10rem] flex items-center justify-center">
                    <div
                        class="rounded-full  bg-red-50 w-[7rem] h-[7rem] border border-red-100 flex items-center justify-center">
                        <font-awesome-icon class="text-6xl text-red-400" icon="fa-solid fa-triangle-exclamation" />
                    </div>
                </div>
                <div class="grid grid-cols-3 items-center gap-4 w-full ">
                    <div class=" flex flex-col items-end text-gray-600 text-sm font-semibold gap-2">
                        <p v-for="info in props.data" :key="info">{{ info.label }}</p>
                    </div>

                    <div class=" col-span-2">
                        <div class=" flex flex-col text-gray-800 text-sm font-semibold gap-2">
                            <p v-for="info in props.data" :key="info">{{ info.value }}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="mt-auto ml-auto flex flex-row gap-2 text-gray-700 font-medium">
                <button @click="proceed_job"
                    class="border bg-white shadow-sm hover:shadow-md transition-all rounded-sm px-2.5 hover:bg-red-400 hover:text-white py-1 active:scale-95">Yes,
                    Delete
                    it.</button>
                <button @click="cancel_job"
                    class="border bg-white shadow-sm hover:shadow-md transition-all rounded-sm px-2.5 hover:bg-gray-50 py-1 active:scale-95">Cancel</button>
            </div>
        </div>
    </div>
</template>

<script setup>
const emit = defineEmits(['cancel-dialog', 'proceed-removal'])

const props = defineProps({
    data: Object
})


const cancel_job = () => {
    emit('cancel-dialog')
}
const proceed_job = () => {
    emit('proceed-removal')
}
</script>

<style lang="scss" scoped></style>