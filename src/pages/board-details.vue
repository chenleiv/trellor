<template>
    <section v-if="board" class="board-details">
        <board-header
            :board="board"
            @loadBoard="loadBoard"
            @editBgcBoard="editBgcBoard"
        />

        <main class="main-layout">
            <Container
                class="groups-container"
                behaviour="contain"
                @drop-ready="dropReady($event)"
                orientation="horizontal"
                @drop="onDrop"
                @drag-end="dropEnd"
                :remove-on-drop-out="true"
                drop-class="card-ghost-drop"
                drag-class="dragging"
            >
                <!-- Group-preview -->
                <Draggable v-for="group in board.groups" :key="group.id">
                    <group-preview
                        :group="group"
                        :boardLabels="board.labels"
                        @loadBoard="loadBoard"
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
            <router-view @loadBoard="loadBoard" />
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
                isAddClicked: false,
                groupTitle: '',
                toggleMenu: false,
            };
        },

        created() {
            this.loadBoard();
        },

        methods: {
            dropEnd(ev) {
                // console.log('arguments', ev);
            },
            onDrop(dropResult) {
                const board = JSON.parse(JSON.stringify(this.board));
                board.groups = applyDrag(this.board.groups, dropResult);
                // console.log('dropResult', dropResult);
                this.updateBoard(board);
            },
            dropReady() {},
            editBgcBoard(style) {
                this.$emit('setBg', style);
            },
            async loadBoard() {
                const { boardId } = this.$route.params;
                try {
                    const board = await this.$store.dispatch({
                        type: 'getBoard',
                        boardId,
                    });
                    this.board = board;
                    // console.log('this.board ', this.board);
                    // console.log(
                    //     'this.board.style from details',
                    //     this.board.style
                    // );
                    // this.toyToEdit = JSON.parse(JSON.stringify(toy));
                } catch (err) {
                    console.log('Board Loading Error (board-details):', err);
                    throw err;
                }
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
                    // console.log(
                    //     `Group Added Successfully in ${this.board._id}`
                    // );
                    this.loadBoard();
                } catch (err) {
                    console.log(
                        'Error in Adding a Group (board-details):',
                        err
                    );
                    throw err;
                } finally {
                    this.groupTitle = '';
                    // console.log('', this.$el.scrollWidth);
                    this.$el.scrollTo(this.$el.scrollWidth + 270, 0);
                }
            },
            async updateBoard(changedBoard) {
                try {
                    const savedBoard = await this.$store.dispatch({
                        type: 'updateBoard',
                        board: changedBoard,
                    });
                    console.log(`Board changed successfully`);
                    this.loadBoard();
                } catch (err) {
                    console.log('Error in adding a board (workspace):', err);
                    throw err;
                }
            },
        },

        computed: {
            // getBoard
        },

        //ask Avior if nessecery
        // watch: {
        //   "$route.params.BoardId": {
        //     handler() {
        //       let toyId = this.$route.params.BoardId;
        //       console.log("Changed to", BoardId);
        //       this.$store.dispatch({ type: "setCurrToy", BoardId });
        //     },
        //     immediate: true,
        //   },
        // },

        components: {
            groupPreview,
            boardHeader,
            Container,
            Draggable,
        },
    };
</script>
