<template>
    <div class="flex flex-col items-center  " :class="[`w-[${props.width}] bg-none`]">
        <input :id="label" @input="emit('update:modelValue', $event.target.value)" :value="modelValue"
            :class="[props.modelValue ? 'bg-blue-100' : ' bg-transparent']"
            class="border-t-0 border-l-0 w-full  border-e-0 border-b text-center  font-bold tracking-wide  border-gray-400 focus:bg-yellow-50 outline-none focus:ring-0 ring-0 ">
        <label for="" class="text-xs italic text-zinc-400" v-if="label">({{ props.label }})</label>
    </div>
</template>

<script setup>
const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
    label: String,
    width: {
        type: String,
        default: "100%"
    },
    modelValue: String
})


</script>

<style lang="scss" scoped></style>