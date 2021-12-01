<template>
    <div class="workspace">
        <h1>This is an workspace page</h1>
        <ul>
            <li v-for="board in boards" :key="board._id">
                <!-- <router-link :to="`/board/${board._id}`"> -->
                <board-preview :board="board" />
                <!-- </router-link> -->
            </li>
        </ul>
    </div>
</template>

<script>
    import boardPreview from '@/cmps/board-preview.vue';

    export default {
        name: 'workspace',

        computed: {
            boards() {
                return this.$store.getters.boardsToShow;
            },
        },

        components: {
            boardPreview,
        },
    };
</script>
