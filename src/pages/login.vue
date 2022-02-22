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
                <small v-if="error">{{ error }}</small>
                <button>Login</button>
            </form>
            <button class="google-btn" @click="googleSignup">
                <img src="@/assets/img/icons8-google.svg" alt="" /><span
                    >Continue with Google</span
                ></button
            ><span @click="islogin = false">Or Sign up</span>
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
                <small v-if="passError">{{ passError }}</small>
                <small v-if="error">{{ error }}</small>
                <button>Signup</button>
            </form>
            <button class="google-btn" @click="googleSignup">
                <img src="@/assets/img/icons8-google.svg" alt="" />Continue with
                Google
            </button>
            <span @click="islogin = true">Or login</span>
        </div>
    </section>
</template>

<script>
    import { ValidationProvider } from 'vee-validate';
    import { extend } from 'vee-validate';

    export default {
        data() {
            return {
                islogin: true,
                error: '',
                passError: '',
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
                if (!this.userLogin.username || !this.userLogin.password) {
                    this.error =
                        'Please enter your username and password to continue';
                    return;
                }
                this.error = '';
                try {
                    let user = this.userLogin;
                    await this.$store.dispatch({ type: 'login', user });
                    this.$router.push('/workspace');
                } catch (err) {
                    // console.log('Error in Login :', err);
                    this.error = 'Invalid username or password';
                    // throw err;
                }
            },
            async signup() {
                if (
                    !this.userSignup.username ||
                    !this.userSignup.password ||
                    !this.userSignup.fullname
                ) {
                    this.error = 'Please enter all fields';
                    return;
                }
                this.error = '';
                if (this.userSignup.password.length < 8) {
                    this.passError = 'Password must be atleast 8 chars';
                    return;
                }

                this.passError = '';
                try {
                    let user = this.userSignup;
                    await this.$store.dispatch({ type: 'signup', user });
                    this.$router.push('/workspace');
                } catch (err) {
                    console.log('Error in SignUp :', err);
                    throw err;
                }
            },
            async googleSignup() {
                const googleUser = await this.$gAuth.signIn();
                try {
                    const user = googleUser.getBasicProfile();

                    this.googleUser = {
                        username: user.getEmail(),
                        password: user.getId(),
                        fullname: user.getName(),
                        imgUrl: user.getImageUrl(),
                    };
                    if (this.googleUser.username !== '') {
                        await this.$store.dispatch({
                            type: 'signup',
                            user: this.googleUser,
                        });

                        this.$router.push('/workspace');
                    }
                } catch (err) {
                    console.log('Error in google SignUp :', err);
                    throw err;
                }
            },
        },
        components: {
            ValidationProvider,
        },
    };
</script>

<style></style>
