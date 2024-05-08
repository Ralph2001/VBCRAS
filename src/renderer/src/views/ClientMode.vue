<template>
  <div class="h-full relative">
    <Sidebar header="Connect to Server" />
    <div class="flex flex-col h-full justify-center items-center p-4 md:ml-[50%] lg:ml-[30%] relative">
      <Transition enter-active-class="animate__animated animate__fadeInDown"
        leave-active-class="animate__animated animate__fadeOutUp">
        <Alert v-if="error" message="Error: Unable to connect to host." error />
      </Transition>
      <div class="mt-auto flex items-center flex-col gap-2 relative h-20">
        <HostInput label="Host Address" v-model="formData.hostAddress" :error="v$.hostAddress.$error"
          @keyup.enter="connectToHost()" :autofocus="true">
          <p v-if="v$.hostAddress.$error" class="mt-2 text-sm text-red-600 dark:text-red-500">
            <span class="font-medium">Error!</span>
            {{ v$.hostAddress.$errors[0].$message }}
          </p>
        </HostInput>
        <button :class="{ 'animate__animated animate__bounce animate__repeat-3': error }"
          class="rounded-full text-gray-500 font-semibold text-sm p-2 absolute top-[30px] right-[-30px]"
          @click="infoBtn">
          ?
        </button>
        <InfoMessage v-if="info" />
      </div>
      <div class="mt-auto flex flex-row items-center w-full">
        <HandleButton title="Change Mode" @click="changeMode()" />
        <div class="ml-auto flex flex-row gap-3">
          <!-- <HandleButton title="Auto Connect" /> -->
          <HandleButton :title="connectText" @click="connectToHost()" :isLoading="loading" :isDisabled="isDisabled" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import HandleButton from "../components/mode/HandleButton.vue";
import HostInput from "../components/mode/HostInput.vue";
import Sidebar from "../components/mode/Sidebar.vue";
import { ref, reactive, computed, onMounted } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, maxLength, ipAddress } from "@vuelidate/validators";
import { useModeStore } from "../stores/mode";
import { useHostStore } from "../stores/connection";
import InfoMessage from "../components/client/InfoMessage.vue";
import Swal from "sweetalert2";
import Alert from "../components/Alert.vue";
// import KillSwitch from '../components/client/KillSwitch.vue';

const connectText = ref("Connect");
const mode = useModeStore();
const con = useHostStore();
const loading = ref();
const isDisabled = ref();
const info = ref(false);
const error = ref(false);

const infoBtn = () => {
  info.value = !info.value;
};

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 5000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

const changeMode = () => {
  mode.removeMode();
};

const formData = reactive({
  hostAddress: null,
});

const rules = computed(() => {
  return {
    hostAddress: { required, ipAddress },
  };
});

const v$ = useVuelidate(rules, formData);

const connectToHost = async () => {
  v$.value.$touch();
  if (v$.value.$error) {
    return;
  }

  const hostAddress = formData.hostAddress;
  connectText.value = "Connecting";
  loading.value = true;
  isDisabled.value = true;
  error.value = false;

  try {
    const connect = await con.connectHost(hostAddress);
    if (!connect) {
      connectText.value = "Connect";
      loading.value = false;
      isDisabled.value = false;
      error.value = true;

      setTimeout(() => {
        error.value = false;
      }, 5000);
    }
  } catch (error) {
    connectText.value = "Connect";
    loading.value = false;
    isDisabled.value = false;
    error.value = true;

    setTimeout(() => {
      error.value = false;
    }, 5000);
  }
};
</script>
