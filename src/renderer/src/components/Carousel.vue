<template>
  <div id="controls-carousel" class="relative w-full h-full flex flex-col justify-center" data-carousel="static">
    <!-- Carousel wrapper -->
    <div class="relative h-full overflow-hidden rounded-r-sm ">
      <div class="hidden duration-700 ease-in-out" data-carousel-item="active">
        <img src="../assets/1.jpg"
          class="absolute border-none block object-cover w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 "
          alt="..." />
        <div class="image-overlay"></div>
      </div>
      <div class="hidden duration-700 ease-in-out" data-carousel-item>
        <img src="../assets/2.jpg"
          class="absolute border-none block object-cover w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 "
          alt="..." />
        <div class="image-overlay"></div>
      </div>

    </div>
    <!-- Slider controls -->

    <button type="button"
      class="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
      data-carousel-next>
      <span
        class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-0 dark:group-focus:ring-gray-800/70 group-focus:outline-none">
        <svg class="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180" aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="m1 9 4-4-4-4" />
        </svg>
        <span class="sr-only">Next</span>
      </span>
    </button>
  </div>
</template>

<script setup></script>

<style scoped>
.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  /* box-shadow: inset 120px 0 50px 0 #FFF; */
  background: linear-gradient(to left,
      rgba(255, 255, 255, 0) 70%,
      rgba(255, 255, 255, 1) 100%);
}
</style>
