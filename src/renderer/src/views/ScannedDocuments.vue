<template>
  <div class="flex flex-col h-[calc(100vh-92px)] py-3 relative" @dragenter="showDropzone">
    <Dropzone
      @dragleave="handleDragLeave"
      @drop="handleDrop"
      @dragover.prevent
      :isDropzoneVisible="isDropzoneVisible"
      v-if="isShowModal == false"
    />

    <div class="h-max mt-6">
      <TableData
       class=" scale-90"
        :data="Documents.scanned"
        :types="Documents.types"
        :isLoading="Documents.isLoading"
        :title="Documents.title"
      />
    </div>
  </div>

  <div class="flex bottom-0 fixed w-full bg-gray-50 left-0 p-2 justify-end">
    <p class="text-sm font-medium text-gray-900">
      Total Records (<span class="text-blue-600">{{
        Number(Documents.totalCount).toLocaleString()
      }}</span
      >)
    </p>
  </div>
</template>

<script setup>
import { ref, inject, onMounted } from "vue";
import { reactive, computed } from "vue";

import { scannedDocuments } from "../stores/scanned";
import TableData from "../components/TableData.vue";
import Dropzone from "../components/Dropzone.vue";

const Documents = scannedDocuments();

onMounted(() => {
  Documents.getScanned();
});
</script>
