import got, {Options} from 'got';

const PLACEHOLDER_BOARDID = '_PLACEHOLDER_BOARDID_'
const PLACEHOLDER_STARTAT = '_PLACEHOLDER_STARTAT_'
const URI = 'rest/agile/1.0/board/' + PLACEHOLDER_BOARDID + '/sprint?startAt=' + PLACEHOLDER_STARTAT;
const SELECT_STRING = "SELECT id FROM board";
const INSERT_STRING = 'INSERT INTO sprint(id, name, board_id, start_date, end_date, complete_date, state) VALUES($1, $2, $3, $4, $5, $6, $7) ' +
                      'ON CONFLICT ON CONSTRAINT sprint_pkey DO UPDATE SET name = excluded.name, board_id = excluded.board_id, ' +
                      'start_date = excluded.start_date, end_date = excluded.end_date, complete_date = excluded.complete_date, state = excluded.state;';


const log = (text) => {
  console.log('sprint - ' + text)
}

const getData = async (boardId, response, query, conf) => {
  log('getData - boardId = ' + boardId);

  for (let vIndex in response.values) {
    let value = response.values[vIndex]
    let completeDate = typeof value.completeDate == 'undefined' ? '' : (new Date(value.completeDate)).toISOString().replace('Z','-0000')
    let startDate = typeof value.startDate == 'undefined' ? '' : (new Date(value.startDate)).toISOString().replace('Z','-0000')
    let endDate = typeof value.endDate == 'undefined' ? '' : (new Date(value.endDate)).toISOString().replace('Z','-0000')

    if (conf.jiraStartDate < startDate || startDate == '') {
      // log('Geting Sprint name=' + value.name + ', id=' + value.id + ', startDate=' + startDate + ', minimum startDate=' + conf.jiraStartDate + ", board id=" + boardId)
      await query({text: INSERT_STRING, values: [value.id, value.name, boardId, startDate, endDate,  completeDate, value.state]})
    } else {
      // log('Skipping Sprint name=' + value.name + ', id=' + value.id + ', startDate=' + startDate + ', minimum startDate=' + conf.jiraStartDate)
    }
  }
}

const request = async (boardId, options, startAt, query, conf) => {
  log('Board id = ' + boardId);
  try {
    const response = await got(URI.replace(PLACEHOLDER_BOARDID, boardId).replace(PLACEHOLDER_STARTAT, startAt), undefined, options).json();
    await getData(boardId, response, query, conf)

    if (response.isLast == false) {
      await request(boardId, options, response.startAt + response.maxResults, query, conf);
    }
  } catch (error) {
    log("################################## ERROR")
    log("URI = " + URI.replace(PLACEHOLDER_BOARDID, boardId).replace(PLACEHOLDER_STARTAT, startAt))
    log("options = " + JSON.stringify(options))
    log("error = " + JSON.stringify(error))
    log("stack = " + error.stack);
    log("################################## ERROR")
    throw error;
  }
}

const GetSprints = async (getConfig, query) => {
  log('##### GetSprints #####');

  let conf = getConfig();
  let result = await query(SELECT_STRING);

  if (result != null) {
    for (const idx in result.rows) {
      const boardId = result.rows[idx].id;
      const options = new Options({
        prefixUrl: conf.jiraUrl,
        headers: {
          authorization: conf.jiraAuth
        }
      });

      await request(boardId, options, 0, query, conf);
    }
  }
}

export {GetSprints}
