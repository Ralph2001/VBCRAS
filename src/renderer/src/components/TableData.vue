<template>
  <div class="h-[calc(100vh-135px)]">
    <DataTable
      :value="data"
      removableSort
      stripedRows
      tableStyle="min-width: 50rem"
      v-model:filters="filters"
      :globalFilterFields="['name', 'type']"
      :loading="isLoading"
      dataKey="id"
      scrollable
      scrollHeight="flex"
      filterDisplay="row"
      stateStorage="session"
      stateKey="dt-state-demo-session"
    >
      <template #header>
        <div class="flex flex-row justify-between items-center">
          <p class="text-2xl font-medium text-slate-900">{{ title }}</p>
          <div class="flex flex-row gap-2">
            <span class="relative">
              <i
                class="pi pi-search absolute top-2/4 -mt-2 left-3 text-surface-400 dark:text-surface-600"
              />
              <InputText
                v-model="filters['global'].value"
                placeholder="Search"
                class="pl-10 font-normal"
              />
            </span>
          </div>
        </div>
      </template>
<<<<<<< HEAD
=======
      <!-- <template #footer>
        <div class="flex w-full justify-end items-center h-1">
          <p class="text-sm font-medium text-gray-900">Total Records (<span class="text-blue-600">{{  Number(total).toLocaleString()  }}</span>)</p>
        </div>
      </template> -->

>>>>>>> c1c51535f7d20cb8e725b0c6c09f7356f4152c7f
      <Column
        sortable
        field="name"
        header="Name"
        class="overflow-ellipsis"
        style="width: 50%"
      >
        <template #body="slotProps">
          <p class="text-md text-slate-900 font-medium overflow-ellipsis">
            {{ slotProps.data.name }}
          </p>
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <InputText
            v-model="filterModel.value"
            type="text"
            @input="filterCallback()"
            class="p-column-filter"
            placeholder="Search By Name"
          />
        </template>
      </Column>

      <Column
        field="type"
        sortable
        header="Type"
        style="width: 2%; max-width: 2%"
        :showFilterMenu="false"
        :filterMenuStyle="{ width: '14rem' }"
      >
        <template #body="{ data }">
          <Tag class="rounded" :value="data.type" :severity="getSeverity(data.type)" />
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <Dropdown
            v-model="filterModel.value"
            @change="filterCallback()"
            :options="types"
            placeholder="Select Type"
            class="p-column-filter"
            style="min-width: 12rem"
            :showClear="true"
          >
            <template #option="slotProps">
              <Tag :value="slotProps.option" :severity="getSeverity(slotProps.option)" />
            </template>
          </Dropdown>
        </template>
      </Column>

      <Column style="width: 20%; max-width: 20%">
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
