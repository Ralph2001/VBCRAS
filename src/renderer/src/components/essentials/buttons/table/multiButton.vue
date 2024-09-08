<template>
  <!-- <Teleport to="body">
    <FinalityMessage v-if="finality" @close-modal="finality = false" :data="props.params" />
  </Teleport> -->

  <!-- <div class="flex items-center h-full justify-center relative w-full" :class="{
    'bg-green-200': Approved,
    'bg-red-200': Disapproved,
  }" ref="mainBtn">
    <div class="flex flex-row divide-x" v-if="status === ''">
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

    <div v-if="showOption"
      class="absolute flex  gap-2 flex-col w-full p-2 bg-white border z-50 items-center top-[95%] ">
      <button @click="ImpugnedBtn" type="button"
        class="px-3 py-2 text-xs font-medium text-center w-full text-white bg-gray-500 hover:bg-gray-600 focus:outline-none shadow-2xl">
        Impugn
      </button>

    </div>
  </div> -->

  <div class="w-full flex flex-col items-center justify-center h-full relative">
    <button type="button" ref="mainBtn" @click="approve_petition()"
      class="px-3 py-1 text-xs tracking-wide  bg-green-500 hover:bg-green-600 text-white rounded font-medium active:scale-95 text-center    transition-all focus:outline-none">
      OPEN
    </button>
  </div>


</template>

<script setup>
import { ref } from "vue";
import { useRouter } from 'vue-router'
const router = useRouter()
const mainBtn = ref(null);

const props = defineProps({
  params: {
    type: Object,
    required: true
  }
})


const approve_petition = () => {
  console.log(props.params.data)

  // Add Validation Here
  router.push('/pages/cce_approval/' + props.params.data.id)


  // Swal
  //   .fire({
  //     title: "Are you sure?",
  //     text: "You won't be able to revert this!",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "#3085d6",
  //     cancelButtonColor: "#d33",
  //     confirmButtonText: "Yes, approve it!",
  //   })
  //   .then(async (result) => {
  //     if (result.isConfirmed) {

  //       const create_finality = await window.ClericalApi.CreateFinality(props.params.data);

  //       Approved.value = true;
  //       showOption.value = false;
  //       status.value = "Approved";
  //       finality.value = true
  //     }
  //   });

};

</script>

<style lang="scss" scoped></style>
