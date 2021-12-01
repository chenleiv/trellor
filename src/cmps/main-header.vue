<template>
    <section class="main-header">
        <div class="logo">
            <h1>LOGO</h1>
        </div>
        <div class="main-header-links">
            <router-link to="/">Home</router-link> |
            <router-link to="/workspace">Workspace</router-link>
        </div>
        <button class="user-account-btn">User Account</button>
    </section>
</template>

<script>
    export default {
        name: 'mainHeader',
    };
</script>
