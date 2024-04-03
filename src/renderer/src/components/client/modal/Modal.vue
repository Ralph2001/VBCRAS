<template>
    <div
        tabindex="-1"
        class="overflow-x-hidden h-[calc(100vh)] overflow-y-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 flex backdrop-blur-sm backdrop-brightness-[0.5]"
        aria-modal="true"
        role="dialog"
    >
        <div
            :class="{
                ' max-w-[80rem] h-[calc(100vh-20px)] overflow-y-hidden': large,
                'max-w-2xl max-h-full': medium,
                'max-w-lg': small,
                'max-w-[35rem]': titleCard,
            }"
            class="relative p-4 w-full"
        >
            <div
                class="relative bg-white h-full overflow-y-auto rounded-lg shadow dark:bg-gray-700"
            >
                <div
                    class="flex top-0 right-0 left-0 p-3"
                    :class="{ 'border-b': !titleCard }"
                >
                    <h3
                        class="text-xl font-semibold text-gray-900 dark:text-white"
                    >
                        {{ label }}
                    </h3>
                    <slot name="header"></slot>
                </div>
                <div
                    :class="{
                        'h-[25rem]': titleCard,
                        'h-[calc(100vh-180px)]': !titleCard,
                    }"
                    class="p-3 md:p-4 overflow-y-scroll"
                >
                    <slot> </slot>
                </div>
                <div
                    :class="{ 'border-t': !titleCard }"
                    class="flex items-center justify-end p-2 md:p-3 rounded-b dark:border-gray-600"
                >
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
    },
    large: Boolean,
    small: Boolean,
    titleCard: Boolean,
    medium: Boolean,
});
</script>
