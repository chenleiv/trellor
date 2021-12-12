<template>
    <section class="login">
        <div v-if="islogin">
            <h4>Login to Trellor</h4>
            <form @submit.prevent="login">
                <input
                    placeholder="Username"
                    v-model="userLogin.username"
                    type="text"
                />
                <input
                    placeholder="Password"
                    v-model="userLogin.password"
                    type="password"
                />
                <button>Login</button>
                <button @click="googleSignup">
                    <img src="@/assets/img/icons8-google.svg" alt="" /><span
                        >Continue with Google</span
                    >
                </button>

                <span @click="islogin = false">Or Sign up</span>
            </form>
        </div>
        <div v-else>
            <h4>Sign up</h4>
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
                    type="password"
                />
                <!-- <img src="@/assets/img/undraw_completed_tasks_vs6q.svg" alt="" /> -->
                <button>Signup</button>
                <button @click="googleSignup">
                    <img src="@/assets/img/icons8-google.svg" alt="" />Continue
                    with Google
                </button>
            </form>
            <span @click="islogin = true">Or login</span>
        </div>
    </section>
</template>

<script>
    export default {
        data() {
            return {
                islogin: true,
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
                googleUser: {
                    username: null,
                    password: null,
                    fullname: null,
                    imgUrl: '',
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
            async googleSignup() {
                const googleUser = await this.$gAuth.signIn();
                console.log('', googleUser.getBasicProfile());
                try {
                    const user = googleUser.getBasicProfile();
                    this.googleUser = {
                        username: user.pv,
                        password: user.HW,
                        fullname: user.jf,
                        imgUrl: user.oN,
                    };
                    console.log('this.googleUser', this.googleUser);

                    await this.$store.dispatch({
                        type: 'signup',
                        user: this.googleUser,
                    });
                    this.$router.push('/');
                } catch (err) {
                    console.log('Error in google SignUp :', err);
                    throw err;
                }
            },
        },
    };
</script>

<style></style>
