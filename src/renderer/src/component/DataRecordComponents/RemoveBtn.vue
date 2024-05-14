<template>
    <div class="flex flex-col items-center justify-center h-full">
        <button type="button" @click="removeItem(props.params.data.id)"
            class="px-3 py-1 text-sm tracking-wide active:scale-95  font-medium text-center  rounded-sm  border transition-all focus:outline-none hover:bg-red-400 hover:text-white ">
            Remove
        </button>
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRecords } from '../../stores/Records/main.js'

const record = useRecords()

const props = defineProps({
    params: {
        type: Object
    }
})


const removeItem = async (id) => {
    const action = await record.removeRecord(id)
    console.log(action)
}
</script>

<style lang="scss" scoped></style>