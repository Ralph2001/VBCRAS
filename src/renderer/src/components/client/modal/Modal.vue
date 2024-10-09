<template>
  <div
    class="fixed top-0 bottom-0 left-0 right-0 backdrop-brightness-75 z-[9999999999999999] flex items-center justify-center">
    <div class="h-full   flex flex-col w-full relative">
      <div class="w-full flex flex-row h-auto bg-gray-700 outline-none px-3  p-1 items-center ">

        <slot name="header"></slot>
      </div>
      <div class="h-full bg-gray-200 flex w-full overflow-y-scroll shadow-inne relative">
        <slot> </slot>
      </div>
      <div class=" w-full bg-gray-800 py-1.5  p-1" v-if="props.footer">
        <slot name="footer"> </slot>
      </div>
    </div>
  </div>
</template>

<script setup>const props = defineProps({
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
  footer: {
    type: Boolean,
    default: true
  },
  doctype: {
    type: String,
    default: "",
  },
});
</script>

<style lang="scss" scoped></style>