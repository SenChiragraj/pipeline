import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OpenProject = () => {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${process.env.BASE_URL}/projects/all`);
      setProjects(response.data);
    } catch (error) {
      console.error('Failed to fetch projects', error);
    }
  };

  const filteredProjects = projects.filter((project) =>
    `${project.name} ${project.repoName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Your Projects</h2>

      <input
        type="text"
        placeholder="Search projects..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="space-y-3 max-h-[60vh] overflow-y-auto">
        {filteredProjects.length === 0 ? (
          <p className="text-gray-500">No matching projects found.</p>
        ) : (
          filteredProjects.map((project) => (
            <div
              key={project.id}
              className="border p-3 rounded-md flex justify-between items-center hover:bg-gray-50"
            >
              <div>
                <p className="font-medium text-gray-800">{project.name}</p>
                <p className="text-sm text-gray-500">{project.repoName}</p>
              </div>
              <button
                onClick={() =>
                  (window.location.href = `/project/${project.name}`)
                }
                className="text-blue-600 hover:underline text-sm"
              >
                Open
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OpenProject;
