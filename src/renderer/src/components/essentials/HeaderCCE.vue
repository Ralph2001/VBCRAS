<template>
    <div class="w-full  flex items-center text-center justify-center p-1 mb-5 transition-all shadow-md bg-white">
        <p class="text-lg uppercase font-semibold tracking-wider text-pretty" v-if="props.petition_type === 'CCE'">
            PETITION FOR CORRECTION OF CLERICAL ERROR IN THE CERTIFICATE OF <span
                :class="[props.type_label === 'Live Birth' ? 'text-green-500' : props.type_label === 'Death'? 'text-blue-500': props.type_label === 'Marriage'? 'text-red-500': '']">{{ props.type_label }}</span>
        </p>
        <p class="text-lg uppercase font-semibold tracking-widest" v-else>
            PETITION FOR CHANGE OF FIRST NAME
        </p>
    </div>
</template>

<script setup>
const props = defineProps({
    petition_type: {
        type: String,
        default: ''
    },
    type_label: {
        type: String,
        default: ''
    }
})
</script>

<style lang="scss" scoped></style>