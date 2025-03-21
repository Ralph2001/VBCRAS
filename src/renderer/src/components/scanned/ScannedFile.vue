<template>
    <li :class="`h-${props.size}px`"
        class="text-md flex-row justify-between font-semibold antialiased flex items-center gap-1 hover:bg-blue-100 hover:cursor-pointer rounded-sm relative group">
        <div class="block w-[60%] overflow-hidden truncate">
            <font-awesome-icon icon="fa-solid fa-file-pdf" class="text-red-500 me-2 ms-3" />
            {{ file_info.name ? file_info.name.replace(".pdf", "") : 'Unnamed' }}
        </div>
        <p class="text-sm italic font-normal group-hover:mr-5 mr-2 duration-300 text-gray-800">
            {{ file_info.type }} {{ file_info.month }} {{ file_info.year }}
        </p>
    </li>
</template>

<script setup>
const props = defineProps({
    file_info: {
        type: [Array, Object]
    },
    size: {
        type: Number
    }
})
</script>