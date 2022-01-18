<template>
    <section>
        <el-popover
            :title="data.btn.name"
            placement="top"
            width="300"
            trigger="click"
            v-model="isPopoverVisible"
            content=""
        >
            <span @click="cancelEditLabel" class="close-popover-btn">✖</span>
            <hr />

            <div class="label-choosing-container">
                <section v-for="(label, idx) in data.labels" :key="label.id" class="label-choosing">
                    <div
                        v-if="!isLabelEdit"
                        :style="{
                            'background-color': label.color,
                        }"
                        class="label-color"
                        @click="chooseLabel(label.id)"
                    >
                        <svg
                            v-if="data.taskToEdit.labelIds.includes(label.id)"
                            viewBox="0 0 24 24"
                            class="delete-label-svg"
                        >
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"></path>
                        </svg>
                        {{ label.title }}
                    </div>
                    <button
                        v-if="!isLabelEdit"
                        class="label-pencil"
                        @click="editLabelTitle(label.id, idx)"
                    >
                        <svg viewBox="0 0 24 24">
                            <path
                                d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                            ></path>
                        </svg>
                    </button>
                </section>
                <div v-if="isLabelEdit" class="edit-label-container">
                    <label for="labelTitle">Name</label>
                    <el-input
                        name="labelTitle"
                        v-model="labelTitle"
                        class="labelTitleInput"
                    ></el-input>
                    <div class="edit-label-buttons">
                        <el-button type="primary" class="save" @click="saveLabelTitle"
                            >Save</el-button
                        >
                        <el-button type="danger" class="delete" @click="removeLabel"
                            >Delete</el-button
                        >
                    </div>
                </div>
            </div>

            <div class="action-btn-content" slot="reference">
                <svg viewBox="0 0 24 24">
                    <path :d="data.btn.d"></path>
                </svg>
                <span>{{ data.btn.name }}</span>
            </div>
        </el-popover>
    </section>
</template>

<script>
    export default {
        props: {
            data: {
                type: Object,
                required: true,
                default: function () {
                    return { msg: 'No Data' };
                },
            },
        },

        data() {
            return {
                isLabelEdit: false,
                hasLabelChosen: false,
                labelIdToShow: '',
                labelIdxToEdit: null,
                labelIdToEdit: null,
                labelTitle: '',
                isPopoverVisible: false,
            };
        },

        methods: {
            chooseLabel(id) {
                this.hasLabelChosen = true;
                this.labelIdToShow = id;
                const { taskToEdit } = this.data;
                const labelIdx = taskToEdit.labelIds.findIndex((lbId) => lbId === id);
                if (taskToEdit.labelIds.includes(id)) {
                    taskToEdit.labelIds.splice(labelIdx, 1);
                } else {
                    taskToEdit.labelIds.push(id);
                }
                this.updateTask();
            },

            editLabelTitle(labelId, idx) {
                this.isLabelEdit = true;
                this.labelIdxToEdit = idx;
                this.labelIdToEdit = labelId;
            },

            saveLabelTitle() {
                this.isLabelEdit = false;
                const { labels } = this.data;
                labels[this.labelIdxToEdit].title = this.labelTitle;
                const board = this.getCopiedBoard();
                board.labels = labels;
                this.updateBoard(board);
                this.labelTitle = '';
            },

            removeLabel() {
                this.isLabelEdit = false;
                const { taskToEdit, labels } = this.data;
                const lbIdx = taskToEdit.labelIds.findIndex((id) => id === this.labelIdToEdit);
                taskToEdit.labelIds.splice(lbIdx, 1);
                labels[this.labelIdxToEdit].title = '';
                const board = this.getCopiedBoard();
                board.labels = labels;
                this.updateTask();
                this.updateBoard(board);
            },

            getCopiedBoard() {
                return JSON.parse(JSON.stringify(this.data.board));
            },

            updateTask() {
                this.$emit('updateTask');
            },

            updateBoard(board) {
                this.$emit('updateBoard', board);
                this.labelTitle = '';
            },

            cancelEditLabel() {
                this.isPopoverVisible = false;
                setTimeout(() => {
                    this.isLabelEdit = false;
                }, 500);
            },
        },
    };
</script>
