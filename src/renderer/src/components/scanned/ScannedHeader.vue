<template>
    <div
        class="grid sm:grid-cols-1 gap-4 md:lg:grid-cols-3 items-center shadow-sm justify-between px-3 py-3 bg-gray-100 rounded-t-lg">
        <p class="text-xl tracking-wider font-semibold ms-3 text-gray-800">
            Scanned Documents
        </p>

        <div class="relative">
            <slot name="content"> </slot>
        </div>
    </div>
</template>