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

            <el-popover
                placement="bottom-end"
                width="100"
                v-model="toggleMenu"
                title="List actions"
            >
                <hr />
                <div>
                    <el-button
                        type="text"
                        size="mini"
                        style="
                            display: flex;
                            margin: 0;
                            color: black;
                            font-size: 14px;
                        "
                        @click.prevent="removeGroup"
                        >Archive this list</el-button
                    >
                    <!-- @click="toggleTaskDelete" -->
                </div>
                <el-button
                    slot="reference"
                    class="el-icon-more btn-group"
                ></el-button>
            </el-popover>
        </div>

        <Container
            class="tasks-container"
            group-name="col"
            orientation="vertical"
            @drop="onTaskDrop(group.id, $event)"
            :get-child-payload="getTaskPayload(group.id)"
            drop-class="card-ghost-drop"
            drag-class="dragging"
            :auto-scroll-enabled="true"
        >
            <Draggable
                v-for="task in group.tasks"
                :key="task.id"
                :auto-scroll-enabled="true"
            >
                <!-- <router-link :to="`/board/${boardId}/task/${task.id}`"> -->
                <task-preview
                    :board="board"
                    :task="task"
                    :boardLabels="boardLabels"
                    @deleteTask="removeTask"
                />
                <!-- </router-link> -->
            </Draggable>
        </Container>
        <section class="add-task-section">
            <div
                v-if="!isAddTaskClicked"
                class="add-a-task"
                @click="toggleAddTaskInput"
            >
                <span class="el-icon-plus"> </span> Add a card
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
                    <button @click="saveTask">Add card</button>
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
    import { Container, Draggable, smoothDnD } from 'vue-smooth-dnd';
    import { applyDrag } from '@/services/util-drag.js';

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
            board: {
                type: Object,
            },
            boardLabels: {
                type: Array,
            },
        },

        data() {
            return {
                newTitle: JSON.parse(JSON.stringify(this.group.title)),
                isInputVisible: false,
                boardId: '',
                isAddTaskClicked: false,
                taskTitle: '',
                toggleMenu: false,
            };
        },

        created() {
            this.boardId = this.board._id;
        },

        methods: {
            getTaskPayload(groupId) {
                return (index) => {
                    return this.board.groups.filter((g) => g.id === groupId)[0]
                        .tasks[index];
                };
            },

            onTaskDrop(groupId, dropResult) {
                if (
                    dropResult.removedIndex !== null ||
                    dropResult.addedIndex !== null
                ) {
                    const board = Object.assign({}, this.board);
                    const group = this.board.groups.find(
                        (g) => g.id === groupId
                    );
                    const groupIndex = board.groups.indexOf(group);
                    const newGroup = Object.assign({}, group);
                    newGroup.tasks = applyDrag(newGroup.tasks, dropResult);
                    board.groups.splice(groupIndex, 1, newGroup);

                    this.$emit('updateBoard', board);
                }
            },

            async editGroup(group) {
                try {
                    await this.$store.dispatch({
                        type: 'updateGroup',
                        boardId: this.boardId,
                        group,
                    });
                    console.log(
                        `Group Saved Successfully in ${this.board._id}`
                    );
                } catch (err) {
                    console.log('Error in updateGroup (group-preview):', err);
                    throw err;
                }
            },
            editTitle() {
                // this.toggleEditMode();
                if (!this.newTitle.trim()) this.newTitle = 'List title';
                const group = JSON.parse(JSON.stringify(this.group));
                group.title = this.newTitle;
                this.editGroup(group);
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
                    // this.$emit('loadBoard');
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
            Container,
            Draggable,
        },
    };
</script>
