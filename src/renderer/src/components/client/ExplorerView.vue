<template>
  <div class="flex flex-col h-full border rounded-lg relative justify-center ">
    <Transition enter-active-class="animate__animated animate__fadeInDown"
      leave-active-class="animate__animated animate__fadeOutUp">
      <Alert v-if="showAlert" message="Error: Unable to open the file." error />
    </Transition>
    <div
      class="grid sm:grid-cols-1 gap-4 md:lg:grid-cols-3 items-center shadow-sm justify-between px-3 py-3 bg-gray-100 rounded-t-lg">
      <p class="text-xl tracking-wider font-semibold ms-3 text-gray-800">Scanned Documents</p>

      <div class="relative">
        <font-awesome-icon icon="fa-solid fa-xmark" v-if="searchQuery" @click="searchQuery = ''"
          class="absolute right-3 text-gray-500 hover:text-gray-700 cursor-pointer top-[0.80rem]" />
        <font-awesome-icon icon="fa-solid fa-magnifying-glass"
          class="text-gray-300 pointer-events-none absolute mt-[0.80rem] ml-2" />
        <!-- <SearchFilter v-model="searchQuery" :hasValue="searchQuery" /> -->

        <input type="text" ref="input" v-model="searchQuery" :class="{
          'border-blue-600 border ring-2 ring-blue-400': searchQuery != '',
        }"
          class="placeholder:text-gray-300 placeholder:text-sm placeholder:font-normal pl-8 rounded-lg border border-gray-300 font-semibold w-full select-none"
          placeholder="Search" />
      </div>


      <!-- <div class="flex justify-end gap-2 items-center me-5 text-gray-400  cursor-pointer relative">
        <font-awesome-icon icon="fa-solid fa-gear" class="hover:text-gray-600"
          @click="ScannedSettings = !ScannedSettings" />
        <font-awesome-icon icon="fa-solid fa-circle-question" class="hover:text-gray-600" /> 


         <div v-if="ScannedSettings" ref="settings"
          class="bg-white flex flex-col top-8 shadow-md w-auto border border-gray-200 z-[99999] p-4 absolute h-auto">
          <p class="text-gray-600 font-semibold text-sm mb-3">
            Opening PDF:
          </p>
          <div class="w-full flex flex-col gap-2">
            <div class="flex items-center group ps-2 border border-gray-200 rounded" v-for="(key, value) in openlist"
              :key="value">
              <input :id="value" type="radio" :checked="Documents.OpenMode === value" @change="changeOpenMethod"
                v-model="opening_method" :value="value" name="openMethod"
                class="w-4 h-4 text-blue-600 bg-gray-100  border-gray-300 focus:ring-blue-500 group-hover:cursor-pointer ">
              <label :for="value"
                class="w-full py-1.5 px-2 ms-2 text-sm font-medium text-gray-900  group-hover:cursor-pointer">{{
                  key }}</label>
            </div>
          </div>
        </div>
      </div> -->

      <div class="flex flex-row gap-1 justify-end pr-5">
        <div :class="{ 'text-gray-600 shadow-custom-inset ': Documents.OpenMode === 'OpenSideBar' }"
          class="bg-white px-1 text-gray-400 rounded hover:cursor-pointer active:scale-95"
          @click="changeOpenMethod('OpenSideBar')"
          >
          <font-awesome-icon icon="fa-solid fa-window-maximize" />
        </div>
        <div :class="{ 'text-gray-600 shadow-custom-inset': Documents.OpenMode === 'OpenNewWindow' }"
          class="bg-white px-1 text-gray-400  rounded  hover:cursor-pointer active:scale-95"
          @click="changeOpenMethod('OpenNewWindow')">
          <font-awesome-icon icon="fa-solid fa-window-restore" />
        </div>
      </div>

    </div>

    <div class="flex mt-2 basis-[5%]   flex-row justify-cente6r h-16 items-center gap-2  p-2 w-full">
      <button
        class="rounded-full hover:bg-gray-50 active:scale-95 px-2 disabled:text-gray-200 text-blue-400 hover:text-blue-500"
        :disabled="!toggleBack" @click="goBack()">
        <font-awesome-icon icon="fa-solid fa-circle-arrow-left" />
      </button>

      <nav
        class="flex p-2 w-full bg-white text-white rounded-lg shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700"
        aria-label="Breadcrumb">
        <ol class="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
          <li class="inline-flex items-center" disabled>
            <a @click="goHome()" :class="{
              'pointer-events-none text-gray-400': !type,
              'text-gray-700': type,
            }"
              class="inline-flex items-center text-sm font-medium hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
              <svg class="w-3 h-3 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                viewBox="0 0 20 20">
                <path
                  d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
              </svg>
              Home
            </a>
          </li>
          <li>
            <div class="flex items-center" v-if="type">
              <svg class="rtl:rotate-180 block w-3 h-3 mx-1 text-gray-400" aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="m1 9 4-4-4-4" />
              </svg>
              <a @click="goYear()" :class="{
                'pointer-events-none text-gray-400': !year,
                'text-gray-700': year,
              }"
                class="ms-1 text-sm font-medium hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white">{{
                  type }}</a>
            </div>
          </li>
          <li>
            <div class="flex items-center" v-if="year">
              <svg class="rtl:rotate-180 block w-3 h-3 mx-1 text-gray-400" aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="m1 9 4-4-4-4" />
              </svg>
              <a @click="goMonth()" :class="{
                'pointer-events-none text-gray-400': !month,
                'text-gray-700': month,
              }"
                class="ms-1 text-sm font-medium hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white">{{
                  year }}</a>
            </div>
          </li>
          <!-- Months -->
          <li v-if="month">
            <div class="flex items-center">
              <svg class="rtl:rotate-180 w-3 h-3 mx-1 text-gray-400" aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="m1 9 4-4-4-4" />
              </svg>
              <span class="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">{{ month }}</span>
            </div>
          </li>
        </ol>
      </nav>

      <div class="flex flex-row p-1 items-center gap-2 justify-center"
        v-if="type && year && month && searchQuery == ''">
        <p class="text-xs font-mono text-gray-800">Files:</p>
        <p class="text-xs font-mono text-gray-800">
          {{ files.length }}
        </p>
      </div>
    </div>

    <div class="flex basis-[94%] border  flex-col p-4 overflow-y-scroll relative h-[calc(100vh-350px)]">
      <ul class="w-full space-y-1 px-2 m list-none list-inside dark:text-gray-400">
        <!-- Folders Here -->
        <li v-if="!type && searchQuery == ''" v-for="type in types" :key="type" @click="selectType(type)"
          class="text-md font-semibold antialiased flex items-center gap-1 hover:bg-blue-100 hover:cursor-pointer rounded-sm">
          <font-awesome-icon icon="fa-solid fa-folder" class="text-yellow-400/70 me-2 ms-3" />
          {{ type }}
        </li>

        <li v-if="!data.length && searchQuery == '' && !props.loading" class="text-center text-gray-600 font-italic">
          Empty Data.
        </li>

        <li v-if="type && !year && searchQuery == ''" v-for="year in years" :key="year" @click="selectYear(year)"
          class="text-md font-semibold antialiased flex items-center gap-1 hover:bg-blue-100 hover:cursor-pointer rounded-sm">
          <font-awesome-icon icon="fa-solid fa-folder" class="text-yellow-400/70 me-2 ms-3" />
          {{ year }}
        </li>

        <!-- Months -->
        <li v-if="type && year && !month && searchQuery == ''" v-for="month in months" :key="month"
          @click="selectMonth(month)"
          class="text-md font-semibold antialiased flex items-center gap-1 hover:bg-blue-100 hover:cursor-pointer rounded-sm">
          <font-awesome-icon icon="fa-solid fa-folder" class="text-yellow-400/70 me-2 ms-3" />
          {{ month }}
        </li>
      </ul>
      <!-- Files -->

      <div class="h-full flex flex-row" v-if="type && year && month && searchQuery == ''">
        <div :class="{ 'sm:hidden md:lg:block h-full': pdfSource }" class="h-full grow">
          <RecycleScroller v-if="type && year && month && searchQuery == ''" :items="files" class="h-full"
            :item-size="28" key-field="name" v-slot="{ item }">
            <li @dblclick.prevent="openFile(item.filepath, item.name)" tabindex="0"
              :class="{ 'bg-blue-500 hover:bg-blue-500 text-white group ': ActiveFile === item.name && pdfSource }"
              class="text-md flex-row justify-between font-semibold antialiased flex items-center gap-1 hover:bg-blue-100 hover:cursor-pointer rounded-sm relative group">
              <div class="block w-[60%] overflow-hidden truncate">
                <font-awesome-icon icon="fa-solid fa-file-pdf" class="text-red-500 me-2 ms-3" />
                {{ item.name.replace(".pdf", "") }}
              </div>
              <p :class="{ 'text-white  ': ActiveFile === item.name && pdfSource }"
                class="text-sm italic  font-normal mr-2 text-gray-800">
                {{ item.type }} {{ item.month }}
                {{ item.year }}
                <font-awesome-icon @click="openFile(item.filepath, item.name)" icon="fa-solid fa-folder-open"
                  title="Open file path"
                  class="ms-1 text-gray-400 hover:text-gray-700 text-md hidden group-hover:inline-block transition-all" />
              </p>
            </li>
          </RecycleScroller>
        </div>
        <div class="border-s sm:hidden md:lg:block h-full"></div>
        <div :class="{ 'flex flex-col': pdfSource, 'sm:hidden md:lg:flex': !pdfSource }"
          class=" h-full w-full flex    p-1  items-center justify-center  gap-2 sm:basis-[100%] md:lg:basis-[50%]"
          v-if="Documents.OpenMode === 'OpenSideBar'">
          <div class="flex flex-row items-center w-full h-[2rem] gap-2 " v-if="pdfSource">
            <button v-if="pdfSource && !full_screen" @click="pdfSource = ''"
              class="border px-2 py-1.5 h-full self-start w-[5rem] text-white text-xs font-medium bg-red-400 hover:bg-red-500 rounded hover:text-white ">Close</button>
            <button :title="!full_screen ? 'Expand' : 'Shrink'" v-if="pdfSource" @click="full_screen = !full_screen"
              class="border sm:hidden h-full md:lg:flex w-auto justify-center px-2 py-1.5 self-start rounded text-gray-800 text-sm font-medium bg-white hover:bg-gray-700 hover:text-white hover:transition-colors duration-300 shadow-sm">

              <p class="text-xs tracking-wide" v-if="!full_screen">Full Screen</p>

              <font-awesome-icon icon="fa-solid fa-compress" v-if="full_screen" />
            </button>
          </div>
          <div v-if="pdfSource"
            :class="{ 'hidden': !pdfSource, ' fixed gap-2 top-0 bottom-0 right-0 left-0 z-50 flex flex-col px-5 py-2 bg-gray-700': full_screen, 'flex': !full_screen }"
            class="w-full h-full">
            <button :title="!full_screen ? 'Expand' : 'Shrink'" v-if="full_screen" @click="full_screen = !full_screen"
              class=" justify-center px-2 py-1  self-end w-[3rem] shadow-lg rounded-sm text-gray-800 text-sm font-medium bg-white hover:bg-gray-800  hover:text-white "><font-awesome-icon
                icon="fa-solid fa-expand" v-if="!full_screen" />

              <font-awesome-icon icon="fa-solid fa-compress" v-if="full_screen" /></button>

            <div :class="{ 'top-[3rem]': full_screen, 'top-[4rem]': !full_screen }" v-if="pdfSource"
              class="absolute  right-[7rem] z-50 bg-[#323639]   py-4 px-1 text-xs items-center justify-center  font-mono tracking-wider text-gray-50 font-medium ">
              VBCRAS</div>
            <div class="w-full h-full bg-[#323639]">
              <iframe :src="pdfSource" frameborder="0" class="w-full h-full">
              </iframe>
            </div>
            <!-- <PDFViewer ref="PdfViewerRef" :source="pdfSource"
              :class="{ 'w-full': full_screen, 'w-[5rem] ': !full_screen }" class="h-full" :controls="[
                'print',
                'rotate',
                'zoom',
                'switchPage',
                'catalog']" /> -->
          </div>

          <div v-else class="h-full  w-full  flex items-center justify-center shadow-sm bg-gray-100 relative">
            <p class="text-gray-600 font-mono text-lg tracking-wider bottom-[8rem] font-semibold">
              VBCRAS
            </p>
            <!-- <Wave /> -->
          </div>
        </div>
      </div>

      <!-- Search Scroller -->
      <div class="h-full flex flex-row" v-if="searchQuery != ''">
        <div v-if="!searchData.length && searchQuery != ''"
          class="flex w-full flex-col items-center h-full gap-10 justify-center">
          <p class="text-center text-lg font-bold text-gray-600 font-italic">
            No files found.
          </p>

          <div>
            <img src="../../assets/no result.png" alt="" class="h-[15rem]" srcset="" />
          </div>
        </div>

        <div class="h-full grow">
          <RecycleScroller v-if="searchQuery != '' && searchData.length" :items="searchData" class="h-full"
            :item-size="28" key-field="name" v-slot="{ item }">
            <li tabindex="0" @dblclick="openFile(item.filepath, item.name)"
              class="text-md flex-row justify-between font-semibold antialiased flex items-center gap-1 hover:bg-blue-100 hover:cursor-pointer rounded-sm group">
              <div class="block w-[60%] overflow-hidden truncate">
                <font-awesome-icon icon="fa-solid fa-file-pdf" class="text-red-500 me-2 ms-3" />
                {{ item.name.replace(".pdf", "") }}
              </div>
              <p class="text-sm italic text-gray-600 font-normal mr-2">
                {{ item.type }} {{ item.month }} {{ item.year }}

                <font-awesome-icon icon="fa-solid fa-folder-open" title="Open file path"
                  class="ms-2 text-gray-400 hover:text-gray-700 text-md hidden group-hover:inline-block transition-all" />
              </p>
            </li>
          </RecycleScroller>
        </div>

        <div class="basis-[50%] h-full w-full flex  border-s p-1  items-center justify-center  gap-2"
          v-if="searchQuery != '' && searchData.length">
          <button v-if="pdfSource" @click="pdfSource = ''"
            class="border px-2 py-1.5 self-start rounded-sm text-gray-700 text-sm font-medium hover:bg-red-400 hover:text-white ">Close</button>
          <PDFViewer :source="pdfSource" class="w-[5rem]" v-if="pdfSource" :controls="[
            'print',
            'rotate',
            'zoom',

            'switchPage',]" />
          <div v-else class="h-full w-full flex items-center justify-center shadow-sm bg-gray-100">
            <p class="text-gray-600 font-mono text-lg  ">VBCRAS</p>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, watch } from "vue";
import SearchFilter from "./SearchFilter.vue";
import { useComputerStore } from "../../stores/computer";
import { useScannedDocuments } from "../../stores/scanned";
import Alert from "../Alert.vue";
import { watchDebounced, refDebounced, onStartTyping } from "@vueuse/core";
import PDFViewer from 'pdf-viewer-vue'
import { onClickOutside } from '@vueuse/core'
import Wave from '../Wave.vue'

const full_screen = ref(false)

const ActiveFile = ref()

const showAlert = ref(false);

const computer = useComputerStore();
const Documents = useScannedDocuments();
onMounted(() => {
  computer.getUserName();
});
const pdfSource = ref('')
const toggleBack = ref(false);
const type = ref("");
const year = ref("");
const month = ref("");
const searchQuery = ref("");
const input = ref(null);
const ScannedSettings = ref(false)

const settings = ref(null)

onClickOutside(settings, event =>
  ScannedSettings.value = false
)



const openlist = ref({
  OpenSideBar: 'Sidebar',
  OpenNewWindow: 'New Window',
})


const changeOpenMethod = (value) => {
  Documents.changeOpeningMode(value)
  pdfSource.value = ''
}

const search = refDebounced(searchQuery, 2000);

onStartTyping(() => {
  if (!input.value.active) input.value.focus();
});

const openFile = async (filepath, filename) => {
  try {
    const device = computer.desktop_name;

    ActiveFile.value = filename
    const data = [
      {
        name: filename,
        device_used: device,
        action: "Opened",
      },
    ];

    const add_log = await Documents.add_log(data);
    if (add_log) {

      if (Documents.OpenMode === 'OpenSideBar') {
        const check = await window.ScannedApi.OpenInSideBar(filepath)

        pdfSource.value = 'data:application/pdf;filename=generated.pdf;base64,' + check.fileUrl
        console.log(check)
        if (!check.status) {
          showAlert.value = true;
          pdfSource.value = ''
          setTimeout(() => {
            showAlert.value = false;
          }, 3000);
        }
        return
      }

      const check = await window.LocalCivilApi.checkFile(filepath)
      if (!check) {
        showAlert.value = true;
        pdfSource.value = ''
        setTimeout(() => {
          showAlert.value = false;
        }, 3000);
      }

    }
  } catch (error) {
    showAlert.value = true;
    pdfSource.value = ''
    setTimeout(() => {
      showAlert.value = false;
    }, 3000);
  }
};


const openPath = async (filepath, filename) => {

  try {
    const device = computer.desktop_name;
    const data = [
      {
        name: filename,
        device_used: device,
        action: "Opened",
      },
    ];

    const add_log = await Documents.add_log(data);
    if (add_log) {
      const openpath = await window.LocalCivilApi.openFilePath(filepath);

      if (!openpath) {
        showAlert.value = true;

        setTimeout(() => {
          showAlert.value = false;
        }, 3000);
      }
    }
  } catch (error) {
    showAlert.value = true;
    console.log("Error opening file path");
    setTimeout(() => {
      showAlert.value = false;
    }, 3000);
  }
};



const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
});

const searchData = computed(() => {
  pdfSource.value = ''

  const searchQueryLower = search.value.toLowerCase();
  const searchWords = searchQueryLower.split(/\s+/);

  const filteredData = props.data.filter((data) => {
    const nameLower = data.name.toLowerCase();

    return (
      searchWords.every((word) => nameLower.includes(word)) &&
      (!type.value || data.type === type.value) &&
      (!year.value || data.year === year.value) &&
      (!year.value || !month.value || data.month === month.value)
    );
  });

  return [...new Set(filteredData.map((data) => data))].sort((a, b) => a - b);
});

const goBack = () => {
  pdfSource.value = ''
  if (type.value && year.value && month.value) {
    month.value = "";
    toggleBack.value = true;
  } else if (type.value && year.value) {
    year.value = "";
    toggleBack.value = true;
  } else if (type.value) {
    type.value = "";
    toggleBack.value = false;
  }
};

const goHome = () => {
  pdfSource.value = ''

  type.value = "";
  month.value = "";
  year.value = "";
  toggleBack.value = false;
};
const goYear = () => {
  pdfSource.value = ''

  year.value = "";
  month.value = "";
  toggleBack.value = true;
};
const goMonth = () => {
  pdfSource.value = ''

  month.value = "";
  toggleBack.value = true;
};

const filteredData = computed(() => {
  let filtered = props.data.filter((item) => {
    if (!type.value) return true;
    if (!year.value) return item.type === type.value;
    if (!month.value) return item.type === type.value && item.year === year.value;
    return (
      item.type === type.value && item.year === year.value && item.month === month.value
    );
  });

  return filtered;
});

const types = computed(() => {
  return [...new Set(filteredData.value.map((data) => data.type))].sort((a, b) => a - b);
});

const years = computed(() => {
  return [...new Set(filteredData.value.map((data) => data.year))].sort((a, b) => a - b);
});

const months = computed(() => {
  // const uniqueMonths = [...new Set(filteredData.value.map(data => data.month.toLowerCase()))];
  const monthIndex = {
    January: 0,
    February: 1,
    March: 2,
    April: 3,
    May: 4,
    June: 5,
    July: 6,
    August: 7,
    September: 8,
    October: 9,
    November: 10,
    December: 11,
  };

  return [...new Set(filteredData.value.map((data) => data.month))].sort(
    (a, b) => monthIndex[a] - monthIndex[b]
  );
});

const files = computed(() => {
  return filteredData.value.map((data) => data).sort((a, b) => a - b);
});

const selectType = (selectedType) => {
  pdfSource.value = ''

  toggleBack.value = true;
  type.value = selectedType;
  year.value = "";
  month.value = "";
};

const selectYear = (selectedYear) => {
  pdfSource.value = ''

  toggleBack.value = true;
  year.value = selectedYear;
  month.value = "";
};

const selectMonth = (selectedMonth) => {
  pdfSource.value = ''

  toggleBack.value = true;
  month.value = selectedMonth;
};
</script>
