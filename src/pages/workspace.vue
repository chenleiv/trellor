<template>
    <div class="workspace main-layout full">
        <div class="board-previews-container">
            <div class="add-board-btn" @click="openBoardModal">
                <span>Create new board</span>
            </div>
            <div
                class="modal-background"
                v-if="isModalOpen"
                @click="isModalOpen = false"
            ></div>
            <div class="add-board-modal" v-if="isModalOpen">
                <form @submit.prevent="addBoard">
                    <input
                        type="text"
                        placeholder="Add board title"
                        v-model="newBoard.title"
                    />
                    <button type="submit">Create board</button>
                </form>
            </div>
            <div v-for="board in boards" :key="board._id">
                <!-- <router-link :to="`/board/${board._id}`"> -->
                <board-preview :board="board" />
                <!-- </router-link> -->
            </div>
        </div>
    </div>
</template>

<script>
    import boardPreview from '@/cmps/board-preview.vue';
    import { boardService } from '@/services/board-service.js';

    export default {
        name: 'workspace',
        data() {
            return {
                isModalOpen: false,
                newBoard: boardService.getEmptyBoard(),
            };
        },

        computed: {
            boards() {
                return this.$store.getters.boardsToShow;
            },
        },

        methods: {
            openBoardModal() {
                this.isModalOpen = !this.isModalOpen;
            },
            async addBoard() {
                console.log('', this.newBoard);
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
        },
    };
</script>
