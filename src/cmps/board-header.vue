<template>
    <section>
        <div class="board-header move">
            <div class="left-side-header">
                <div class="left-and-members">
                    <div class="left-side-btn">
                        <button @click="toggleLeftMenu">
                            <span class="el-dropdown-link">
                                <span class="material-icons-outlined rote">
                                    leaderboard
                                </span>
                                <span>Board</span
                                ><i
                                    class="el-icon-arrow-down el-icon--right"
                                ></i>
                            </span>
                        </button>
                    </div>

                    <div class="left-menu" v-if="leftMenu">
                        <button class="left-btn" @click="openDashboard">
                            <span class="material-icons-outlined">
                                dashboard
                            </span>
                            Dashboard
                        </button>
                        <button class="left-btn" @click="openMainMap">
                            <span class="material-icons-outlined"> map </span
                            >Map
                        </button>
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
                        @click="starUpdate"
                        class="star-favorite"
                    ></span>
                </div>
                <div class="members-container">
                    <div class="vl"></div>
                    <div class="avatar-icon" v-if="board.members.length">
                        <template v-for="mem in board.members">
                            <el-popover
                                :key="mem._id"
                                placement="top"
                                :title="mem.fullname"
                                width="200"
                                trigger="hover"
                                ><div class="mems-popover">
                                    <span>{{ mem.username }}</span>
                                    <span @click="removeMember(mem._id)"
                                        >remove</span
                                    >
                                </div>
                                <avatar
                                    slot="reference"
                                    backgroundColor="cadetblue"
                                    color="#fff"
                                    :size="30"
                                    :src="mem.imgUrl"
                                    :username="mem.fullname"
                                ></avatar></el-popover
                        ></template>
                    </div>

                    <el-popover
                        class="users-popover"
                        placement="bottom"
                        width="200"
                        v-model="toggleUserInvite"
                        title="Add to board"
                    >
                        <div
                            class="available-users-container"
                            v-for="(user, i) in availUsers"
                            :key="i"
                            @click="addMembers(user)"
                        >
                            <avatar
                                backgroundColor="cadetblue"
                                color="#fff"
                                :size="30"
                                :username="user.fullname"
                                :src="user.imgUrl"
                            ></avatar
                            ><span>{{ user.fullname }}</span>
                        </div>
                        <a class="add-btn" slot="reference">
                            <span class="user"></span> Invite
                        </a>
                    </el-popover>
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
                    @removeBoard="removeBoard"
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
                availUsers: [],
                isShown: false,
                value: '',
                isStarred: this.board.isStarred,
                title: this.board.title,
                boardId: '',
                visible: false,
                filterIsShown: false,
                toggleUserInvite: false,
                leftMenu: false,
            };
        },
        created() {
            // this.boardId = this.board._id;
            this.availUsers = this.users;
            // console.log('', this.board.members);
            this.boardId = this.board._id;
        },

        methods: {
            removeMember(id) {
                const board = JSON.parse(JSON.stringify(this.board));
                const idx = board.members.findIndex((mem) => mem._id === id);
                board.members.splice(idx, 1);
                if (this.loggedInUser) {
                    board.activities.unshift({
                        byMember: this.loggedInUser,
                        txt: 'has remove a member',
                        createdAt: Date.now(),
                    });
                }

                this.updateBoard(board);
            },
            addMembers(user) {
                const board = JSON.parse(JSON.stringify(this.board));
                if (board.members.find((m) => m._id == user._id)) return;
                board.members.push(user);
                if (this.loggedInUser) {
                    board.activities.unshift({
                        byMember: this.loggedInUser,
                        txt: 'has added a member',
                        createdAt: Date.now(),
                    });
                }
                this.updateBoard(board);
            },
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
                    this.$emit('editBgcBoard', style);
                } catch (err) {
                    console.log('Error in updateBoard (board-header):', err);
                    throw err;
                }
            },
            starUpdate() {
                this.isStarred = !this.isStarred;
                const changedBoard = JSON.parse(JSON.stringify(this.board));
                changedBoard.isStarred = this.isStarred;
                if (this.loggedInUser) {
                    changedBoard.activities.unshift({
                        byMember: this.loggedInUser,
                        txt: 'has made this board his favorite',
                        createdAt: Date.now(),
                    });
                }
                this.updateBoard(changedBoard);
            },
            async updateBoard(board) {
                const newBoard = JSON.parse(JSON.stringify(board));
                try {
                    this.$emit('updateBoard', newBoard);

                    console.log(`Board changed successfully`);
                } catch (err) {
                    console.log('Error in adding a board (workspace):', err);
                    throw err;
                }
            },
            async removeBoard() {
                try {
                    await this.$store.dispatch({
                        type: 'removeBoard',
                        boardId: this.boardId,
                    });
                    console.log(`Board removed successfully`);
                    this.$router.push('/workspace');
                } catch (err) {
                    console.log('Error in removing board (aside-menu):', err);
                    throw err;
                }
            },
            async editTitle() {
                this.toggleInput();
                if (!this.title.trim()) this.title = 'Board name';
                try {
                    await this.$store.dispatch({
                        type: 'updateBoardTitle',
                        boardId: this.boardId,
                        title: this.title,
                    });
                    console.log(`Board Saved Successfully in ${this.boardId}`);
                } catch (err) {
                    console.log('Error in updateBoard (board-header):', err);
                    throw err;
                }
            },
            openMainMap() {
                console.log('click map');
                this.leftMenu = false;
                this.$router.push(`/board/${this.boardId}/main-map`);
            },
            openDashboard() {
                this.leftMenu = false;
                console.log('click dash');
                this.$router.push(`/board/${this.boardId}/dashboard`);
            },
            toggleLeftMenu() {
                this.leftMenu = !this.leftMenu;
                console.log('this.leftMenu', this.leftMenu);
            },
        },

        computed: {
            loggedInUser() {
                return this.$store.getters.loggedinUser;
            },
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
            users() {
                return this.$store.getters.users;
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
