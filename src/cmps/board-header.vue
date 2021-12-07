<template>
    <section>
        <div class="board-header move">
            <!-- drop-dawn menu (board,map,calender) -->
            <div class="left-side-header">
                <div class="select">
                    <el-dropdown trigger="click" type="primary">
                        <span class="el-dropdown-link">
                            <span class="material-icons-outlined">
                                leaderboard
                            </span>
                            <span>Board</span
                            ><i class="el-icon-arrow-down el-icon--right"></i>
                        </span>

                        <el-dropdown-menu slot="dropdown" type="primary">
                            <el-dropdown-item>
                                <span class="material-icons-outlined">
                                    leaderboard
                                </span>
                                <span>Board</span>
                            </el-dropdown-item>
                            <el-dropdown-item>
                                <span class="material-icons-outlined">
                                    calendar_month
                                </span>
                                Calender</el-dropdown-item
                            >
                            <el-dropdown-item
                                ><span class="material-icons-outlined">
                                    location_on
                                </span>
                                Map</el-dropdown-item
                            >
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>

                <section class="board-title-header">
                    <input
                        @focus="$event.target.select()"
                        v-model="title"
                        @blur="editTitle"
                        @keyup.enter="$event.target.blur()"
                        placeholder="Add title..."
                        v-autowidth="{
                            maxWidth: '200px',
                            minWidth: '10px',
                            comfortZone: 0,
                        }"
                    />
                </section>
                <span
                    :class="{ starred: isStarred }"
                    @click="updateBoard"
                    class="star-favorite"
                ></span>
                <div class="members-container">
                    <div class="vl"></div>
                    <div class="avatar-icon">
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
                    </div>

                    <a class="add-btn"> <span class="user"></span> Invite </a>
                </div>
            </div>

            <div class="right-side-header" :class="{ move: isShown }">
                <div class="vl"></div>

                <!-- filter button open dropdown -->
                <button class="filter-btn" @click="openFilter">
                    <span class="material-icons-outlined"> filter_list </span>
                    Filter
                </button>
                <div>
                    <board-filter
                        :board="board"
                        :class="filterToShown"
                        @openFilter="openFilter"
                    >
                    </board-filter>
                </div>

                <!-- <board-filter></board-filter> -->
                <button class="menu-btn" @click="openMenu">
                    <span class="el-icon-more"></span> Show menu
                </button>
            </div>
            <transition name="slide-fade">
                <aside-menu
                    :board="board"
                    :class="menuBarIsShown"
                    @openMenu="openMenu"
                    @updateBgcBoard="editBgcBoard"
                ></aside-menu
            ></transition>
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
                isShown: false,
                value: '',
                isStarred: this.board.isStarred,
                title: this.board.title,
                boardId: '',
                visible: false,
                filterIsShown: true,
            };
        },
        created() {
            this.boardId = this.$route.params.boardId;
        },

        methods: {
            openMenu() {
                this.isShown = !this.isShown;
            },
            openFilter() {
                this.filterIsShown = !this.filterIsShown;
            },

            toggleInput() {
                this.isInputVisible = !this.isInputVisible;
            },

            async editBgcBoard(style) {
                try {
                    await this.$store.dispatch({
                        type: 'updateBoardBgc',
                        boardId: this.boardId,
                        style: style,
                    });
                    console.log(`Board Saved Successfully in ${this.boardId}`);
                    // this.$emit('loadBoard');
                    this.$emit('editBgcBoard', style);
                } catch (err) {
                    console.log('Error in updateBoard (board-header):', err);
                    throw err;
                }
            },
            async updateBoard() {
                this.isStarred = !this.isStarred;
                console.log('', this.isStarred);
                const changedBoard = JSON.parse(JSON.stringify(this.board));
                changedBoard.isStarred = this.isStarred;
                try {
                    const savedBoard = await this.$store.dispatch({
                        type: 'updateBoard',
                        board: changedBoard,
                    });
                    console.log(`Board changed successfully`);
                    this.$emit('loadBoard');
                } catch (err) {
                    console.log('Error in adding a board (workspace):', err);
                    throw err;
                }
            },
            async editTitle() {
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
            },
        },

        computed: {
            menuBarIsShown() {
                return {
                    'aside-menu-open': this.isShown,
                    'aside-close': !this.isShown,
                };
            },
            filterToShown() {
                return {
                    'filter-menu-open': this.filterIsShown,
                    'filter-close': !this.filterIsShown,
                };
            },
        },
        watch: {
            editBgcBoard() {
                console.log('watch bgc');
            },
        },
        components: {
            asideMenu,
            BoardFilter,
            Avatar,
        },
    };
</script>
