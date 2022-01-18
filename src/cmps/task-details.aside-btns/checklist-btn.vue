<template>
    <section>
        <!-- Feature in Development -->

        <!-- <el-popover
            :title="data.btn.name"
            placement="top"
            width="300"
            trigger="click"
            v-model="isPopoverVisible"
            content=""
        >
            <span @click="isPopoverVisible = false" class="close-popover-btn">✖</span>
            <hr />

            <div class="add-checklist-container">
                <h3 class="add-checklist-header">Title</h3>
                <el-input placeholder="Enter a title..." v-model="checklistTitle"></el-input>
                <el-button type="primary" class="add-checklist-btn" @click="addCheckList"
                    >Add</el-button
                >
            </div> -->

        <!-- <div class="action-btn-content" slot="reference">
                <svg viewBox="0 0 24 24">
                    <path :d="data.btn.d"></path>
                </svg>
                <span>{{ data.btn.name }}</span>
            </div> -->
        <!-- </el-popover> -->
        <!-- <div class="action-btn-content" slot="reference">
            <svg viewBox="0 0 24 24">
                <path :d="data.btn.d"></path>
            </svg>
            <span>{{ data.btn.name }}</span>
        </div> -->
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
                checklistTitle: '',
                isChecklistShown: false,
                isPopoverVisible: false,
            };
        },

        methods: {
            addCheckList() {
                this.isChecklistShown = true;
            },
        },
    };
</script>
