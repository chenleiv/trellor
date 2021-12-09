<template>
    <section class="modal-background" @click.self="backToBoard">
        <GmapMap
            :center="center"
            :zoom="2"
            map-type-id="satellite"
            style="
                width: 1000px;
                height: 520px;
                margin: 50px auto;
                border: 4px solid black;
                opacity: 0.6;
            "
        >
            <GmapMarker
                v-for="(pos, index) in positions"
                :position="pos.coords"
                :title="pos.address"
                :clickable="true"
                :draggable="false"
                :key="index"
            />
        </GmapMap>
    </section>
</template>

<script>
    export default {
        data() {
            return {
                center: { lat: 31.769218, lng: 35.208144 },
                positions: [],
                // tasksTitles: []
            };
        },

        created() {
            this.loadBoard();
        },

        methods: {
            getPositions() {
                this.board.groups.forEach((group) => {
                    group.tasks.forEach((task) => {
                        if (task.location) {
                            const pos = {
                                coords: task.location.coords,
                                address: task.location.address,
                                taskTitle: task.title,
                            };
                            this.positions.push(pos);
                            // this.positions.push(task.location.coords);
                            // this.tasksTitles.push(task.title);
                        }
                    });
                });
            },

            async loadBoard() {
                const { boardId } = this.$route.params;
                try {
                    const board = await this.$store.dispatch({
                        type: 'getBoard',
                        boardId,
                    });
                    this.board = board;
                    this.getPositions();
                } catch (err) {
                    console.log('Board Loading Error (main-map):', err);
                    throw err;
                }
            },

            // backToBoard:
            backToBoard() {
                this.$router.push(`/board/${this.board._id}`);
            },
        },
    };
</script>
