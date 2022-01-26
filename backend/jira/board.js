import got, {Options} from 'got';

const PLACEHOLDER_BOARDID = '_PLACEHOLDER_BOARDID_'
const URI = 'rest/agile/1.0/board/' + PLACEHOLDER_BOARDID
const INSERT_STRING = 'INSERT INTO board(id, name) VALUES($1, $2) ON CONFLICT ON CONSTRAINT board_pkey DO ' +
                      'UPDATE SET id = excluded.id, name = excluded.name;';

const log = (text) => {
  console.log('board - ' + text)
};

const GetBoard = async (boardId, getConfig, query) => {
  log('##### GetBoard #####');

  let conf = getConfig();
  const options = new Options({
    prefixUrl: conf.jiraUrl,
    headers: {
      authorization: conf.jiraAuth
    }
  });

  log('Board id = ' + boardId);

  try {
    const response = await got(URI.replace(PLACEHOLDER_BOARDID, boardId), undefined, options).json();
    await query({text: INSERT_STRING, values: [response.id, response.name]})
  } catch (error) {
    log("################################## ERROR")
    log("URI = " + URI.replace(PLACEHOLDER_BOARDID, boardId))
    log("options = " + JSON.stringify(options))
    log("error = " + JSON.stringify(error))
    log("stack = " + error.stack);
    log("################################## ERROR")
    throw error;
  }
};

export {GetBoard};

