<template>
  <div class="h-[calc(100vh-180px)] flex flex-col border rounded ">
    <ScannedHeader>
      <template #content>
        <ScannedSearch v-model="searchQuery" />
      </template>
    </ScannedHeader>
    <ScannedNavbar :type="selected_type" :year="selected_year" :month="selected_month" @navigate="navigate" />
    <div class="h-full overflow-y-auto p-4">
      <!-- Render Directory -->
      <ScannedDirectory :data="directory" v-if="directory.length > 0" @select-file="handleSelect" />

      <!-- Render Items -->
      <RecycleScroller class="flex-1" v-if="isValidSelection" :items="filteredFiles" :item-size="10" key-field="id"
        v-slot="{ item }">
        <ScannedFile :file_info="item" :size="10" />
      </RecycleScroller>
    </div>
  </div>
</template>

<script setup>
import { RecycleScroller } from "vue-virtual-scroller";
import ScannedHeader from "../scanned/ScannedHeader.vue";
import ScannedSearch from "../scanned/ScannedSearch.vue";
import ScannedNavbar from "../scanned/ScannedNavbar.vue";
import { computed, ref } from "vue";
import ScannedDirectory from "../scanned/ScannedDirectory.vue";
import ScannedFile from "../scanned/ScannedFile.vue";

// Reactive references for selected filters
const selected_type = ref(null)
const selected_year = ref(null)
const selected_month = ref(null)

const searchQuery = ref(null)

// Props for data and types
const props = defineProps({
  data: {
    type: Array,
    required: true
  },
  types: {
    type: Array,
    required: true
  }
});

// Reusable filtering logic
const getFilteredData = (type = null, year = null, month = null) => {
  return props.data.filter((data) =>
    (!type || data.scanned_type.name === type) &&
    (!year || data.year === year) &&
    (!month || data.month === month)
  );
};

// Computed property for directory (type, year, month selection)
const directory = computed(() => {
  if (selected_type.value === null) {
    return props.types;
  }

  if (selected_year.value === null) {
    return [...new Set(props.data.filter((data) => data.scanned_type.name === selected_type.value).map((data) => data.year))].sort((a, b) => a - b);
  }

  if (selected_month.value === null) {
    return [...new Set(props.data.filter((data) => data.scanned_type.name === selected_type.value && data.year === selected_year.value).map((data) => data.month))].sort((a, b) => a - b);
  }

  return [];
});

// Computed property for filtered files
const filteredFiles = computed(() => getFilteredData(selected_type.value, selected_year.value, selected_month.value));

// Boolean to check if selection is valid for rendering files
const isValidSelection = computed(() => selected_type.value !== null && selected_year.value !== null && selected_month.value !== null);

// Handle user selection for type, year, and month
const handleSelect = (data) => {
  if (!selected_type.value) {
    selected_type.value = data;
    selected_year.value = null;
    selected_month.value = null;
  } else if (!selected_year.value) {
    selected_year.value = data;
    selected_month.value = null;
  } else if (!selected_month.value) {
    selected_month.value = data;
  }
};

const navigate = (event) => {
  if (event === 'home') {
    selected_type.value = null
    selected_year.value = null
    selected_month.value = null
  }
  else if (event === 'types') {
    selected_year.value = null
    selected_month.value = null
  } else if (event === 'year') {
    selected_month.value = null
  }
}
</script>
