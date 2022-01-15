import got, {Options} from 'got';

const PLACEHOLDER_BOARDID = '_PLACEHOLDER_BOARDID_'
const PLACEHOLDER_STARTAT = '_PLACEHOLDER_STARTAT_'
const PLACEHOLDER_ISSUEID = '_PLACEHOLDER_ISSUEID_'
const URI_BOARD = 'rest/agile/1.0/board/' + PLACEHOLDER_BOARDID + '/epic?startAt=' + PLACEHOLDER_STARTAT;
const SELECT_BOARDS_STRING = "SELECT id FROM board";
const URI_EPIC = 'rest/api/3/issue/' + PLACEHOLDER_ISSUEID;
const SELECT_EPICS_STRING = "SELECT id, key, parent_id FROM epic"
const INSERT_EPIC_STRING = 'INSERT INTO epic(id, name, key, board_id) VALUES($1, $2, $3, $4) ON CONFLICT ON CONSTRAINT epic_pkey DO NOTHING;';
const UPDATE_EPIC_PARENT_STRING = 'UPDATE epic SET parent_id = $1 WHERE id = $2'
const SELECT_EPIC_STRING = "SELECT id, key, parent_id FROM epic WHERE id = $1"
const INSERT_PARENT_STRING = 'INSERT INTO epic(id, name, key) VALUES($1, $2, $3)';

const log = (text) => {
  console.log('epic - ' + text)
}

const requestGetEpics = async (boardId, options, startAt, query) => {
  log('requestGetEpics - Board id = ' + boardId);
  try {
    const response = await got(URI_BOARD.replace(PLACEHOLDER_BOARDID, boardId).replace(PLACEHOLDER_STARTAT, startAt), undefined, options).json();
    for (let iIndex in response.values) {
      let issue = response.values[iIndex]
      const result = await query({text: INSERT_EPIC_STRING, values: [issue.id, issue.name, issue.key, boardId]})
    }

    if (response.isLast == false) {
      await requestGetEpics(boardId, options, response.startAt + response.maxResults, query);
    }
  } catch (error) {
    log(error);
  }
}

const GetEpics = async (getConfig, query) => {
  log('##### GetEpics #####');

  let conf = getConfig();
  let result = await query(SELECT_BOARDS_STRING);

  if (result != null) {
    for (const idx in result.rows) {
      const boardId = result.rows[idx].id;
      const options = new Options({
        prefixUrl: conf.jiraUrl,
        headers: {
          authorization: conf.jiraAuth
        }
      });

      await requestGetEpics(boardId, options, 0, query);
    }
  }
}

const requestGetEpicParent = async (id, options, query) => {
  log('requestGetEpicParent - Epic id = ' + id);
  try {
    const response = await got(URI_EPIC.replace(PLACEHOLDER_ISSUEID, id), undefined, options).json();
    if ('parent' in response.fields) {
      const parent = response.fields.parent;
      let result = await query({text:SELECT_EPIC_STRING, values: [parent.id]});

      if (result.rowCount > 0) {
        result = await query({text: UPDATE_EPIC_PARENT_STRING, values: [parent.id, id]})
      } else {
        result = await query({text: INSERT_PARENT_STRING, values: [parseInt(parent.id), parent.fields.summary, parent.key]})
      }
    }
  } catch (error) {
    log(error);
  }
}

const GetEpicsParent = async (getConfig, query) => {
  log('##### GetEpicsParent #####');

  let conf = getConfig();
  let result = await query(SELECT_EPICS_STRING);

  if (result != null) {
    for (const idx in result.rows) {
      const key = result.rows[idx].key;
      const id = result.rows[idx].id;
      const parentId = result.rows[idx].parent_id;

      if (parentId == null) {
        const options = new Options({
          prefixUrl: conf.jiraUrl,
          headers: {
            authorization: conf.jiraAuth
          }
        });
        await requestGetEpicParent(id, options, query);
      }
    }
  }
}

export {GetEpics, GetEpicsParent}
