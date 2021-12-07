<template>
    <section class="group-preview">
        <div class="group-header">
            <!-- class="input-title" -->
            <input
                type="text"
                v-model="newTitle"
                @blur="editTitle"
                @keyup.enter="$event.target.blur()"
                @focus="$event.target.select()"
            />

            <el-popover placement="top" width="150" v-model="toggleMenu">
                <p>Delete this list?</p>
                <div style="text-align: right; margin: 0">
                    <el-button
                        size="mini"
                        type="text"
                        style="color: black"
                        @click="toggleGroupMenu"
                        >cancel</el-button
                    >
                    <el-button type="info" size="mini" @click="removeGroup"
                        >confirm</el-button
                    >
                </div>
                <el-button
                    slot="reference"
                    class="el-icon-more btn-group"
                ></el-button>
            </el-popover>
        </div>

        <!-- </drag&drop> -->
        <div class="tasks-container">
            <draggable
                v-model="group.tasks"
                group="tasks"
                class="tasks-container"
            >
                <router-link
                    v-for="task in group.tasks"
                    :key="task.id"
                    :to="`/board/${boardId}/task/${task.id}`"
                    class="sortable"
                    ghostClass="ghost"
                >
                    <task-preview
                        :task="task"
                        :boardLabels="boardLabels"
                        @deleteTask="removeTask"
                    />
                </router-link>
            </draggable>
        </div>

        <!-- @end="dragEnd" -->
        <!-- </drag&drop> -->

        <!-- <div class="tasks-container">
            <template v-for="task in group.tasks">
                <router-link
                    :key="task.id"
                    :to="`/board/${boardId}/task/${task.id}`"
                >
                    <task-preview :task="task" :boardLabels="boardLabels" />
                </router-link>
            </template>
        </div> -->

        <section class="add-task-section">
            <div
                class="add-a-task"
                v-if="!isAddTaskClicked"
                @click="toggleAddTaskInput"
            >
                <span class="el-icon-plus"> </span> Add a Task
            </div>

            <div v-else class="task-add-container">
                <textarea
                    v-model="taskTitle"
                    type="text"
                    placeholder="Enter a title for this task..."
                    ref="saveTaskInput"
                    oninput='this.style.height =
                "";this.style.height = this.scrollHeight + "px"'
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
    // import Sortable from 'sortablejs/modular/sortable.complete.esm.js';

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
            boardLabels: {
                type: Array,
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
        },

        methods: {
            // show() {
            //     this.$modal.show('my-first-modal');
            // },
            // hide() {
            //     this.$modal.hide('my-first-modal');
            // },
            async editTitle() {
                // this.toggleEditMode();
                if (!this.newTitle.trim()) this.newTitle = 'List title';

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
                // this.$emit('openModalBg');
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
            async removeTask(task) {
                try {
                    await this.$store.dispatch({
                        type: 'removeTask',
                        boardId: this.boardId,
                        groupId: this.group.id,
                        task: task,
                    });
                    console.log(
                        `Task ${task.id}  Successfully deleted in GroupId ${this.group.id}`
                    );
                    this.$emit('loadBoard');
                } catch (err) {
                    console.log('Error in deleteTask (group-preview):', err);
                    throw err;
                }
            },

            async saveTask() {
                if (!this.taskTitle.trim()) return;
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
            // Sortable,
        },
    };
</script>
