<template>
    <div class="w-full">
        <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
                    <th v-for="header in headerGroup.headers" :key="header.id" scope="col" class="px-6 py-3">
                        <FlexRender :render="header.column.columnDef.header" :props="header.getContext()" />
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="row in table.getRowModel().rows" :key="row.id"
                    class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <td v-for="cell in row.getVisibleCells()" :key="cell.id" class="px-6 py-4">
                        <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
                    </td>
                </tr>
            </tbody>
        </table>
        <nav class="flex items-center flex-column flex-wrap md:flex-row justify-between pt-4"
            aria-label="Table navigation">
            <span
                class="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto">Page
                <span class="font-semibold text-gray-900 dark:text-white">{{ table.getState().pagination.pageIndex +
                    1 }} of {{ table.getPageCount() }}</span> - <span
                    class="font-semibold text-gray-900 dark:text-white">{{ table.getFilteredRowModel().rows.length
                    }} Results</span></span>
            <ul class="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
                <li>
                    <a @click="table.setPageIndex(0)"
                        class="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">First
                        Page</a>
                </li>
                <li>
                    <a @click="table.previousPage()"
                        class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Previous
                        Page</a>
                </li>
                <li>
                    <a @click="table.nextPage()"
                        class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Next
                        Page</a>
                </li>

                <li>
                    <a @click="table.setPageIndex(table.getPageCount() - 1)"
                        class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Last
                        Page</a>
                </li>
            </ul>
        </nav>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useVueTable, FlexRender, getCoreRowModel, getPaginationRowModel } from '@tanstack/vue-table'
import { format } from "date-fns";

const props = defineProps({
    data: {
        type: Array,
        required: true
    }
})

const columnsData = [
    {
        accessorKey: 'name',
        header: 'Name'

    },
    {
        accessorKey: 'action',
        header: 'Action'

    },
    {
        accessorKey: 'device_used',
        header: 'Device Used'

    },
    {
        accessorKey: 'action_at',
        header: 'Time',
        cell: info => format(new Date(info.getValue()), 'MMMM d, yyyy h:m a')
    },

]

const table = useVueTable({
    data: props.data,
    columns: columnsData,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel()
})
</script>
