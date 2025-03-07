<style>
.hovered {
  margin-bottom: 20px;
  transition-duration: 300ms;
}
</style>

<template>
  <div class="flex flex-col h-[calc(100vh-100px)] relative w-full">
    <!-- Crtl + F -->
    <Menu />
    <div
      class="bg-transparent border h-full rounded-sm flex md:flex-row sm:flex-col p-4 sm:px-10 md:lg:px-40 items-center flex-wrap">
      <div class="flex flex-col grow items-center h-full justify-center px-10">
        <!-- <div class="w-full flex justify-center">
          <p class="font-semibold p-4 text-gray-700 text-2xl">System</p>
        </div>

        <div class="w-full flex flex-row gap-2 justify-center items-center">
          <div v-for="app in system_class"
            class="w-[10rem] h-[5rem] p-2 bg-gray-200 hover:cursor-pointer rounded flex items-center justify-center shadow hover:bg-gray-300 transition-all">
            <p class="text-xs text-center font-semibold">

              {{ app.name }}</p>
          </div>
        </div> -->

        <div
          class="flex flex-row gap-2 items-center text-lg uFppercase font-semibold text-nowrap text-gray-800 justify-center h-[5rem]">
          <p class="transition-all" @mouseover="hoverTitle" ref="Vital">Vital</p>
          <p class="transition-all" @mouseover="hoverTitle" ref="Bridge">Bridge</p>
          <p class="transition-all" @mouseover="hoverTitle" ref="Civil">Civil</p>
          <p class="transition-all" @mouseover="hoverTitle" ref="Registry">Registry</p>
          <p class="transition-all" @mouseover="hoverTitle" ref="and">and</p>
          <p class="transition-all" @mouseover="hoverTitle" ref="Archive">Archive</p>
          <p class="transition-all" @mouseover="hoverTitle" ref="System">System</p>
        </div>
        <div class="">
          <p class="text-md font-normal text-center leading-7 tracking-wider text-gray-800">
            <span class="font-bold hover:scale-95 font-mono text-2xl">Vital Bridge</span>
            suggests a connection or link that is essential or crucial. In the context of
            a birth, death, and marriage record system, it could signify the pivotal role
            of the system in connecting and managing vital life events, serving as a
            bridge between individuals and official records. The term
            <span class="font-bold font-mono text-lg tracking-wider">vital</span>
            emphasizes the importance or significance of the information being bridged,
            while
            <span class="font-bold font-mono text-lg tracking-wider">bridge</span>
            implies the facilitation or connection between different components or
            entities.
          </p>

        </div>
      </div>


      <div class="absolute bottom-10 right-10 flex flex-row items-center gap-2">
        <p class="text-xs text-gray-600">
          App Version:
        </p>
        <p class="text-xs text-blue-800 font-medium">{{ appVersion }}</p>
      </div>

    </div>

    <div class="fixed flex flex-row sm:gap-5 md:gap-[5rem] bottom-0 right-0 left-0 px-10 py-2 bg-gray-100 shadow-lg border border-t">

      <div class="flex md:flex-row lg:flex-row sm:flex-col sm:gap-2 md:gap-[5rem]">
        <div>
          <p class="text-sm text-slate-800 font-bold text-nowrap antialiased tracking-widest">
            {{ system_setting.defaults[0].municipal_civil_registrar }}
          </p>
          <p class="text-xs text-gray-500 font-semibold antialiased tracking-widest">
            MUNICIPAL CIVIL REGISTRAR
          </p>
        </div>
        <div>
          <p class="text-sm text-slate-800 font-bold text-nowrap antialiased">
            {{ system_setting.defaults[0].mayor }}
          </p>
          <p class="text-xs text-yellow-400 font-semibold antialiased">MUNICIPAL MAYOR</p>
        </div>
      </div>
      <div class="flex items-center sm:justify-end w-full md:ml-auto gap-2">
        <!-- <img src="../../assets/bayambang_logo.png" class="h-14 animate__animated animate__tada" alt="" srcset="" /> -->
        <div class="flex-col items-center">
          <p class="text-md text-slate-800 font-bold text-nowrap tracking-widest">
            Civil Registry
          </p>
          <p class="text-sm text-gray-600 font-semibold antialiased text-nowrap tracking-widest">
            {{ system_setting.defaults[0].petition_default_filling_municipality + ', ' +
              system_setting.defaults[0].petition_default_filling_province }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import Carousel from "../../components/Carousel.vue";
import Menu from "../../components/Menu.vue";
import { useSetup } from "../../stores/Setting/setup.js";


const system_setting = useSetup()
const appVersion = ref()

onMounted(async () => {
  system_setting.getSystemSetting()

  try {
    const version = await window.UpdateApi.appVersion();
    appVersion.value = 'v' + version; // Set the fetched version
  } catch (error) {
    console.error('Failed to fetch app version:', error);
    appVersion.value = 'Error fetching version'; // Handle error
  }

})

const Vital = ref();
const Bridge = ref();
const Civil = ref();
const Registry = ref();
const and = ref();
const Archive = ref();
const System = ref();

const hoverTitle = () => {
  const refs = [
    Vital.value,
    Bridge.value,
    Civil.value,
    Registry.value,
    and.value,
    Archive.value,
    System.value,
  ];
  refs.forEach((ref, index) => {
    setTimeout(() => {
      ref.classList.add("hovered");
      setTimeout(() => {
        ref.classList.remove("hovered");
      }, 200);
    }, 100 * (index + 1));
  });
};

const system_class = ref([
  {
    name: 'Correction in Clearical Error & Change of First Name',
    link: ''
  },
  {
    name: 'Forms',
    link: ''
  },

  {
    name: 'Marriage License',
    link: ''
  },


  {
    name: 'Legitimation',
    link: ''
  },

  {
    name: 'AUSF',
    link: ''
  },

  {
    name: 'Scanned Documents',
    link: ''
  }
])
</script>