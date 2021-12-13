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
        name: 'app',
        data() {
            return {
                boardId: null,
                // headerColor: '#026aa7',
                boardStyle: {
                    bgColor: '#00a1ff',
                    bgImg: 'none',
                },
            };
        },
        created() {
            this.boardId = this.$route.params.boardId;
            if (!this.loggedInUser) this.login();
        },
        computed: {
            loggedInUser() {
                return this.$store.getters.loggedinUser;
            },
        },
        methods: {
            setBg(style) {
                console.log('new style', style);
                this.boardStyle = style;
            },
            async login() {
                try {
                    let user = {
                        fullname: 'Guest',
                        username: 'guest1@gmail.com',
                        password: 'guest123',
                        imgUrl: 'https://res.cloudinary.com/cloudinaryorb/image/upload/v1639142324/guest_b8lh6r.png',
                    };
                    await this.$store.dispatch({ type: 'login', user });
                } catch (err) {
                    console.log('Error in Login :', err);
                    throw err;
                }
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
                            bgImg: 'none',
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
