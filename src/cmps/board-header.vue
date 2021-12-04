<template>
    <section>
        <div class="board-header">
            <!-- drop-dawn menu (board,map,calender) -->

            <div class="select">
                <button>
                    <span class="el-icon-s-data"></span
                    ><span class="bb"> Board</span
                    ><span class="el-icon-arrow-down"></span>
                </button>
                <!-- <el-select v-model="value" collapse-tags placeholder="Board">
                    <el-option value="Board">
                        <i class="el-icon-s-data"></i> Board</el-option
                    >
                    <el-option value="Map">
                        <i class="el-icon-location-information"></i>
                        Map</el-option
                    >
                    <el-option value="Calendar">
                        <i class="el-icon-date"></i> Calendar</el-option
                    >
                    <el-option value="Dashboard">
                        <i class="el-icon-odometer"></i> Dashboard</el-option
                    >
                </el-select> -->
            </div>

            <section class="board-title-header">
                <input
                    @focus="$event.target.select()"
                    v-model="title"
                    @blur="editTitle"
                    @keyup.enter="$event.target.blur()"
                    placeholder="Add title..."
                />
            </section>

            <div class="header-members">
                <avatar
                    backgroundColor="lightblue"
                    color="black"
                    :size="30"
                    username="Ben Ernst"
                ></avatar>
                <avatar
                    backgroundColor="darkslateblue"
                    color="#fff"
                    :size="30"
                    username="Or Baadani"
                ></avatar>

                <avatar
                    backgroundColor="cadetblue"
                    color="#fff"
                    :size="30"
                    username="Chen Leiv"
                ></avatar>

                <button class="add-btn">
                    <span class="user"></span> invite
                </button>
            </div>

            <div class="right-side">
                <!-- filter button open dropdown -->
                <button class="filter-btn">Filter</button>
                <!-- <board-filter></board-filter> -->
                <button class="menu-btn" @click="openMenu">Show menu</button>
            </div>

            <aside-menu :class="menuBarIsShown"></aside-menu>
        </div>
    </section>
</template>

<script>
    import asideMenu from '@/cmps/aside-menu.vue';
    import BoardFilter from '@/cmps/board-filter.vue';
    import Avatar from 'vue-avatar';

    export default {
        name: 'boardHeader',
        props: ['board'],

        data() {
            return {
                IsShown: false,
                // isInputVisible: false,
                title: this.board.title,
                boardId: '',
            };
        },
        created() {
            this.boardId = this.$route.params.boardId;
        },

        methods: {
            openMenu() {
                this.IsShown = !this.IsShown;
                // this.$emit('openSide');
            },

            toggleInput() {
                this.isInputVisible = !this.isInputVisible;
                // TODO: Clearing textarea Input
            },

            async editTitle() {
                console.log('this.board.title', this.board.title);
                this.toggleInput();
                try {
                    await this.$store.dispatch({
                        type: 'updateBoardTitle',
                        boardId: this.boardId,
                        title: this.title,
                    });
                    console.log(`Board Saved Successfully in ${this.boardId}`);
                    this.$emit('loadBoard');
                } catch (err) {
                    console.log('Error in updateBoard (board-header):', err);
                    throw err;
                }
                console.log('this.board.title', this.board.title);
                console.log('this.title', this.title);
            },
        },

        computed: {
            menuBarIsShown() {
                return {
                    'aside-menu-open': this.IsShown,
                    'aside-close': !this.IsShown,
                };
            },
        },

        components: {
            asideMenu,
            BoardFilter,
            Avatar,
        },
    };
</script>
