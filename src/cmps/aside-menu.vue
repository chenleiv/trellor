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
            <h2 class="bgc-btn" @click="openBgcMenu">
                <div
                    :style="{
                        backgroundColor: boardStyle.bgColor,
                        backgroundImage: boardStyle.bgImg,
                    }"
                ></div>
                Change background
            </h2>
            <!-- backGround color cmp -->
            <transition name="slide-fade">
                <div
                    v-if="bgcIsClick"
                    class="background-menu aside-menu"
                    :class="{
                        'aside-close': !bgcIsClick,
                    }"
                >
                    <div class="board-header">
                        <button
                            class="el-icon-arrow-left"
                            style="font-size: 20px"
                            @click="openBgcMenu"
                        ></button>
                        <h3 class="header">Background</h3>
                        <button
                            class="el-icon-close"
                            style="font-size: 20px"
                            @click="closeMenu"
                        ></button>
                    </div>
                    <hr />
                    <div
                        v-if="!openColorMenu && !openImgMenu && !bgcType"
                        class="bgc-btns"
                    >
                        <div
                            class="color-options"
                            @click="openColorMenu = !openColorMenu"
                        ></div>
                        <div
                            class="img-options"
                            @click="openImgMenu = !openImgMenu"
                        ></div>
                        <img-upload
                            class="upload-btn"
                            @onSaveImg="changeImgUrl"
                        ></img-upload>
                    </div>
                    <bgc-aside-menu
                        v-if="openColorMenu"
                        :class="openBgcOption"
                        @chosenBg="chosenBg"
                    ></bgc-aside-menu>
                    <!-- </router-view> -->
                    <background-unsplash
                        class="cmp-unsplash"
                        v-if="openImgMenu"
                        @onSaveImg="changeImgUrl"
                    ></background-unsplash>
                </div>
            </transition>
            <h2 class="archive-btn"><span></span> Archive</h2>
            <el-popover placement="top" width="150" v-model="toggleDeleteMenu">
                <p>Remove this board?</p>
                <div style="text-align: right; margin: 0">
                    <el-button
                        size="mini"
                        type="text"
                        style="color: black"
                        @click="toggleDeleteMenu = false"
                        >cancel</el-button
                    >
                    <el-button type="info" size="mini" @click="removeBoard"
                        >confirm</el-button
                    >
                    <!-- <el-button size="mini" type="text" @click="toggleDeleteMenu = false">cancel</el-button>
    <el-button type="primary" size="mini" @click="removeBoard">confirm</el-button> -->
                </div>
                <el-button class="close-board-btn" slot="reference"
                    >Close board...</el-button
                >
            </el-popover>
            <!-- <h2 slot="reference"
                class="close-board-btn"
                @click="toggleDeleteMenu = !toggleDeleteMenu"
            >
                Close board...
            </h2> -->
        </div>
        <!-- </section> -->
        <hr />

        <section class="activities">
            <div class="activities-header">
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
                    username="Ben Ernst"
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
    import bgcAsideMenu from '@/cmps/bgc-aside-menu.vue';
    import Avatar from 'vue-avatar';
    import imgUpload from '@/cmps/img-upload.vue';
    import backgroundUnsplash from '@/cmps/background-unsplash.vue';
    export default {
        name: 'asideMenu',
        props: ['board'],
        data() {
            return {
                bgcIsClick: false,
                boardStyle: this.board.style,
                openColorMenu: false,
                openImgMenu: false,
                bgcType: false,
                toggleDeleteMenu: false,
                boardId: '',
            };
        },
        created() {
            this.boardId = this.board._id;
            // console.log(' this.boardId aside menu', this.boardId);
            // console.log(' this.board', this.board);
            // console.log(' this.activity', this.board.activities);
        },
        methods: {
            removeBoard() {
                this.$emit('removeBoard', this.boardId);
                // console.log('removeBoard from aside menu', this.boardId);
            },
            changeImgUrl(url) {
                this.bgcType === true;
                this.boardStyle.bgImg = `url(${url})`;
                this.boardStyle.bgColor = 'transparent';
                this.$emit('updateBgcBoard', this.boardStyle);
            },
            closeMenu() {
                this.$emit('openMenu');
            },
            openBgcMenu() {
                this.openColorMenu = false;
                this.openImgMenu = false;
                this.bgcType = false;
                this.bgcIsClick = !this.bgcIsClick;
            },
            chosenBg(style, image) {
                this.boardStyle = style;
                this.$emit('updateBgcBoard', this.boardStyle);
                console.log('this.boardStyle', this.boardStyle);
            },
        },
        computed: {
            openBgcOption() {
                console.log('open bgc menu');
                console.log('this.bgcIsClick', this.bgcIsClick);
                // this.closeMenu();
                return {
                    'aside-bgc-open': this.bgcIsClick,
                    'aside-bgc-close': !this.bgcIsClick,
                };
            },
        },
        components: {
            bgcAsideMenu,
            Avatar,
            imgUpload,
            backgroundUnsplash,
        },
    };
</script>
