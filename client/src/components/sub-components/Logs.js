import React, { useEffect, useState } from 'react';

const Logs = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/webhook/logs')
      .then((res) => res.json())
      .then((data) => setLogs(data))
      .catch((err) => console.error('Failed to load logs', err));
  }, []);

  return (
    <div>
      <h2>Build Logs</h2>
      <table>
        <thead>
          <tr>
            <th>Repo Name</th>
            <th>Status</th>
            <th>Log Details</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td>{log.repoName}</td>
              <td>{log.status}</td>
              <td>{log.logDetails}</td>
              <td>{log.timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Logs;
