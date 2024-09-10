<template>
  <div>
    <Modal medium label="Preferences">
      <template v-slot:header>
        <ModalCloseButton @click="emit('close-modal', false)" />
      </template>

      <div class="h-full">
        <div class="flex flex-col gap-2">
          <div class="flex items-center w-full justify-center">
            <div class="flex flex-row flex-wrap w-fit divide-x border divide-gray-200 shadow-sm">
              <Button label="Default Values" :isActive="defaultValues" @click="tabOpen('defaultValues')" />
              <Button label="Date Settings" :isActive="datePosting" @click="tabOpen('datePosting')" />
              <Button label="File Location" :isActive="fileLocation" @click="tabOpen('file')" />
              <Button label="Template" :isActive="templates" @click="tabOpen('templates')" />
            </div>
          </div>
        </div>
        <div class="flex flex-col w-full mt-10 gap-6 p-2" v-if="defaultValues">
          <div class="flex flex-col gap-4 w-full">
            <p class="font-semibold text-md tracking-wide italic">
              Local Civil Registry Office
            </p>

            <Input label="Municipal Civil Registrar" />
          </div>
          <div class="flex flex-col gap-4 w-full">
            <p class="font-semibold text-md tracking-wide italic">
              Filing this Petition at
            </p>

            <div class="grid grid-cols-2 w-full gap-2">
              <Input label="Municipality" />
              <Input label="Province" />
            </div>
          </div>

          <div class="flex flex-col gap-4 w-full">
            <p class="font-semibold text-md tracking-wide italic">
              Administering Officer
            </p>

            <div class="grid grid-cols-2 w-full gap-2">
              <Input label="Name" />
              <Input label="Position" />
            </div>
          </div>
          <div class="flex flex-col gap-4 w-full">
            <p class="font-semibold text-md tracking-wide italic">Petition</p>

            <div class="grid grid-cols-2 w-full gap-2">
              <Input label="Nationality" />
              <Input label="Country" />
            </div>
          </div>
        </div>

        <div class="flex flex-col items-center justify-center w-full mt-5 gap-6 p-2" v-if="datePosting">
          <div class="grid grid-cols-3 gap-4 w-full items-center">
            <div class="flex items-center justify-center h-full pt-6">
              <p class="font-semibold text-md">Day's to Add Before</p>
            </div>
            <div class="flex flex-col gap-2">
              <Input type="number" label="Notice of Posting" />
            </div>
            <div class="flex flex-col h-full gap-2 pt-6">
              <div class="flex items-center">
                <input id="default-checkbox" type="checkbox" value=""
                  class="w-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                <label for="default-checkbox" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Skip
                  Holidays</label>
              </div>
              <div class="flex items-center">
                <input id="default-checkbox" type="checkbox" value=""
                  class="w-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                <label for="default-checkbox" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Skip
                  Weekends</label>
              </div>
            </div>
          </div>
          <div class="grid grid-cols-3 gap-4 w-full items-center">
            <div class="flex items-center justify-center h-full pt-6">
              <p class="font-semibold text-md">Day's to Add Before</p>
            </div>
            <div class="flex flex-col gap-2">
              <Input type="number" label="Certificate of Posting" />
            </div>
            <div class="flex flex-col h-full gap-2 pt-6">
              <div class="flex items-center">
                <input id="default-checkbox" type="checkbox" value=""
                  class="w-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                <label for="default-checkbox" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Skip
                  Holidays</label>
              </div>
              <div class="flex items-center">
                <input id="default-checkbox" type="checkbox" value=""
                  class="w-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                <label for="default-checkbox" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Skip
                  Weekends</label>
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-col items-center justify-center w-full mt-5 gap-6 p-2" v-if="fileLocation">
          <div class="flex flex-col gap-3 w-full">
            <p class="font-semibold text-md tracking-wide text-blue-500">File Location</p>
            <Input label="Default File Location" />
          </div>
        </div>
      </div>

      <template v-slot:footer>
        <div class="h-full flex items-center justify-end gap-2 w-full">
          <button type="button" @click="submitForm()"
            class="py-2 px-4 tracking-wide text-sm font-medium text-white bg-green-500 rounded active:scale-95 transition-all hover:bg-green-600 shadow-sm hover:text-white focus:z-10 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
            Save Changes
          </button>
          <button type="button" @click="emit('close-modal', false)"
            class="py-2 px-4 tracking-wide text-sm font-medium bg-white border border-gray-300 text-gray-900 rounded active:scale-95 transition-all hover:bg-red-500 shadow-sm hover:text-white focus:z-10 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
            Close
          </button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref } from "vue";

import Modal from "../../client/modal/Modal.vue";
import ModalCloseButton from "../../client/modal/ModalCloseButton.vue";
import Input from "../inputs/Input.vue";
import Button from "../buttons/Button.vue";
const emit = defineEmits(["close-modal"]);

const defaultValues = ref(true);
const datePosting = ref(false);
const fileLocation = ref(false);
const templates = ref(false);

const tabOpen = (value) => {
  if (value === "defaultValues") {
    defaultValues.value = true;
    datePosting.value = false;
    fileLocation.value = false;
    templates.value = false;
  } else if (value === "datePosting") {
    datePosting.value = true;
    fileLocation.value = false;
    defaultValues.value = false;
    templates.value = false;
  } else if (value === "file") {
    defaultValues.value = false;
    datePosting.value = false;
    fileLocation.value = true;
    templates.value = false;
  } else if (value === "templates") {
    defaultValues.value = false;
    datePosting.value = false;
    fileLocation.value = false;
    templates.value = true;
  }
};
</script>
