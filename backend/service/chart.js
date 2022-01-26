import {GraphQLInt} from  'graphql';
import {GetConfig} from '../common/config.js'
import {Query} from '../common/dbClient.js'
import {Chart} from './schema.js'

const PLACEHOLDER_BOARDID = '_PLACEHOLDER_BOARDID_'
const URI = 'rest/agile/1.0/board/' + PLACEHOLDER_BOARDID
const SELECT_ISSUE_INNER_JOIN = 'SELECT * FROM issue INNER JOIN closed_sprint ON closed_sprint.issue_id = issue.id WHERE issue.id=$1';
const SELECT_ISSUE = 'SELECT * FROM issue WHERE issue.epic_id=$1';
const SELECT_EPIC = 'SELECT * FROM epic WHERE epic.board_id=$1';
const SELECT_SPRINT = 'SELECT * FROM sprint WHERE sprint.board_id=$1';

const log = (text) => {
  console.log('board - ' + text)
}

const getClosedSprints = async (issueId) => {
  let closedSprintsArray = [];
  let closedSprints = await Query({text: SELECT_ISSUE_INNER_JOIN, values: [issueId]})
  if (closedSprints !=  null) {
    for (const idx in closedSprints.rows) {
      closedSprintsArray.push(closedSprints.rows[idx].sprint_id)
    }
  }
  return closedSprintsArray;
}

const getIssues = async (epicId) => {
  let issuesArray = [];
  let issues = await Query({text: SELECT_ISSUE, values: [epicId]})
  if (issues != null) {
    for (const idx in issues.rows) {
      let closedSprintsArray = await getClosedSprints(issues.rows[idx].id);
      issuesArray.push({
        id: issues.rows[idx].id,
        key: issues.rows[idx].key,
        name: issues.rows[idx].name,
        type: issues.rows[idx].type,
        status: issues.rows[idx].status,
        resolution: issues.rows[idx].resolution,
        resolutionDate: issues.rows[idx].resolution_date,
        closedSprints: closedSprintsArray});
    }
  }
  return issuesArray;
}

const getEpics = async (boardId) => {
  let epicsArray = [];
  let epics = await Query({text: SELECT_EPIC, values: [boardId]})
  if (epics != null) {
    for (const idx in epics.rows) {
      let issuesArray = await getIssues(epics.rows[idx].id);
      epicsArray.push({
        id: epics.rows[idx].id,
        key: epics.rows[idx].key,
        name: epics.rows[idx].name,
        issues: issuesArray});
    }
  }
  return epicsArray;
}

const getSprints = async (boardId) => {
  let sprintsArray = [];
  let sprints = await Query({text: SELECT_SPRINT, values: [boardId]})
  if (sprints != null) {
    for (const idx in sprints.rows) {
      sprintsArray.push({
        id: sprints.rows[idx].id,
        name: sprints.rows[idx].name,
        startDate: sprints.rows[idx].start_date,
        completeDate: sprints.rows[idx].complete_date,
        state: sprints.rows[idx].state
      });
    }
  }
  return sprintsArray;
}

const buildChart = async (boardId) => {
  let epics = await getEpics(boardId);
  let sprints = await getSprints(boardId)
  let result = {
    id: boardId,
    epics: epics,
    sprints: sprints
  }
  log("result: " + JSON.stringify(result));
  return result;

}

const GetQueryMap = () => {
  return {
    Board: {
      type: Chart,
      args: {boardId: {type: GraphQLInt}},
      resolve: (_, {boardId}) => buildChart(boardId)
    }
  }
};

export {GetQueryMap};

