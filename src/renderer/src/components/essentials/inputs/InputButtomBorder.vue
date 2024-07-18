<template>
    <div class="flex flex-col items-center  " :class="[`w-[${props.width}] bg-none`]">
        <input :tabindex="skip ? -1 : 1" :id="label" @input="emitValue" :value="modelValue"
            :class="[props.modelValue ? 'bg-blue-50' : ' bg-yellow-50'], $attrs['text-position']"
            class="border-t-0 border-l-0 w-full  border-e-0 border-b text-center  font-bold tracking-wide  border-gray-400 outline-none focus:ring-0 ring-0 ">
        <label for="" class="text-xs italic text-zinc-400" v-if="label">({{ props.label }})</label>
    </div>
</template>

<script setup>
import { useAttrs } from 'vue'

const attrs = useAttrs()

const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
    label: String,
    width: {
        type: String,
        default: "100%"
    },
    modelValue: String,
    skip: {
        type: Boolean,
        default: false
    },
    isBold: {
        type: Boolean,
        default: false
    },
})

const emitValue = (e) => {
    if (props.isBold) {
        emit('update:modelValue', e.target.value.toUpperCase())
        return
    }
    emit('update:modelValue', e.target.value)
}
</script>

<style lang="scss" scoped></style>