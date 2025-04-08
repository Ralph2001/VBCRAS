<template>
    <div class="flex flex-row items-center shadow-sm justify-center gap-6 px-3 py-3 bg-gray-100 rounded-t-lg">
        <p class="text-xl tracking-wider w-56 text-nowrap font-semibold ms-3 text-gray-800">
            Scanned Documents
        </p>

        <div class="relative flex flex-row gap-2 item-center w-full">
            <slot name="content"> </slot>
        </div>
    </div>
</template>