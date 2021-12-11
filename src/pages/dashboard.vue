<template>
    <section class="modal-background">
        <div class="dashboard-container" v-if="board">
            <h1>DASHBOARD</h1>
            <button
                @click.self="backToBoard"
                class="close-dashboard-btn"
            ></button>
            <tasksPerMemberChart
                class="chart"
                :chartData="charts.barChartData"
                :options="charts.barChartOptions"
            />
            <tasksByLabelChart
                class="chart"
                :chartData="charts.pieChartData"
                :options="charts.pieChartOptions"
            />
        </div>
    </section>
</template>

<script>
    import tasksPerMemberChart from '@/cmps/tasks-per-member-chart';
    import tasksByLabelChart from '@/cmps/tasks-by-label-chart';

    export default {
        data() {
            return {
                // board: null,
                boardId: null,
                membersNames: [],
                dataLabelIds: [],
                charts: {
                    barChartData: {
                        type: 'bar',
                        labels: this.membersNames,
                        datasets: [
                            {
                                data: [],
                                beginAtZero: true,
                                backgroundColor: [
                                    'rgba(75, 192, 192, 0.5)',
                                    'rgba(153, 182, 255, 0.5)',
                                    'rgba(54, 192, 235, 0.5)',
                                ],
                            },
                        ],
                    },
                    barChartOptions: {
                        responsive: true,
                        scales: {
                            yAxes: [
                                {
                                    display: true,
                                    ticks: {
                                        beginAtZero: true,
                                        stepSize: 1,
                                    },
                                },
                            ],
                        },
                        legend: {
                            display: false,
                        },
                        title: {
                            display: true,
                            text: 'Tasks per Member',
                        },
                        layout: {
                            padding: 20,
                        },
                    },
                    pieChartData: {
                        type: 'pie',
                        labels: [],
                        datasets: [
                            {
                                data: [],
                                backgroundColor: [
                                    '#40a0ff80',
                                    '#67c23a88',
                                    '#e6a23c7e',
                                    '#f56c6c88',
                                ],
                            },
                        ],
                    },
                    pieChartOptions: {
                        responsive: true,
                        legend: {
                            display: true,
                            position: 'left',
                        },
                        title: {
                            display: true,
                            text: 'Tasks By Label',
                        },
                        layout: {
                            padding: 20,
                        },
                    },
                },
            };
        },

        created() {
            this.loadBoard();
        },

        methods: {
            async loadBoard() {
                // const { boardId } = this.$route.params;
                const boardId = this.board._id;
                this.setMembersData();
                this.setLabelsData();
                // try {
                //     const board = await this.$store.dispatch({
                //         type: 'getBoard',
                //         boardId,
                //     });
                //     // this.board = board;
                // } catch (err) {
                //     console.log('Board Loading Error (dashboard):', err);
                //     throw err;
                // }
            },

            setMembersData() {
                this.setMembersNames();
                this.setTasksCount();
            },

            setMembersNames() {
                this.charts.barChartData.labels = this.board.members.map(
                    (member) => member.fullname
                );
                this.setTasksCount();
            },

            setTasksCount() {
                var membersAppearance = [];
                this.board.groups.forEach((group) => {
                    group.tasks.forEach((task) => {
                        task.members.forEach((member) => {
                            membersAppearance.push(member.fullname);
                        });
                    });
                });
                var count = 0;
                this.charts.barChartData.labels.forEach((memberName) => {
                    count = 0;
                    membersAppearance.forEach((fullname) => {
                        if (memberName === fullname) {
                            count++;
                            this.charts.barChartData.datasets[0].data[
                                this.charts.barChartData.labels.indexOf(
                                    memberName
                                )
                            ] = count;
                        }
                    });
                });
            },

            // Labels:

            setLabelsData() {
                // Colors:
                // this.charts.pieChartData.datasets[0].backgroundColor =
                //     this.board.labels.map((label) => label.color);
                // Titles:
                this.charts.pieChartData.labels = this.board.labels.map(
                    (label) => label.title
                );
                // Ids:
                this.dataLabelIds = this.board.labels.map((label) => label.id);
                // Count:
                this.setLabelsCount();
            },

            setLabelsCount() {
                var labelsAppearance = [];
                this.board.groups.forEach((group) => {
                    group.tasks.forEach((task) => {
                        task.labelIds.forEach((labelId) => {
                            labelsAppearance.push(labelId);
                        });
                    });
                });
                var count = 0;
                this.dataLabelIds.forEach((dLabelId) => {
                    count = 0;
                    labelsAppearance.forEach((lbId) => {
                        if (dLabelId === lbId) {
                            count++;
                            this.charts.pieChartData.datasets[0].data[
                                this.dataLabelIds.indexOf(dLabelId)
                            ] = count;
                        }
                    });
                });
            },

            // backToBoard:
            backToBoard() {
                this.$router.push(`/board/${this.board._id}`);
            },
        },
        computed: {
            board() {
                return this.$store.getters.getCurrBoard;
            },
        },

        components: {
            tasksPerMemberChart,
            tasksByLabelChart,
        },
    };
</script>
