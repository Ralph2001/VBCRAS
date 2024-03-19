<template>
    <div class="flex flex-col relative justify-center w-full">
        <div class="flex flex-row items-center p-3 px-5 mb-2">
            <p class="text-md font-semibold tracking-tight">FILED CORRECTION OF CLERICAL ERROR & CHANGE OF FIRST NAME
                <span class="text-xs font-base tracking-wide">R.A. 9048 /
                    R.A. 10172</span>
            </p>
            <div class="relative ml-auto">
                <button type="button" @click="dropdown = !dropdown"
                    class=" ml-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-0 active:scale-95 transition-all focus:ring-blue-300 font-medium rounded shadow text-sm px-4 py-2 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Create</button>

                <div v-if="dropdown"
                    class="z-50 right-0 absolute border bg-white shadow-lg divide-y divide-gray-100 rounded-lg  w-44 dark:bg-gray-700">
                    <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                        <li v-for="RA in RA" :key="RA">
                            <a href="#"
                                class="block px-4 py-2 font-semibold hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                {{ RA }}</a>
                        </li>

                    </ul>
                </div>

            </div>
        </div>
        <div class="h-[calc(100vh-170px)] px-5 relative">
            <TableGrid :data="data" :dataColumns="colDefs" />
        </div>

        <Modal large label="Create Document">
            <template v-slot:header>
                <button type="button" @click=""
                    class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-full text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                    data-modal-hide="default-modal"><svg class="w-3 h-3" aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"></path>
                    </svg><span class="sr-only">Close modal</span>
                </button>
            </template>

            <div class="flex flex-col gap-5 overflow-y-scroll py-3">
                <Box title="Document Type">
                    <div class="flex flex-row p-2 gap-2">
                        <Select :options="Type" label="Type" />
                        <Select :options="DocumentType" label="Document Type" />
                    </div>
                </Box>
                <div class="w-full flex item-center justify-center mb-2">
                    <p class="text-lg uppercase font-semibold">PETITION FOR CORRECTION OF CLERICAL ERROR IN THE
                        CERTIFICATE OF LIVE
                        BIRTH
                    </p>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <Box title="Petition Details" width="w-full">
                        <div class="grid grid-cols-2 gap-2 w-full">
                            <Input label="Petition Number" />
                            <Input label="Petitioner Name" />
                            <Input label="Nationality" />
                        </div>
                    </Box>

                    <Box title="Petitioner Complete Address" width="w-full">
                        <div class="grid grid-cols-2 w-full gap-2 ">
                            <Input label="Country" />
                            <Input label="Province" />
                            <Input label="City/Municipality" />

                            <Input label="Barangay" />
                        </div>
                    </Box>

                </div>
                <div class="flex flex-row flex-wrap gap-2">
                    <div class="basis-3/12 ">
                        <Box title="seeking for correction of the clerical error in: " width="w-full">
                            <div class="grid grid-rows-2 gap-2 w-full">
                                <div class="flex items-center">
                                    <input id="default-radio-1" type="radio" value="" name="default-radio"
                                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                                    <label for="default-radio-1"
                                        class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">my Certificate
                                        of Live
                                        Birth</label>
                                </div>
                                <div class="flex items-center">
                                    <input checked id="default-radio-2" type="radio" value="" name="default-radio"
                                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                                    <label for="default-radio-2"
                                        class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">the
                                        Certificate of Live
                                        Birth of</label>
                                </div>

                            </div>
                        </Box>
                    </div>

                    <div class="basis-2/5 grow">
                        <Box title="Document Owner & Relationship to the Owner" width="w-full">
                            <div class="flex flex-row w-full gap-2 ">
                                <div class="basis-[70%]">
                                    <Input label="Name of Owner" />
                                </div>
                                <div class="grow">
                                    <Input label="Relation of Owner" />
                                </div>
                            </div>
                        </Box>
                    </div>

                    <div class="basis-[20%] ">
                        <Box title="I/He/She was born on" width="w-full">
                            <div class="grid grid-cols-1 w-full gap-2 ">
                                <Input label="Date of Birth" />
                            </div>
                        </Box>
                    </div>

                    <div class="basis-[70%]">
                        <Box title=", at" width="w-ful">
                            <div class="grid grid-cols-2  w-full gap-2 ">
                                <Input label="Country" />
                                <Input label="Province" />
                                <Input label="City/Municipality" />

                            </div>
                        </Box>
                    </div>
                    <div class="grow">
                        <Box title="The birth was recorded under " width="w-ful">
                            <div class="grid grid-cols-1  w-full gap-2 ">
                                <Input label="Registry Number" />

                            </div>
                        </Box>
                    </div>

                </div>
                <div class="flex flex-col flex-wrap gap-2">
                    <div class="grow">
                        <Box title="The clerical error(s) to be corrected is (are): " width="w-ful">
                            <div class="flex flex-col w-full">
                                <div class="grid grid-cols-4  w-full gap-2 text-center ">
                                    <p class="text-sm">Item No.</p>
                                    <p class="text-sm">Description</p>
                                    <p class="text-sm">From</p>
                                    <p class="text-sm">To</p>
                                </div>
                                <div class="grid grid-cols-4  w-full gap-2 items-center">
                                    <p class="text-sm text-center">1</p>
                                    <Input />
                                    <Input />
                                    <Input />
                                </div>

                            </div>
                        </Box>
                    </div>
                    <div class="grow">
                        <Box title="The facts/reasons for filing this petition are the following. " width="w-ful">
                            <div class="grid grid-cols-1  w-full gap-2 ">

                                <label for="message"
                                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Facts/Reasons</label>
                                <textarea id="message" rows="4"
                                    class="block p-2.5 text-justify font-semibold w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"></textarea>

                            </div>
                        </Box>
                    </div>
                </div>

                <div class="flex flex-row flex-wrap gap-2">
                    <div class="grow">
                        <Box title=" documents to support this petition: " width="w-ful">
                            <div class="flex flex-col w-full">
                                <div class="flex flex-row  w-full gap-2 items-center">
                                    <p class="basis-[9%] text-sm text-center">a)</p>
                                    <div class="basis-[90%]">
                                        <Input />
                                    </div>
                                </div>

                            </div>
                        </Box>
                    </div>
                    <div class="basis-[40%]">
                        <Box title="filing this petition at the LCRO of " width="w-ful">
                            <div class="flex flex-row justify-center gap-2 w-full">
                                <Input label="City/Municipality" />
                                <Input label="Province" />
                            </div>
                        </Box>
                    </div>
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
import { onClickOutside } from '@vueuse/core'
import Box from '../../components/essentials/Box.vue';
import Select from '../../components/essentials/inputs/Select.vue';
import Input from '../../components/essentials/inputs/Input.vue';

const dropdown = ref(false)
onClickOutside(dropdown, event => dropdown.value = false)


const RA = ref([
    "R.A. 9048",
    "R.A. 10172"
])

const Type = ref(
    ["CCE",
        "CFN"]
)
const DocumentType = ref(
    ["Birth",
        "Death", "Marriage"]
)

const colDefs = ref([
    { field: "name", headerName: "Petitioner Number", flex: 2, filter: true, pinned: 'left', lockPinned: true, },
    { field: "name", headerName: "Petitioner Name", flex: 1, filter: true },
    { field: "name", headerName: "Document Owner", flex: 1, filter: true },
    { field: "name", headerName: "Relationship", flex: 1, filter: true },
    { field: "name", headerName: "Date Filed", flex: 1, filter: true },
    { field: "name", headerName: "Status", flex: 1, filter: true },
    { field: "name", headerName: "Date Forwarded to CRG", flex: 1, filter: true },
    { headerName: "Action", flex: 1, pinned: 'right', lockPinned: true, resizable: false, sortable: false },

]);


const data = ref([
    "Ralph"
])
</script>
