<template>
    <div class="workspace main-layout full">
        <section>
            <h4 class="favorites" v-if="atleastOneStarred">Favorites</h4>
            <div class="board-previews-container">
                <template v-for="board in boards"
                    ><board-preview
                        :key="board._id"
                        v-if="board.isStarred"
                        :board="board"
                /></template>
            </div>
            <div class="board-previews-container">
                <div class="add-board-btn" @click="openBoardModal">
                    <span>Create new board</span>
                </div>

                <div
                    class="modal-background"
                    v-if="isModalOpen"
                    @click="
                        {
                            (isModalOpen = false), (openUnsplash = false);
                        }
                    "
                ></div>
                <div class="modal-container" v-if="isModalOpen">
                    <div
                        class="add-board-modal"
                        :style="{
                            backgroundColor: boardStyle.bgColor,
                            backgroundImage:
                                'linear-gradient(rgb(0 0 0 / 27%), rgb(0 0 0 / 10%)) ,' +
                                boardStyle.bgImg,
                        }"
                    >
                        <div>
                            <input
                                type="text"
                                placeholder="Add board title"
                                v-model="newBoard.title"
                                @keyup.enter="addBoard"
                            />
                        </div>
                        <background-picker
                            @chosenBg="chosenBg"
                        ></background-picker>
                        <div class="modal-board-btns">
                            <button
                                @click="addBoard"
                                :disabled="!newBoard.title.length"
                            >
                                Create board
                            </button>
                            <button @click="openUnsplash = !openUnsplash">
                                <span class=""></span>More
                            </button>
                        </div>
                    </div>
                    <background-unsplash
                        @onSaveImg="onSaveImg"
                        v-if="openUnsplash"
                    ></background-unsplash>
                </div>
                <template v-for="board in boards"
                    ><board-preview
                        :key="board._id"
                        v-if="!board.isStarred"
                        :board="board"
                /></template>
            </div>
        </section>
    </div>
</template>

<script>
    import boardPreview from '@/cmps/board-preview.vue';
    import backgroundPicker from '@/cmps/background-picker.vue';
    import { boardService } from '@/services/board-service.js';
    import backgroundUnsplash from '@/cmps/background-unsplash.vue';

    export default {
        name: 'workspace',
        data() {
            return {
                isModalOpen: false,
                newBoard: boardService.getEmptyBoard(),
                openUnsplash: false,
                boardStyle: {
                    bgColor: 'none',
                    bgImg: `url(${require('@/assets/img/' + '2.jpg')})`,
                },
            };
        },

        computed: {
            boards() {
                return this.$store.getters.boardsToShow;
            },
            atleastOneStarred() {
                return this.boards.some((board) => board.isStarred);
            },
        },

        methods: {
            onSaveImg(url) {
                this.boardStyle.bgImg = `url(${url})`;
                this.boardStyle.bgColor = 'none';
            },
            openBoardModal() {
                this.isModalOpen = !this.isModalOpen;
            },
            chosenBg(style, image) {
                this.boardStyle = style;
                console.log('this.boardStyle', this.boardStyle);
            },
            async addBoard() {
                if (!this.newBoard.title) return;
                console.log('', this.newBoard);
                this.newBoard.style = this.boardStyle;
                const board = JSON.parse(JSON.stringify(this.newBoard));
                try {
                    board.createdAt = Date.now();
                    const savedBoard = await this.$store.dispatch({
                        type: 'addBoard',
                        board,
                    });
                    console.log(`Board added successfully`);
                    this.$router.push(`/board/${savedBoard._id}`);
                } catch (err) {
                    console.log('Error in adding a board (workspace):', err);
                    throw err;
                } finally {
                    this.newBoard.Title = '';
                    this.openBoardModal();
                }
            },
        },

        components: {
            boardPreview,
            backgroundPicker,
            backgroundUnsplash,
        },
    };
</script>
