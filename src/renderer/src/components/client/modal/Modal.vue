<template>
  <div tabindex="-1" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
    <div :class="[
      'bg-white rounded-md shadow-lg overflow-hidden flex flex-col w-full',
      props.medium
        ? 'max-w-screen-xl max-h-[calc(100%-8rem)] h-[calc(100%-8rem)]'
        : 'h-full'
    ]">
      <!-- Header -->
      <!-- <div class="bg-gray-900 text-white px-4 py-2 flex items-center">
        <slot name="header" />
      </div> -->

      <div class="p-4 border-b flex items-center justify-between bg-gray-900 text-white">
        <h2 class="font-bold text-base ">{{ title }}</h2>
        <button @click="emits('exit-modal')" class="">
          <font-awesome-icon icon="fa-solid fa-xmark" class="text-xl" />
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto p-4 bg-gray-200">
        <slot />
      </div>

      <!-- Footer -->
      <div v-if="props.footer" class=" border-t text-right">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>


<script setup>

const emits = defineEmits(['exit-modal'])

const props = defineProps({
  title: {
    type: String,
    required: true
  },
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