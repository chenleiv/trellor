<template>
    <section class="board-header">
        <!-- drop-dawn menu (board,map,calender) -->

        <div class="select">
            <el-select v-model="value" collapse-tags placeholder="Board">
                <el-option value="Board">
                    <i class="el-icon-s-data"></i> Board</el-option
                >
                <el-option value="Map">
                    <i class="el-icon-location-information"></i> Map</el-option
                >
                <el-option value="Calendar">
                    <i class="el-icon-date"></i> Calendar</el-option
                >
                <el-option value="Dashboard">
                    <i class="el-icon-odometer"></i> Dashboard</el-option
                >
            </el-select>
        </div>

        <section class="board-title-header">
            <article v-if="!isInputVisible" @click="toggleInput">
                <p>{{ board.title }}</p>
            </article>
            <!-- <div v-else> -->
            <input
                v-else
                v-model="title"
                type="text"
                @blur="editTitle"
                cols="1"
                rows="1"
                placeholder="change title..."
                ref="title"
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

            <button><span class="add-user"></span> invite users</button>
        </div>

        <!-- filter button open dropdown -->
        <!-- <board-filter></board-filter> -->

        <button class="menu-btn" @click="openMenu">Show menu</button>

        <aside-menu :class="menuVisibility" />
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
                isMenuOpen: false,
                value: '',
                isInputVisible: false,
                title: '',
                boardId: '',
            };
        },
        created() {
            this.boardId = this.$route.params.boardId;
            console.log('this.boardId board header', this.boardId);
        },

        methods: {
            openMenu() {
                this.isMenuOpen = !this.isMenuOpen;
            },
            // handleMenuClick(e) {
            //     console.log('click', e);
            // },
            toggleInput() {
                this.isInputVisible = !this.isInputVisible;
                this.$nextTick(() => {
                    if (this.isInputVisible) this.$refs.title.focus();
                });
                // TODO: Clearing textarea Input
            },
            async editTitle() {
                this.toggleInput();
                try {
                    await this.$store.dispatch({
                        type: 'updateBoardTitle',
                        boardId: this.boardId,
                        title: this.title,
                    });
                    console.log(`Board Saved Successfully in ${boardId}`);
                    this.$emit('loadBoard');
                } catch (err) {
                    console.log('Error in updateBoard (board-header):', err);
                    throw err;
                }
            },
        },
        computed: {
            menuVisibility() {
                return { 'aside-menu-open': this.isMenuOpen };
            },
            // titleToShow() {
            //     return this.title
            /////         ? this.title
            //         : 'Add a more detailed description...';
            // },
        },

        components: {
            asideMenu,
            BoardFilter,
            Avatar,
        },
    };
</script>
