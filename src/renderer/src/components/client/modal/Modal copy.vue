<template>
  <div
    class="overflow-x-hidden h-full z-[99999999999999999999999999999999999999999]  overflow-y-hidden fixed top-10 right-0 left-0 justify-center items-center w-full md:inset-0 flex backdrop-blur-sm backdrop-brightness-[0.5]"
    aria-modal="true" tabindex="-1" role="dialog">
    <div :class="{
      'w-screen h-screen overflow-y-hidden': large,
      'lg:max-w-5xl max-h-full': medium,
      'lg:max-w-2xl max-h-full sm:px-20': dropbox,
      'max-w-lg p-10': small,
      'max-w-[35rem] ': titleCard,
    }" class="relative p-1 w-full" tabindex="-1">
      <div class="relative  h-full rounded-sm w-full overflow-y-auto dark:bg-gray-700">
        <!-- Header -->
        <div class="flex bg-white items-center top-0 right-0 left-0 p-1 border-b">
          <p v-if="!titleCard" class="text-sm tracking-wide font-semibold text-gray-800 uppercase dark:text-white">
            {{ label }}
          </p>

          <div class="p-2 truncate overflow-ellipsis" v-if="titleCard">
            <p class="text-sm font-semibold text-gray-900 dark:text-white tracking-wide truncate">
              {{ first }}
            </p>
            <p class="text-xs font-semibold pl-2 text-blue-500 dark:text-white tracking-wider">
              <span v-if="second !== ''">Document Owner: </span>
              <span class="text-gray-900">{{ second }}</span>
            </p>
          </div>

          <slot name="header"></slot>
        </div>

        <!-- Main Body -->
        <div :class="{
          'h-[19rem]': titleCard,
          'h-[calc(100vh-180px)]': small || medium,
          'h-[calc(100vh-75px)]': large,
        }" class="overflow-y-scroll relative bg-white">
          <slot> </slot>
        </div>

        <!-- Footer -->
        <div :class="[titleCard ? ' h-0' : '', $attrs.footerBG ? $attrs.footerBG : 'bg-white']"
          class="flex z-50 h-max p-1 items-center fixed w-full justify-end mt-auto   dark:border-gray-600">
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
