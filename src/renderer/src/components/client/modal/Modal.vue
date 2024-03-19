<template>
    <div id="default-modal" tabindex="-1"
        class="overflow-y-hidden overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%)] max-h-full flex backdrop-blur-sm backdrop-brightness-[0.5]"
        aria-modal="true" role="dialog">
        <div :class="{ 'max-w-[100rem] max-h-screen': large, 'max-w-2xl max-h-full': medium }"
            class="relative p-4 w-full ">
            <!-- Modal content -->
            <div class="relative bg-white  rounded-lg shadow dark:bg-gray-700">
                <!-- Modal header -->
                <div class="flex items-center justify-between p-4 md:p-5  rounded-t dark:border-gray-600">
                    <h3 class="text-xl font-semibold text-gray-900 dark:text-white"> {{ label }} </h3>
                    <slot name="header"></slot>
                </div>
                <!-- Modal body -->
                <div class="p-3 md:p-4 space-y-4 overflow-y-scroll h-[50rem] border">
                    <slot>
                    </slot>
                </div>
                <!-- Modal footer -->
                <div class="flex items-center justify-end p-2 md:p-3 rounded-b dark:border-gray-600">
                    <slot name="footer"></slot>
                </div>
            </div>
        </div>
    </div>
</template>


<script setup>
const props = defineProps({
    label: {
        type: String,
        required: true
    },
    large: Boolean,
    small: Boolean,
    medium: Boolean
})
</script>