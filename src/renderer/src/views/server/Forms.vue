<template>
    <div class="p-4 sm:ml-64 h-full    bg-blue-50/50 ">
        <div class="flex flex-row justify-between mt-5 px-10">
            <HeaderTop title="Civil Registry Forms" description="All Form Records here" icon="fa-solid fa-file-lines" />
        </div>
        <div class="flex flex-col mt-10 mb-10  h-[calc(100vh-160px)]  ">
            <TabsWrapper>
                <Tab title="All Form Records" icon="fa-solid fa-file-lines">

                </Tab>
                <Tab title="Logs" icon="fa-solid fa-scroll">
                    Hello2
                </Tab>
                <Tab title="Report" icon="fa-solid fa-flag">
                    Hello3
                </Tab>
                <Tab title="General" icon="fa-solid fa-gear">
                    Hello4
                </Tab>
            </TabsWrapper>
        </div>
    </div>
</template>

<script setup>
import TabsWrapper from './components/TabsWrapper.vue';
import Tab from './components/Tab.vue';
import HeaderTop from './components/HeaderTop.vue';
</script>
