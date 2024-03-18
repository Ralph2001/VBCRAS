<template>
    <div class="flex flex-col relative justify-center w-full">
        <div class="flex flex-row items-center p-3 px-5">
            <p class="text-lg font-semibold tracking-tight">Correction of Clerical Error <span
                    class="text-sm font-base">R.A. 9048 /
                    R.A. 10172</span></p>
            <button type="button" @click="modalSwitch()"
                class=" ml-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-0 active:scale-95 transition-all focus:ring-blue-300 font-medium rounded shadow text-sm px-4 py-2 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Create</button>
        </div>
        <div class="h-[calc(100vh-170px)] px-5 relative">
            <TableGrid />
        </div>


        <Modal v-if="selectRA">
            <template v-slot:header>
                <button type="button" @click="modalSwitch()"
                    class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-full text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                    data-modal-hide="default-modal"><svg class="w-3 h-3" aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"></path>
                    </svg><span class="sr-only">Close modal</span>
                </button>
            </template>

            <div class="flex flex-row w-full gap-2 ">
                <div class="flex flex-row gap-1 flex-grow" v-for="Rep in RA">
                    <button
                        class="p-6 bg-slate-100 border border-gray-200 w-full text-lg font-semibold text-gray-800 rounded-sm hover:scale-[.98] active:scale-95  ">
                        {{ Rep }}
                    </button>
                </div>
            </div>
        </Modal>

    </div>
</template>

<script setup>
import { ref } from 'vue';
import TableGrid from '../../components/TableGrid.vue';
import Modal from '../../components/client/modal/Modal.vue';
import { FwbRadio } from 'flowbite-vue';

const selectRA = ref(false)

const modalSwitch = () => {
    selectRA.value = !selectRA.value
}

const RA = ref([
    'R.A. 9048',
    'R.A. 10172',
])
</script>
