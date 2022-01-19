# jira-gantt-chart

## Launch the infra

* Set the following env variables
  * export POSTGRES_USER="postgres"
  * export POSTGRES_PASSWORD="changeme"
  * export POSTGRES_PORT=5432
  * export POSTGRES_DATABASE="gantt_chart"
  * export POSTGRES_HOST="172.18.0.2"
  * export PGADMIN_DEFAULT_EMAIL="pgadmin4@pgadmin.org"
  * export PGADMIN_DEFAULT_PASSWORD="admin"
  * export PGADMIN_PORT=5050
  * export JIRA_URL="https://\<enter the value>"
  * export JIRA_USER="\<enter the value>"
  * export JIRA_API_TOKEN="\<enter the value>"
  * export JIRA_BOARD_ID=\<enter the value>
  * export JIRA_START_DATE="2021-01-01T00:00:00.000-0000"
* Create the network

    `docker network create --driver bridge jira_gantt_chart`
* Launch the PostgresSQL container

    `docker-compose -f infra/database/docker-compose.yaml up -d`
* Create the database and table

    ```
    cd script
    npm install
    node createDatabase.js
    node createTable.js
    ```

* Launch the backend

    ```
    cd backend
    npm install
    node server.js
    ```
