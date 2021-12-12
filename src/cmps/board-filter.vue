<template>
    <div class="filter-menu">
        <div class="filter-header">
            <h3 class="header">Filter</h3>
            <button
                class="el-icon-close"
                style="font-size: 20px"
                @click="closeMenu"
            ></button>
        </div>
        <hr />
        <div class="filter-content">
            <div>
                <p>Keyword</p>
                <div class="search-filter-input">
                    <input
                        type="text"
                        placeholder="Enter a keyword…"
                        value=""
                    />
                </div>
                <p>Search cards, members, labels, and more.</p>
                <p>Members</p>
                <div class="filter-members">
                    <label>
                        <el-checkbox v-model="noMembers"
                            >No members</el-checkbox
                        >
                    </label>
                    <label>
                        <el-checkbox v-model="assigned"
                            >Card assigned to me</el-checkbox
                        >
                    </label>
                    <label>
                        <el-checkbox v-model="byMember"
                            >Select member</el-checkbox
                        >
                    </label>
                </div>
                <p>Labels</p>
                <div class="filter-labels">
                    <el-checkbox
                        v-model="noLabels"
                        style="color: #5e6c84; text-color: #fff"
                        >No labels
                    </el-checkbox>

                    <el-checkbox v-model="label1" style="text-color: #fff">
                        <div class="label label1"></div>
                    </el-checkbox>
                    <el-checkbox v-model="label2">
                        <div class="label label2"></div
                    ></el-checkbox>
                    <el-checkbox v-model="label3">
                        <div class="label label3"></div
                    ></el-checkbox>
                    <el-checkbox v-model="label4">
                        <div class="label label4"></div
                    ></el-checkbox>
                </div>

                <div>
                    <p>Due date</p>
                    <ul>
                        <li>No dates</li>
                        <li>Overdue</li>
                        <li>Due in the next day</li>
                        <p>Due date</p>
                    </ul>
                </div>
                <hr />
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'BoardFilter',
        data() {
            return {
                checked: false,
                noMembers: false,
                assigned: false,
                byMember: false,
                noLabels: false,
                label1: false,
                label2: false,
                label3: false,
                label4: false,
            };
        },

        methods: {
            closeMenu() {
                this.$emit('openFilter');
            },
        },
    };
</script>
