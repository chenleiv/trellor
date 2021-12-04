<template>
    <section v-if="board" class="board-details">
        <board-header :board="board" @loadBoard="loadBoard" />

        <main class="main-layout">
            <section class="groups-container">
                <div v-for="group in board.groups" :key="group.id">
                    <group-preview :group="group" @loadBoard="loadBoard" />
                </div>

                <div v-if="!isAddClicked">
                    <button @click="openAddingInput">Add another group</button>
                </div>
                <div v-else>
                    <input
                        v-model="groupTitle"
                        type="text"
                        placeholder="Enter group title..."
                    />
                    <button @click="addGroup">Add group</button>
                    <button @click="openAddingInput">X</button>
                </div>
            </section>
        </main>

        <transition name="fade">
            <router-view />
        </transition>
    </section>
</template>

<script>
    import groupPreview from '@/cmps/group-preview.vue';
    import boardHeader from '@/cmps/board-header.vue';

    export default {
        name: 'boardDetails',

        data() {
            return {
                board: null,
                isAddClicked: false,
                groupTitle: '',
            };
        },

        created() {
            this.loadBoard();
        },

        methods: {
            async loadBoard() {
                const { boardId } = this.$route.params;
                try {
                    const board = await this.$store.dispatch({
                        type: 'getBoard',
                        boardId,
                    });
                    this.board = board;
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
                    this.loadBoard();
                } catch (err) {
                    console.log(
                        'Error in Adding a Group (board-details):',
                        err
                    );
                    throw err;
                } finally {
                    this.groupTitle = '';
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
        },
    };
</script>
