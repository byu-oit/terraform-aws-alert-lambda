import * as env from 'env-var'

export const appName = env.get('APP_NAME').required().asString()
export const kb = env.get('KB_ARTICLE').required().asString()
export const host = env.get('MONITORING_URL').default('https://in.monitoring.byu.edu').asUrlString()
export const path = env.get('MONITORING_PATH').default('/generic/process-event').asString()
