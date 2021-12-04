<template>
    <section v-if="task">
        <router-link :to="`/board/${board._id}`">
            <div class="modal-background"></div>
        </router-link>

        <section class="task-details-container">
            <header class="task-modal-header">
                <button class="close-modal-btn" @click="backToBoard"></button>
                <!-- <textarea><span></span>Hi</textarea> -->
                <h1><span></span>{{ task.title }}</h1>
                <p>
                    in group
                    <span>{{ group.title }}</span>
                </p>
            </header>
            <main>
                <section class="description-container">
                    <h4>
                        <svg>
                            <path
                                d="M14 17H4v2h10v-2zm6-8H4v2h16V9zM4 15h16v-2H4v2zM4 5v2h16V5H4z"
                            ></path>
                        </svg>
                        <span>Description</span>
                    </h4>

                    <div class="description-edit">
                        <textarea
                            v-model="description"
                            type="text"
                            @blur="addDescription"
                            @click="openTextArea"
                            placeholder="Add a more detailed description..."
                            ref="descriptionInput"
                            @focus="$event.target.select()"
                        ></textarea>
                        <div class="description-btns" v-if="isTextAreaVisible">
                            <el-button
                                type="primary"
                                class="save-task-description-btn"
                                @click="addDescription"
                            >
                                <span>Save</span>
                            </el-button>

                            <button
                                class="close-task-description-btn"
                                @click.prevent="cancelDescAdding"
                            ></button>
                        </div>
                    </div>
                </section>

                <section class="activity-container">
                    <header class="activity-header">
                        <h4>
                            <svg>
                                <path
                                    d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z"
                                ></path>
                            </svg>
                            <span>Activity</span>
                        </h4>
                        <button>Show details</button>
                    </header>
                    <div class="comments-container">
                        <avatar
                            class="curr-user-avatar"
                            backgroundColor="lightblue"
                            color="black"
                            :size="30"
                            username="Ben Ernst"
                        ></avatar>
                        <textarea
                            type="text"
                            placeholder="Write a comment..."
                            @click="openCommentInput"
                            @blur="closeCommentInput"
                            @keyup="setCommentInputValue"
                        />
                    </div>
                    <button
                        class="save-comment-btn"
                        :class="[visibility, saveCommentBtnStyle]"
                    >
                        <span>Save</span>
                    </button>
                    <!-- Need to get the activity from the specific task -->

                    <div class="activity-list">
                        <div
                            v-for="activity in board.activities"
                            :key="activity.id"
                            class="activity-preview-container"
                        >
                            <avatar
                                class="curr-user-avatar"
                                backgroundColor="lightblue"
                                color="black"
                                :size="30"
                                username="Tal Tarablus"
                            ></avatar>
                            <div class="activity-details">
                                <div class="activity-member-container">
                                    <span class="member-name">{{
                                        activity.byMember.fullname
                                    }}</span
                                    ><span class="activity-content">{{
                                        activity.txt
                                    }}</span>
                                </div>
                                <div class="activity-created-at-container">
                                    <span class="activity-created-at"
                                        >3 days ago</span
                                    >
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </section>
    </section>
</template>

<script>
    import avatar from 'vue-avatar';

    export default {
        name: 'taskDetails',

        data() {
            return {
                board: null,
                task: null,
                group: null,
                isTextAreaVisible: false,
                description: '',
                isCommentInputOpen: false,
                isCommentInput: '',
            };
        },

        created() {
            this.loadData();
        },

        methods: {
            async loadData() {
                const { boardId } = this.$route.params;
                const { taskId } = this.$route.params;
                try {
                    // Getting Board:
                    const board = await this.$store.dispatch({
                        type: 'getBoard',
                        boardId,
                    });
                    this.board = board;
                    // Loading Task:
                    const taskArr = board.groups.map((group) => {
                        return group.tasks.find((task) => {
                            return task.id === taskId;
                        });
                    });
                    this.task = taskArr.find((item) => item !== undefined);
                    // Loading Group:
                    const group = board.groups.find((gr) =>
                        gr.tasks.includes(this.task)
                    );
                    this.group = group;
                } catch (err) {
                    console.log('Error in loadData (task-details):', err);
                    throw err;
                }
            },

            // toggleTextArea() {
            //     this.isTextAreaVisible = !this.isTextAreaVisible;
            //     console.log('this.isTextAreaVisible:', this.isTextAreaVisible);
            //     this.$nextTick(() => {
            //         if (this.isTextAreaVisible)
            //             this.$refs.descriptionInput.focus();
            //     });
            //     // TODO: Clearing textarea Input
            // },

            async addDescription() {
                this.isTextAreaVisible = false;
                try {
                    await this.$store.dispatch({
                        type: 'updateTask',
                        boardId: this.board._id,
                        groupId: this.group.id,
                        task: this.task,
                        taskDescription: this.description,
                    });
                    console.log(
                        `Description Succefully Added in TaskId ${this.task.id}`
                    );
                } catch (err) {
                    console.log('Error in addDescription (task-details):', err);
                    throw err;
                }
            },

            openTextArea() {
                this.isTextAreaVisible = true;
            },

            cancelDescAdding() {
                this.description = '';
                this.isTextAreaVisible = false;
            },

            openCommentInput() {
                this.isCommentInputOpen = true;
            },

            closeCommentInput() {
                this.isCommentInputOpen = false;
            },

            setCommentInputValue(ev) {
                this.isCommentInput = ev.target.value ? true : false;
            },

            backToBoard() {
                this.$router.push(`/board/${this.board._id}`);
            },
        },

        computed: {
            // descriptionToShow() {
            //     return this.description
            //         ? this.description
            //         : 'Add a more detailed description...';
            // },

            visibility() {
                return { hidden: !this.isCommentInputOpen };
            },

            saveCommentBtnStyle() {
                return { 'save-comment-btn-typing-style': this.isCommentInput };
            },
        },

        components: {
            avatar,
        },
    };
</script>
