<template>
  <div>
    <Transition
      enter-active-class="animate__animated animate__fadeInDown"
      leave-active-class="animate__animated animate__fadeOutUp"
    >
      <div
        v-if="notification"
        class="flex flex-col absolute rounded-xl h-[auto] top-0 right-5 border bg-white z-50 w-[30rem] p-4 shadow-md"
      >
        <p class="text-md font-semibold tracking-widest p-2">
          Approved <span class="font-normal text-xs italic">on April 19, 2024</span>
        </p>
        <div class="h-full flex flex-col justify-center items-start py-2 px-3">
          <div class="flex flex-row w-full p-1">
            <p class="basis-[38%] italic font-normal text-gray-900 tracking-wide">
              Petition Number:
            </p>
            <p class="font-medium text-gray-900 tracking-wide truncate">CCE-1216-2024</p>
          </div>
          <div class="flex flex-row w-full p-1">
            <p class="basis-[38%] italic font-normal text-gray-900 tracking-wide">
              Petitioner Name:
            </p>
            <p class="font-medium text-gray-900 tracking-wide truncate">
              RALPH ADVINCULA VILLANUEVA
            </p>
          </div>
          <div class="flex flex-row w-full p-1">
            <p class="basis-[38%] italic font-normal text-gray-900 tracking-wide">
              Document Owner:
            </p>
            <p class="font-medium text-gray-900 tracking-wide truncate">
              RALPH ADVINCULA VILLANUEVA
            </p>
          </div>
        </div>
        <div class="flex gap-2 flex-row justify-end">
          <button
            type="button"
            class="px-3 py-2 text-xs tracking-widest font-medium text-center text-white bg-blue-700 rounded-sm hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Open Finality
          </button>
          <button
            type="button"
            @click="notification = false"
            class="px-3 py-2 text-xs tracking-widest font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-sm hover:bg-red-500 hover:text-white"
          >
            Close
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped></style>
