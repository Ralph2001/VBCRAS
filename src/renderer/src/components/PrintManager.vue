<template>
    <PrinterDialog v-if="print" :pdfBase64="printBase64" @close="print = false" :defaultPageSize="'Long Coupon'"
        :maxPageSize="maxPageRange" />

    <PrinterPageDialog v-if="isselectPage" :pdfBase64="printBase64" @close="isselectPage = false" />

    <div class="flex flex-row gap-0 items-center relative">
        <button
            class="text-white hover:text-white hover:bg-green-600 gap-3 rounded-l text-sm bg-green-500 shadow-sm outline-none font-medium px-4 py-1.5 tracking-wide flex flex-row items-center"
            v-if="props.active_pdf_link" @click="printPDF">
            <font-awesome-icon icon="fa-solid fa-print" class="text-lg" />
            <div class="flex flex-col items-start">

                <p class="text-xs">Print Active Document </p>
            </div>
        </button>
        <button
            class="text-white border-l border-green-700 hover:text-white hover:bg-green-700 rounded-r gap-3 text-sm bg-green-600 shadow-sm outline-none font-medium px-4 py-1.5 tracking-wide flex flex-row items-center"
            v-if="props.active_pdf_link" @click="managePrinterMethod">
            <font-awesome-icon icon="fa-solid fa-gear" class="text-lg" />
        </button>

        <div v-if="isSelectPrintMethodOpen" ref="target"
            class="absolute overflow-hidden w-[20rem] gap-2 top-14 bg-white rounded-xl p-2 shadow-xl border border-gray-100 flex flex-col font-sans">
            <button v-for="method in printMethods" :key="method.id" @click="selectPrintMethod(method)" :class="[
                ' py-3 px-4 rounded-lg h-20 flex items-center text-left transition-all duration-200 ease-in-out border-gray-200',
                'border',
                selectedPrintMethod === method.id
                    ? 'bg-blue-50 border-blue-200 text-blue-800'
                    : 'bg-white border-gray-200 text-gray-800 hover:bg-gray-50 hover:border-gray-300'
            ]">
                <font-awesome-icon :icon="method.icon" :class="[
                    'text-xl mr-3',
                    selectedPrintMethod === method.id ? 'text-blue-600' : 'text-gray-500'
                ]" />
                <div class="flex flex-col flex-grow">
                    <p :class="[
                        'text-sm font-medium',
                        selectedPrintMethod === method.id ? 'text-blue-800' : 'text-gray-800'
                    ]">
                        {{ method.name }}
                    </p>
                    <p :class="[
                        'text-xs mt-0.5 text-wrap',
                        selectedPrintMethod === method.id ? 'text-blue-600' : 'text-gray-500'
                    ]">
                        {{ method.description }}
                    </p>
                </div>
                <div v-if="selectedPrintMethod === method.id" class="ml-auto">
                    <font-awesome-icon icon="fa-solid fa-circle-check" class="text-blue-600 text-lg" />
                </div>
            </button>
        </div>

        
    </div>
</template>

<script setup>
import { toRefs } from 'vue';
import { usePrint } from '../composables/marriage/usePrint';
import PrinterDialog from './PrinterDialog.vue';
import PrinterPageDialog from './PrinterPageDialog.vue';

const props = defineProps({
    active_pdf_link: {
        type: String,
        default: null
    },
    active_pdf: {
        type: String,
        default: null
    },
    count: {
        type: Number,
        default: 1
    },
});

// Pass reactive props to the composable
const { active_pdf_link, active_pdf, count } = toRefs(props);

const {
    print,
    isselectPage,
    printBase64,
    isSelectPrintMethodOpen,
    selectedPrintMethod,
    target,
    printMethods,
    maxPageRange,
    managePrinterMethod,
    selectPrintMethod,
    printPDF,
} = usePrint(active_pdf_link, active_pdf, count);
</script>