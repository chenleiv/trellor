<template>
    <main class="aside-menu">
        <div class="board-header">
            <h3 class="header">Menu</h3>
            <button
                class="el-icon-close"
                style="font-size: 20px"
                @click="closeMenu"
            ></button>
        </div>
        <!-- <div class="pop-over-content"> -->
        <hr />
        <!-- <section> -->
        <div class="menu-content">
            <h2 class="bgc-btn"><span></span> Change backgroundColor</h2>
            <h2 class="archive-btn"><span></span> Archive</h2>
        </div>
        <!-- </section> -->
        <hr />

        <section class="activities">
            <div class="activity-header">
                <svg>
                    <path
                        d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z"
                    ></path>
                </svg>
                <h3>Activity</h3>
            </div>
        </section>
        <section>
            <div
                class="activity-preview-container"
                v-for="activity in board.activities"
                :key="activity.id"
            >
                <avatar
                    class="curr-user-avatar"
                    backgroundColor="lightblue"
                    color="black"
                    :size="30"
                    username="Tal Tarablus"
                ></avatar>
                <div class="activity-details">
                    <span class="member-name">{{
                        activity.byMember.fullname
                    }}</span
                    >{{ activity.txt }}
                    <div class="activity-member-container">
                        <span class="activity-created-at">3 days ago</span>
                    </div>
                </div>
            </div>
        </section>
    </main>
</template>

<script>
    import Avatar from 'vue-avatar';
    export default {
        name: 'asideMenu',
        props: ['board'],
        data() {
            return {};
        },
        created() {
            this.boardId = this.$route.params.boardId;
            console.log(' this.boardId', this.boardId);
            console.log(' this.board', this.board);
            console.log(' this.activity', this.board.activities);
        },
        methods: {
            closeMenu() {
                this.$emit('openMenu');
            },
        },
        computed: {},
        components: {
            Avatar,
        },
    };
</script>
