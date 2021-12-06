<template>
    <div
        id="app"
        :style="{
            backgroundColor: boardStyle.bgColor,
            backgroundImage: boardStyle.bgImg,
        }"
    >
        <main-header />
        <router-view @setBg="setBg" />
    </div>
</template>

<script>
    import mainHeader from './cmps/main-header.vue';

    export default {
        data() {
            return {
                boardStyle: {
                    bgColor: '#00a1ff',
                    bgColor: 'none',
                },
            };
        },
        methods: {
            setBg(style) {
                console.log('new style', style);
                this.boardStyle = style;
            },
        },
        watch: {
            '$route.params.boardId': {
                async handler() {
                    let { boardId } = this.$route.params;
                    if (boardId) {
                        try {
                            const board = await this.$store.dispatch({
                                type: 'getBoard',
                                boardId,
                            });
                            this.boardStyle = board.style;
                        } catch (err) {
                            console.log('Error in handler (main-header):', err);
                            throw err;
                        }
                    } else
                        this.boardStyle = {
                            bgColor: '#00a1ff',
                            bgImage: 'none',
                        };
                },
                immediate: true,
            },
        },

        components: {
            mainHeader,
        },
    };
</script>
