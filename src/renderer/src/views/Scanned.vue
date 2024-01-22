<template>
  <div class="flex flex-col h-[calc(100vh-92px)] py-3 relative" @dragenter="showDropzone">
    <DropZone @dragleave="handleDragLeave" @drop="handleDrop" @dragover.prevent
      :isDropzoneVisible="isDropzoneVisible" />
    <div class="flex flex-row justify-start p-2">
      <p class="text-2xl text-slate-800 text-wrap font-medium">Scanned Documents</p>
    </div>
    <div class="mt-5 mb-5 h-max">
      <DataAppTable />
    </div>

    <fwb-modal v-if="isShowModal" @close="closeModal" persistent class="rounded-sm z-50">
      <template #header>
        <div class="flex items-center text-lg font-bold">Scanned Document</div>
      </template>
      <template #body>
        <div class="p-4 md:p-5 space-y-4">
          <div class="flex flex-row justify-start items-center p-2 gap-1">
            <div>
              <img
                src="https://png.pngtree.com/png-clipart/20220612/original/pngtree-pdf-file-icon-png-png-image_7965915.png"
                class="h-12 max-w-xs" alt="" />
            </div>
            <div>
              <p class="text-md font-semibold text-slate-900 text-justify">
                {{ filename }}
              </p>
              <p class="text-sm text-slate-900 text-justify">{{ filesize }} MB</p>

            </div>
          </div>
          <div>
            <DropInputField type="text" id="name" label="File Name" v-model="formData.name_file"
              :error="v$.name_file.$error" />
          </div>


          <div class="flex flex-row gap-1 items-center justify-center">
            <div class="flex flex-col w-[90%]">
              <DropInputField type="text" id="destination" label="File Path" v-model="formData.target"
                :error="v$.target.$error" className=" w-full" />
            </div>

            <fwb-button @click="changePath" class="w-auto rounded-sm">
              Path
            </fwb-button>


          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-between">
          <fwb-button @click="closeModal" color="alternative"> Cancel </fwb-button>
          <fwb-button @click="submitForm" color="blue"> Save </fwb-button>
        </div>
      </template>
    </fwb-modal>
  </div>
</template>

<script setup>
  import { ref, inject } from "vue";
  import DropZone from "../components/ScanApp/DropZone.vue";
  import DataAppTable from "../components/DataAppTable.vue";
  import axios from "axios";

  import { FwbButton, FwbModal } from "flowbite-vue";
  import DropInputField from "../components/ScanApp/dropinputfield.vue";

  import { reactive, computed } from "vue";
  import { useVuelidate } from "@vuelidate/core";
  import { required } from "@vuelidate/validators";

  // SweetAlert
  const swal = inject("$swal");

  // Modal & DropZone
  const isShowModal = ref(false);
  const isDropzoneVisible = ref(false);

  // Text
  const filename = ref("");
  const filesize = ref("");
  const picked = ref("other");



  // FormData
  const formData = reactive({
    name_file: "",
    target: "",
    source: "",
  });

  const rules = computed(() => {
    return {
      name_file: { required },
      target: { required },
      source: { required },
    };
  });

  const v$ = useVuelidate(rules, formData);

  const submitForm = async () => {
    v$.value.$touch();
    if (v$.value.$error) {
      return;
    }

    const name = formData.name_file;
    const filepath = formData.target;
    const type = "Other";

    try {
      const submit = await axios
        .post(
          "http://127.0.0.1:1216/add",
          { name, filepath, type },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          console.log(response);
          if (response.data.status === "success") {
            closeModal();
            swal({
              title: "Success!",
              text: response.data.message,
              icon: "success",
            });
          } else if (response.data.status == "required") {
            swal({
              title: "Required Fields",
              text: response.data.message,
              icon: "error",
            });
          }
        })
        .catch((error) => {
          closeModal();
          swal({
            title: "Success!",
            text: "Document added successfully.",
            icon: "success",
          });
        });
    } catch (error) { }
  };

  // Close Modal
  const closeModal = () => {
    isShowModal.value = false;
    filename.value = "";
    filesize.value = "";
    picked.value = "other";
    formData.name_file = "";
    formData.target = "";
  };

  const showDropzone = () => {
    isDropzoneVisible.value = true;
  };

  const handleDragLeave = () => {
    isDropzoneVisible.value = false;
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    isDropzoneVisible.value = false;

    if (file && file.type === "application/pdf") {
      isShowModal.value = true;

      filename.value = file.name;
      filesize.value = (file.size / (1024 * 1024)).toFixed(2);
      formData.target = file.path;
      const filenameWithoutExtension = file.name.replace(/\.pdf$/i, "");
      filename.value = filenameWithoutExtension;
      formData.name_file = filenameWithoutExtension;
      formData.source = file.path;
    } else {
      swal({
        icon: "error",
        title: "Upload PDF only!",
        text: "File",
      });
    }
  };

  const changePath = async () => {
    try {
      const selectedPath = await window.LocalCivilApi.selectFolder();
      if (selectedPath) {
        formData.target = selectedPath;
      } else {
        console.log("Folder selection was canceled.");
      }
    } catch (error) {
      console.error("Error during folder selection:", error);
    }
  };

  const FileOperation = () => {
    swal({
      title: "<p class='select-none'>Do you want to move the file?</P",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Yes",
      denyButtonText: `Copy`,
    }).then((result) => {
      if (result.isConfirmed) {
        move();
        if (move()) {
          swal({
            icon: "success",
            title: "Moved!",
            text: "The file was moved to the desired location.",
          });
          closeModal();
        } else {
          swal("Error!", "", "error");
        }
      } else if (result.isDenied) {
        copy();
        if (copy()) {
          swal({
            icon: "success",
            title: "Moved!",
            text: "The file was moved to the desired location.",
          });
          closeModal();
        } else {
          swal("Error!", "", "error");
        }
      }
    });
  };
  // Move
  const move = async () => {
    try {
      await window.LocalCivilApi.moveFile(
        formData.source.value,
        target + "\\" + formData.name_file + ".pdf"
      );
    } catch (error) {
      console.error("Error:", error);
    }
  };
  // Copy
  const copy = async () => {
    try {
      await window.LocalCivilApi.copyFile(
        formData.source.value,
        target + "\\" + formData.name_file + ".pdf"
      );
    } catch (error) {
      console.error("Error:", error);
    }
  };
</script>