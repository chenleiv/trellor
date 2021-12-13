<template>
    <div class="home">
        <div>
            <div class="link">
                <article>
                    <h1>Trellor: where powerful work gets done.</h1>
                    <p>
                        Make every project a success: customize your Trello
                        workspace with more ways to visualize your work and
                        dashboards to help every team do their best work
                    </p>
                </article>
                <router-link to="/workspace"><h2>Try Demo</h2> </router-link>
            </div>

            <img src="@/assets/img/homepage.jpg" alt="" />
        </div>

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
