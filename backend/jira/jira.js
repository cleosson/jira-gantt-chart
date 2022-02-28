import {GetBoard} from './board.js'
import {GetEpics, GetEpicsParent} from './epic.js'
import {GetEpicIssues} from './epicIssues.js'
import {GetSprints} from './sprint.js'
import {GetConfig} from '../common/config.js'
import {Query} from '../common/dbClient.js'
import {Status} from '../common/graphQLTypes.js'

const STATUS_NONE = 0;
const STATUS_LOADING = 1;
const STATUS_LOADED = 3;
const STATUS_FAILED = 4;

let status = STATUS_NONE;
let id = 0

const fetchIssuesAsync = async () => {
  status = STATUS_LOADING;

  try {
    await GetBoard(GetConfig().jiraBoardId, GetConfig, Query);
    await GetEpics(GetConfig, Query);
    await GetEpicsParent(GetConfig, Query);
    await GetSprints(GetConfig, Query);
    await GetEpicIssues(GetConfig, Query);

    status = STATUS_LOADED;
  } catch (error) {
    status = STATUS_FAILED;
  }
}

const fetchIssues = () => {
  fetchIssuesAsync();
  return getFetchIssuesStatus();
}

const getFetchIssuesStatus = () => {
  let msg = "None";
  switch (status) {
    case STATUS_NONE:
      msg = "None";
      break;
    case STATUS_LOADING:
      msg = "Loading";
      break;
    case STATUS_LOADED:
      msg = "Loaded"
      break;
    case STATUS_FAILED:
      msg = "Failed"
      break;
  }
  return {status: true, msg: msg, id: id};
}

const GetQueryMap = () => {
  return {
    fetchIssuesJira: {
      type: Status,
      resolve: () => fetchIssues()
    },
    getFetchIssuesStatusJira: {
      type: Status,
      resolve: () => getFetchIssuesStatus()
    }
  }
}

export {GetQueryMap};

