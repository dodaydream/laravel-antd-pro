<template>
    <a-dropdown
        placement="bottomRight"
        trigger="click"
        v-model:visible="visible"
    >
        <div class="action ant-dropdown-link user-dropdown-menu flex items-center">
            <a-button type="text" size="large">
                <template #icon>
                    <a-badge :count="$page.props.jobs.length">
                        <inbox-outlined/>
                    </a-badge>
                </template>
            </a-button>
        </div>
        <template #overlay>
            <a-menu class="!p-0">
                <keep-alive>
                    <a-card class="!w-96 !border-0">
                        <template #title>
                            <h3 class="mb-1">{{ $t('background_jobs') }}</h3>
                            <p class="text-sm text-slate-500 m-0 flex gap-3">
                                <div v-if="finishedJobsCount > 0">
                                    <CheckCircleOutlined class="!text-green-500 mr-1" />
                                    <span>{{ finishedJobsCount }}</span>
                                </div>
                                <div v-if="failedJobsCount > 0">
                                    <CloseCircleOutlined class="!text-red-500 mr-1" />
                                    <span>{{ executingJobsCount }}</span>
                                </div>
                                <div v-if="executingJobsCount > 0">
                                    <LoadingOutlined class="!text-blue-500 mr-1" />
                                    <span>{{ executingJobsCount }}</span>
                                </div>
                                <div v-if="queuedJobsCount > 0">
                                    <UploadOutlined class="!text-slate-500 mr-1" />
                                    <span>{{ queuedJobsCount }}</span>
                                </div>
                            </p>
                        </template>
                        <template #extra>
                            <a-button type="link"
                                      class="!p-0"
                                      @click="dismissAllFinishedJobs"
                                      :disabled="!hasFinishedJobs"
                            >
                                {{ $t('clear_all_finished') }}
                            </a-button>
                        </template>

                        <perfect-scrollbar class="!h-full" :options="{ suppressScrollX: true }" ref="scroll">
                            <a-list :data-source="$page.props.jobs" row-key="id">
                                <transition-group name="list" v-if="$page.props.jobs.length">
                                    <a-list-item class="!px-6"
                                                 v-for="item in $page.props.jobs"
                                                 :key="item.id"
                                    >
                                        <a-list-item-meta>
                                            <template #title>
                                                {{ item.type }}
                                            </template>

                                            <template #description>
                                                <a-typography-text :type="jobStatusType(item.status)">{{
                                                        $t(item.status)
                                                    }}
                                                </a-typography-text>
                                                <a-progress
                                                    :status="jobStatusProgress(item.status)"
                                                    :percent="item.progress_percentage"/>
                                            </template>
                                        </a-list-item-meta>

                                        <a-button @click="dismissFinishedJob(item)"
                                                  type="text"
                                                  shape="circle"
                                                  size="small"
                                                  v-if="item.status === 'finished'"
                                                  class="!absolute right-6"
                                        >
                                            <template #icon>
                                                <CloseOutlined/>
                                            </template>
                                        </a-button>
                                    </a-list-item>
                                </transition-group>
                            </a-list>
                        </perfect-scrollbar>
                    </a-card>
                </keep-alive>
            </a-menu>
        </template>
    </a-dropdown>
</template>

<script>
import {
    InboxOutlined,
    CloseOutlined,
    CheckCircleOutlined,
    LoadingOutlined,
    CloseCircleOutlined,
    UploadOutlined
} from '@ant-design/icons-vue'

export default {
    name: "Jobs",
    components: {
        InboxOutlined,
        CheckCircleOutlined,
        CloseCircleOutlined,
        LoadingOutlined,
        CloseOutlined,
        UploadOutlined
    },
    data () {
        return {
            visible: false,
            ref: null
        }
    },
    computed: {
        jobStatusType() {
            return (status) => {
                return {
                    'finished': 'success',
                    'failed': 'danger',
                    'retrying': 'warning'
                }[status]
            }
        },
        jobStatusProgress() {
            return (status) => {
                return {
                    'finished': 'success',
                    'failed': 'exception',
                    'retrying': 'normal'
                }[status]
            }
        },
        hasFinishedJobs() {
            return this.$page.props.jobs.filter((job) => {
                return job.status === 'finished'
            }).length > 0
        },
        finishedJobsCount() {
            return this.$page.props.jobs.filter((job) => {
                return job.status === 'finished'
            }).length
        },
        executingJobsCount() {
            return this.$page.props.jobs.filter((job) => {
                return job.status === 'executing'
            }).length
        },
        failedJobsCount() {
            return this.$page.props.jobs.filter((job) => {
                return job.status === 'failed'
            }).length
        },
        queuedJobsCount() {
            return this.$page.props.jobs.filter((job) => {
                return job.status === 'queued'
            }).length
        }
    },
    watch: {
        visible: function (val) {
            if (val) {
                this.updateStatuses()
                this.ref = setInterval(this.updateStatuses, 5000)
            } else {
                clearInterval(this.ref)
            }
        },
        '$page.props.jobs.length': function (val) {
            this.$refs['scroll']?.ps.update()
            console.log(this.$refs['scroll'])
        }
    },
    methods: {
        async dismissAllFinishedJobs() {
            this.$page.props.jobs.forEach(job => {
                if (job.status === 'finished') {
                    this.dismissFinishedJob(job, false)
                }
            })
            await window.axios.delete(route('admin.jobs.dismiss-all-finished'))
        },
        async dismissFinishedJob (job, sendRequest=true) {
            this.$nextTick(() => {
                const index = this.$page.props.jobs.findIndex(j => j.id === job.id)
                this.$page.props.jobs.splice(index, 1)
            })

            if (sendRequest) {
                await window.axios.delete(route('admin.jobs.remove', {id: job.id}))
            }
        },
        updateStatuses() {
            window.axios.get(route('admin.jobs.statuses')).then(({data}) => {
                data.jobs.forEach((newJob) => {
                    if (this.$page.props.jobs.findIndex(j => j.id === newJob.id) === -1) {
                        this.$page.props.jobs.push(newJob)
                    } else {
                        const oldJob = this.$page.props.jobs.findIndex(j => j.id === newJob.id)
                        if (newJob.status === 'finished') {
                            this.$page.props.jobs.splice(oldJob, 1)
                            this.$page.props.jobs.push(newJob)
                        } else {
                            this.$page.props.jobs[oldJob] = newJob
                        }
                    }
                })
            })
        }
    }
}
</script>

<style scoped>
:deep(.ant-card-body) {
    padding: 0;
    @apply h-96;
}

:deep(.ant-list-item-action) {
    @apply ml-4;
}

:deep(.ant-list-item) {
    align-items: start;
    @apply hover:bg-gray-50;
}

:deep(.ant-list-item-action) > li {
    padding: 0;
}

.list-enter-active,
.list-leave-active {
    transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
    opacity: 0;
    transform: translateX(30px);
}
</style>
