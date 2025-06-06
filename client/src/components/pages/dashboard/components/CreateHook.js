import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../../../auth/authSessions';
import { toast } from 'react-toastify';

import * as Form from '@radix-ui/react-form';
import * as Select from '@radix-ui/react-select';
import { ChevronDownIcon } from '@radix-ui/react-icons';

const CreateHookForm = ({ onSuccess }) => {
  const navigate = useNavigate();
  const [repos, setRepos] = useState([]);
  const [projectName, setProjectName] = useState('');
  const [repoFullName, setRepoFullName] = useState('');
  const [errors, setErrors] = useState({ projectName: '', repoName: '' });

  const accessToken = getToken();

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const res = await fetch('https://api.github.com/user/repos', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await res.json();
        setRepos(data);
      } catch (err) {
        toast.error('Failed to load repositories');
      }
    };

    fetchRepos();
  }, [accessToken]);

  const createWebhook = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/webhook/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoFullName, accessToken }),
      });

      if (!res.ok) throw new Error('Webhook creation failed');

      toast.success('Webhook created successfully!');
      onSuccess?.(); // Close dialog if provided
    } catch (error) {
      toast.error('Failed to create webhook');
    }
  };

  const validate = () => {
    const newErrors = { projectName: '', repoName: '' };
    if (!projectName || projectName.trim().length < 3) {
      newErrors.projectName = 'Project name must be at least 3 characters.';
    }
    if (!repoFullName) {
      newErrors.repoName = 'Please select a repository.';
    }
    setErrors(newErrors);
    return !newErrors.projectName && !newErrors.repoName;
  };

  async function addToProjects() {
    try {
      const params = new URLSearchParams();
      params.append('name', projectName);
      params.append('repoName', repoFullName);

      const res = await fetch('http://localhost:8080/api/projects/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      if (!res.ok) throw new Error('Project creation failed');

      toast.success('Project created successfully!');
      navigate(`/project/${projectName}`);
    } catch (error) {
      toast.error('Failed to create project');
    }
  }

  const createProject = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    createWebhook();
    await addToProjects();
  };

  return (
    <Form.Root onSubmit={createProject} className="space-y-6">
      <Form.Field name="projectName" className="grid gap-2">
        <Form.Label className="text-sm font-medium text-gray-700">
          Project Name
        </Form.Label>
        <Form.Control asChild>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </Form.Control>
        {errors.projectName && (
          <span className="text-sm text-red-600">{errors.projectName}</span>
        )}
      </Form.Field>

      <Form.Field name="repoName" className="grid gap-2">
        <Form.Label className="text-sm font-medium text-gray-700">
          Repository
        </Form.Label>
        <Select.Root value={repoFullName} onValueChange={setRepoFullName}>
          <Select.Trigger className="inline-flex items-center justify-between border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500">
            <Select.Value placeholder="Select a repository" />
            <Select.Icon>
              <ChevronDownIcon />
            </Select.Icon>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content className="bg-white border border-gray-300 rounded-md shadow-lg z-50">
              <Select.Viewport className="p-2">
                {repos.map((repo) => (
                  <Select.Item
                    key={repo.id}
                    value={repo.full_name}
                    className="px-4 py-2 rounded hover:bg-gray-100 cursor-pointer"
                  >
                    <Select.ItemText>{repo.name}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
        {errors.repoName && (
          <span className="text-sm text-red-600">{errors.repoName}</span>
        )}
      </Form.Field>

      <Form.Submit asChild>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Create Project
        </button>
      </Form.Submit>
    </Form.Root>
  );
};

export default CreateHookForm;
