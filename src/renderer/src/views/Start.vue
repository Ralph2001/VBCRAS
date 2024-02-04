<template>
  <div class="flex flex-row p-2 h-[calc(100vh-80px)]">
    <div class="flex flex-col justify-between gap-5 w-2/5">
      <div class="mb-auto"></div>
      <div>
        <p class="text-5xl sm:text-3xl text-slate-900 font-semibold lg:text-7xl">
          Local Civil Registry
        </p>
        <p class="text-2xl sm:text-lg text-slate-800 font-sans lg:text-3xl lg:mt-3">
          Bayambang, Pangasinan
        </p>
      </div>
      <div>
        <p class="text-lg sm:text-md text-slate-800 font-bold lg:text-xl lg:mt-3">
          ISMAEL D. MALICDEM, JR
        </p>
        <p class="text-lg sm:text-md text-gray-500 font-semibold">MUNICIPAL CIVIL REGISTRAR</p>
      </div>
      <div class="mt-auto">
        <p class="text-md sm:text-sm text-slate-800 font-bold text-nowrap">
          HON. MARY CLARE JUDITH PHYLLIS JOSE-QUIAMBAO
        </p>
        <p class="text-sm sm:text-xs text-yellow-400 font-semibold">MUNICIPAL MAYOR</p>
      </div>
    </div>
    <div class="flex w-3/5 justify-center items-center">
      <FrontCarousel />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import FrontCarousel from "../components/FrontCarousel.vue";
import { initFlowbite } from "flowbite";
import { AuthStore } from "../stores/auth"
import { useRouter } from "vue-router"

const router = useRouter();


const Auth = AuthStore();


onMounted(() => {
  initFlowbite();
  if (!Auth.isAuthenticated()) {
    router.push('/login');
  } else {
    router.push('/Start')
  }
});
</script>
