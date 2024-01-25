<template>
  <Toast />
  <SplitButton
    label="Open File"
    size="small"
    :pt="{
      button: {
        root: {
          class:
            'text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100  focus:ring-gray-200 font-medium rounded-s text-sm p-2 pr-6 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700',
        },
      },
      menuButton: {
        root: {
          class: 'bg-gray-200 p-2  border border-gray-200 hover:bg-slate-400',
        },
      },
    }"
    @click="openFile(filepath)"
    :model="items"
  />
</template>

<script setup>
import SplitButton from "primevue/splitbutton";
import Toast from "primevue/toast";
import { defineProps, ref } from "vue";
import { useToast } from "primevue/usetoast";

const toast = useToast();
const props = defineProps({
  filepath: {
    required: true,
  },
  id: {
    requird: true,
    type: Number,
  },
});

const items = [
  {
    label: "Open File Path",
    icon: "pi pi-folder",
    command: () => {
      openPath(props.filepath);
    },
  },
  {
    label: "Update Record",
    icon: "pi pi-external-link",

    command: () => {},
  },
  {
    label: "Remove Record",
    icon: "pi pi-times",

    command: () => {},
  },
];

const openFile = async (filepath) => {
  try {
    const check = await window.LocalCivilApi.checkFile(filepath);
    // if (check) {
    //   toast.add({
    //     severity: "success",
    //     detail: "The file was found.",
    //     life: 1000,
    //   });
    // } else {
    //   toast.add({
    //     severity: "info",
    //     summary: "Info",
    //     detail: "Message Content",
    //     life: 3000,
    //   });
    // }
  } catch (error) {
    toast.add({
      severity: "info",
      summary: "Info",
      detail: "Message Content",
      life: 3000,
    });
  }
};
const openPath = async (filepath) => {
  try {
    const check = await window.LocalCivilApi.openFilePath(filepath);
    // if (check) {
    //   toast.add({
    //     severity: "success",
    //     summary: "Success",
    //     life: 3000,
    //   });
    // } else {
    //   toast.add({
    //     severity: "error",
    //     summary: "Not Opening",
    //     detail: "Something went wrong",
    //     life: 3000,
    //   });
    // }
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Not Opening",
      detail: error,
      life: 3000,
    });
  }
};
</script>
