<template>
    <div class="flex flex-col items-center justify-center h-full relative">
        <button :class="[isClick ? 'bg-gray-700 text-gray-200' : 'bg-white text-gray-800']" ref="button"
            class=" border px-4 h-8 flex items-center  transition-all font-medium rounded-sm"
            @click="showOptions">Action</button>

        <div class="fixed h-screen w-full bg-white z-[99999]">
            Hi
        </div>



        <div class=" absolute flex flex-col items-center border shadow-sm h-auto bg-white top-[95%] z-[99999] w-[10rem]"
            v-if="isClick">
            <button class="w-full hover:bg-blue-100 flex items-center px-5 font-medium">Preview PDF</button>
            <button class="w-full hover:bg-blue-100 flex items-center px-5 font-medium">Print</button>
            <button class="w-full hover:bg-blue-100 flex items-center px-5 font-medium"
                v-if="auth_.user_id === data.created_by || auth_.user_role === 1">Edit</button>
            <button class="w-full hover:bg-red-300 flex items-center px-5 font-medium" v-if="auth_.user_role === 1"
                @click="removeItem">Remove</button>
        </div>

    </div>
</template>

<script setup>
import { onClickOutside } from '@vueuse/core';
import { ref } from 'vue';
import { useAusf } from '../../../stores/Ausf';
import { AuthStore } from '../../../stores/clientAuth';

const auth_ = AuthStore()
const aufs_ = useAusf()

const isClick = ref(false)
const button = ref()

const props = defineProps({
    data: {
        type: Object

    }
})

const data = props.params.data

onClickOutside(button, (event) => (isClick.value = false));

const showOptions = () => {
    isClick.value = !isClick.value
}

const removeItem = () => {
    aufs_.removeAusf(data.id)
}
</script>

<style lang="scss" scoped></style>