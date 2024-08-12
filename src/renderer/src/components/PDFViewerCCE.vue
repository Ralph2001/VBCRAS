<template>
    <div class="h-full w-full fixed top-0 bottom-0 right-0 left-0 bg-white items-center flex justify-center z-[99999]">
        <div class="w-full bg-[#525659] flex  absolute  p-4 top-5 z-[99999]">
            <div class="flex flex-row gap-2 items-center">
                <p class="text-sm  text-gray-100 font-medium  italic">
                    Correction of Clerical Error - Ralph Advincula Villanueva
                </p>
            </div>
            <div class="flex flex-row gap-3 ml-auto">
                <!-- <button class="border  text-sm bg-white shadow-sm rounded-sm px-3 py-1 tracking-wide">Print All</button> -->
                <button class="border  text-sm bg-white shadow-sm rounded-sm px-3 py-1 tracking-wide"
                    v-if="active_pdf_link" @click="printPDF">Print</button>
                <button @click="exit_btn"
                    class="border  text-sm bg-white shadow-sm rounded-sm px-3 py-1 tracking-wide">Exit</button>
            </div>
        </div>
        <div class="absolute top-[5rem] left-5 w-[20rem] p-2 px-6 items-center gap-2  z-[9999999] flex flex-col">
            <button @click="change_active_pdf(item.name, item.link)" v-for="item in pdfs" :key="item"
                :class="[active_pdf === item.name ? 'bg-blue-500 text-white ' : 'bg-white']"
                class="p-2 shadow-inner outline-none ring-0 w-full font-medium text-sm rounded-sm flex items-start">
                {{ item.name }}
            </button>
        </div>

        <div class="absolute right-0 w-[2rem] h-full block bg-[#525659] ">

        </div>
        <div class="h-full w-full bg-[#525659] items-center flex justify-center">
            <div class=" z-[9999999]" v-if="!active_pdf_link">
                <p class="text-white italic">Select Option Above</p>
            </div>

            <iframe ref="iframeRef" class="h-full w-full" v-if="active_pdf_link" :src="base64(active_pdf_link)"
                frameborder="1" allowfullscreen=""></iframe>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';


const emit = defineEmits(['cancel-btn', 'save-print', 'exit-btn']);

const props = defineProps({
    pdf: {
        type: [String, Object, Array],
        default: null
    },
    status: {
        type: Boolean,
        default: false
    },
    pdf_data: {
        type: [Array, Object, String],

    }
})

function base64(data) {
    return 'data:application/pdf;filename=generated.pdf;base64,' + data
}
const pdfs = ref(props.pdf_data)
const active_pdf = ref(null)
const active_pdf_link = ref(null)


const change_active_pdf = (name, link) => {
    active_pdf.value = name
    active_pdf_link.value = link
}

const cancel = () => {
    emit('cancel-btn')
}

const save_print = () => {
    emit('save-print')
}

const exit_btn = () => {
    emit('exit-btn')
}

const printPDF = async () => {
    const base64Data = active_pdf_link.value
    const open = await window.LocalCivilApi.printPDFBase64(base64Data)
}

</script>

<style lang="scss" scoped></style>