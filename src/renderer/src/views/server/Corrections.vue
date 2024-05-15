<template>
    <div class="p-4 sm:ml-64 h-full    bg-blue-50/50 ">
        <div class="flex flex-row justify-between mt-5 px-10">
            <HeaderTop title="Correction of Civil Registry Documents" description="All Correction Records here"
                icon="fa-file-pen" />
        </div>
        <div class="flex flex-col mt-10 mb-10   h-[calc(100vh-160px)]  ">
            <TabsWrapper>
                <Tab title="All Correction Records" icon="fa-solid fa-file-pen">

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
