<template>
    <header
        class="main-header main-layout"
        :style="{ backgroundColor: headerColor }"
    >
        <section class="header-container">
            <div class="logo">
                <router-link to="/workspace">
                    <span class="el-icon-s-grid grid-icon"></span>
                </router-link>
                <router-link to="/" class="logo-trellor">
                    <h1><span class="logo-icon"></span> Trellor</h1>
                </router-link>
            </div>
            <!-- <div class="main-header-links"></div> -->
            <!-- <button class="user-account-btn"> -->
            <div class="right-side">
                <div class="search-input">
                    <el-input
                        placeholder="Search"
                        prefix-icon="el-icon-search"
                        v-model="input"
                    >
                    </el-input>
                </div>
                <button class="alert"></button>
                <router-link v-if="!loggedInUser" to="/login">
                    Login</router-link
                >
                <el-popover
                    v-if="loggedInUser"
                    placement="bottom-end"
                    width="100"
                    v-model="toggleUserMenu"
                    :title="'Hello, ' + loggedInUser.fullname"
                >
                    <el-button v-if="loggedInUser" @click="logout"
                        >Logout</el-button
                    >
                    <avatar
                        v-if="loggedInUser"
                        :src="loggedInUser.imgUrl"
                        backgroundColor="darkslateblue"
                        color="#fff"
                        :size="30"
                        slot="reference"
                        :username="loggedInUser.fullname"
                    ></avatar>
                </el-popover>
            </div>
        </section>
    </header>
</template>

<script>
    import Avatar from 'vue-avatar';
    // import { login } from '@/services/auth.service.js';
    import { login } from '../services/auth.service';
    export default {
        name: 'mainHeader',
        data() {
            return {
                headerColor: '',
                input: '',
                toggleUserMenu: false,
            };
        },
        created() {
            this.boardId = this.$route.params.boardId;
        },
        computed: {
            loggedInUser() {
                return this.$store.getters.loggedinUser;
            },
        },
        methods: {
            async logout() {
                this.toggleUserMenu = false;
                try {
                    await this.$store.dispatch({ type: 'logout' });
                    this.$router.push('/login');

                    // this.$router.push('/');
                } catch (err) {
                    console.log('err in logout (login cmp)', err);
                    throw err;
                }
            },
        },
        watch: {
            '$route.params.boardId': {
                async handler() {
                    let { boardId } = this.$route.params;
                    if (boardId) {
                        this.headerColor = '#00000073';
                    } else {
                        this.headerColor = '#026aa7';
                    }
                },
            },
        },
        components: {
            Avatar,
        },
    };
</script>
