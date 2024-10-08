<template>

  <div class="w-full flex flex-col items-center justify-center h-full  ">
    <button v-if="props.params.data.status === 'PENDING' && props.params.data.created_by === user.user_id" type="button"
      ref="mainBtn" @click="approve_petition()"
      class="px-3 py-1 text-xs tracking-wide  bg-green-500 hover:bg-green-600 text-white rounded font-medium active:scale-95 text-center    transition-all focus:outline-none">
      CREATE FINALITY
    </button>
    <!-- <div v-else class="flex h-full w-full bg-blue-200 items-center justify-center relative">
      <p class="font-medium">Pending</p>
    </div> -->

    <!-- <div v-if="isWaiting()" class="flex h-full w-full bg-yellow-200 items-center justify-center relative">
      <p class=" font-medium text-gray-700 -mt-2 ">TO BE GRANTED</p> <br>
      <p class="text-xs font-medium text-gray-700 absolute  bottom-0">{{
        formatDate(props.params.data.petition_date_granted) }}</p>
    </div> -->
    <div v-if="props.params.data.status === 'FINISHED'"
      class="flex h-full w-full bg-green-200 items-center justify-center relative">
      <p class="font-medium">FINISHED</p>
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

const approve_petition = () => {
  console.log(props.params.data)

  router.push('/pages/cce_approval/' + props.params.data.id)
};

</script>

<style lang="scss" scoped></style>
