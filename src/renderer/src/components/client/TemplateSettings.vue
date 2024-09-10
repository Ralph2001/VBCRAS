<template>
    <div class="w-full flex flex-col gap-4 ">
        <div class="flex flex-col gap-2 items-center justify-center">
            <p class="text-2xl font-medium p-4">Documents</p>
            <div class="flex flex-row gap-2 items-center justify-center" v-if="props.file_types.length">
                <div v-for="type in props.file_types" :key="type"
                    class="h-[8rem] border border-gray-200 w-[8rem]  rounded-md bg-green-50 flex flex-col items-center  justify-center shadow-sm">
                    <p class="text-wrap px-2 text-center font-semibold text-sm mt-auto">{{ type }}</p>
                    <div class="flex flex-col w-full mt-auto">
                        <button
                            class="w-full text-xs py-1.5 bg-gray-50 border border-gray-300 active:bg-gray-200 transition-all">Open</button>


                    </div>
                </div>
            </div>
            <div v-else>Blank</div>
        </div>

        <div class="flex flex-col items-center">
            <div class="flex flex-col gap-2 items-center justify-center">
                <p class="text-2xl font-medium">How to?</p>
                <p class="text-justify text-md tracking-wide">
                    To customize the template, start by clicking "Open" and paste your
                    custom template into the designated folder or editing the document,
                    ensuring that the file
                    is named <span class="font-bold">"{{ props.document_name }}"</span> It is important that this file
                    is
                    saved in
                    the specified path, not in any other location, to ensure proper
                    functionality. Within your template, you can insert tags such as
                    <span class="font-bold">`{tag_name}`</span> at specific locations
                    where you want the
                    system to
                    automatically insert data. These tags correspond to specific fields
                    and will be replaced with the appropriate information provided by
                    the system during processing. By doing this, you can ensure that
                    your document is accurately populated with all necessary details,
                    maintaining consistency and correctness throughout the generated
                    petitions.
                </p>
            </div>
            <p class="text-2xl font-medium">Tags</p>
            <div class="flex flex-row gap-4 flex-wrap mt-5 items-center justify-center">
                <div v-for="tag in props.tags" :key="tag.tag"
                    class="w-[15rem] bg-white h-auto py-4 flex flex-col px-10 items-center justify-center gap-2 border border-gray-300 rounded-md hover:shadow-md transition-all">
                    <p class="font-medium text-md">{{ tag.tag }}</p>
                    <p class="text-sm  text-gray-700 text-justify">{{ tag.details }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

const props = defineProps({
    document_name: String,
    tags: {
        type: Array,
    },
    file_types: {
        type: Array,
        default: []
    }
})
</script>

<style lang="scss" scoped></style>