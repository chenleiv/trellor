<template>
    <section class="dash">
        <section class="modal-background" @click.self="backToBoard">
            <section class="dashboard-container" @click.self="backToBoard">
                <h1>DASHBOARD</h1>

                <button
                    @click.self="backToBoard"
                    class="close-dashboard-btn"
                ></button>

                <section class="details-container" @click.self="backToBoard">
                    <div class="detail">
                        <span class="material-icons-outlined">
                            people_alt
                        </span>
                        <strong>{{ membersCount }}</strong>
                    </div>
                    <div class="detail">
                        <span class="material-icons-outlined"> badge </span>
                        <strong>{{ taskCount }} Tasks</strong>
                    </div>
                </section>

                <section
                    class="charts-container"
                    v-if="board"
                    @click.self="backToBoard"
                >
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
                    <tasksDueDatesChart
                        class="chart"
                        :chartData="charts.lineChartData"
                        :options="charts.lineChartOptions"
                    />
                </section>
            </section>
        </section>
    </section>
</template>

<script>
    import tasksPerMemberChart from '@/cmps/tasks-per-member-chart';
    import tasksByLabelChart from '@/cmps/tasks-by-label-chart';
    import tasksDueDatesChart from '@/cmps/tasks-due-dates-chart';
    import { months } from 'moment';

    export default {
        data() {
            return {
                taskCount: 0,
                tasksCompleted: 0,
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
                                barThickness: 60,
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
                            padding: 10,
                        },

                        layout: {
                            padding: 40,
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
                            position: 'right',
                        },
                        title: {
                            display: true,
                            text: 'Tasks By Label',
                            padding: 0,
                        },
                        layout: {
                            padding: 50,
                        },
                    },

                    lineChartData: {
                        type: 'line',
                        labels: [
                            'January',
                            'February',
                            'March',
                            'April',
                            'May',
                            'June',
                            'July',
                            'August',
                            'September',
                            'October',
                            'November',
                            'December',
                        ],
                        datasets: [
                            {
                                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                                fill: false,
                                borderColor: '#6e8caa80',
                                backgroundColor: [
                                    // '#40a0ff80',
                                    // '#67c23a88',
                                    // '#e6a23c7e',
                                    // '#f56c6c88',
                                    // '#40a0ff80',
                                    // '#67c23a88',
                                    // '#e6a23c7e',
                                    // '#f56c6c88',
                                    // '#40a0ff80',
                                    // '#67c23a88',
                                    // '#e6a23c7e',
                                    // '#f56c6c88',
                                ],
                            },
                        ],
                    },
                    lineChartOptions: {
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
                            position: 'bottom',
                        },
                        title: {
                            display: true,
                            text: 'Tasks Due Dates 2022',
                        },
                        layout: {
                            padding: 40,
                        },
                    },
                },
            };
        },

        created() {
            this.loadDashboard();
        },

        methods: {
            async loadDashboard() {
                this.setMembersData();
                this.setLabelsData();
                this.getTasksPerDueDate();
            },

            setMembersData() {
                this.setMembersNames();
                this.setTasksCount();
            },

            setMembersNames() {
                this.charts.barChartData.labels = this.board.members.map(
                    (member) => member.fullname
                );
            },

            setTasksCount() {
                var membersAppearance = [];
                this.board.groups.forEach((group) => {
                    group.tasks.forEach((task) => {
                        this.taskCount++;
                        if (task.isComplete) this.tasksCompleted++;
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

            getTasksPerDueDate() {
                var monthsAppearance = [];
                this.board.groups.forEach((group) => {
                    group.tasks.forEach((task) => {
                        monthsAppearance.push(task.dueDate.substring(0, 3));
                    });
                });

                monthsAppearance.forEach((month) => {
                    this.charts.lineChartData.labels.forEach((m) => {
                        if (month === m.substring(0, 3)) {
                            this.charts.lineChartData.datasets[0].data[
                                this.charts.lineChartData.labels.indexOf(m)
                            ]++;
                        }
                    });
                });

                var count = 0;
                this.dataLabelIds.forEach((dLabelId) => {
                    count = 0;
                    monthsAppearance.forEach((month) => {
                        if (dLabelId === month) {
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

            membersCount() {
                var displayedWord = 'Member';
                if (this.board.members.length > 1) displayedWord += 's';
                return `${this.board.members.length} ${displayedWord}`;
            },
        },

        components: {
            tasksPerMemberChart,
            tasksByLabelChart,
            tasksDueDatesChart,
        },
    };
</script>
