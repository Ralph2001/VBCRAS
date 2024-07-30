<template>
    <div class="h-full w-full fixed top-0 bottom-0 right-0 left-0 bg-white items-center flex justify-center z-[99999]">
        <div class="w-full bg-[#525659] flex  absolute  p-4 top-5 z-[99999]">
            <div class="flex flex-row gap-2 items-center">
                <font-awesome-icon icon="fa-solid fa-circle-check"  class="text-gray-400" v-if="status"/>
                <p class="text-sm  text-gray-100 font-medium  italic">{{ status ? 'Data has been saved.' : 'Reviewing' }}
                </p>
            </div>
            <div class="flex flex-row gap-3 ml-auto">
                <button class="border  text-sm bg-white shadow-sm rounded-sm px-3 py-1 tracking-wide"
                    @click="save_print">Save and Print</button>
                <button class="border  text-sm bg-white shadow-sm rounded-sm px-3 py-1 tracking-wide"
                    @click="cancel">Cancel</button>
            </div>
        </div>
        <div
            class="absolute sm:w-[1.5rem] md:lg:w-[2rem] right-0 bg-[#525659] z-[99998] mt-[7.5rem] flex items-center justify-center h-full">
            <button
                class=" text-gray-800 bg-yellow-100 shadow-inner text-sm bg-none outline-none ring-0 rotate-90  font-semibold tracking-widest px-3 py-1 text-nowrap"
                @click="printPDF">Adjustments</button>
        </div>
        <div class="h-full w-full">
            <iframe v-if="pdf" ref="iframeRef" class="h-full w-full " :src="pdf" frameborder="1"
                allowfullscreen=""></iframe>
        </div>
    </div>
</template>

<script setup>
const emit = defineEmits(['cancel-btn', 'save-print']);

const props = defineProps({
    pdf: {
        type: [String, Object, Array],
        default: null
    },
    status: {
        type: Boolean,
        default: false
    }
})

const cancel = () => {
    emit('cancel-btn')
}

const save_print = () => {
    emit('save-print')
}
</script>

<style lang="scss" scoped></style>