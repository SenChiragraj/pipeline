import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
} from '@mui/material';
import { getToken } from '../auth/authSessions';
import { useRepo } from '../../context/RepoContext';
import BuildEventListener from './buildEventListener';

const WebhookMonitor = () => {
  const [webhooks, setWebhooks] = useState([]);
  const [logs, setLogs] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const accessToken = getToken();
  const { repoFullName } = useRepo();

  useEffect(() => {
    if (!repoFullName || !accessToken) return;

    fetch(
      `http://localhost:8080/api/webhook/list?repoFullName=${encodeURIComponent(
        repoFullName
      )}&accessToken=${encodeURIComponent(accessToken)}`
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch webhooks');
        }
        return res.json();
      })
      .then(setWebhooks)
      .catch((err) => console.error('Failed to fetch webhooks:', err));
  }, [repoFullName, accessToken]);

  const loadLogs = () => {
    setSelectedRepo(repoFullName);
    fetch(
      `http://localhost:8080/api/webhook/logs?repo=${encodeURIComponent(
        repoFullName
      )}`
    )
      .then((res) => res.json())
      .then(setLogs)
      .catch((err) => console.error('Failed to fetch logs:', err));
  };

  const loadBuildLogs = () => {
    setSelectedRepo(repoFullName);
    fetch(
      `http://localhost:8080/api/webhook/buildlogs?repo=${encodeURIComponent(
        repoFullName
      )}`
    )
      .then((res) => res.json())
      .then(setLogs)
      .catch((err) => console.error('Failed to fetch logs:', err));
  };

  const deleteWebhook = (hookId) => {
    fetch(
      `http://localhost:8080/api/webhook/delete?repoFullName=${encodeURIComponent(
        repoFullName
      )}&hookId=${hookId}&accessToken=${encodeURIComponent(accessToken)}`,
      { method: 'DELETE' }
    )
      .then((res) => {
        if (!res.ok) throw new Error('Failed to delete webhook');
        return res.text();
      })
      .then(() => {
        setWebhooks((prev) => prev.filter((w) => w.id !== hookId));
      })
      .catch((err) => console.error(err));
  };

  return (
    <div style={{ padding: '2rem' }}>
      <BuildEventListener />
      <Typography variant="h4" gutterBottom>
        Webhook Monitor {repoFullName}
      </Typography>

      <Typography variant="h6">Webhooks</Typography>
      <TableContainer component={Paper} style={{ marginBottom: '2rem' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Repo</TableCell>
              <TableCell>URL</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Logs</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {webhooks.map((wh, index) => (
              <TableRow key={index}>
                <TableCell>{wh.repoFullName}</TableCell>
                <TableCell>{wh.url}</TableCell>
                <TableCell>{new Date(wh.createdAt).toLocaleString()}</TableCell>
                <TableCell>
                  <Button variant="outlined" onClick={() => loadLogs()}>
                    View Logs
                  </Button>

                  <Button variant="outlined" onClick={() => loadBuildLogs()}>
                    Build Logs
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => deleteWebhook(wh.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {selectedRepo && (
        <>
          <Typography variant="h6">Logs for: {selectedRepo}</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Commit</TableCell>
                  <TableCell>Message</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {logs.map((log, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      {new Date(log.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell>{log.status}</TableCell>
                    <TableCell>{log.commitId}</TableCell>
                    <TableCell>{log.message}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </div>
  );
};

export default WebhookMonitor;
