export interface SchedulerJob extends Function {
  id?: number
}

const queue: SchedulerJob[] = []
const postQueue: SchedulerJob[] = []
let isFlushing: boolean = false
const resolvedPromise: Promise<any> = Promise.resolve()

function queueFlush() {
  if (!isFlushing) {
    resolvedPromise.then(flushJobs)
  }
}

function flushJobs() {
  isFlushing = true

  try {
    queue.forEach(job => {
      job()
    })
  } finally {
    queue.length = 0

    flushPostJobs()
    isFlushing = false
  }
}

function flushPostJobs() {
  try {
    postQueue.forEach(job => {
      job()
    })
  } finally {
    postQueue.length = 0
  }
}

export function queueJob(job: SchedulerJob) {
  if (!queue.includes(job)) {
    queue.push(job)
    queueFlush()
  }
}

// 渲染更新结束后的任务
export function queuePostJob(job: SchedulerJob) {
  if (!postQueue.includes(job)) {
    postQueue.push(job)
    queueFlush()
  }
}
