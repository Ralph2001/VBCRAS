<script setup>

import Carousel from "../../components/Carousel.vue";

</script>

<template>
  <div class="flex flex-col h-[calc(100vh-80px)] relative w-full">
    <div class="bg-white rounded-sm flex md:flex-row sm:flex-col p-4 h-[calc(100vh-139px)] items-center flex-wrap ">

      <div class="flex flex-col md:basis-[35%] items-center h-full   justify-center gap-10  px-10  ">


        <p class="text-lg tracking-wide">For I know the plans I have for you, declares the Lord, plans for welfare and
          not for evil,
          to give you a future and a hope.</p>
        <p class="font-semibold italic text-md">Jeremiah 29:11</p>
     
        <!-- <div
          class="flex flex-row gap-2 items-center text-lg uppercase font-semibold text-nowrap text-gray-800 justify-center">
          <p class="hover:scale-105 transition-all">Vital</p>
          <p class="hover:scale-105 transition-all">Bridge</p>
          <p class="hover:scale-105 transition-all">Civil</p>
          <p class="hover:scale-105 transition-all">Registry</p>
          <p class="hover:scale-105 transition-all">and</p>
          <p class="hover:scale-105 transition-all">Archive</p>
          <p class="hover:scale-105 transition-all">System</p>
        </div>
        <div class="">
          <p class="text-md font-normal  text-justify leading-7 tracking-wider text-gray-800 ">
            <span class="font-bold hover:scale-95">"Vital Bridge"</span>
            suggests a connection or link that is essential or crucial. In the context
            of a birth, death, and marriage record system, it could signify the
            pivotal role of the system in connecting and managing vital life events,
            serving as a bridge between individuals and official records. The term
            <span class="font-bold italic">"vital"</span> emphasizes the importance or
            significance of the information being bridged, while
            <span class="font-bold italic">"bridge"</span> implies the facilitation or
            connection between different components or entities.
          </p>
        </div> -->

      </div>


      <div class=" grow h-[calc(100vh-300px)] sm:hidden md:block">
        <Carousel />
      </div>
    </div>

    <div class="fixed flex flex-row sm:gap-5 md:gap-[5rem] bottom-0 right-0 left-0 px-10 py-2 bg-slate-50">

      <div class="flex md:flex-row lg:flex-row sm:flex-col sm:gap-2 md:gap-[5rem] ">
        <div>
          <p class="text-sm text-slate-800 font-bold text-nowrap antialiased tracking-widest">
            ISMAEL D. MALICDEM, JR
          </p>
          <p class="text-xs text-gray-500 font-semibold antialiased tracking-widest">
            MUNICIPAL CIVIL REGISTRAR
          </p>
        </div>
        <div>
          <p class="text-sm text-slate-800 font-bold text-nowrap antialiased">
            HON. MARY CLARE JUDITH PHYLLIS JOSE-QUIAMBAO
          </p>
          <p class="text-xs text-yellow-400 font-semibold antialiased">MUNICIPAL MAYOR</p>
        </div>
      </div>
      <div class="flex items-center sm:justify-end w-full md:ml-auto gap-2">
        <img src="../../assets/bayambang_logo.png" class="h-14 animate__animated animate__tada" alt="" srcset="" />
        <div class="flex-col items-center">
          <p class="text-md text-slate-800 font-bold text-nowrap tracking-widest">
            Local Civil Registry
          </p>
          <p class="text-sm text-gray-600 font-semibold antialiased text-nowrap tracking-widest">
            Bayambang, Pangasinan
          </p>
        </div>
      </div>
    </div>

  </div>
</template>
