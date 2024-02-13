<template>
  <div class="h-[calc(100vh-150px)] bg-teal-50/20 ">
    <DataTable :value="data" showGridlines removableSort tableStyle="min-width: 50rem;" tableClass="bg-white" :pt="{
      header: {
        class: 'bg-blue-300 p-4'
      }
    }" v-model:filters="filters" :globalFilterFields="['name', 'type', 'filepath']" :loading="isLoading" dataKey="id"
      scrollable scrollHeight="flex" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50, 100]" filterDisplay="row"
      stateStorage="session" stateKey="ScannedTable">
      <template #header>
        <div class="flex flex-row justify-between items-center h-10 scale-95">
          <p class="text-xl font-medium text-slate-900"><span class="pi pi-print"></span> {{ title }}</p>
          <div class="flex flex-row gap-2">
            <span class="relative">
              <i class="pi pi-search absolute top-2/4 -mt-2 left-3 text-surface-400 dark:text-surface-600 " />
              <InputText v-model="filters['global'].value" placeholder="Search" class="pl-8 rounded-sm font-normal " />
            </span>
            <!-- <Button icon="pi pi-refresh" rounded raised /> -->
          </div>
        </div>
      </template>

      <Column sortable field="name" header="Name" headerClass="text-sm" bodyClass="bg-neutral-50 " style="width: 60%; ">
        <template #body="slotProps">
          <p class="text-md font-sans text-slate-900 font-medium w-[10rem] sm:w-[10rem] md:w-[35rem] truncate">
            {{ slotProps.data.name }}
          </p>
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <InputText v-model="filterModel.value" type="text" @input="filterCallback()"
            class="p-column-filter font-normal text-sm uppercase rounded-sm" placeholder="Search By Name" />
        </template>
      </Column>

      <Column field="type" sortable header="Type" headerClass="text-sm" style="width: 10%;" :showFilterMenu="false">
        <template #body="{ data }">
          <div class="flex flex-row gap-1 w-full justify-center">
            <!-- <Tag class="rounded" :value="data.type" :severity="getSeverity(data.type)" /> -->
            <Tag :title="data.type" :class="getSeverity(data.type)" />
          </div>
        </template>

        <template #filter="{ filterModel, filterCallback }">
          <Dropdown v-model="filterModel.value" @change="filterCallback()" :options="types" placeholder="Type"
            class="p-column-filter font-normal text-sm uppercase rounded-sm" style="width: 8rem;" :showClear="true">
            <template #option="slotProps">
              <Tag :title="slotProps.option" :class="getSeverity(slotProps.option)" />
              <!-- <Tag :value="slotProps.option" :severity="getSeverity(slotProps.option)" /> -->
            </template>
          </Dropdown>
        </template>
      </Column>

      <Column field="year" sortable header="Year" headerClass="text-sm" style="width: 10%;" :showFilterMenu="false">
        <template #body="slotProps">
          <div class="w-full flex justify-center">
            <p class="text-md text-gray-900 font-bold">{{ slotProps.data.year }}</p>
          </div>
        </template>

        <template #filter="{ filterModel, filterCallback }">
          <Dropdown v-model="filterModel.value" @change="filterCallback()" :options="year" placeholder="Year"
            class="p-column-filter font-normal text-sm uppercase rounded-sm" style="width: 8rem;" :showClear="true">
            <template #option="slotProps">
              <p class="text-md text-gray-900 font-bold">{{ slotProps.option }}</p>
            </template>
          </Dropdown>
        </template>
      </Column>

      <Column style="width: 25%;" headerClass="text-sm">
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
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { FilterMatchMode } from "primevue/api";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import InputText from "primevue/inputtext";
import "primeicons/primeicons.css";
import Tag from "./Tag.vue";

import EditBtn from "./EditBtn.vue";
import Dropdown from "primevue/dropdown";
import Button from "primevue/button";

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  types: {
    type: Array,
    required: true,
  },
  isLoading: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
  },
});

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
      return "bg-green-100";

    case "Death":
      return "bg-blue-100";

    case "Marriage":
      return "bg-red-100";

    case "Legal":
      return "bg-yellow-50";

    case "Other":
      return "bg-gray-100";
  }
};
</script>
