const request = require('../common/requestCommon')
const config = require('./config')
const dbClient = require('../common/dbClient')

const PLACEHOLDER_BOARDID = '_PLACEHOLDER_BOARDID_'
const PLACEHOLDER_EPICID = '_PLACEHOLDER_EPICID_'
const PLACEHOLDER_STARTAT = '_PLACEHOLDER_STARTAT_'
const FILENAME = 'output/epicIssues.csv'
const streamWrite = fs.createWriteStream(FILENAME, {autoClose: true})

streamWrite.on('error', function (err) {
  console.log('######################################################################################## error');
}).on('finish', function () {
  console.log('######################################################################################## finish');
});
streamWrite.write('epic;id;key;issuetype;status;resolution;resolutionDate;sprintId;sprintName;closedSprintsId;closedSprintsName;closedSprintsCount;closedSprintName;closedSprintStartDate;closedSprintCompleteDate\n')

const REQUEST_FILENAME = 'output/epicIssues_request.json'
let requestSaved = false

const HTTP_REQUEST = {
  method: 'GET',
  uri: '',
  headers: {
              'authorization': '',
              'content-Type': 'application/json'
          },
  json: true
};

const URI = '/rest/agile/1.0/board/' + PLACEHOLDER_BOARDID + '/epic/' + PLACEHOLDER_EPICID + '/issue?startAt=' + PLACEHOLDER_STARTAT;

let accumNbrEpics = 0
let accumNbrIssues = 0
let nbrEpics = 0

function log(text) {
  console.log('epicIssue - ' + text)
}

function saveData(context) {
  log('Saving data to ' + FILENAME + ', board id = ' + context.boardId + ', epic id = '+ context.epicId);

  let buffer = '';

  for (index in context.dataBuffer) {
    buffer += context.dataBuffer[index] + '\n';
  }

  accumNbrEpics++
  accumNbrIssues += context.issuesKey.length

  log('number of epics               = ' + nbrEpics)
  log('accumulated number of epics   = ' + accumNbrEpics)
  log('accumulated number of issues  = ' + accumNbrIssues)

  streamWrite.write(buffer);

  context.callerCallback()
}
function getData(response, context) {
  log('getData - boardId = '+ context.boardId + ', epic id = '+ context.epicId);
  let epicId = 0

  //console.log('response=' +  JSON.stringify(response))
  for (iIndex in response.issues) {
    let issue = response.issues[iIndex]

    //console.log('issue.key='+issue.key)
    let closedSprintsName = ''
    let closedSprintsId = ''
    let closedSprintsCount = 0
    let sprintName = ''
    let sprintId = ''
    let closedSprintName = ''
    let closedSprintStartDate = ''
    let closedSprintCompleteDate = ''

    // Get the active sprint
    if (issue.fields.sprint) {
      sprintId = issue.fields.sprint.id
      sprintName = issue.fields.sprint.name
    }

    // Get closed sprints that bug/task
    if (typeof issue.fields.closedSprints !== 'undefined' && issue.fields.closedSprints) {
      for (csIndex in issue.fields.closedSprints) {
        let closedSprint = issue.fields.closedSprints[csIndex]
        closedSprintsName = closedSprintsName  + closedSprint.name + ','
        closedSprintsId = closedSprintsId + closedSprint.id + ','
        closedSprintsCount++

        if (sprintName == '' && closedSprintName == '') {
            closedSprintName = closedSprint.name
            closedSprintStartDate = closedSprint.startDate
            closedSprintCompleteDate = closedSprint.completeDate
        }
      }
    }

    closedSprintsId = closedSprintsId.replace(/,$/, '')
    closedSprintsName = closedSprintsName.replace(/,$/, '')
    resolutionDate = issue.fields.resolutiondate == null ? '' : (new Date(issue.fields.resolutiondate)).toISOString().replace('Z','-0000')
    resolution = issue.fields.resolution == null ? '' : issue.fields.resolution.name

    context.dataBuffer.push(
      issue.fields.epic.key + ';' +
      issue.id + ';' +
      issue.key + ';' +
      issue.fields.issuetype.name + ';' +
      issue.fields.status.name + ';' +
      resolution + ';' +
      resolutionDate + ';' +
      sprintId + ';' +
      sprintName + ';' +
      closedSprintsId + ';' +
      closedSprintsName + ';' +
      closedSprintsCount + ';' +
      closedSprintName + ';' +
      closedSprintStartDate + ';' +
      closedSprintCompleteDate

    )

    context.issuesKey.push(issue.key)
  }
}

function handleResponse(response, context){
  log('handleResponse - boardId = '+ context.boardId);

  getData(response, context);

  if (response.total > response.startAt + response.maxResults) {
    context.httpRequest.uri = context.jiraUrl + URI.replace(PLACEHOLDER_BOARDID, context.boardId).replace(PLACEHOLDER_EPICID, context.epicId).replace(PLACEHOLDER_STARTAT, response.startAt + response.maxResults);
    request.request(context);
  } else {
    saveData(context);
  }
}

function getEpicIssues(jiraUrl, auth, boardId, epicsId, callerCbk) {
  log('##### Getting Epics issues #####');

  nbrEpics += epicsId.length

  for (index in epicsId) {
    log('Getting the epics issues. Board Id = ' + boardId);
    log('Getting the epics issues. Epic Id = ' + epicsId[index]);

    let context = {
      httpRequest : Object.assign({}, HTTP_REQUEST),
      handleResponse : handleResponse,
      dataBuffer : [],
      callerCallback : callerCbk,
      boardId : boardId,
      epicId : epicsId[index],
      issuesKey : [],
      jiraUrl : jiraUrl
    }

    context.httpRequest.uri = jiraUrl + URI.replace(PLACEHOLDER_BOARDID, boardId).replace(PLACEHOLDER_EPICID, epicsId[index]).replace(PLACEHOLDER_STARTAT, '0')
    context.httpRequest.headers.authorization = auth

    if (!requestSaved) {
      const streamWriteRequest = fs.createWriteStream(REQUEST_FILENAME, {autoClose: true})
      streamWriteRequest.write(JSON.stringify(context.httpRequest))
      requestSaved = true
    }

    request.request(context)
  }
}

module.exports = {
  getEpicIssues
}