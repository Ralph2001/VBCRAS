<template>
    <div :class="[petition_type(props.params.data.petition_type)]"
        class="flex w-full h-full  text-gray-100 text-sm font-medium tracking-wide border p-0 m-0 items-center  px-2">
        {{ props.params.data.petition_number }}
    </div>
</template>

<script setup>
const props = defineProps({
    params: {
        type: Object,
        required: true
    }
})

function petition_type(petition_type) {
    if (petition_type === 'CCE') {
        return 'bg-[#4A90E2]'
    }
    return 'bg-[#2C7A7B]'
}
</script>

<style lang="scss" scoped></style>