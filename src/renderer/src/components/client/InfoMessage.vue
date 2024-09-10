<template>
    <div>
        <div role="tooltip"
            class="absolute z-10 top-20 -right-10 inline-block w-[20rem] text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-100 rounded-lg shadow-sm  dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800">
            <div class="shadow-md px-3 py-2 bg-red-400 rounded-t-lg dark:border-gray-600 dark:bg-gray-700">
                <h3 class=" font-medium tracking-wide  text-white">Can't Connect?</h3>
            </div>
            <div class="px-3 py-2 border rounded">
                <ul class="mt-1.5 list-disc list-inside">
                    <li>Please ensure you use the host address provided by the admin.</li>
                    <li>Ensure you're on the same network as the admin.</li>

                </ul>
            </div>
            <div data-popper-arrow></div>
        </div>
    </div>
</template>
