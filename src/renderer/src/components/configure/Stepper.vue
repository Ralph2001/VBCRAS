<template>
    <div class="flex flex-col p-10 w-full h-full relative">
        <div class=" flex flex-row px-10 py-5 w-full items-center ">
            <div class="flex flex-row w-full justify-between">
                <p class="text-2xl font-mono text-gray-600">{{ props.steps[current_step].title }}</p>
                <p class="italic text-gray-500">System Setup</p>
            </div>
        </div>

        <div class=" flex flex-col p-4 border rounded h-[calc(100vh-200px)] overflow-scroll  w-full ">
            <slot :name="`step-${current_step}`"></slot>
        </div>

        <div class="fixed bottom-0 w-full right-0 left-0 p-4 gap-2 flex">
            <button @click="auth.logout" tabindex="-1"
                class="border px-4 py-1.5 hover:bg-red-400 rounded hover:text-white">Exit</button>
            <div class="ml-auto">
                <button :disabled="current_step === 0"
                    class="px-4 py-1.5 border outline-none  tracking-wider disabled:bg-blue-300 bg-blue-500 hover:bg-blue-600 rounded text-white"
                    @click="prevStep">Previous</button>
                <button v-if="current_step !== props.steps.length - 1"
                    class="px-4 py-1.5 border outline-none  tracking-wider  disabled:bg-blue-300 bg-blue-500 hover:bg-blue-600 rounded text-white"
                    @click="nextStep">Next</button>
                <button v-if="current_step === props.steps.length - 1"
                    class="px-4 py-1.5 border outline-none  tracking-wider  disabled:bg-blue-300 bg-green-500 hover:bg-green-600 rounded text-white"
                    @click="nextStep">Submit</button>
            </div>
        </div>  
    </div>
</template>

<script setup>
import { AuthStore } from '../../stores/clientAuth';
import { ref } from 'vue';


const auth = AuthStore()
const props = defineProps({
    steps: {
        type: Array
    }
})
const current_step = ref(0)

function goToStep(index) {
    if (index < 0 || index >= props.steps.length) return;
    current_step.value = index;
}
function prevStep() {
    goToStep(current_step.value - 1);
}
function nextStep() {
    goToStep(current_step.value + 1);
}

</script>

<style lang="scss" scoped></style>