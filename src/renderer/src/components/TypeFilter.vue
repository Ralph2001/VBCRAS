<template>
    <div class="flex flex-col p-2">
        <div class="text-center font-semibold">Select Type</div>
        <div class="flex flex-col gap-1 mt-2">
            <div class="mb-3">
                <label class="text-sm font-semibold">
                    <input type="radio" name="type" v-model="type" @change="updateFilter()" value="All" /> All
                </label>
            </div>

            <div class="flex items-center mb-1 bg-gray-50 " v-for="singletype in alltypes" :key="singletype">
                <input :id="singletype" type="radio" v-model="type" @change="updateFilter()" :value="singletype"
                    name="type"
                    class="w-4 h-4 cursor-pointer text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                <label :for="singletype"
                    class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300 cursor-pointer">{{
                        singletype }}</label>
            </div>

        </div>
    </div>
</template>

<script>

export default {
    data: function () {
        return {
            type: 'All',
            alltypes: [
                'Birth',
                'Marriage',
                'Death',
                'Legal Instrument',
                'Other'
            ]

        };
    },
    methods: {
        updateFilter() {
            this.params.filterChangedCallback();
        },

        doesFilterPass(params) {
            return params.data.type === this.type;
        },

        isFilterActive() {
            if (this.type === 'All') {
                return this.type === ''
            }
            return this.type === this.type;
        },
    }

};
</script>
