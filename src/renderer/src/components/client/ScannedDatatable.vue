<template>
    <DataTable :value="data" paginator :rows="20" :rowsPerPageOptions="[10, 20, 30, 100,]" scrollable scrollHeight="flex"
        removableSort v-model:filters="filters" :globalFilterFields="['name', 'type', 'filepath']" filterDisplay="row"
        selectionMode="single">

        <template #header>
            <div class="flex flex-wrap items-center justify-between gap-2">
                <span class="text-md flex items-center gap-2 text-gray-800 antialiased dark:text-surface-0 font-bold">

                    <font-awesome-icon icon="fa-solid fa-file-pdf" class="text-2xl text-gray-700" /> {{ title }}</span>
                <div class="flex flex-row gap-4 items-center">
                    <button @click="filterswitch()">

                        <font-awesome-icon icon="fa-solid fa-filter"
                            :class="{ 'text-blue-500': filtersBtn, 'text-gray-400': !filtersBtn }" />



                    </button>
                    <span class="relative">
                        <i class="pi pi-search absolute top-2/4 -mt-2 left-3 text-surface-400 dark:text-surface-600 " />
                        <InputText v-model="filters['global'].value" placeholder="Search"
                            class="pl-2  rounded-sm font-normal " />
                    </span>

                </div>
            </div>
        </template>

        <template #empty> 
        <div class="flex items-center justify-center">
            Empty Data.
        </div>
         </template>
        <Column field="name" header="Name" sortable :showFilterMenu="false" bodyStyle="width: 10px; max-width: 10px"
            tabindex="-1">
            <template #body="slotProps">
                <p class="text-md font-sans flex items-center gap-2  text-slate-800 antialiased font-medium  truncate">
                    {{ slotProps.data.name }}
                </p>
            </template>

            <template #filter="{ filterModel, filterCallback }" v-if="filtersBtn">
                <InputText v-model="filterModel.value" type="text" @input="filterCallback()"
                    class="p-column-filter font-normal text-sm uppercase rounded-sm" placeholder="Search By Name" />
            </template>


        </Column>

        <Column field="type" sortable :showFilterMenu="false" style="width: 10%;">
            <template #header>
                <div class="flex flex-row w-full justify-center">
                    <p class="text-center">Type</p>
                </div>
            </template>
            <template #body="{ data }">
                <div class="flex flex-row gap-1 w-full justify-center">
                    <!-- <Tag class="rounded" :value="data.type" :severity="getSeverity(data.type)" /> -->
                    <Tag :title="data.type" :class="getSeverity(data.type)" />
                </div>
            </template>

            <template #filter="{ filterModel, filterCallback }" v-if="filtersBtn">
                <Dropdown v-model="filterModel.value" @change="filterCallback()" :options="types" placeholder="Type"
                    class="p-column-filter font-normal text-sm uppercase rounded-sm" style="width: 8rem;" :showClear="true">
                    <template #option="slotProps">
                        <Tag :title="slotProps.option" :class="getSeverity(slotProps.option)" />
                    </template>
                </Dropdown>
            </template>
        </Column>

        <Column field="year" sortable :showFilterMenu="false" style="width: 10%;">
            <template #header>
                <div class="flex flex-row w-full justify-center">
                    <p class="text-center">Year</p>
                </div>
            </template>

            <template #body="slotProps">
                <div class="w-full flex justify-center">
                    <p class="text-sm text-gray-900 font-bold">{{ slotProps.data.year }}</p>
                </div>
            </template>

            <template #filter="{ filterModel, filterCallback }" v-if="filtersBtn">
                <Dropdown v-model="filterModel.value" @change="filterCallback()" :options="year" placeholder="Year"
                    class="p-column-filter font-normal text-sm uppercase rounded-sm " style="width: 8rem;"
                    :showClear="true">
                    <template #option="slotProps">
                        <p class="text-md text-gray-900 font-bold">{{ slotProps.option }}</p>
                    </template>
                </Dropdown>
            </template>
        </Column>

        <Column style="width: 15%;">
            <template #header>
                <div class="flex flex-row w-full justify-center">
                    <p class="text-center">Action</p>
                </div>
            </template>
            <template #body="slotProps">
                <div class="flex items-center justify-center">
                    <EditBtn :filepath="slotProps.data.filepath" :id="slotProps.data.id" />
                </div>
            </template>
        </Column>

    </DataTable>
</template>

<script setup>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Row from 'primevue/row';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import { FilterMatchMode } from "primevue/api";
import Tag from './Tag.vue'
import { ref, computed } from 'vue';
import EditBtn from './EditBtn.vue';
import Swal from 'sweetalert2'


const filtersBtn = ref(false)


const filterswitch = () => {
    filtersBtn.value = !filtersBtn.value
}

const props = defineProps({
    data: {
        type: Array,
        required: true
    }, title: {
        type: String,
        required: true
    },
    types: {
        type: Array,
        required: true,
    }
})

const year = computed(() => {
    return [...new Set(props.data.map(data => data.year))]
        .sort((a, b) => a - b);
});

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    type: { value: null, matchMode: FilterMatchMode.EQUALS },
    year: { value: null, matchMode: FilterMatchMode.EQUALS },

});


const getSeverity = (type) => {
    switch (type) {
        case "Birth":
            return "bg-green-200";

        case "Death":
            return "bg-blue-200";

        case "Marriage":
            return "bg-red-200";

        case "Legal":
            return "bg-yellow-200";

        case "Other":
            return "bg-gray-200";
    }
};
</script>

