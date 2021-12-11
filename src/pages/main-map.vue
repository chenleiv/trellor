<template>
    <section class="modal-background" @click.self="backToBoard">
        <GmapMap
            :center="center"
            :zoom="2"
            map-type-id="terrain"
            class="main-map"
        >
            ><GmapMarker
                v-for="(task, id) in tasks"
                :key="id"
                :position="task.location.coords"
                :title="task.location.address"
                :clickable="true"
                :draggable="false"
                @click="showById = id"
                @closeclick="showById = null"
            >
                <gmap-info-window :opened="showById === id">
                    <task-preview
                        :task="task"
                        :boardLabels="boardLabels"
                        class="task-preview-in-map"
                    />
                </gmap-info-window>
            </GmapMarker>
        </GmapMap>
    </section>
</template>

<script>
    import taskPreview from '@/cmps/task-preview.vue';

    export default {
        data() {
            return {
                center: { lat: 31.769218, lng: 35.208144 },
                tasks: [],
                showById: null,
                boardLabels: [],
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
                            this.tasks.push(task);
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
                    this.boardLabels = this.board.labels;
                    this.getPositions();
                } catch (err) {
                    console.log('Board Loading Error (main-map):', err);
                    throw err;
                }
            },

            backToBoard() {
                this.$router.push(`/board/${this.board._id}`);
            },
        },

        components: {
            taskPreview,
        },
    };
</script>
