<template>
  <Toast />
  <div class="h-[calc(100vh-135px)]">
    <DataTable
      :value="products"
      removableSort
      stripedRows
      tableStyle="min-width: 50rem"
      v-model:filters="filters"
      :loading="loading"
      :globalFilterFields="['name', 'type']"
      dataKey="id"
      scrollable
      scrollHeight="flex"
      filterDisplay="row"
    >
      <template #header>
        <div class="flex flex-row justify-between items-center">
          <p class="text-2xl font-medium text-slate-900">Scanned Documents</p>
          <div class="flex flex-row gap-2">
            <span class="relative">
              <i
                class="pi pi-search absolute top-2/4 -mt-2 left-3 text-surface-400 dark:text-surface-600"
              />
              <InputText
                v-model="filters['global'].value"
                placeholder="Keyword Search"
                class="pl-10 font-normal"
              />
            </span>
            <Button icon="pi pi-cog" text severity="secondary" rounded aria-label="Filter" />
          </div>
        </div>
      </template>
      <template #empty>
        <div class="flex flex-row justify-center items-center">
          <img src="../assets/images/not found.png" alt="not found" class="h-48" />
        </div>
        <div class="flex flex-col items-center justify-center gap-1">
          <p class="text-md uppercase text-gray-800 font-semibold">No Result</p>
        </div>
      </template>
      <template #loading>
        <p class="text-md font-semibold text-center">Loading Data. Please wait...</p>
      </template>
      <template #footer>
        <div class="mr-5">
          <p class="text-2xl text-end font-semibold text-gray-900">
            Total Records: {{ totalResults }}
          </p>
        </div>
      </template>

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

      <Column style="width: 10%; max-width: 10%">
        <template #header>
          <div class="flex flex-row w-full justify-center">
            <p class="text-center">Action</p>
          </div>
        </template>
        <template #body="slotProps">
          <div class="flex flex-row gap-1 items-center justify-center">
            <!-- <SplitButton
              label="Open"
              :loading="ikot"
              icon="pi pi-file-pdf"
              :model="items"
              severity="success"
              size="small"
              :pt="{
                path: slotProps.data.filepath,
              }"
              @click="openFile(slotProps.data.filepath)"
            /> -->
            <!-- <fwb-button
              color="default"
              class="rounded"
              @click="openFile(slotProps.data.filepath)"
              size="sm"
              >Open</fwb-button
            > -->
            <!-- <fwb-button
              color="light"
              class="rounded"
              size="sm"
              @click="openPath(slotProps.data.filepath)"
              >Open File Location</fwb-button
            > -->
            <EditBtn :filepath="slotProps.data.filepath" :id="slotProps.data.id" />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from "vue";
import { FilterMatchMode } from "primevue/api";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import SplitButton from "primevue/splitbutton";
import InputText from "primevue/inputtext";
import "primeicons/primeicons.css";
import axios from "axios";
import Tag from "primevue/tag";
const swal = inject("$swal");
import { FwbButton } from "flowbite-vue";
import { useToast } from "primevue/usetoast";
import Toast from "primevue/toast";
import EditBtn from "./ScanApp/EditBtn.vue";
import Dropdown from "primevue/dropdown";
import Button from "primevue/button";

const toast = useToast();

const totalResults = ref("");
const ikot = ref(true);
const products = ref([]);
const open = ref("");

onMounted(async () => {
  try {
    const response = await axios.get("http://127.0.0.1:1216/scanned");
    products.value = response.data.scans;
    totalResults.value = response.data.scans.length;
    loading.value = false;
  } catch (error) {
    console.error("Error fetching products:", error);
    alert("Can't  Connect to the Serveeeeeeeer! ");
  }
});

const items = [
  {
    label: "Open File Path",
    icon: "pi pi-folder-open",
    command: (path) => {
      console.log(path);
    },
  },
  {
    label: "Remove Record",
    icon: "pi pi-ban",
    command: () => {
      alert("Remove Record");
    },
  },
];

const types = ref(["Birth", "Death", "Marriage", "Legal", "Other"]);

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
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

const loading = ref(true);
</script>
