<template>
    <div
        class="fixed top-0 w-full h-full overflow-y-auto  bottom-0 right-0 left-0 rounded backdrop-blur-sm backdrop-brightness-75 z-50 items-center justify-center p-4 flex ">
        <div class="h-full w-full bg-white rounded grid grid-cols-1 lg:grid-cols-2  max-w-screen-2xl  ">

            <div class="h-full w-full">
                <PDFViewerWorker :scale="1.3" :pdfBytes64="active_pdf_link" />
            </div>
            <div class="bg-gray-200 flex flex-col h-full w-full p-4">
                <p class="text-gray-700 font-semibold text-2xl font-sans">Document Details</p>
                <div class="">
                    <p class="font-medium text-gray-600"><span class="italic text-gray-500 font-normal">Filename:
                        </span> 2001-16 Ralph A.
                        Villanueva</p>
                    <p class="font-medium text-gray-600"><span class="italic text-gray-500 font-normal">Type: </span>
                        Birth</p>

                </div>

                <div class="flex flex-col gap-1 mt-auto mb-auto">
                    <InputLabel label="Registry Number">:
                        <InputforForm width="100%" />
                    </InputLabel>
                    <InputLabel label="Date of Registration">:
                        <InputforForm width="100%" />
                    </InputLabel>
                    <InputLabel label="Name">:
                        <InputforForm width="100%" bold isUpperCase />
                    </InputLabel>
                    <InputLabel label="Sex">:
                        <InputforForm width="100%" />
                    </InputLabel>
                    <InputLabel label="Date of Birth">:
                        <InputforForm width="100%" />
                    </InputLabel>
                    <InputLabel label="Place of Birth">:
                        <InputforForm width="100%" />
                    </InputLabel>
                    <InputLabel label="Name of Mother">:
                        <InputforForm width="100%" />
                    </InputLabel>
                    <InputLabel label="Citizenship of Mother">:
                        <InputforForm width="100%" />
                    </InputLabel>
                    <InputLabel label="Name of Father">:
                        <InputforForm width="100%" />
                    </InputLabel>
                    <InputLabel label="Citizenship of Father">:
                        <InputforForm width="100%" />
                    </InputLabel>
                    <InputLabel label="Date of Marriage">:
                        <InputforForm width="100%" />
                    </InputLabel>
                    <InputLabel label="Place of Marriage of Parents">:
                        <InputforForm width="100%" />
                    </InputLabel>
                </div>
                <div class="flex w-full">
                    <!-- <div>
                        <p class="font-normal text-gray-600 text-sm"><span class="font-medium">Last Modified By:</span>
                            Ralph
                        </p>
                        <p class="font-normal text-gray-600 text-sm"><span class="font-medium">Last Modified:</span>
                            March
                            22, 2025
                        </p>
                    </div> -->

                    <div class="flex flex-row ml-auto items-center   gap-2">
                        <button @click="emits('close-details')"
                            class="py-1 h-fit bg-white rounded border flex items-center justify-center px-2 border-gray-400">Exit</button>
                        <button
                            class="py-1 h-fit bg-white rounded border flex items-center justify-center px-2 border-gray-400">Save</button>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>
<script setup>
import { ref } from 'vue';
import PDFViewerWorker from '../PDFViewerWorker.vue';
import InputforForm from '../Form/InputforForm.vue';
import InputLabel from '../Form/InputLabel.vue';
const active_pdf_link = ref('')

const emits = defineEmits(['close-details'])

</script>