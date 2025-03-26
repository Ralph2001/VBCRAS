<template>
  <div tabindex="-1"
    class="fixed top-0 bottom-0 left-0 right-0 backdrop-brightness-75 z-[9999999999999999] flex items-center justify-center backdrop-blur ">
    <div class=" flex flex-col  relative overflow-hidden"
      :class="[props.medium ? ' w-full  h-[calc(100%-10rem)] max-w-screen-xl max-h-[calc(100%-10rem)]' : 'w-full h-full']">
      <div class="w-full flex flex-row h-auto bg-gray-700 outline-none px-3  p-1 items-center ">
        <slot name="header"></slot>
      </div>
      <div class="h-full bg-gray-300 rounded-b-lg flex w-full relative overflow-y-auto">
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
  medium: {
    type: Boolean,
    default: false,
  },
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