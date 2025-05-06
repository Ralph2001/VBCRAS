<template>
    <div class="flex flex-row gap-2 items-center">
      <p class="text-sm font-medium w-36">{{ label }}</p>
  
      <!-- X Axis Input (if x exists) -->
      <template v-if="modelValue?.x !== undefined">
        <font-awesome-icon icon="fa-solid fa-arrows-left-right" />
        <InputforForm
          width="6rem"
          type="number"
          :modelValue="modelValue.x"
          @update:modelValue="val => updateField('x', val)"
        />
      </template>
  
      <!-- Y Axis Input (if y exists) -->
      <template v-if="modelValue?.y !== undefined">
        <font-awesome-icon icon="fa-solid fa-arrows-up-down" />
        <InputforForm
          width="6rem"
          type="number"
          :modelValue="modelValue.y"
          @update:modelValue="val => updateField('y', val)"
        />
      </template>
  
      <!-- Font Size Input (if font exists) -->
      <template v-if="modelValue?.font !== undefined">
        <font-awesome-icon icon="fa-solid fa-text-height" />
        <InputforForm
          width="6rem"
          type="number"
          :modelValue="modelValue.font"
          @update:modelValue="val => updateField('font', val)"
        />
      </template>
  
      <!-- Width Size Input (if width exists) -->
      <template v-if="modelValue?.width !== undefined">
        <font-awesome-icon icon="fa-solid fa-ruler-horizontal" />
        <InputforForm
          width="6rem"
          type="number"
          :modelValue="modelValue.width"
          @update:modelValue="val => updateField('width', val)"
        />
      </template>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    modelValue: Object,
    label: String
  })
  
  const emit = defineEmits(['update:modelValue'])
  
  function updateField(field, value) {
    emit('update:modelValue', {
      ...props.modelValue,
      [field]: value
    })
  }
  </script>
  