<template>
  <div class="h-[calc(100vh-180px)] flex flex-col border rounded ">

    <ScannedHeader>
      <template #content>
        <ScannedSearch v-model="searchQuery" />
        <div class="ml-auto w-32 flex items-center justify-center">
          <button @click="emits('openNewTypeModal')"
            class="rounded-md w-fit px-2.5 h-fit bg-blue-600 text-white  py-1.5 text-xs font-medium">Add
            Type</button>

        </div>
      </template>
    </ScannedHeader>

    <ScannedNavbar :type="getTypeName" :year="selected_year" :month="selected_month" @navigate="navigate" />
    <div class="h-full overflow-y-auto relative p-4 flex flex-col">
      <!-- Render Directory -->
      <ScannedDirectory :data="directory" v-if="directory.length > 0 && !documents.loading && !documents.isError"
        @select-file="handleSelect" />

      <!-- Loading State -->
      <div class="my-auto mx-auto " v-if="documents.loading && !documents.isError">
        <p class="font-medium font-mono">Retrieving information, please hold on...</p>
      </div>
      <!-- Error State -->
      <div class="my-auto mx-auto " v-if="documents.isError">
        <p class="font-medium font-mono">{{ documents.errorMessage }}</p>
      </div>

      <div v-if="selected_type === null && !documents.loading && !documents.isError"
        class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-12 gap-3 p-4">
        <button v-for="type in props.types" :key="type.id" @click="handleSelect(type.id)"
          class="group flex flex-col items-center justify-center space-y-2 p-3  rounded-lg border border-transparent hover:border-gray-200 hover:bg-gray-100 transition duration-150">
          <div class="relative w-14 h-14 flex items-center justify-center">
            <font-awesome-icon icon="fa-solid fa-folder" class="text-yellow-400 text-5xl z-10" />
            <font-awesome-icon icon="fa-solid fa-folder"
              class="absolute top-0.5 left-0.5 text-yellow-300 text-5xl z-0" />
          </div>
          <p class="text-xs text-center font-medium text-gray-800 leading-tight truncate w-full max-w-[6rem]">
            {{ type.name }}
          </p>
        </button>
      </div>


      <!-- Render Items -->
      <RecycleScroller class="flex-1" v-if="isValidSelection && !documents.loading && !documents.isError"
        :items="filteredFiles" :item-size="5" key-field="id" v-slot="{ item }">
        <ScannedFile :file_info="item" :size="5" @open-details="handleData" />
      </RecycleScroller>

      <div v-if="filteredFiles.length <= 0 && selected_type !== null && !documents.loading && !documents.isError"
        class="w-full h-full flex items-center justify-center">
        <p class="text-lg text-gray-600">No files found...</p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { DynamicScroller, DynamicScrollerItem, RecycleScroller } from "vue-virtual-scroller";
import ScannedHeader from "../scanned/ScannedHeader.vue";
import ScannedSearch from "../scanned/ScannedSearch.vue";
import ScannedNavbar from "../scanned/ScannedNavbar.vue";
import { computed, onMounted, ref, watch } from "vue";
import ScannedDirectory from "../scanned/ScannedDirectory.vue";
import ScannedFile from "../scanned/ScannedFile.vue";
import { useScannedDocuments } from "../../stores/Scanned";
import { useDebounceFn, useEventListener } from '@vueuse/core'



const documents = useScannedDocuments()
// Reactive references for selected filters
const selected_type = ref(null)
const selected_year = ref(null)
const selected_month = ref(null)
const isLoading = ref(false)

const searchQuery = ref("");


const emits = defineEmits(['open-details', 'openNewTypeModal', 'pass-data'])

const handleData = (data) => {
  emits('pass-data', data)

}

const debouncedFn = useDebounceFn(() => {
  SearchFile();
}, 1000, { maxWait: 5000 })

watch(searchQuery, () => {
  debouncedFn()
});

onMounted(() => {
  documents.isError = false
  documents.errorMessage = ''
})
watch(
  [selected_type, selected_year, selected_month],
  ([newType, newYear, newMonth]) => {
    if (newType || newYear || newMonth) {
      documents.getScanned({ type: newType, year: newYear, month: newMonth });
    }
  }
);

const SearchFile = () => {
  documents.getScanned({ type: selected_type.value, year: selected_year.value, month: selected_month.value, search: searchQuery.value });
}

const scannedType = ref([])

onMounted(async () => {
  try {
    const data = await documents.getScannedType();
    scannedType.value = Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Failed to fetch scanned types', error);
    scannedType.value = [];
  }
});

const getTypeName = computed(() => {
  const type = scannedType.value.find((type) => type.id === selected_type.value);
  return type ? type.name : '';
});


const scanned = computed(() => documents.scanned);



// Props for data and types
const props = defineProps({
  // data: {
  //   type: Array,
  //   required: true
  // },
  types: {
    type: Array,
    required: true
  }
});

// Reusable filtering logic
const getFilteredData = (type = null, year = null, month = null) => {
  return documents.scanned
};


// Computed property for directory (type, year, month selection)
const directory = computed(() => {
  if (selected_type.value === null) {
    return []
  }

  if (selected_year.value === null) {
    return [...new Set(documents.scanned.map((data) => data.year))].sort((a, b) => a - b);
  }

  if (selected_month.value === null) {
    return [...new Set(documents.scanned.map((data) => data.month))].sort((a, b) => a - b);
  }

  return [];
});

// // Computed property for filtered files
const filteredFiles = computed(() =>
  getFilteredData(selected_type.value, selected_year.value, selected_month.value)
);

// // Boolean to check if selection is valid for rendering files
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
