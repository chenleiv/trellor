<template>
    <section v-if="board" class="board-details">
        <board-header
            :board="board"
            @updateBoard="updateBoard"
            @editBgcBoard="editBgcBoard"
        />

        <main class="main-layout">
            <Container
                group-name="bo"
                class="groups-container"
                behaviour="contain"
                orientation="horizontal"
                @drop="onGroupDrop"
                :remove-on-drop-out="true"
                drop-class="card-ghost-drop"
                drag-class="dragging"
            >
                <!-- drag-handle-selector=".column-drag-handle" -->
                <!-- Group-preview -->
                <Draggable v-for="group in board.groups" :key="group.id">
                    <group-preview
                        @updateBoard="updateBoard"
                        :board="board"
                        :group="group"
                        :boardLabels="board.labels"
                    />
                </Draggable>
                <section>
                    <!-- <transition name="slide-up"> -->
                    <div class="add-group-btn-container" v-if="!isAddClicked">
                        <button class="add-group-btn" @click="openAddingInput">
                            <span class="el-icon-plus"></span> Add another list
                        </button>
                    </div>
                    <!-- </transition> -->
                    <!-- <transition name="slide-up"> -->
                    <div class="group-add-container" v-if="isAddClicked">
                        <input
                            @keyup.enter="addGroup"
                            v-model="groupTitle"
                            type="text"
                            placeholder="Enter list title..."
                        />
                        <div class="group-btns-container">
                            <button @click="addGroup">Add list</button>
                            <button
                                class="el-icon-close"
                                @click="openAddingInput"
                            ></button>
                        </div>
                    </div>
                    <!-- </transition> -->
                </section>
            </Container>
        </main>

        <transition name="fade" :duration="50">
            <router-view />
        </transition>
    </section>
</template>

<script>
    import groupPreview from '@/cmps/group-preview.vue';
    import boardHeader from '@/cmps/board-header.vue';
    import { Container, Draggable, smoothDnD } from 'vue-smooth-dnd';
    import { applyDrag } from '@/services/util-drag.js';
    export default {
        name: 'boardDetails',

        data() {
            return {
                board: null,
                // boardId: null,
                isAddClicked: false,
                groupTitle: '',
                toggleMenu: false,
            };
        },

        created() {
            // this.loadBoard();
            this.getBoard();
        },

        methods: {
            // async loadBoard() {
            //     const { boardId } = this.$route.params;
            //     try {
            //         const board = await this.$store.dispatch({
            //             type: 'getBoard',
            //             boardId,
            //         });
            //         this.board = board;
            //         this.boardId = boardId;
            //     } catch (err) {
            //         console.log('Board Loading Error (board-details):', err);
            //         throw err;
            //     }
            // },
            getBoard() {
                this.board = this.$store.getters.getCurrBoard;
            },
            dropEnd(ev) {
                // console.log('arguments', ev);
            },
            onGroupDrop(dropResult) {
                console.log('hi');
                // const board = JSON.parse(JSON.stringify(this.board));
                const board = Object.assign({}, this.board);
                board.groups = applyDrag(this.board.groups, dropResult);
                // console.log('dropResult', dropResult);
                this.updateBoard(board);
            },
            editBgcBoard(style) {
                this.$emit('setBg', style);
            },

            openAddingInput() {
                this.isAddClicked = !this.isAddClicked;
            },
            async addGroup() {
                if (!this.groupTitle) return;
                try {
                    await this.$store.dispatch({
                        // const group = JSON.parse(JSON.stringify(this.newGroup));
                        type: 'addGroup',
                        boardId: this.board._id,
                        groupTitle: this.groupTitle,
                    });
                    console.log(
                        `Group Added Successfully in ${this.board._id}`
                    );
                } catch (err) {
                    console.log(
                        'Error in Adding a Group (board-details):',
                        err
                    );
                    throw err;
                } finally {
                    this.groupTitle = '';
                    this.$el.scrollTo(this.$el.scrollWidth + 270, 0);
                }
            },
            async updateBoard(newBoard) {
                try {
                    await this.$store.dispatch({
                        type: 'updateBoard',
                        board: newBoard,
                    });
                    console.log(`Board changed successfully`);
                } catch (err) {
                    console.log('Error in adding a board (workspace):', err);
                    throw err;
                }
            },
        },

        computed: {
            //     board() {
            //         return this.$store.getters.watchedBoard;
            //     },
            //     BoardId() {
            //         return this.$route.params.id;
            //     },
        },

        watch: {
            '$store.getters.getCurrBoard'(board) {
                this.board = { ...board };
            },
        },

        components: {
            groupPreview,
            boardHeader,
            Container,
            Draggable,
        },
    };
</script>
