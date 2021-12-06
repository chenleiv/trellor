<template>
    <section class="task-preview">
        <div class="task-preview-content">
            <div v-if="taskLabels.length" class="labels">
                <div
                    class="task-label"
                    v-for="label in taskLabels"
                    :key="label.Id"
                    @click.prevent="toggleSize"
                    :style="{
                        backgroundColor: label.color,
                    }"
                    :class="{ shrinkLabel: changeLabelSize }"
                >
                    <transition name="fade">
                        <span v-if="!changeLabelSize">{{
                            label.title
                        }}</span></transition
                    >
                </div>
            </div>
            {{ task.title }}
            <button class="edit-task-btn btn-group"></button>
        </div>
    </section>
</template>

<script>
    export default {
        name: 'taskPreview',

        props: {
            task: {
                type: Object,
                required: true,
                default: function () {
                    return { msg: 'No Task' };
                },
            },
            boardLabels: {
                type: Array,
            },
        },

        data() {
            return {
                changeLabelSize: true,
                boardId: '',
                taskLabels: [],
            };
        },

        created() {
            const { boardId } = this.$route.params;
            this.boardId = boardId;
            if (this.task.labelIds.length > 0) this.getLabels();
            // if (this.task.labels) {
            //     // Ben
            // }
        },
        methods: {
            toggleSize() {
                this.changeLabelSize = !this.changeLabelSize;
                console.log('this.changeLabelSize', this.changeLabelSize);
            },
            getLabels() {
                // const taskLabels = ['l101', 'l102'];

                const labels = this.boardLabels.filter((lb) => {
                    // console.log('lb', lb);
                    return this.task.labelIds.some((taskL) => {
                        // console.log('lb id', lb.id);
                        return lb.id.includes(taskL); // Ben
                        // return lb.id === taskL.id; // Ben
                    });
                });
                this.taskLabels = labels;
            },
        },
    };
</script>
