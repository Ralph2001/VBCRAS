<template>
  <Toast />
  <div class="card">
    <DataTable
      :value="products"
      removableSort
      stripedRows
      stateStorage="session"
      stateKey="dt-state-demo-session"
      tableStyle="min-width: 50rem"
      v-model:filters="filters"
      :loading="loading"
      :globalFilterFields="['name', 'type']"
      dataKey="id"
    >
      <template #header>
        <div class="flex flex-row justify-end">
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
      </Column>

      <Column field="type" sortable header="Type" style="width: 20%; max-width: 20%">
        <template #body="{ data }">
          <Tag :value="data.type" :severity="getSeverity(data.type)" />
        </template>
      </Column>

      <Column style="width: 30%; max-width: 30%">
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
            <fwb-button
              color="default"
              class="rounded"
              @click="openFile(slotProps.data.filepath)"
              size="sm"
              >Open</fwb-button
            >
            <fwb-button
              color="light"
              class="rounded"
              size="sm"
              @click="openPath(slotProps.data.filepath)"
              >Open File Location</fwb-button
            >
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

const toast = useToast();

const ikot = ref(true);
const products = ref([]);
const open = ref("");

onMounted(async () => {
  try {
    const response = await axios.get("http://127.0.0.1:1216/scanned");
    products.value = response.data.scans;
    loading.value = false;
  } catch (error) {
    console.error("Error fetching products:", error);
    alert("Can't  Connect to the Serveeeeeeeer! ");
  }
});

const openFile = async (filepath) => {
  try {
    const check = await window.LocalCivilApi.checkFile(filepath);
    if (check) {
      toast.add({
        severity: "success",
        summary: "Success",
        detail: "File Found.",
        life: 3000,
      });
    } else {
      toast.add({
        severity: "info",
        summary: "Info",
        detail: "Message Content",
        life: 3000,
      });
    }
  } catch (error) {
    toast.add({
      severity: "info",
      summary: "Info",
      detail: "Message Content",
      life: 3000,
    });
  }
};

const openPath = async (filepath) => {
  try {
    const check = await window.LocalCivilApi.openFilePath(filepath);
    if (check) {
      toast.add({
        severity: "success",
        summary: "Success",
        life: 3000,
      });
    } else {
      toast.add({
        severity: "error",
        summary: "Not Opening",
        detail: "Something went wrong",
        life: 3000,
      });
    }
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Not Opening",
      detail: error,
      life: 3000,
    });
  }
};

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
