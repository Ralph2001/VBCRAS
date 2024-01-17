<template>
  <div class="card">
    <DataTable
      :value="products"
      paginator
      showGridlines
      removableSort
      :rows="5"
      :rowsPerPageOptions="[5, 10, 20, 50]"
      stripedRows
      tableStyle="min-width: 50rem"
      paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
      currentPageReportTemplate="{first} to {last} of {totalRecords}"
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
        <div class="flex flex-col items-center justify-center gap-1">
          <p class="text-lg text-gray-500 font-semibold">
            Sorry, No Results.
          </p>
        </div>
      </template>
      <template #loading>
        <p class="text-md font-semibold text-center">Loading Data. Please wait...</p>
      </template>

      <Column field="name" sortable header="Name" style="width: 30%"> </Column>
      <Column field="filepath" sortable header="Filepath" style="width: 40%"> </Column>
      <Column field="type" sortable header="Type" style="width: 10%"></Column>
      <!-- <Column field="name" sortable header="Year" style="width: 10%"></Column> -->
      <Column header="Action" style="width: 10%">
        <template #body="slotProps">
          <div class="flex flex-row gap-1 items-center">
            <SplitButton label="Open" icon="pi pi-file-pdf" :model="items" size="small" />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { FilterMatchMode } from "primevue/api";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import SplitButton from "primevue/splitbutton";

// import ProgressBar from 'primevue/progressbar';
import InputText from "primevue/inputtext";

import "primeicons/primeicons.css";

import axios from "axios";

const products = ref([]);

onMounted(async () => {
  try {
    const response = await axios.get("http://127.0.0.1:5000/scanned"); 
    products.value = response.data;
    loading.value = false;
    console.log(products.value)
  } catch (error) {
    console.error("Error fetching products:", error);
    alert("Can't Fucking Connect to the Serveeeeeeeer! Call 911");
  }
});

const items = [
  {
    label: "Update",
    icon: "pi pi-refresh",
  },
  {
    label: "Open File Path",
    icon: "pi pi-folder-open",
  },
];

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
});

const loading = ref(true);
</script>
