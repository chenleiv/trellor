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

            <div class="attach-popover">
                <img-upload @onSaveImg="changeImgUrl"></img-upload>
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
    import imgUpload from '../img-upload';

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
                cover: '',
                isPopoverVisible: false,
            };
        },

        methods: {
            changeImgUrl(url) {
                let title = /[^/]*$/.exec(url)[0];
                const { taskToEdit } = this.data;
                taskToEdit.attachments.push({
                    title,
                    url,
                    isCover: false,
                });
                if (
                    taskToEdit.attachments.length === 1 &&
                    taskToEdit.coverStyle.bgColor !== 'transparent' &&
                    taskToEdit.coverStyle.bgImg !== 'none'
                ) {
                    taskToEdit.attachments[0].isCover = true;
                }
                this.$emit('updateTask');
                this.cover = url;
            },
        },

        components: {
            imgUpload,
        },
    };
</script>
