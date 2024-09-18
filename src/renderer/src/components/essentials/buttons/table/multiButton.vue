<template>

  <div class="w-full flex flex-col items-center justify-center h-full  ">
    <button v-if="!isWaiting || user.user_role === 1" type="button" ref="mainBtn" @click="approve_petition()"
      class="px-3 py-1 text-xs tracking-wide  bg-green-500 hover:bg-green-600 text-white rounded font-medium active:scale-95 text-center    transition-all focus:outline-none">
      CREATE FINALITY
    </button>
    <div v-if="isWaiting && user.user_role === 2"
      class="flex h-full w-full bg-yellow-200 items-center justify-center relative">
      <p class=" font-medium text-gray-700 -mt-2 ">PENDING</p> <br>
      <p class="text-xs font-medium absolute  bottom-0">{{ formatDate(props.params.data.petition_date_granted) }}</p>
    </div>
  </div>


</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from 'vue-router'
const router = useRouter()
const mainBtn = ref(null);
import { AuthStore } from "../../../../stores/Authentication";
import { format } from "date-fns";
const user = AuthStore()


onMounted(() => {
  user.isAuthenticated()
})
const props = defineProps({
  params: {
    type: Object,
    required: true
  }
})
function formatDate(data) {
 return format(data, "MMMM dd, yyyy")
}

function isWaiting() {
  const now = new Date()
  const grantedDate = new Date(props.params.data.petition_date_granted);
  console.log(now > grantedDate)
  return now > grantedDate;
}

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
