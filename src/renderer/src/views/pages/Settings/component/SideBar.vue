<template>
    <aside id="sidebar-multi-level-sidebar"
        class=" fixed left-0 w-80  h-full transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar">
        <div class="h-full px-4 py-6 overflow-y-auto flex flex-col bg-[#0D1B2A] text-white">
            <!-- Logo/Header -->


            <p class="text-center text-lg font-bold tracking-wide mb-6">VBRAS</p>

            <!-- Navigation Links -->
            <ul class="flex flex-col gap-2 flex-grow">
                <li>
                    <router-link to="/settings/dashboard"
                        class="flex items-center p-2 rounded-lg hover:bg-[#1B263B] transition"
                        active-class="bg-[#415A77]">
                        <font-awesome-icon icon="fa-solid fa-gauge" class="w-5 h-5 mr-3" />
                        <span>Dashboard</span>
                    </router-link>
                </li>

                <li>
                    <router-link to="correction-report"
                        class="flex items-center p-2 rounded-lg hover:bg-[#1B263B] transition"
                        active-class="bg-[#415A77]">
                        <font-awesome-icon icon="fa-solid fa-file-pen" class="w-5 h-5 mr-3" />
                        <span>Corrections</span>
                    </router-link>
                </li>

                <li>
                    <router-link to="form-report" class="flex items-center p-2 rounded-lg hover:bg-[#1B263B] transition"
                        active-class="bg-[#415A77]">
                        <font-awesome-icon icon="fa-solid fa-file-alt" class="w-5 h-5 mr-3" />
                        <span>Forms</span>
                    </router-link>
                </li>

                <li>
                    <router-link to="marriage-report"
                        class="flex items-center p-2 rounded-lg hover:bg-[#1B263B] transition"
                        active-class="bg-[#415A77]">
                        <font-awesome-icon icon="fa-solid fa-heart" class="w-5 h-5 mr-3" />
                        <span>Marriage License</span>
                    </router-link>
                </li>

                <li>
                    <router-link to="legitimation-report"
                        class="flex items-center p-2 rounded-lg hover:bg-[#1B263B] transition"
                        active-class="bg-[#415A77]">
                        <font-awesome-icon icon="fa-solid fa-handshake" class="w-5 h-5 mr-3" />
                        <span>Legitimation</span>
                    </router-link>
                </li>
                <li>
                    <router-link to="scanned-report"
                        class="flex items-center p-2 rounded-lg hover:bg-[#1B263B] transition"
                        active-class="bg-[#415A77]">
                        <font-awesome-icon icon="fa-solid fa-handshake" class="w-5 h-5 mr-3" />
                        <span>Scanned Documents</span>
                    </router-link>
                </li>

                <li>
                    <router-link to="system-settings-activity-logs"
                        class="flex items-center p-2 rounded-lg hover:bg-[#1B263B] transition"
                        active-class="bg-[#415A77]">
                        <font-awesome-icon icon="fa-solid fa-list-check" class="w-5 h-5 mr-3" />
                        <span>Activity Logs</span>
                    </router-link>
                </li>

                <!-- System Settings -->
                <li class="mt-auto">
                    <router-link to="system_setting"
                        class="flex items-center justify-center gap-2 p-2 rounded-lg bg-[#1B263B] hover:bg-[#415A77] transition"
                        active-class="bg-[#415A77]">
                        <font-awesome-icon icon="fa-solid fa-gear" class="w-5 h-5" />
                        <span>System Setting</span>
                    </router-link>
                </li>
            </ul>

            <!-- View All Apps -->
            <div class="mt-4">
                <router-link to="/pages/welcome"
                    class="flex items-center justify-center gap-2 w-full p-2 rounded-lg bg-[#1B263B] hover:bg-green-500 hover:text-white transition">
                    <font-awesome-icon icon="fa-solid fa-right-from-bracket" class="w-5 h-5" />
                    <span>View All Apps</span>
                </router-link>
            </div>
        </div>
    </aside>
</template>
