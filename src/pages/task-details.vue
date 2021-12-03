<template>
    <section v-if="task">
        <router-link :to="`/board/${board._id}`">
            <div class="modal-background"></div>
        </router-link>

        <section class="task-details-container">
            <header>
                <button class="close-modal-btn" @click="backToBoard"></button>
                <h1>{{ task.title }}</h1>
                <p>
                    in group
                    <span>{{ group.title }}</span>
                </p>
            </header>
            <main>
                <section class="description-container">
                    <h4>Description</h4>
                    <article v-if="!isTextAreaVisible" @click="toggleTextArea">
                        <p>{{ descriptionToShow }}</p>
                    </article>
                    <div v-else>
                        <textarea
                            v-model="description"
                            type="text"
                            @blur="addDescription"
                            cols="40"
                            rows="6"
                            placeholder="Add a more detailed description..."
                            ref="descriptionInput"
                        ></textarea>
                        <button @click="addDescription">Save</button>
                        <button @click="cancelDescAdding">X</button>
                    </div>
                </section>

                <section class="activities-container">
                    <h4>Activity</h4>
                    <input type="text" placeholder="Write a comment..." />
                    <!-- Need to get the activities from the specific task -->
                    <main class="activities-list">
                        <ul>
                            <li
                                v-for="activity in board.activities"
                                :key="activity.id"
                            >
                                {{ activity.byMember.fullname }}
                                {{ activity.txt }}
                            </li>
                        </ul>
                    </main>
                </section>
            </main>
        </section>
    </section>
</template>

<script>
    export default {
        name: 'taskDetails',

        data() {
            return {
                board: null,
                task: null,
                group: null,
                isTextAreaVisible: false,
                description: '',
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
                    this.task = taskArr[0];
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

            toggleTextArea() {
                this.isTextAreaVisible = !this.isTextAreaVisible;
                this.$nextTick(() => {
                    if (this.isTextAreaVisible)
                        this.$refs.descriptionInput.focus();
                });
                // TODO: Clearing textarea Input
            },

            async addDescription() {
                this.toggleTextArea();
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

            cancelDescAdding() {
                this.description = '';
                this.toggleTextArea();
            },

            backToBoard() {
                this.$router.push(`/board/${this.board._id}`);
            },
        },

        computed: {
            descriptionToShow() {
                return this.description
                    ? this.description
                    : 'Add a more detailed description...';
            },
        },
    };
</script>
