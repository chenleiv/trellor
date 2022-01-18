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
            <span @click="isPopoverVisible = false" class="close-popover-btn">✖</span>
            <hr />

            <div class="date-picking-container">
                <el-date-picker v-model="dateVal" type="date" placeholder="Pick a day">
                </el-date-picker>
                <div class="edit-date-buttons">
                    <el-button type="primary" class="save-date-btn" @click="saveDate"
                        >Save</el-button
                    >
                    <el-button type="info" class="delete-date-btn" @click="removeDate" plain
                        >Remove</el-button
                    >
                </div>
            </div>

            <div class="action-btn-content" slot="reference">
                <svg viewBox="0 0 24 24">
                    <path :d="data.btn.d"></path>
                    <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"></path>
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
                dateVal: '',
                isPopoverVisible: false,
            };
        },

        methods: {
            saveDate() {
                this.$emit('toggleDate', true);
                const dateStr = this.dateVal.toString();
                const dateToSave = dateStr.substring(4, 15);
                this.data.taskToEdit.dueDate = dateToSave;
                this.updateTask();
            },

            removeDate() {
                this.$emit('toggleDate', false);
                const { taskToEdit } = this.data;
                taskToEdit.dueDate = '';
                taskToEdit.isComplete = false;
                this.updateTask();
            },

            updateTask() {
                this.$emit('updateTask');
            },
        },
    };
</script>
