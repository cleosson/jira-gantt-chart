import {GetBoard} from './jira/board.js'
import {GetEpics, GetEpicsParent} from './jira/epic.js'
import {GetEpicIssues} from './jira/epicIssues.js'
import {GetSprints} from './jira/sprint.js'
import {GetConfig} from './common/config.js'
import {Query} from './common/dbClient.js'


const main = async () => {
    await GetBoard(GetConfig().jiraBoardId, GetConfig, Query);
    await GetEpics(GetConfig, Query);
    await GetEpicsParent(GetConfig, Query);
    await GetSprints(GetConfig, Query);
    await GetEpicIssues(GetConfig, Query);
}

main();

