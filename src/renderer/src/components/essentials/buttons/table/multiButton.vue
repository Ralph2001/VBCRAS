<template>
  <Teleport to="body">

    <FinalityMessage v-if="finality" @close-modal="finality = false" :data="props.params" />

  </Teleport>
  <div class="flex items-center h-full justify-center relative w-full" :class="{
    'bg-green-200': Approved,
    'bg-red-200': Disapproved,
    'bg-yellow-200': Impugned,
  }" ref="mainBtn">
    <div class="flex flex-row" v-if="status === ''">
      <button @click="ApprovedBtn" type="button"
        class="px-3 py-2 text-xs font-medium text-center text-white bg-green-500 hover:bg-green-600 focus:outline-none transition-all hover:shadow-md">
        Approve
      </button>
      <button @click="dropdown" type="button"
        class="px-3 py-2 text-xs font-medium text-center text-white bg-green-600 hover:bg-green-700 focus:outline-none">
        <font-awesome-icon icon="fa-solid fa-angle-down" />
      </button>
    </div>

    <div class="flex flex-col items-center w-full" v-if="status !== ''">
      <p class="text-sm font-semibold">{{ status }}</p>
      <p class="text-xs italic">on April 16, 2024</p>
    </div>

    <div v-if="showOption" class="absolute flex gap-1 flex-col w-full p-2 bg-white border z-50 h-[5.2rem] top-[95%]">
      <button @click="DisapprovedBtn" type="button"
        class="px-3 py-2 text-xs font-medium text-center text-white bg-red-400 hover:bg-red-500 focus:outline-none">
        Disapprove
      </button>
      <button @click="ImpugnedBtn" type="button"
        class="px-3 py-2 text-xs font-medium text-center text-white bg-gray-500 hover:bg-gray-600 focus:outline-none">
        Impugn
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { onClickOutside } from "@vueuse/core";
import FinalityMessage from "../../../modals/FinalityMessage.vue";
const showOption = ref(false);
const status = ref("");
import Swal from 'sweetalert2'
const finality = ref(false)

const mainBtn = ref(null);
const dropdown = () => {
  showOption.value = !showOption.value;
};

const Approved = ref(false);
const Disapproved = ref(false);
const Impugned = ref(false);

const props = defineProps({
  params: {
    type: Object,
    required: true
  }
})

onClickOutside(mainBtn, (event) => (showOption.value = false));

const ApprovedBtn = () => {
  Swal
    .fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, approve it!",
    })
    .then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Success!",
          text: "Petition Successfully Approved.",
          icon: "success",
        });

        Approved.value = true;
        showOption.value = false;
        status.value = "Approved";
        finality.value = true
      }
    });



};

const DisapprovedBtn = () => {
  Disapproved.value = true;
  status.value = "Disapproved";
  showOption.value = false;
};
const ImpugnedBtn = () => {
  Impugned.value = true;
  status.value = "Impugned";
  showOption.value = false;
};
</script>

<style lang="scss" scoped></style>
