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
                        :board="board"
                        :boardLabels="board.labels"
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
            };
        },

        created() {
            this.getPositions();
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

            backToBoard() {
                this.$router.push(`/board/${this.board._id}`);
            },
        },

        computed: {
            board() {
                return this.$store.getters.getCurrBoard;
            },
        },

        components: {
            taskPreview,
        },
    };
</script>
