<template>
    <div class="h-fullflex w-full flex-col items-center justify-center">
        <!-- <div class="w-[15rem]">
            <InputSuggestions label="phil" :items="provinces" v-model="input" />
        </div> -->

        <div class="h-[calc(100vh-100px)] w-full overflow-y-scroll">

            <ul v-for="(items, index) in provinces" class="list-disc flex flex-col ">
                <li><span class="text-red-600 text-5xl">{{ index }} </span> {{ items }}</li>
            </ul>

        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import InputSuggestions from '../../components/essentials/inputs/InputSuggestions.vue';
import philippines from '../../utils/philippines';



const regions = computed(() => {
    return Object.keys(philippines[0]);
})

const provinces = computed(() => {
    const allProvinces = [];
    regions.value.forEach(region => {
        const regionProvinces = philippines.map(data => data[region].province_list);
        allProvinces.push(...regionProvinces);
    });
    return [...new Set(allProvinces)].sort();
})

const provinces_name = computed(() => {
    provinces.forEach(province => {
        console.log(province)
    });
})




</script>

<style lang="scss" scoped></style>