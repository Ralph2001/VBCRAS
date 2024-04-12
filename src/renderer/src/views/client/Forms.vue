<template>
    <div class="flex flex-col relative justify-center w-full">
        <Header label="Local Civil Registry Forms ">
            <BtnDrop
                label="Create"
                :options="options"
                @open-modal="modalOpener"
            />
            <ButtonIcon>
                <font-awesome-icon icon="fa-solid fa-gear"
            /></ButtonIcon>
        </Header>
        <div class="h-[calc(100vh-170px)] px-5 relative">
            <TableGrid :data="data" :dataColumns="colDefs" />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import TableGrid from '../../components/TableGrid.vue'
import BtnDrop from '../../components/essentials/buttons/BtnDrop.vue'
import Header from '../../components/essentials/header.vue'
import ButtonIcon from '../../components/essentials/buttons/ButtonIcon.vue'

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
const options = ref([
    'Form 1A (Birth)',
    'Form 2A (Death)',
    'Form 3A (Marriage)',
])
</script>

<style lang="scss" scoped></style>
