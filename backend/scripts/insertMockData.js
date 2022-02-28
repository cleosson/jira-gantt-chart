import 'dotenv/config';
import pg from 'pg';

const client = new pg.Client({
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USER,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: parseInt(process.env.POSTGRES_PORT, 10),
});

const executeSQL = async (queries) => {
  try {
    await client.connect();     // gets connection
    for (const query of queries) {
      await client.query(query);
    }
    return true;
  } catch (error) {
    console.error("error: " + JSON.stringify(error));
    console.error("error.stack: " + error.stack);
    return false;
  } finally {
    await client.end();         // closes connection
  }
};

const sqls = [
  `
  INSERT INTO board(id, name)
    VALUES(69, 'Gantt Chart Board')
    ON CONFLICT ON CONSTRAINT board_pkey DO
    UPDATE SET
      id = excluded.id,
      name = excluded.name;
  `,
  `
  INSERT INTO epic(id, name, key, board_id)
    VALUES(101, 'Gant Chart Jira', 'PRODUCT-100', 69)
    ON CONFLICT ON CONSTRAINT epic_pkey DO
    UPDATE SET
      name = excluded.name,
      key = excluded.key;
  `,
  `
  INSERT INTO epic(id, name, key, board_id, parent_id)
    VALUES(102, 'Build Jira Integration', 'GANTT-200', 69, 101)
    ON CONFLICT ON CONSTRAINT epic_pkey DO
    UPDATE SET
      name = excluded.name,
      key = excluded.key,
      parent_id = excluded.parent_id;
  `,
  `
  INSERT INTO epic(id, name, key, board_id, parent_id)
    VALUES(103, 'Build Gantt Chart', 'GANTT-300', 69, 101)
    ON CONFLICT ON CONSTRAINT epic_pkey DO
    UPDATE SET
      name = excluded.name,
      key = excluded.key,
      parent_id = excluded.parent_id;
  `,
  `
  INSERT INTO sprint(id, name, board_id, start_date, complete_date, state)
   VALUES(401, 'Sprint #1', 69, '2021-11-01T00:00:00.000-0000', '2021-11-30T00:00:00.000-0000', 'closed')
    ON CONFLICT ON CONSTRAINT sprint_pkey DO
    UPDATE SET
      name = excluded.name,
      board_id = excluded.board_id,
      start_date = excluded.start_date,
      complete_date = excluded.complete_date,
      state = excluded.state;
  `,
  `
  INSERT INTO sprint(id, name, board_id, start_date, complete_date, state)
   VALUES(402, 'Sprint #2', 69, '2021-12-01T00:00:00.000-0000', '2021-012-31T00:00:00.000-0000', 'closed')
    ON CONFLICT ON CONSTRAINT sprint_pkey DO
    UPDATE SET
      name = excluded.name,
      board_id = excluded.board_id,
      start_date = excluded.start_date,
      complete_date = excluded.complete_date,
      state = excluded.state;
  `,
  `
  INSERT INTO sprint(id, name, board_id, start_date, state)
   VALUES(403, 'Sprint #3', 69, '2021-01-01T00:00:00.000-0000', 'active')
    ON CONFLICT ON CONSTRAINT sprint_pkey DO
    UPDATE SET
      name = excluded.name,
      board_id = excluded.board_id,
      start_date = excluded.start_date,
      complete_date = excluded.complete_date,
      state = excluded.state;
  `,
  `
  INSERT INTO sprint(id, name, board_id, state)
   VALUES(404, 'Sprint #4', 69, 'future')
    ON CONFLICT ON CONSTRAINT sprint_pkey DO
    UPDATE SET
      name = excluded.name,
      board_id = excluded.board_id,
      start_date = excluded.start_date,
      complete_date = excluded.complete_date,
      state = excluded.state;
  `,
  `
  INSERT INTO issue(id, key, name, type, status, resolution, resolution_date, epic_id)
    VALUES(1001, 'CHART-1', 'Ticket 01', 'Story', 'Done', 'Done', '2021-11-30T00:00:00.000-0000', 102)
    ON CONFLICT ON CONSTRAINT issue_pkey DO
    UPDATE SET
      key = excluded.key,
      name = excluded.name,
      type = excluded.type,
      status = excluded.status,
      resolution = excluded.resolution,
      resolution_date = excluded.resolution_date,
      epic_id = excluded.epic_id;
  `,
  `
  INSERT INTO issue(id, key, name, type, status, resolution, resolution_date, epic_id)
    VALUES(1002, 'CHART-2', 'Ticket 02', 'Story', 'Done', 'Done', '2021-11-30T00:00:00.000-0000', 102)
    ON CONFLICT ON CONSTRAINT issue_pkey DO
    UPDATE SET
      key = excluded.key,
      name = excluded.name,
      type = excluded.type,
      status = excluded.status,
      resolution = excluded.resolution,
      resolution_date = excluded.resolution_date,
      epic_id = excluded.epic_id;
  `,
  `
  INSERT INTO issue(id, key, name, type, status, resolution, resolution_date, epic_id)
    VALUES(1003, 'CHART-3', 'Ticket 03', 'Story', 'Done', 'Done', '2021-12-30T00:00:00.000-0000', 102)
    ON CONFLICT ON CONSTRAINT issue_pkey DO
    UPDATE SET
      key = excluded.key,
      name = excluded.name,
      type = excluded.type,
      status = excluded.status,
      resolution = excluded.resolution,
      resolution_date = excluded.resolution_date,
      epic_id = excluded.epic_id;
  `,
  `
  INSERT INTO issue(id, key, name, type, status, resolution, resolution_date, epic_id)
    VALUES(1004, 'CHART-3', 'Ticket 03', 'Story', 'Done', 'Done', '2021-12-30T00:00:00.000-0000', 102)
    ON CONFLICT ON CONSTRAINT issue_pkey DO
    UPDATE SET
      key = excluded.key,
      name = excluded.name,
      type = excluded.type,
      status = excluded.status,
      resolution = excluded.resolution,
      resolution_date = excluded.resolution_date,
      epic_id = excluded.epic_id;
  `,
  `
  INSERT INTO issue(id, key, name, type, status, sprint_id, epic_id)
    VALUES(1005, 'CHART-4', 'Ticket 04', 'Story', 'In Progress', 403, 103)
    ON CONFLICT ON CONSTRAINT issue_pkey DO
    UPDATE SET
      key = excluded.key,
      name = excluded.name,
      type = excluded.type,
      status = excluded.status,
      sprint_id = excluded.sprint_id,
      epic_id = excluded.epic_id;
  `,
  `
  INSERT INTO issue(id, key, name, type, status, sprint_id, epic_id)
    VALUES(1006, 'CHART-5', 'Ticket 05', 'Story', 'In Progress', 403, 103)
    ON CONFLICT ON CONSTRAINT issue_pkey DO
    UPDATE SET
      key = excluded.key,
      name = excluded.name,
      type = excluded.type,
      status = excluded.status,
      sprint_id = excluded.sprint_id,
      epic_id = excluded.epic_id;
  `,
  `
  INSERT INTO issue(id, key, name, type, status, sprint_id, epic_id)
    VALUES(1007, 'CHART-6', 'Ticket 06', 'Story', 'Backlog', 403, 103)
    ON CONFLICT ON CONSTRAINT issue_pkey DO
    UPDATE SET
      key = excluded.key,
      name = excluded.name,
      type = excluded.type,
      status = excluded.status,
      sprint_id = excluded.sprint_id,
      epic_id = excluded.epic_id;
  `,
  `
  INSERT INTO issue(id, key, name, type, status, sprint_id, epic_id)
    VALUES(1007, 'CHART-7', 'Ticket 07', 'Story', 'Backlog', 404, 103)
    ON CONFLICT ON CONSTRAINT issue_pkey DO
    UPDATE SET
      key = excluded.key,
      name = excluded.name,
      type = excluded.type,
      status = excluded.status,
      sprint_id = excluded.sprint_id,
      epic_id = excluded.epic_id;
  `,
  `
  INSERT INTO issue(id, key, name, type, status, sprint_id, epic_id)
    VALUES(1008, 'CHART-8', 'Ticket 08', 'Story', 'Backlog', 404, 103)
    ON CONFLICT ON CONSTRAINT issue_pkey DO
    UPDATE SET
      key = excluded.key,
      name = excluded.name,
      type = excluded.type,
      status = excluded.status,
      sprint_id = excluded.sprint_id,
      epic_id = excluded.epic_id;
  `,
  `
  INSERT INTO closed_sprint(sprint_id, issue_id)
    VALUES(401, 1001)
    ON CONFLICT ON CONSTRAINT closed_sprint_pkey DO NOTHING;
  `,
  `
  INSERT INTO closed_sprint(sprint_id, issue_id)
    VALUES(401, 1002)
    ON CONFLICT ON CONSTRAINT closed_sprint_pkey DO NOTHING;
  `,
  `
  INSERT INTO closed_sprint(sprint_id, issue_id)
    VALUES(401, 1003)
    ON CONFLICT ON CONSTRAINT closed_sprint_pkey DO NOTHING;
  `,
  `
  INSERT INTO closed_sprint(sprint_id, issue_id)
    VALUES(401, 1004)
    ON CONFLICT ON CONSTRAINT closed_sprint_pkey DO NOTHING;
  `,
  `
  INSERT INTO closed_sprint(sprint_id, issue_id)
    VALUES(402, 1003)
    ON CONFLICT ON CONSTRAINT closed_sprint_pkey DO NOTHING;
  `,
  `
  INSERT INTO closed_sprint(sprint_id, issue_id)
    VALUES(402, 1004)
    ON CONFLICT ON CONSTRAINT closed_sprint_pkey DO NOTHING;
  `
];

 executeSQL(sqls).then(result => {
  if (result) {
    console.log('Data inserted');
  }
});
