<template>
  <div class="h-[calc(100vh-135px)]">
    <DataTable :value="data" showGridlines removableSort tableStyle="min-width: 50rem; "  v-model:filters="filters"
      :globalFilterFields="['name', 'type']" :loading="isLoading" dataKey="id" scrollable scrollHeight="flex"
      filterDisplay="row" stateStorage="session" stateKey="dt-state-demo-session">
      <template #header>
        <div class="flex flex-row justify-between items-center h-10 scale-95">
          <p class="text-lg font-medium text-slate-900"><span class="pi pi-print"></span> {{ title }}</p>
          <div class="flex flex-row gap-2">
            <span class="relative">
              <i class="pi pi-search absolute top-2/4 -mt-2 left-3 text-surface-400 dark:text-surface-600" />
              <InputText v-model="filters['global'].value" placeholder="Search" class="pl-8 rounded-sm font-normal" />
            </span>
            <!-- <Button icon="pi pi-refresh" rounded raised /> -->
          </div>
        </div>
      </template>
      <Column sortable field="name" header="Name" headerClass="text-sm " style="width: 60%;">
        <template #body="slotProps">
          <p class="text-md font-sans text-slate-900 font-medium w-[10rem] sm:w-[20rem] md:w-[35rem] truncate">
            {{ slotProps.data.name }}
          </p>
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <InputText v-model="filterModel.value" type="text" @input="filterCallback()"
            class="p-column-filter font-normal text-sm uppercase rounded-sm" placeholder="Search By Name" />
        </template>
      </Column>

      <Column field="type" sortable header="Type" headerClass="text-sm" style="width: 15%;" :showFilterMenu="false">
        <template #body="{ data }">
          <div class="flex flex-row w-full justify-center">
            <Tag class="rounded-sm" :value="data.type" :severity="getSeverity(data.type)" />
          </div>
        </template>

        <template #filter="{ filterModel, filterCallback }">
          <Dropdown v-model="filterModel.value" @change="filterCallback()" :options="types" placeholder="Select Type"
            class="p-column-filter font-normal text-sm uppercase rounded-sm" style="width: 11rem;" :showClear="true">
            <template #option="slotProps">
              <Tag :value="slotProps.option" :severity="getSeverity(slotProps.option)" />
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
          <div class="flex flex-row gap-1 items-center justify-center">
            <EditBtn :filepath="slotProps.data.filepath" :id="slotProps.data.id" />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { FilterMatchMode } from "primevue/api";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import InputText from "primevue/inputtext";
import "primeicons/primeicons.css";
import Tag from "primevue/tag";

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

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  name: { value: null, matchMode: FilterMatchMode.CONTAINS },
  type: { value: null, matchMode: FilterMatchMode.EQUALS },
});

const getSeverity = (type) => {
  switch (type) {
    case "Birth":
      return "success";

    case "Death":
      return "info";

    case "Marriage":
      return "danger";

    case "Legal":
      return "warning";

    case "Other":
      return null;
  }
};
</script>
