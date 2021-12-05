<template>
    <section class="group-preview">
        <div class="group-header">
            <input
                class="input-title"
                type="text"
                v-model="newTitle"
                @blur="editTitle"
                @keyup.enter="$event.target.blur()"
            />
            <!-- <h4 v-if="!isInputVisible" @click="toggleEditMode">
                {{ group.title }}
            </h4> -->
            <button
                class="el-icon-more btn-group"
                @click="toggleGroupMenu"
            ></button>
        </div>
        <div v-if="toggleMenu" class="group-actions-modal">
            <h4>Group actions</h4>
            <button @click="removeGroup">Delete group</button>
        </div>
        <div class="tasks-container">
            <template v-for="task in group.tasks">
                <router-link
                    :key="task.id"
                    :to="`/board/${boardId}/task/${task.id}`"
                >
                    <task-preview :task="task" />
                </router-link>
            </template>
        </div>
        <!-- </draggable> -->

        <section class="add-task-section">
            <div
                class="add-a-task"
                v-if="!isAddTaskClicked"
                @click="toggleAddTaskInput"
            >
                <span class="el-icon-plus"> </span> Add a Task
            </div>

            <div v-else class="task-add-container">
                <!-- oninput='this.style.height =
                "";this.style.height = this.scrollHeight + "px"' -->
                <textarea
                    v-model="taskTitle"
                    type="text"
                    placeholder="Enter a title for this task..."
                    ref="saveTaskInput"
                    @keyup.enter="saveTask"
                />
                <div>
                    <button @click="saveTask">Add Task</button>
                    <button
                        class="el-icon-close"
                        @click="toggleAddTaskInput"
                    ></button>
                </div>
            </div>
        </section>
    </section>
</template>

<script>
    import taskPreview from '@/cmps/task-preview.vue';
    import draggable from 'vuedraggable';

    export default {
        name: 'groupPreview',

        props: {
            group: {
                type: Object,
                required: true,
                default: function () {
                    return { msg: 'No Group' };
                },
            },
        },

        data() {
            return {
                newTitle: JSON.parse(JSON.stringify(this.group.title)),
                isInputVisible: false,
                board: null,
                boardId: '',
                isAddTaskClicked: false,
                taskTitle: '',
                toggleMenu: false,
            };
        },

        created() {
            this.boardId = this.$route.params.boardId;
            // console.log('this.boardId', this.boardId);
        },

        methods: {
            async editTitle() {
                // this.toggleEditMode();
                if (!this.newTitle) return;

                const group = JSON.parse(JSON.stringify(this.group));
                group.title = this.newTitle;
                try {
                    const board = await this.$store.dispatch({
                        type: 'updateGroup',
                        boardId: this.boardId,
                        group,
                    });
                    console.log(`Group Saved Successfully in ${board._id}`);
                    this.$emit('loadBoard');
                } catch (err) {
                    console.log('Error in updateGroup (group-preview):', err);
                    throw err;
                }
            },
            toggleGroupMenu() {
                this.toggleMenu = !this.toggleMenu;
                this.$emit('openModalBg');
            },
            async removeGroup() {
                if (this.toggleMenu) {
                    try {
                        await this.$store.dispatch({
                            type: 'removeGroup',
                            boardId: this.boardId,
                            groupId: this.group.id,
                        });
                        console.log(
                            `Group Removed Successfully in BoardId ${this.boardId}`
                        );
                        this.$emit('loadBoard');
                    } catch (err) {
                        console.log(
                            'Error in removeGroup (group-preview):',
                            err
                        );
                        throw err;
                    }
                }
            },

            async saveTask() {
                if (!this.taskTitle) return;
                this.toggleAddTaskInput();
                try {
                    await this.$store.dispatch({
                        type: 'addTask',
                        boardId: this.boardId,
                        groupId: this.group.id,
                        taskTitle: this.taskTitle,
                    });
                    console.log(
                        `Task Successfully Added in GroupId ${this.group.id}`
                    );
                    this.$emit('loadBoard');
                } catch (err) {
                    console.log('Error in saveTask (group-preview):', err);
                    throw err;
                } finally {
                    this.taskTitle = '';
                }
            },

            toggleAddTaskInput() {
                this.isAddTaskClicked = !this.isAddTaskClicked;
                this.$nextTick(() => {
                    if (this.isAddTaskClicked) this.$refs.saveTaskInput.focus();
                });
            },
        },

        components: {
            taskPreview,
            draggable,
        },
    };
</script>
