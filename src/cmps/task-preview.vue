<template>
    <section class="task-preview">
        <!-- To task details -->
        <router-link :to="`/board/${boardId}/task/${task.id}`">
            <div
                v-if="toggleEditCard"
                class="overlay"
                @click.prevent="toggleEditCard = false"
            ></div>

            <div
                class="cover-preview-container"
                :class="{ 'show-task-cover-modal': toggleEditCard }"
            >
                <div
                    v-if="findCoverColor"
                    class="cover-color-preview"
                    :style="{ backgroundColor: task.coverStyle.bgColor }"
                ></div>
                <img
                    v-if="findCoverImg"
                    class="cover-img-preview"
                    :src="coverUrl"
                />

                <div
                    :class="{ 'show-task-modal': toggleEditCard }"
                    class="task-preview-content"
                >
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
                                <span v-if="!changeLabelSize">{{
                                    label.title
                                }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="task-title" v-if="!toggleEditCard">
                        {{ task.title }}
                    </div>

                    <textarea
                        v-else
                        @keydown.enter.prevent
                        @click.prevent
                        class="input-edit-task"
                        v-model="editTitle"
                    ></textarea>
                    <button
                        @click.prevent="taskEdit"
                        v-if="toggleEditCard"
                        class="save-edit-task"
                    >
                        Save
                    </button>

                    <div class="model-btn">
                        <button
                            @click.prevent="openTask"
                            v-if="toggleEditCard"
                            class="open-edit-btn"
                        >
                            <span class="material-icons-outlined">
                                calendar_today
                            </span>

                            Open card
                        </button>
                        <button
                            @click.prevent="removeTask"
                            v-if="toggleEditCard"
                            class="remove-edit-btn"
                        >
                            <span class="material-icons-outlined">
                                archive
                            </span>
                            Archive
                        </button>
                    </div>

                    <div class="task-show-details" v-if="showIcons">
                        <section class="icons-section">
                            <div
                                class="task-description"
                                v-if="task.description"
                            >
                                <span class="material-icons-outlined">
                                    notes
                                </span>
                            </div>

                            <div class="comments" v-if="task.comments.length">
                                <span
                                    class="task-comments"
                                    v-if="task.comments.length"
                                >
                                    <span></span>
                                </span>
                                <span>{{ commentsLength }}</span>
                            </div>

                            <div
                                class="task-attachment"
                                v-if="attachmentLength"
                            >
                                <span> </span>
                                <span>{{ attachmentLength }}</span>
                            </div>
                            <div class="task-location" v-if="task.location">
                                <span class=""></span>
                            </div>
                            <div class="task-date" v-if="task.dueDate">
                                <span class="">
                                    <span
                                        class="material-icons-outlined"
                                        v-if="task.isComplete"
                                    >
                                        done
                                    </span>
                                </span>
                            </div>
                            <div class="task-checklists" v-if="task.checklists">
                                <span v-if="task.checklists.length">
                                    <span class="material-icons-outlined">
                                        check_box
                                    </span>
                                    <p>0/2</p>
                                </span>
                            </div>
                        </section>
                        <section class="">
                            <div
                                v-for="member in task.members"
                                :key="member.id"
                                class="list-task-members"
                            >
                                <avatar
                                    class="user-avatar"
                                    backgroundColor="lightblue"
                                    color="black"
                                    :size="30"
                                    :username="member.fullname"
                                    :src="member.imgUrl"
                                ></avatar>
                            </div>
                        </section>
                    </div>

                    <!-- delete button -->

                    <button
                        class="edit-task-btn btn-group"
                        @click.prevent="toggleEditCard = true"
                        v-if="!toggleEditCard"
                    ></button>
                </div>
            </div>
        </router-link>
    </section>
</template>

<script>
    import Avatar from 'vue-avatar';

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
            board: {
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
                coverUrl: '',
                toggleEditCard: false,
                editTitle: '',
                // deleteCard: false,
            };
        },

        created() {
            this.boardId = this.board._id;
            if (this.task.labelIds) {
                if (this.task.labelIds.length > 0) this.getLabels();
            }
            this.editTitle = this.task.title;
        },
        methods: {
            toggleSize() {
                this.changeLabelSize = !this.changeLabelSize;
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
            taskEdit() {
                this.toggleEditCard = !this.toggleEditCard;
                const newTask = JSON.parse(JSON.stringify(this.task));
                newTask.title = this.editTitle;
                console.log('newTask.title', newTask.title);
                this.$emit('saveEditTask', newTask);
            },
        },
        computed: {
            findCoverImg() {
                if (this.task.attachments.some((attach) => attach.isCover)) {
                    const attach = this.task.attachments.find(
                        (attach) => attach.isCover
                    );
                    this.coverUrl = attach.url;
                } else if (this.task.coverStyle.bgImg !== 'none') {
                    this.coverUrl = this.task.coverStyle.bgImg;
                }
                return this.coverUrl;
            },
            findCoverColor() {
                if (
                    this.task.coverStyle.bgColor !== 'transparent' &&
                    this.task.coverStyle.bgImg === 'none' &&
                    !this.task.attachments.some((attach) => attach.isCover)
                )
                    return this.task.coverStyle.bgColor;
            },
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
            showIcons() {
                if (
                    this.task.description ||
                    this.task.comments.length > 0 ||
                    this.task.checklists.length > 0 ||
                    this.task.members.length > 0 ||
                    this.task.attachments.length > 0 ||
                    this.task.location
                ) {
                    return true;
                } else return false;
            },
            attachmentLength() {
                let attachment = this.task.attachments.length
                    ? this.task.attachments.length
                    : null;
                return attachment;
            },
        },
        components: {
            Avatar,
        },
    };
</script>
