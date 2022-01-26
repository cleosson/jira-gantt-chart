import {GetConfig} from './common/config.js'
import {Query} from './common/dbClient.js'
import {GetQueryMap as GetJiraQueryMap} from './jira/jira.js'
import {GetQueryMap as GetGanttChartQueryMap} from './service/chart.js'

const GetFieldConfigMap = () => {
  return {
    ...GetJiraQueryMap(),
    ...GetGanttChartQueryMap()
  };
}

export {
  GetFieldConfigMap
};