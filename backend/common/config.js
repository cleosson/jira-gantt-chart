const config = {
  jiraUrl : process.env.JIRA_URL,
  jiraBoardId : process.env.JIRA_BOARD_ID,
  jiraAuth : 'Basic ' + Buffer.from(process.env.JIRA_USER + ':' + process.env.JIRA_API_TOKEN).toString('base64'),
  jiraStartDate : process.env.JIRA_START_DATE
};

const GetConfig = () => {
  return config;
}

export {GetConfig}
