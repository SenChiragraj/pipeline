import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const jobTypes = [
  { label: 'Freestyle project', value: 'freestyle' },
  { label: 'Pipeline', value: 'pipeline' },
  { label: 'Multibranch Pipeline', value: 'multibranch' },
];

const NewItem = () => {
  const [name, setName] = useState('');
  const [type, setType] = useState(jobTypes[0].value);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Call your backend API to create the job here
    // await createJob({ name, type });
    // On success, navigate to the job's page
    navigate(`/dashboard/${name}`);
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Create New Item</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2 font-medium">Item Name</label>
        <input
          type="text"
          className="w-full mb-4 p-2 border rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <label className="block mb-2 font-medium">Type</label>
        <select
          className="w-full mb-4 p-2 border rounded"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          {jobTypes.map((jt) => (
            <option key={jt.value} value={jt.value}>
              {jt.label}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Create
        </button>
      </form>
    </div>
  );
};

export default NewItem;
