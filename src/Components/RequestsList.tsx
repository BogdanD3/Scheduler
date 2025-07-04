import React from "react";

interface Request {
  worker: string;
  date: string;
  currentShift: string;
  desiredShift: string;
  reason: string;
}

interface RequestsListProps {
  requests: Request[];
  onApprove: (request: Request) => void;
  onReject: (request: Request) => void;
}

function RequestsList({ requests, onApprove, onReject }: RequestsListProps) {
  return (
    <div className="mt-4 p-3 bg-white/10 rounded-lg text-black">
      <h3 className="font-semibold mb-2">📥 Shift Change Requests</h3>
      <ul>
        {requests.map((req, i) => (
          <li
            key={i}
            className="mb-3 border-b border-gray-300 pb-2 flex flex-col gap-1"
          >
            <div className="flex justify-between">
              <p>
                <strong>{req.worker}</strong> requested{" "}
                <strong>{req.desiredShift}</strong> on {req.date} (Current:{" "}
                {req.currentShift})
              </p>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => onApprove(req)}
                  className="px-3 py-1 bg-green-500 text-white rounded"
                >
                  Approve
                </button>
                <button
                  onClick={() => onReject(req)}
                  className="px-3 py-1 bg-red-500 text-white rounded"
                >
                  Reject
                </button>
              </div>
            </div>
            <p className="text-sm text-green-700 bold italic">Reason: {req.reason}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RequestsList;
