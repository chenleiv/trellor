<template>
    <section class="group-preview">
        <div class="group-header">
            <h4 v-if="!isInputVisible" @click="toggleEditMode">
                {{ group.title }}
            </h4>
            <button
                class="el-icon-more btn-group"
                @click="removeGroup"
            ></button>
        </div>

        <input
            v-if="isInputVisible"
            v-model="newTitle"
            @blur="editTitle"
            @keyup.enter="$event.target.blur()"
            type="text"
            ref="titleInput"
        />

        <!-- <ul> -->
        <!-- <li > -->
        <draggable>
            <div class="tasks-container">
                <task-preview
                    v-for="task in group.tasks"
                    :key="task.id"
                    :task="task"
                />
            </div>
        </draggable>
        <!-- </li> -->
        <!-- </ul> -->

        <section>
            <div v-if="!isAddTaskClicked" @click="toggleAddTaskInput">
                + Add a Task
            </div>

            <div v-else>
                <textarea
                    v-model="taskTitle"
                    oninput='this.style.height = "";this.style.height = this.scrollHeight + "px"'
                    type="text"
                    placeholder="Enter a title for this task..."
                    ref="saveTaskInput"
                    @blur="saveTask"
                />

                <button @click="saveTask">Add Task</button>
                <button @click="toggleAddTaskInput">X</button>
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
            };
        },

        created() {
            this.boardId = this.$route.params.boardId;
            // console.log('this.boardId', this.boardId);
        },

        methods: {
            log() {
                console.log('log log ');
            },

            toggleEditMode() {
                this.isInputVisible = !this.isInputVisible;
                this.$nextTick(() => {
                    if (this.isInputVisible) this.$refs.titleInput.focus();
                });
                // TODO: Clearing textarea Input
            },

            async editTitle() {
                this.toggleEditMode();
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

            async removeGroup() {
                const toDelete = confirm(
                    'Are you sure you want to delete this Group?'
                );
                if (toDelete) {
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
                    this.groupTitle = '';
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
