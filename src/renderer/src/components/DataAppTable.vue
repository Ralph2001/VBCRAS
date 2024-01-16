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
    >


      <template #paginatorstart>
        <Button type="button" icon="pi pi-refresh" text />
      </template>
      <template #paginatorend>
        <Button type="button" icon="pi pi-download" text />
      </template>

      <Column field="title" sortable header="Name" style="width: 25%"></Column>
      <Column field="title" sortable header="Filename" style="width: 25%"> </Column>
      <Column field="title" sortable header="Type" style="width: 25%"></Column>
      <Column header="Action" style="width: 10%">
        <template #body="slotProps">
          <div class="flex flex-row gap-1 items-center">
            <SplitButton
              label="Open"
              icon="pi pi-file-pdf"
              @click="save"
              :model="items"
              size="small"
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { CustomerService } from "./CustomerService";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import SplitButton from "primevue/splitbutton";

import "primeicons/primeicons.css";

import axios from "axios";

const products = ref([]);

onMounted(async () => {
  try {
    const response = await axios.get("https://jsonplaceholder.typicode.com/photos"); // Replace with your API endpoint
    products.value = response.data;
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
</script>
