<template>
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
      :globalFilterFields="['name']"
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

      <Column sortable header="Name" class="overflow-ellipsis" style="width: 50%">
        <template #body="slotProps">
         
            <p class="text-md text-slate-900 font-medium overflow-ellipsis">
              {{ slotProps.data.name }}
            </p>
          
        </template>
      </Column>
      <Column
        field="type"
        sortable
        header="Type"
        style="width: 20%; max-width: 20%"
      ></Column>
      <Column style="width: 10%; max-width: 10%">
        <template #header>
          <div class="flex flex-row w-full justify-center">
            <p class="text-center">Action</p>
          </div>
        </template>
        <template #body="slotProps">
          <div class="flex flex-row gap-1 items-center justify-center">
            <SplitButton
              label="Open"
              icon="pi pi-file-pdf"
              :model="items"
              severity="success"
              size="small"
              @click="showthis(slotProps.data.filepath)"
            />
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
import Button from "primevue/button";
import SplitButton from "primevue/splitbutton";
import InputText from "primevue/inputtext";
import "primeicons/primeicons.css";
import axios from "axios";
import { useToast } from "primevue/usetoast";
const toast = useToast();




const swal = inject("$swal");

const products = ref([]);

onMounted(async () => {
  try {
    const response = await axios.get("http://127.0.0.1:1216/scanned");
    products.value = response.data.scans;
    console.log(response.data.scans);
    loading.value = false;
  } catch (error) {
    console.error("Error fetching products:", error);
    alert("Can't  Connect to the Serveeeeeeeer! ");
  }
});

const showthis = async (filepath) => {
  try {
    const check = await window.LocalCivilApi.checkFile(filepath);
    toast.add({ severity: 'info', summary: 'Info', detail: 'Message Content', life: 3000 });
  } catch (error) {
    toast.add({ severity: 'info', summary: 'Info', detail: 'Message Content', life: 3000 });
  }
};


const items = [
  {
    label: "Update",
    icon: "pi pi-refresh",
  },
  {
    label: "Open File Path",
    icon: "pi pi-folder-open",
    command: () => {
      toast.add({
        severity: "info",
        summary: "Info",
        detail: "Message Content",
        life: 3000,
      });
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
});

const loading = ref(true);
</script>
