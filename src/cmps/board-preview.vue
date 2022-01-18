<template>
    <router-link :to="`/board/${board._id}`">
        <div
            class="board-preview"
            :style="{
                backgroundColor: board.style.bgColor,
                backgroundImage:
                    'linear-gradient(rgb(0 0 0 / 27%), rgb(0 0 0 / 10%)) ,' +
                    board.style.bgImg,
            }"
        >
            <h4 class="board-preview-title">{{ board.title }}</h4>
            <span
                :class="{ starred: isStarred }"
                @click.prevent="updateStarBoard"
            ></span>
        </div>
    </router-link>
</template>

<script>
    export default {
        name: 'boardPreview',
        props: {
            board: {
                type: Object,
                required: true,
                default: function () {
                    return { msg: 'No Board' };
                },
            },
        },
        data() {
            return {
                isStarred: this.board.isStarred,
            };
        },
        methods: {
            clickBoard() {
                console.log('', this.board);
                this.$router.push(`/board/${this.board._id}`);
            },
            updateStarBoard() {
                this.isStarred = !this.isStarred;
                const changedBoard = JSON.parse(JSON.stringify(this.board));
                changedBoard.isStarred = this.isStarred;
                this.updateBoard(changedBoard);
            },
            async updateBoard(changedBoard) {
                try {
                    const savedBoard = await this.$store.dispatch({
                        type: 'updateBoard',
                        board: changedBoard,
                    });
                    console.log(`Board changed successfully`);
                } catch (err) {
                    console.log('Error in adding a board (workspace):', err);
                    throw err;
                }
            },
        },
    };
</script>
