<template>
    <div
        class="fixed inset-0 pointer-events-none top-0 left-0 right-0 bottom-0 opacity-20 z-[999999999999999999999999999999999999999999999999999999999]">
        <svg id="noice" class="w-full h-full">
            <filter id="noise-filter">
                <feTurbulence type="fractalNoise" baseFrequency="1.54" numOctaves="4" stitchTiles="stitch">
                </feTurbulence>
                <feColorMatrix type="saturate" values="0"></feColorMatrix>
                <feComponentTransfer>
                    <feFuncR type="linear" slope="0.49"></feFuncR>
                    <feFuncG type="linear" slope="0.49"></feFuncG>
                    <feFuncB type="linear" slope="0.49"></feFuncB>
                    <feFuncA type="linear" slope="0.52"></feFuncA>
                </feComponentTransfer>
                <feComponentTransfer>
                    <feFuncR type="linear" slope="1.47" intercept="-0.23" />
                    <feFuncG type="linear" slope="1.47" intercept="-0.23" />
                    <feFuncB type="linear" slope="1.47" intercept="-0.23" />
                </feComponentTransfer>
            </filter>
            <rect width="100%" height="100%" filter="url(#noise-filter)"></rect>
        </svg>

    </div>
</template>

<script setup></script>