<template>
    <div class="grow">
        <Box
            title="The grounds for filing this petition are the following  "
            width="w-full"
        >
            <div class="flex flex-col gap-5 text-md font-base justify-center">
                <div class="flex flex-row gap-2 items-center">
                    <p class="basis-[2%] font-serif">a)</p>
                    <CheckBox />
                    <div>
                        The first name is extremely difficult to write or
                        pronounce;
                    </div>
                </div>
                <div class="flex flex-row gap-2 items-center">
                    <p class="basis-[2%] font-serif">b)</p>
                    <CheckBox />

                    <div class="relative">
                        I have/He/She has habitually and continuously used
                        <div class="absolute -top-[1.2rem] left-[23rem]">
                            <Input :class="`flex text-center`" />
                        </div>
                        _______________________________ &nbsp;and I/He/She is
                        publicly known in the community with that first name;
                    </div>
                </div>
                <div class="flex flex-row gap-2 items-center">
                    <p class="basis-[2%] font-serif">c)</p>
                    <CheckBox />
                    <div for="one">
                        <label for="one" class="cursor-pointer">
                            The first name is tainted with dishonor;</label
                        >
                    </div>
                </div>
                <div class="flex flex-row gap-2 items-center">
                    <p class="basis-[2%] font-serif">d)</p>
                    <CheckBox />
                    <div>The first name is ridiculous;</div>
                </div>
                <div class="flex flex-row gap-2 items-center flex-wrap">
                    <p class="basis-[2%] font-serif">e)</p>
                    <CheckBox />
                    <div>The first name causes confusion;</div>
                </div>
                <div class="flex flex-row gap-2 items-center">
                    <p class="basis-[2%] font-serif">f)</p>
                    <CheckBox />
                    <div class="relative w-max">
                        Others: (Specify)
                        <div
                            class="absolute -top-[1.2rem] left-[7.4rem] w-full"
                        >
                            <Input :class="`flex text-center`" />
                        </div>
                        ________________________________________________________.
                    </div>
                </div>
            </div>
        </Box>
    </div>
</template>

<script setup>
import Box from '../Box.vue'
import Input from '../inputs/Input.vue'
import CheckBox from '../buttons/CheckBox.vue'
</script>

<style lang="scss" scoped></style>
