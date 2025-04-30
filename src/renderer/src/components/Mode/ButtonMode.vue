    <template>
        <button type="button"
            class="mode flex flex-col gap-2 items-center shadow-4xl duration-100 justify-center   text-sm font-semibold  antialiased text-gray-800  
        button-10 w-auto h-auto p-4 border border-gray-300 rounded-lg bg-white hover:bg-gray-700 hover:text-white  hover:shadow-sm tracking-wide transition-all">
            <!-- <font-awesome-icon icon="fa-solid fa-network-wired" /> -->
            <p class="text-md font-bold  "> {{ title }}</p>
        </button>
    </template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    title: {
        type: String,
        required: true
    },
})
</script>
