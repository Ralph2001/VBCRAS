<script setup>
  // Define props including modelValue for v-model support
  const props = defineProps({
    modelValue: [String, Number], // Accept both string and number types
    width: String, // Width for the input element
    type: String // Type for the input element (number, text, etc.)
  })

  // Emit the update event for two-way binding
  const emit = defineEmits(['update:modelValue'])

  // Function to emit the updated value to parent
  function updateValue(event) {
    // Emit the update event with the new value from input
    emit('update:modelValue', event.target.value)
  }
</script>

<template>

  <input
    :value="modelValue"  
    :type="type"        
    :style="{ width: width }"  
    @input="updateValue"  
    class="border border-gray-300 rounded px-2 py-1"
  />
</template>
