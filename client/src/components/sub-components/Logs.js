import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Logs = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await axios.get(`${process.env.BASE_URL}/webhook/logs`);
      setLogs(response.data);
    } catch (error) {
      console.error('Failed to load logs', error);
    }
  };

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
