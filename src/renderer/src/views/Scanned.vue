<template>
  <div @dragenter="handleDragEnter" @dragover.prevent>
    <div class="flex flex-row justify-between items-center relative">
      <p class="text-2xl text-slate-800 text-wrap font-medium">Scanned Documents</p>
      <div
        ref="dropzone"
        @dragleave="handleDragLeave"
        @drop="handleDrop"
        :class="{ hidden: !isDropzoneVisible }"
        class="absolute top-0 bottom-0 left-0 right-0 h-[450px] rounded-sm border-4 p-8 border-blue-500 border-dashed items-center z-[99999] bg-white cursor-grabbing transition-all"
      >
        <p class="text-4xl font-bold text-gray-400 text-center mt-36 uppercase">
          Drop PDF FIle Here
        </p>
      </div>
      <button
        @click="openModal"
        class="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-sm text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button"
      >
        ADD
      </button>
    </div>

    <div class="flex flex-col mt-10 w-auto">
      <DataTable />
    </div>
  </div>

  <div
    id="dropModal"
    ref="dropModal"
    tabindex="-1"
    aria-hidden="true"
    class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
  >
    <div class="relative p-4 w-full max-w-2xl max-h-full">
      <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
        <div
          class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600"
        >
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
            Scanned Document
          </h3>
          <button
            type="button"
            @click="closeModal"
            class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
          >
            <svg
              class="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span class="sr-only">Close modal</span>
          </button>
        </div>
        <div class="p-4 md:p-5 space-y-4">
          <div>
            <label
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              for="dropInput"
              >File</label
            >
            <input
              v-on:change="file"
              class="block w-full text-sm text-gray-900 border border-gray-300 rounded-sm cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              id="dropInput"
              ref="dropInput"
              type="file"
            />
          </div>
          <div>
            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >Name</label
            >
            <input
              type="text"
              v-model="filename"
              ref="filename"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
            />
          </div>

          <div>
            <h3 class="mb-4 font-semibold text-gray-900 dark:text-white">Type</h3>
            <ul
              class="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <li
                class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600"
              >
                <div class="flex items-center ps-3">
                  <input
                    id="select_birth"
                    type="radio"
                    value="birth"
                    name="list-radio"
                    v-model="selectedOption"
                    @change="updateFilePath"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                  />
                  <label
                    for="select_birth"
                    class="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >Birth
                  </label>
                </div>
              </li>
              <li
                class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600"
              >
                <div class="flex items-center ps-3">
                  <input
                    id="select_death"
                    type="radio"
                    value="death"
                    name="list-radio"
                    v-model="selectedOption"
                    @change="updateFilePath"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                  />
                  <label
                    for="select_death"
                    class="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >Death</label
                  >
                </div>
              </li>
              <li
                class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600"
              >
                <div class="flex items-center ps-3">
                  <input
                    id="select_marriage"
                    type="radio"
                    value="marriage"
                    name="list-radio"
                    v-model="selectedOption"
                    @change="updateFilePath"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                  />
                  <label
                    for="select_marriage"
                    class="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >Marriage</label
                  >
                </div>
              </li>
              <li
                class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600"
              >
                <div class="flex items-center ps-3">
                  <input
                    id="select_legal"
                    type="radio"
                    value="legal"
                    name="list-radio"
                    v-model="selectedOption"
                    @change="updateFilePath"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                  />
                  <label
                    for="select_legal"
                    class="block w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >Legal Instrument</label
                  >
                </div>
              </li>
              <li
                class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600"
              >
                <div class="flex items-center ps-3">
                  <input
                    id="select_other"
                    type="radio"
                    value="other"
                    name="list-radio"
                    v-model="selectedOption"
                    @change="updateFilePath"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                  />
                  <label
                    for="select_other"
                    class="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >Other</label
                  >
                </div>
              </li>
            </ul>
          </div>
          <div>
            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >Folder Path</label
            >
            <div class="flex flex-row gap-1">

              <input
                type="text"
                id="folder-input"
                v-model="filePathChange"
                class="bg-gray-50 border text-sm font-semibold border-gray-300 text-gray-900 rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-[78%] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
              />
              <button
                type="button"
                id="select-folder"
                class="inline-block text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:outline-none focus:ring-blue-300 rounded border border-gray-300 text-sm font-medium px-5 py-2.5 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
              >
                Change Path
              </button>
            </div>
          </div>
        </div>
        <div
          class="flex justify-end items-center p-2 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600 gap-2"
        >
          <button
            @click="closeModal"
            type="button"
            class="ms-3 text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
          >
            Cancel
          </button>
          <button
            @click="closeModal"
            type="button"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import DataTable from "../components/DataTable.vue";
import { Modal } from "flowbite";

export default {
  data() {
    return {
      members: [],
      filename: "",
      filePathChange: "",
      isDropzoneVisible: false,
    };
  },
  methods: {
    // getMembers() {
    //   const path = "http://127.0.0.1:5000/members";
    //   axios
    //     .get(path)
    //     .then((res) => {
    //       this.members = res.data.members[0];
    //       console.log(res);
    //     })
    //     .catch((error) => {
    //       console.error(error);
    //     });
    // },
    handleDragEnter(event) {
      event.preventDefault();
      console.log("Drag Enter");
      this.isDropzoneVisible = true;
    },
    handleDragLeave(event) {
      event.preventDefault();
      console.log("Drag Leave");
      this.isDropzoneVisible = false;
    },
    handleDrop(event) {
      event.preventDefault();
      const file = event.dataTransfer.files[0];
      if (file.type === "application/pdf") {
        this.isDropzoneVisible = false;
        const $targetModal = this.$refs.dropModal;
        const modal = new Modal($targetModal);
        modal.show();
        this.$refs.filename.focus();
        this.filename = file.name;
      } else {
        this.isDropzoneVisible = false;
        alert("PDF FILE ONLY!");
      }
    },
    closeModal() {
      this.isDropzoneVisible = false;
      const modal = new Modal(this.$refs.dropModal);
      modal.hide();
    },
    openModal() {
      this.isDropzoneVisible = false;
      const modal = new Modal(this.$refs.dropModal);
      modal.show();
    },
    updateFilePath() {
      switch (this.selectedOption) {
        case "birth":
          this.filePathChange =
            "\\SynologyDrive\\Joan\\SCANNED DOCUMENTS\\SCANNED BIRTH 1946-2024";
          break;
        case "death":
          this.filePathChange =
            "\\SynologyDrive\\Joan\\SCANNED DOCUMENTS\\SCANNED DEATH 1946-2023";
          break;
        case "marriage":
          this.filePathChange =
            "\\SynologyDrive\\Joan\\SCANNED DOCUMENTS\\SCANNED MARRIAGE 1946-2023";
          break;
        case "legal":
          this.filePathChange =
            "\\SynologyDrive\\Joan\\SCANNED DOCUMENTS\\SCANNED LEGAL INSTRUMENTS 1996-2024";
          break;
        case "other":
          this.filePathChange = "\\SynologyDrive\\Joan\\SCANNED DOCUMENTS";
          break;
        default:
          this.filePathChange = "";
      }
    },
  },
  mounted() {
    // Select Folder API
    const selectFolderButton = document.getElementById("select-folder");

    if (selectFolderButton) {
      selectFolderButton.addEventListener("click", handleFolderSelection);
    }

    async function handleFolderSelection() {
      try {
        const selectedPath = await window.electronAPI.selectFolder();

        if (selectedPath) {
          updateFolderInputValue(selectedPath);
        } else {
          console.log("Folder selection was canceled.");
        }
      } catch (error) {
        console.error("Error during folder selection:", error);
      }
    }

    function updateFolderInputValue(path) {
      const folderInput = document.getElementById("folder-input");
      if (folderInput) {
        folderInput.value = path;
      }
    }
  },

  // created() {
  //   this.getMembers();
  // },
  components: { DataTable },
};
</script>
