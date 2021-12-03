<template>
    <header class="main-header main-layout">
        <section class="header-container">
            <div class="logo">
                <h1>Trellor</h1>
            </div>
            <div class="main-header-links">
                <router-link to="/">Home</router-link> |
                <router-link to="/workspace">Workspace</router-link>
            </div>
            <button class="user-account-btn">User Account</button>
        </section>
    </header>
</template>

<script>
    export default {
        name: 'mainHeader',
    };
</script>
