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

            <section class="set-cover-container">
                <button @click="$emit('removeTaskCover')" class="remove-cover-btn">
                    Remove Cover
                </button>
                <main>
                    <div>
                        <h4>Colors</h4>
                        <background-picker
                            @chosenBg="setBg"
                            :withImgBg="withImgBg"
                        ></background-picker>
                    </div>
                    <div>
                        <h4>Images</h4>
                        <background-unsplash @onSaveImg="setImg"></background-unsplash>
                    </div>
                </main>
            </section>

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
    import backgroundPicker from '../background-picker';
    import backgroundUnsplash from '../background-unsplash';

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
                withImgBg: false,
                isPopoverVisible: false,
            };
        },

        methods: {
            setBg(style) {
                const { taskToEdit } = this.data;
                taskToEdit.coverStyle.bgColor = style.bgColor;
                taskToEdit.coverStyle.bgImg = 'none';
                if (this.isAttachCover) this.resetAttchCover();
                this.updateTask();
            },

            setImg(url) {
                const { taskToEdit } = this.data;
                taskToEdit.coverStyle.bgColor = 'transparent';
                taskToEdit.coverStyle.bgImg = url;
                if (this.isAttachCover) this.resetAttchCover();
                this.updateTask();
            },

            resetAttchCover() {
                const { task, taskToEdit } = this.data;
                const idx = task.attachments.findIndex((attach) => attach.isCover);
                taskToEdit.attachments[idx].isCover = false;
            },

            updateTask() {
                this.$emit('updateTask');
            },
        },

        computed: {
            isAttachCover() {
                const { task, taskToEdit } = this.data;
                if (taskToEdit.attachments.length) {
                    return task.attachments.some((attach) => attach.isCover);
                }
            },
        },

        components: {
            backgroundPicker,
            backgroundUnsplash,
        },
    };
</script>

<style></style>
