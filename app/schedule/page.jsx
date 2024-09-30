import React from "react";

const ProgressLog = () => {
  const data = [
    {
      taskId: "#1023",
      description: "Approval From Transport Department",
      startCost: "27/09/2024",
      expectedEndDate: "27/09/2024",
      actualEndDate: "27/09/2024",
      additionalComments: "Work approved due PIL",
      status: "Completed",
    },
    {
      taskId: "#3001",
      description: "Approval From Road Department",
      startCost: "28/09/2024",
      expectedEndDate: "27/09/2024",
      actualEndDate: "27/09/2024",
      additionalComments: "Work approved on request of Transport Department",
      status: "Completed",
    },
    {
      taskId: "#2331",
      description: "Route Survey and Feasibility Study",
      startCost: "28/09/2024",
      expectedEndDate: "30/09/2024",
      actualEndDate: "-",
      additionalComments: "Assigned to officer Manish Pandey - 1102(Batch No)",
      status: "Ongoing",
    },
    {
      taskId: "#2341",
      description: "Assign Drivers and Buses to Route",
      startCost: "01/10/2024",
      expectedEndDate: "04/10/2004",
      actualEndDate: "-",
      additionalComments: "Awaiting Road Department Feasibility Study",
      status: "Not Started",
    },
  ];

  const getStatusClass = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-600";
      case "Ongoing":
        return "bg-yellow-100 text-yellow-600";
      case "Not Started":
        return "bg-gray-100 text-gray-600";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-8">
      <div className="bg-white shadow-md rounded-lg overflow-hidden w-full max-w-4xl">
        {/* Header Section */}
        <div className="bg-blue-500 text-white py-4 px-6">
          <h2 className="text-xl font-semibold">PROGRESS LOG</h2>
        </div>

        {/* Project Details */}
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">
            Road Department - <span className="font-bold">#14523</span> Bus
            Service to be stated on Route 752
          </h3>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto text-left border-collapse">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b">Task</th>
                <th className="px-4 py-2 border-b">Description</th>
                <th className="px-4 py-2 border-b">Expected Start Date</th>
                <th className="px-4 py-2 border-b">Expected End Date</th>
                <th className="px-4 py-2 border-b">Actual End Date</th>
                <th className="px-4 py-2 border-b">Additional Comments</th>
                <th className="px-4 py-2 border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-2">{row.taskId}</td>
                  <td className="px-4 py-2">{row.description}</td>
                  <td className="px-4 py-2">{row.startCost}</td>
                  <td className="px-4 py-2">{row.expectedEndDate}</td>
                  <td className="px-4 py-2">{row.actualEndDate}</td>
                  <td className="px-4 py-2">{row.additionalComments}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusClass(
                        row.status
                      )}`}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProgressLog;
