<template>
    <section>
        <form @submit.prevent="login">
            <input
                placeholder="username"
                v-model="userLogin.username"
                type="text"
            />
            <input
                placeholder="password"
                v-model="userLogin.password"
                type="text"
            />
            <button>Go</button>
        </form>

        <h3>Signup</h3>
        <form @submit.prevent="signup">
            <input
                placeholder="username"
                type="text"
                v-model="userSignup.username"
            />
            <input
                placeholder="fullname"
                v-model="userSignup.fullname"
                type="text"
            />
            <input
                placeholder="password"
                v-model="userSignup.password"
                type="text"
            />
            <button>Signup</button>
        </form>
    </section>
</template>

<script>
    export default {
        data() {
            return {
                userLogin: {
                    username: null,
                    password: null,
                },
                userSignup: {
                    username: null,
                    password: null,
                    fullname: null,
                    imgUrl: '',
                    isAdmin: false,
                },
            };
        },
        methods: {
            async login() {
                try {
                    let user = this.userLogin;
                    await this.$store.dispatch({ type: 'login', user });
                    this.$router.push('/');
                    console.log('login', user);
                } catch (err) {
                    console.log('Error in Login :', err);
                    throw err;
                }
            },
            async signup() {
                try {
                    let user = this.userSignup;
                    await this.$store.dispatch({ type: 'signup', user });
                    this.$router.push('/');
                    console.log('signup', user);
                } catch (err) {
                    console.log('Error in SignUp :', err);
                    throw err;
                }
            },
        },
    };
</script>

<style></style>
