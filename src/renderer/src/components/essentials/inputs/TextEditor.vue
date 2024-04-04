<template>
    <div>
        {{ props.modelValue }}
        <Editor
            :modelValue="props.modelValue"
            @input="emit('update:modelValue', $event.target.value)"
        >
            <template v-slot:toolbar>
                <span class="ql-formats">
                    <button v-tooltip.bottom="'Bold'" class="ql-bold"></button>
                    <button
                        v-tooltip.bottom="'Italic'"
                        class="ql-italic"
                    ></button>
                    <button
                        v-tooltip.bottom="'Underline'"
                        class="ql-underline"
                    ></button>
                </span>
            </template>
        </Editor>
    </div>
</template>

<script setup>
import Editor from 'primevue/editor'
const emit = defineEmits(['update:modelValue'])
const props = defineProps({
    modelValue: {
        required: false,
        type: [String, Number],
        default: '',
    },
})
</script>

<style lang="scss" scoped></style>
