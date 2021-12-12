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
                    bgImage: 'none',
                },
            };
        },
        created() {
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
                        username: 'guest@gmail.com',
                        password: 'guest123',
                        imgUrl: 'https://res.cloudinary.com/cloudinaryorb/image/upload/v1639142324/guest_b8lh6r.png',
                    };
                    await this.$store.dispatch({ type: 'login', user });
                    console.log('login', user);
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
