<template>
  <div
    class="overflow-x-hidden h-full  overflow-y-hidden fixed top-10 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 flex backdrop-blur-sm backdrop-brightness-[0.5]"
    aria-modal="true" tabindex="-1" role="dialog" >
    <div :class="{
      'w-screen h-screen overflow-y-hidden': large,
      'lg:max-w-5xl max-h-full': medium,
      'lg:max-w-2xl max-h-full': dropbox,
      'max-w-lg p-10': small,
      'max-w-[35rem] ': titleCard,
    }" class="relative p-1 w-full" tabindex="-1">
      <div class="relative  h-full rounded-sm w-full overflow-y-auto dark:bg-gray-700">
        <!-- Header -->
        <div class="flex bg-white items-center top-0 right-0 left-0 p-3 border-b">
          <h3 v-if="!titleCard" class="text-sm tracking-wide font-bold text-gray-800 uppercase dark:text-white">
            {{ label }}
          </h3>

          <div class="p-2 truncate overflow-ellipsis" v-if="titleCard">
            <h3 class="text-sm font-semibold text-gray-900 dark:text-white tracking-wide truncate">
              {{ first }}
            </h3>
            <h3 class="text-xs font-semibold pl-2 text-blue-500 dark:text-white tracking-wider">
              <span v-if="second !== ''">Document Owner: </span>
              <span class="text-gray-900">{{ second }}</span>
            </h3>
          </div>

          <slot name="header"></slot>
        </div>

        <!-- Main Body -->
        <div :class="{
          'h-[19rem]': titleCard,
          'h-[calc(100vh-180px)]': small || medium,
          'h-[calc(100vh-130px)]': large,
        }" class="overflow-y-scroll relative bg-white">
          <slot> </slot>
        </div>

        <!-- Footer -->
        <div :class="[titleCard ? ' h-0' : '', $attrs.footerBG]"
          class="flex z-50 h-16 items-center justify-end   p-2  dark:border-gray-600">
          <slot name="footer"> </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, useAttrs } from "vue";
const attrs = useAttrs();
const props = defineProps({
  label: {
    type: String,
  },
  large: Boolean,
  small: Boolean,
  titleCard: Boolean,
  settings: Boolean,
  medium: Boolean,
  first: String,
  second: String,
  dropbox: Boolean,
  doctype: {
    type: String,
    default: "",
  },
});


</script>
