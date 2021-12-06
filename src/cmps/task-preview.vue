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
                    :class="{
                        shrinkLabel: changeLabelSize,
                        increaseLabel: !changeLabelSize,
                    }"
                >
                    <span v-if="!changeLabelSize">{{ label.title }}</span>
                </div>
            </div>

            <div class="task-title">
                {{ task.title }}
            </div>

            <div class="task-show-details">
                <div class="task-description" v-if="task.description.length">
                    <span class="material-icons-outlined"> notes </span>
                </div>

                <div class="comments" v-if="task.comments.length">
                    <span class="task-comments">
                        <span></span>
                    </span>
                    <span>{{ commentsLength }}</span>
                </div>

                <!-- <div class="task-attachment">
                    <span class="material-icons-outlined"> attach_file </span>
                    <span>{{ attachmentLength }}</span>
                </div> -->

                <div class="task-checklists">
                    <!-- v-if="task.checklists.length" -->
                    <span>
                        <span class="material-icons-outlined"> check_box </span>
                    </span>
                    <p>0/2</p>
                </div>

                <div v-for="member in task.members" :key="member.id">
                    <div class="list-task-members">{{ member }}</div>
                </div>
            </div>

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
            console.log('', this.boardLabels);
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
                        return lb.id.includes(taskL);
                    });
                });
                this.taskLabels = labels;
            },
        },
        computed: {
            commentsLength() {
                let Comment = this.task.comments.length
                    ? this.task.comments.length
                    : null;
                return Comment;
            },
            // attachmentLength() {
            //     let attachment = this.task.attachment.length
            //         ? this.task.attachment.length
            //         : null;
            //     return attachment;
            // },
        },
    };
</script>
