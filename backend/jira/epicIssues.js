import got, {Options} from 'got';

const PLACEHOLDER_BOARDID = '_PLACEHOLDER_BOARDID_'
const PLACEHOLDER_EPICID = '_PLACEHOLDER_EPICID_'
const PLACEHOLDER_STARTAT = '_PLACEHOLDER_STARTAT_'
const URI = 'rest/agile/1.0/board/' + PLACEHOLDER_BOARDID + '/epic/' + PLACEHOLDER_EPICID + '/issue?startAt=' + PLACEHOLDER_STARTAT;
const INSERT_ISSUE_STRING = 'INSERT INTO issue(id, key, name, type, status, resolution, resolution_date, sprint_id, epic_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT ON CONSTRAINT issue_pkey DO NOTHING;';
const INSERT_CLOSED_SPRINT_STRING = 'INSERT INTO closed_sprint(sprint_id, issue_id) VALUES($1, $2) ON CONFLICT ON CONSTRAINT closed_sprint_pkey DO NOTHING;';
const INSERT_SPRINT_STRING = 'INSERT INTO sprint(id, name, board_id, start_date, complete_date, state) VALUES($1, $2, $3, $4, $5, $6) ON CONFLICT ON CONSTRAINT sprint_pkey DO NOTHING;';
const SELECT_STRING = "SELECT id, board_id FROM epic";

const log = (text) => {
  console.log('epicIssues - ' + text)
}

const getData = async (boardId, epicId, response, query) => {
  log('getData - boardId = '+ boardId + ', epicId = '+ epicId);
  let result = null;

  try {
    //log('response=' +  JSON.stringify(response))
    for (let iIndex in response.issues) {
      let issue = response.issues[iIndex];

      //log('issue.key='+issue.key)
      let sprintId = issue.fields.sprint == null ? null : issue.fields.sprint.id;
      let resolutionDate = issue.fields.resolutiondate == null ? '' : (new Date(issue.fields.resolutiondate)).toISOString().replace('Z','-0000');
      let resolution = issue.fields.resolution == null ? '' : issue.fields.resolution.name;

      result = await query({ text: INSERT_ISSUE_STRING, values: [
        issue.id,
        issue.key,
        issue.fields.summary,
        issue.fields.issuetype.name,
        issue.fields.status.name,
        resolution,
        resolutionDate,
        sprintId,
        issue.fields.epic.id
      ]});

      if (result == null) {
        continue;
      }

      // Get closed sprints that bug/task
      if (typeof issue.fields.closedSprints !== 'undefined' && issue.fields.closedSprints) {
        for (let csIndex in issue.fields.closedSprints) {
          let value = issue.fields.closedSprints[csIndex]
          result = await query({text: INSERT_SPRINT_STRING, values: [value.id, value.name, value.originBoardId, value.startDate, value.completeDate, value.state]})

          if (result == null) {
            break;
          }

          await query({text: INSERT_CLOSED_SPRINT_STRING, values: [issue.fields.closedSprints[csIndex].id, issue.id]});
        }
      }
    }
  } catch (error) {
    log(error);
  }
}


const request = async (boardId, epicId, options, startAt, query) => {
  log('request - boardId = ' + boardId + ", epicId = " + epicId);
  try {
    const response = await got(URI.replace(PLACEHOLDER_BOARDID, boardId).replace(PLACEHOLDER_EPICID, epicId).replace(PLACEHOLDER_STARTAT, startAt), undefined, options).json();
    await getData(boardId, epicId, response, query)

    if (response.total > response.startAt + response.maxResults) {
      await request(boardId, epicId, options, response.startAt + response.maxResults, query);
    }
  } catch (error) {
    log("################################## ERROR")
    log("URI = " + URI.replace(PLACEHOLDER_BOARDID, boardId).replace(PLACEHOLDER_EPICID, epicId).replace(PLACEHOLDER_STARTAT, startAt))
    log("options = " + JSON.stringify(options))
    log("error = " + JSON.stringify(error))
    log("stack = " + error.stack);
    log("################################## ERROR")
  }
}

const GetEpicIssues = async (getConfig, query) => {
  log('##### GetEpicIssues #####');

  let conf = getConfig();
  let result = await query(SELECT_STRING);

  if (result != null) {
    for (const idx in result.rows) {
      const epicId = result.rows[idx].id;
      const boardId = result.rows[idx].board_id;
      const options = new Options({
        prefixUrl: conf.jiraUrl,
        headers: {
          authorization: conf.jiraAuth
        }
      });

      if (boardId == null || epicId == null) {
        log(" WARN - boardId = " + boardId + ", epicId = " + epicId)
        continue;
      }

      await request(boardId, epicId, options, 0, query, conf);
    }
  }
}

export {GetEpicIssues}