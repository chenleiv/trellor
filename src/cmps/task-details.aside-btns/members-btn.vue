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

            <div class="member-choosing-container">
                <h4 class="members-to-show-header">Board members</h4>
                <section
                    v-for="member in data.board.members"
                    :key="member._id"
                    class="member-choosing"
                >
                    <div @click="$emit('chooseMember', member, member._id)">
                        <avatar
                            class="user-avatar"
                            backgroundColor="lightblue"
                            color="black"
                            :size="30"
                            :username="member.fullname"
                            :src="member.imgUrl"
                        ></avatar>
                        {{ member.fullname }}
                        <svg
                            v-if="isMemberIncluded(member._id)"
                            viewBox="0 0 24 24"
                            class="delete-member-svg"
                        >
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"></path>
                        </svg>
                    </div>
                </section>
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
    import avatar from 'vue-avatar';

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
                isPopoverVisible: false,
            };
        },

        methods: {
            isMemberIncluded(memberId) {
                return this.data.taskToEdit.members.some((m) => m._id === memberId);
            },
        },

        components: {
            avatar,
        },
    };
</script>
