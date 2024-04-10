<template>
    <div class="flex flex-col relative justify-center w-full">
        <div class="flex flex-row items-center p-3 px-5 mb-2">
            <p class="text-md font-semibold tracking-tight uppercase">
                Local Civil Registry Form Certificate
            </p>
            <div class="relative ml-auto">
                <button
                    type="button"
                    @click="dropdown = !dropdown"
                    class="ml-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-0 active:scale-95 transition-all focus:ring-blue-300 font-medium rounded shadow text-sm px-4 py-2 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                    Create
                </button>

                <div
                    v-if="dropdown"
                    class="z-50 right-0 absolute border bg-white shadow-lg divide-y divide-gray-100 rounded-lg w-44 dark:bg-gray-700"
                >
                    <ul
                        class="py-2 text-sm text-gray-700 dark:text-gray-200"
                        aria-labelledby="dropdownDefaultButton"
                    >
                        <li v-for="option in options" :key="option">
                            <a
                                @click="modalOpener(option)"
                                class="cursor-pointer block px-4 py-2 font-semibold hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                                {{ option }}</a
                            >
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="h-[calc(100vh-170px)] px-5 relative">
            <TableGrid :data="data" :dataColumns="colDefs" />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import TableGrid from '../../components/TableGrid.vue'

const colDefs = ref([
    {
        field: 'name',
        headerName: 'Name',
        flex: 2,
        filter: true,
        pinned: 'left',
        lockPinned: true,
    },
    { field: 'name', headerName: 'Registry Number', flex: 1, filter: true },
    {
        field: 'name',
        headerName: 'Date of Registration',
        flex: 1,
        filter: true,
    },
    { field: 'name', headerName: 'Type of Form', flex: 1, filter: true },
    { field: 'name', headerName: 'Book Details', flex: 1, filter: true },
    {
        headerName: 'Action',
        flex: 1,
        pinned: 'right',
        lockPinned: true,
        resizable: false,
        sortable: false,
    },
])
const dropdown = ref(false)
const options = ref(['Form 1A (Birth)', 'Form 2A (Death)', 'Form 3A (Marriage)'])
onClickOutside(dropdown, (event) => (dropdown.value = false))
</script>

<style lang="scss" scoped></style>
