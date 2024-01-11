<template>
  <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
    {{ label }}
  </label>
  <input
    :id="id"
    :type="type"
    v-model="filename"
    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    required
  />
</template>

<script>
export default {
  name: "DropInput",
  created() {},
  data() {
    return {};
  },
  props: {
    type: {
      type: String,
      default: "text",
    },
    label: String,
    id: String,
   
  },
};
</script>
