<template>
    <a-dropdown
        placement="bottomRight"
        trigger="click"
        v-model:visible="visible"
    >
        <div class="action ant-dropdown-link user-dropdown-menu flex items-center">
            <a-tooltip placement="bottom">
                <template #title>
                    <span>{{ $t('layout.background_jobs') }}</span>
                </template>
                <a-button type="text" size="large">
                    <template #icon>
                        <a-badge :count="jobsCount">
                            <inbox-outlined/>
                        </a-badge>
                    </template>
                </a-button>
            </a-tooltip>
        </div>
        <template #overlay>
            <a-menu class="!p-0">
                <keep-alive>
                    <a-card class="!w-96 !border-0">
                        <template #title>
                            <h3 class="mb-1">{{ $t('layout.background_jobs') }}</h3>
                            <p class="text-sm text-slate-500 m-0 flex gap-3">
                            <div v-if="finishedJobsCount > 0">
                                <CheckCircleOutlined class="!text-green-500 mr-1"/>
                                <span>{{ finishedJobsCount }}</span>
                            </div>
                            <div v-if="failedJobsCount > 0">
                                <CloseCircleOutlined class="!text-red-500 mr-1"/>
                                <span>{{ executingJobsCount }}</span>
                            </div>
                            <div v-if="executingJobsCount > 0">
                                <LoadingOutlined class="!text-blue-500 mr-1"/>
                                <span>{{ executingJobsCount }}</span>
                            </div>
                            <div v-if="queuedJobsCount > 0">
                                <UploadOutlined class="!text-slate-500 mr-1"/>
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
                            <a-config-provider>
                                <a-list :data-source="jobs" row-key="id" :loading="loading">
                                    <transition-group name="list" v-if="jobs.length">
                                        <a-list-item class="!px-6"
                                                     v-for="item in jobs"
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

                                                    <!--                                                <div class="flex gap-3 mt-3" v-if="item.status === 'finished'">-->
                                                    <!--                                                    <a-button block ghost type="primary">Download</a-button>-->
                                                    <!--                                                    <a-button block>Result</a-button>-->
                                                    <!--                                                </div>-->
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

                                <template #renderEmpty>
                                    <h3 class="text-neutral-500">
                                        {{ $t('no_background_jobs')}}
                                    </h3>
                                </template>

                            </a-config-provider>
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
    data() {
        return {
            loading: true,
            jobs: null,
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
            return this.jobs.filter((job) => {
                return job.status === 'finished'
            }).length > 0
        },
        finishedJobsCount() {
            return this.jobs.filter((job) => {
                return job.status === 'finished'
            }).length
        },
        executingJobsCount() {
            return this.jobs.filter((job) => {
                return job.status === 'executing'
            }).length
        },
        failedJobsCount() {
            return this.jobs.filter((job) => {
                return job.status === 'failed'
            }).length
        },
        queuedJobsCount() {
            return this.jobs.filter((job) => {
                return job.status === 'queued'
            }).length
        },
        jobsCount() {
            if (this.jobs != null) {
                return this.jobs.length - this.finishedJobsCount
            }
            return this.$page.props.jobsCount
        }
    },
    watch: {
        visible: function (val) {
            if (val) {
                if (this.jobs == null) {
                    this.jobs = []
                }
                this.updateStatuses()
                this.ref = setInterval(this.updateStatuses, 5000)
            } else {
                clearInterval(this.ref)
            }
        },
        'jobs.length': function (val) {
            this.$refs['scroll']?.ps.update()
            console.log(this.$refs['scroll'])
        }
    },
    methods: {
        async dismissAllFinishedJobs() {
            this.jobs.forEach(job => {
                if (job.status === 'finished') {
                    this.dismissFinishedJob(job, false)
                }
            })
            await window.axios.delete(route('admin.jobs.dismiss-all-finished'))
        },
        async dismissFinishedJob(job, sendRequest = true) {
            this.$nextTick(() => {
                const index = this.jobs.findIndex(j => j.id === job.id)
                this.jobs.splice(index, 1)
            })

            if (sendRequest) {
                await window.axios.delete(route('admin.jobs.remove', {id: job.id}))
            }
        },
        updateStatuses() {
            window.axios.get(route('admin.jobs.statuses')).then(({data}) => {
                data.jobs.forEach((newJob) => {
                    if (this.jobs.findIndex(j => j.id === newJob.id) === -1) {
                        this.jobs.push(newJob)
                    } else {
                        const oldJob = this.jobs.findIndex(j => j.id === newJob.id)
                        if (newJob.status === 'finished') {
                            this.jobs.splice(oldJob, 1)
                            this.jobs.push(newJob)
                        } else {
                            this.jobs[oldJob] = newJob
                        }
                    }
                })

                this.loading = false
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
    @apply dark:hover:bg-neutral-800;
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
