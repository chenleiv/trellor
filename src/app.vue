<template>
    <div id="app">
        <main-header />
        <router-view />
    </div>
</template>

<script>
    import mainHeader from './cmps/main-header.vue';

    export default {
        components: {
            mainHeader,
        },
    };
</script>
