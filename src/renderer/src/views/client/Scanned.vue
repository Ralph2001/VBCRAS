<template>
    <div class="flex flex-col h-[calc(100vh-92px)] py-3 relative justify-center">
        <ScannedDatatable title="Scanned Documents" :types="types" :data="Documents.scanned" />
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useScannedDocuments } from '../../stores/scanned'
import ScannedDatatable from '../../components/client/ScannedDatatable.vue';

const Documents = useScannedDocuments();
const types = ref([
    "Birth", "Death", "Marriage", "Legal", "Other"
])
onMounted(() => {
    Documents.getScanned()
})
</script>

<style lang="scss" scoped></style>