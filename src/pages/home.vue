<template>
    <div class="home">
        <div class="links">
            <router-link to="/workspace"
                ><h2>Get started <span></span></h2> </router-link
            ><br />
            <router-link to="/"
                ><h2>Login <span></span></h2>
            </router-link>
        </div>
        <img src="@/assets/img/undraw_completed_tasks_vs6q.svg" alt="" />
        <!-- <img src="@/assets/img/undraw_taking_notes_re_bnaf.svg" alt="" /> -->
        <!-- <img src="@/assets/img/undraw_work_chat_re_qes4.svg" alt="" /> -->
    </div>
</template>

<script>
    // @ is an alias to /src

    export default {
        name: 'home',
        components: {},
    };
</script>
