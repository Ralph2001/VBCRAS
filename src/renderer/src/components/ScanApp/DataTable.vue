<template>
  <DataTable class="display">
    <thead>
      <tr>
        <th>File Name</th>
        <th>File Path</th>
        <th>Status</th>
        <th>Action</th>


      </tr>
    </thead>
  </DataTable>
</template>

<script setup>
import DataTable from "datatables.net-vue3";
import DataTablesCore from "datatables.net";

DataTable.use(DataTablesCore);
</script>

<style>
@import "datatables.net-dt";


</style>
