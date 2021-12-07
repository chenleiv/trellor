<template>
    <section class="task-preview">
        <div class="task-preview-content">
            <div v-if="labelsToShow">
                <div v-if="labelsToShow" class="labels">
                    <div
                        class="task-label"
                        v-for="label in labelsToShow"
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
            </div>

            <div class="task-title">
                {{ task.title }}
            </div>

            <div class="task-show-details">
                <div class="task-description" v-if="task.description">
                    <span class="material-icons-outlined"> notes </span>
                </div>

                <div class="comments" v-if="task.comments">
                    <span class="task-comments" v-if="task.comments.length">
                        <span></span>
                    </span>
                    <span>{{ commentsLength }}</span>
                </div>

                <!-- <div class="task-attachment">
                    <span class="material-icons-outlined"> attach_file </span>
                    <span>{{ attachmentLength }}</span>
                </div> -->

                <div class="task-checklists" v-if="task.checklists">
                    <!-- v-if="task.checklists.length" -->
                    <span v-if="task.checklists.length">
                        <span class="material-icons-outlined"> check_box </span>
                        <p>0/2</p>
                    </span>
                </div>

                <div v-for="member in task.members" :key="member.id">
                    <div class="list-task-members">{{ member.fullname }}</div>
                </div>
            </div>

            <!-- delete button -->

            <el-popover
                style="z-index: 10"
                placement="bottom-end"
                width="100"
                v-model="toggleDeleteMenu"
            >
                <p>Delete this task?</p>
                <div style="text-align: right">
                    <el-button
                        size="mini"
                        type="text"
                        style="color: black"
                        @click="toggleTaskDelete"
                        >cancel</el-button
                    >
                    <el-button
                        type="info"
                        size="mini"
                        @click.prevent="removeTask"
                        >confirm</el-button
                    >
                </div>
                <el-button
                    class="edit-task-btn btn-group"
                    slot="reference"
                    @click.prevent
                ></el-button>
            </el-popover>
            <!-- <button
                @click.prevent="deleteTask"
                class="edit-task-btn btn-group"
            ></button> -->
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
                toggleDeleteMenu: false,
            };
        },

        created() {
            const { boardId } = this.$route.params;
            this.boardId = boardId;
            // console.log('', this.boardLabels);

            if (this.task.labelIds) {
                // Ben
                if (this.task.labelIds.length > 0) this.getLabels();
            }
            // console.log('task preview labels', this.taskLabels);
        },
        methods: {
            toggleSize() {
                this.changeLabelSize = !this.changeLabelSize;
                console.log('this.changeLabelSize', this.changeLabelSize);
            },
            getLabels() {
                // const taskLabels = ['l101', 'l102'];
                const labels = this.boardLabels.filter((lb) => {
                    return this.task.labelIds.some((taskL) => {
                        return lb.id.includes(taskL);
                    });
                });
                this.taskLabels = labels;
                return this.taskLabels;
            },
            removeTask() {
                this.$emit('deleteTask', this.task);
                this.toggleDeleteMenu = !this.toggleDeleteMenu;
            },
            toggleTaskDelete() {
                this.toggleDeleteMenu = !this.toggleDeleteMenu;
                // this.$emit('openModalBg');
            },
        },
        computed: {
            commentsLength() {
                let comment = this.task.comments.length
                    ? this.task.comments.length
                    : null;
                return comment;
            },
            labelsToShow() {
                if (this.task.labelIds) {
                    // Ben
                    if (this.task.labelIds.length > 0) {
                        return this.getLabels();
                    }
                }
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
