<template>
  <div class="w-[10rem] h-full">
    <SplitButton label="Open File" size="small" :pt="{
      button: {
        root: {
          class:
            'text-gray-900 hover:text-blue-600 bg-white text-sm border border-gray-300 focus:outline-none hover:bg-gray-100  focus:ring-gray-200 font-medium rounded-s text-sm p-2 pr-6 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700',
        },
      },
      menuButton: {
        root: {
          class: 'bg-gray-200 p-2  border border-gray-200 hover:bg-slate-400 ',
        },
      },
    }" @click="openFile(filepath, filename)" :model="items" />
  </div>
  <Dialog v-model:visible="visible" modal header="We couldn't open the file." :style="{ width: '50rem' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
    <div class="p-2">
      <span class="font-medium ">It looks like we're having trouble accessing the file you requested. Here are a few
        things
        that might be the issue:</span>

      <ul class="mt-4 mb-4 list-disc list-inside">
        <li> <span class="font-bold">Shared Drive Connection:</span> Double-check that the shared drive where the file is
          located is
          properly connected
          and
          accessible.</li>
        <li>
          <span class="font-bold">File Synchronization:</span>
          If the file is on a storage server, confirm that it's fully synced and available
          locally.
        </li>
      </ul>

      <span class="font-medium ">What you can do:</span>
      <ul class="mt-2  list-disc list-inside">
        <li> <span class="font-bold">Check your connection:</span> Verify the shared drive connection and internet access.
        </li>
        <li>
          <span class="font-bold">Wait for synchronization:</span>
          If using storage server, allow time for the file to fully synced.
        </li>
        <li>
          <span class="font-bold">Try again:</span>
          After addressing the potential issues, try opening the file again.
        </li>
      </ul>
    </div>
  </Dialog>
</template>

<script setup>
import SplitButton from "primevue/splitbutton";
import { defineProps, ref, inject, onMounted } from "vue";
import axios from "axios";
import Dialog from 'primevue/dialog';

import { useComputerStore } from '../../stores/computer'

const swal = inject("$swal");
const scannedId = ref("");
const visible = ref(false)

import { useScannedDocuments } from "../../stores/scanned";
const Documents = useScannedDocuments();


const PCName = useComputerStore();
onMounted(() => {
  PCName.getUserName();
});


const props = defineProps({
  filepath: {
    required: true,
  },
  id: {
    requird: true,
    type: Number,
  },
  filename: {
    required: true,
    type: String
  }
});

const items = [
  {
    label: "Open File Path",
    icon: "pi pi-folder",
    command: () => {
      openPath(props.filepath, props.filename);
    },
  },
  {
    label: "Move to Trash",
    icon: "pi pi-times",

    command: () => {
      deleteScanned(props.id);
    },
  },
];

const openFile = async (filepath, filename) => {
  try {
    const device = PCName.desktop_name
    const data = (
      [{
        name: filename,
        device_used: device,
        action: 'Opened'
      }
      ])

    const add_log = await Documents.add_log(data)

    if (add_log) {
      const check = await window.LocalCivilApi.checkFile(filepath);
      if (!check) {
        console.log('Cant Open')
        visible.value = true
      }
    }

  } catch (error) {
    // console.log(error)
    visible.value = true

  }
};
const openPath = async (filepath, filename) => {
  try {
    const device = PCName.desktop_name

    const data = (
      [{
        name: filename,
        device_used: device,
        action: 'Opened Path'
      }
      ])

    const add_log = await Documents.add_log(data)
    if (add_log) {
      const check = await window.LocalCivilApi.openFilePath(filepath);
    }

  } catch (error) {

  }
};

const deleteScanned = (id) => {
  swal
    .fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    })
    .then((result) => {
      if (result.isConfirmed) {
        swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        });

        remove(id);
      }
    });
};

const remove = async (id) => {
  try {
    let host = localStorage.getItem('host')
    let tokenStr = localStorage.getItem('token')
    let device_used_to_delete = PCName.desktop_name
    axios
      .delete(`http://${host}:1216/scanned/delete/${id}&${device_used_to_delete}`, {
        headers: { "Authorization": `Bearer ${tokenStr}` }
      })
      .then((response) => {
        console.log("Document deleted successfully!");
        console.log(response.data);
        Documents.refresh()
      })
      .catch((error) => {
        console.error("Error deleting document:", error);
      });
  } catch (error) { }
};
</script>
