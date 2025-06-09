import React, { useState } from 'react';
import { ScrollArea, Badge, Card } from '@radix-ui/themes';

export default function Document() {
  const [openStep, setOpenStep] = useState(null);

  const steps = [
    {
      title: 'Login with GitHub using OAuth',
      content:
        'Click on the GitHub Login button to authenticate. Grant necessary permissions to access repositories. Once authenticated, you’ll be redirected to the dashboard.',
    },
    {
      title: 'Select a Repository',
      content:
        'After logging in, browse your GitHub repositories. Choose the repository you want to automate builds for. Confirm access so CI/CD can track changes.',
    },
    {
      title: 'Create a Webhook',
      content:
        'Navigate to the Webhook settings in GitHub. Add a new webhook with the CI/CD endpoint URL. Choose triggers like push events or pull requests. Save the webhook.',
    },
    {
      title: 'Push Code or Raise PR',
      content:
        'Make changes in your repository and push the code (`git push origin main`). If working collaboratively, submit a Pull Request (PR). CI/CD detects changes and initiates a build.',
    },
    {
      title: 'Monitor Build Logs',
      content:
        'Open the CI/CD dashboard to track the ongoing build. View logs, check for errors, and analyze performance. If the build fails, read error logs and debug the issue.',
    },
    {
      title: 'Review Build History',
      content:
        'Access past builds to see successful and failed runs. Review logs for debugging purposes. Fix issues and retry builds if needed.',
    },
  ];

  const goBack = () => {
    // Logic to navigate back, e.g., using useNavigate from react-router-dom
    window.history.back();
  };

  return (
    <ScrollArea className="min-h-screen  p-4 bg-gray-50">
      <header className="mb-4 md:mb-6 px-4 flex flex-col md:flex-row justify-between items-center gap-4 bg-white shadow-md rounded-lg p-6">
        {/* Title Section */}
        <div className="text-center md:text-left">
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold">
            Jenkings Documentation
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-1">
            Your guide to using the Jenkings CI/CD platform with GitHub
          </p>
        </div>

        {/* Badge Section */}
        <div className="flex flex-wrap justify-center items-center gap-2">
          <Badge
            variant="solid"
            color="blue"
            className="px-3 py-1 text-xs sm:text-sm md:text-base"
          >
            v1.0
          </Badge>
          <Badge
            variant="soft"
            color="gray"
            className="px-3 py-1 text-xs sm:text-sm md:text-base"
          >
            Updated October 2024
          </Badge>
        </div>

        {/* Button Section */}
        <button className="btn before:btn-dark" onClick={() => goBack()}>
          Go Back
        </button>
      </header>

      <main className="w-full max-w-screen md:max-w-screen mx-auto space-y-6 px-3 md:px-6">
        {/* Overview Section */}
        <section className="p-4 md:p-6 bg-white shadow-md rounded-lg">
          <h2 className="text-lg md:text-2xl font-bold">Project Overview</h2>
          <div className="max-h-40 overflow-y-auto">
            <p className="mt-2 text-gray-700 text-sm md:text-lg">
              <strong>
                Cloud-Based CI/CD Platform with GitHub Integration
              </strong>
            </p>
            <p className="mt-2 text-xs md:text-base">
              This CI/CD platform enables developers to authenticate using
              GitHub, manage repositories, setup webhooks, monitor automated
              builds, and receive real-time updates.
            </p>
          </div>
        </section>
        {/* Features Section */}
        <section className="p-4 md:p-6 bg-white shadow-md rounded-lg">
          <h2 className="text-lg md:text-2xl font-semibold">Key Features</h2>
          <div className="">
            <ul className="list-disc list-inside mt-2 space-y-2 text-gray-800 text-xs md:text-sm">
              {[
                'GitHub OAuth Login',
                'Repository Listing and Selection',
                'Webhook Setup and Trigger',
                'Automated Build Pipeline',
                'Live Build Logs Viewer',
                'Real-Time Notifications',
                'Build History Timeline',
                'Build Status Dashboard',
              ].map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
        </section>
        {/* How to Use Section */}
        <section className="p-4 bg-white shadow-md rounded-lg">
          <h2 className="text-lg font-semibold mb-3">How to Use</h2>
          <div className="space-y-2">
            {steps.map((step, index) => (
              <Card key={index} className="p-3 rounded-md shadow">
                <button
                  className="w-full text-left text-sm font-medium"
                  onClick={() => setOpenStep(openStep === index ? null : index)}
                >
                  {step.title}
                </button>
                {openStep === index && (
                  <p className="mt-1 text-gray-700 text-lg">{step.content}</p>
                )}
              </Card>
            ))}
          </div>
        </section>
      </main>
    </ScrollArea>
  );
}
