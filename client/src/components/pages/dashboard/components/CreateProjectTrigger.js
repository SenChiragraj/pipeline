import * as Dialog from '@radix-ui/react-dialog';
import React from 'react';
import CreateHook from './CreateHook';
import OpenProject from './OpenProject';

const CreateProjectTrigger = () => {
  return (
    <div className="space-y-4">
      {/* Create Project Dialog */}
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <button className="btn w-full">⚙️ Create Project</button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40" />
          <Dialog.Content className="fixed top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg z-50">
            <Dialog.Title className="text-lg font-semibold mb-4">
              Create New Project
            </Dialog.Title>
            <Dialog.Close className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
              ✕
            </Dialog.Close>
            <CreateHook />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Open Projects Dialog */}
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <button className="btn w-full">🔓 Open Projects</button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40" />
          <Dialog.Content className="fixed top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg z-50">
            <Dialog.Title className="text-lg font-semibold mb-4">
              Open Project
            </Dialog.Title>
            <Dialog.Close className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
              ✕
            </Dialog.Close>
            <OpenProject />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default CreateProjectTrigger;
