<template>
    <header class="main-header main-layout">
        <section class="header-container">
            <div class="logo">
                <router-link to="/workspace">
                    <span class="el-icon-s-grid"></span>
                </router-link>
                <router-link to="/">
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
                <avatar
                    backgroundColor="darkslateblue"
                    color="#fff"
                    :size="30"
                    username="Or Baadani"
                ></avatar>
            </div>
        </section>
    </header>
</template>

<script>
    import Avatar from 'vue-avatar';
    export default {
        name: 'mainHeader',
        data() {
            return {
                input: '',
            };
        },
        components: {
            Avatar,
        },
    };
</script>
