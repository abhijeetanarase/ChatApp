import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchInvitations, respondToInvitation } from "../features/invitations/invitationsSlice";
import { UserPlus, XCircle } from 'lucide-react';

const InvitationsList = () => {
  const dispatch = useDispatch();
  const { invitations, loading } = useSelector((state) => state.invitations);

  useEffect(() => {
    dispatch(fetchInvitations());
  }, [dispatch]);

  if (loading) return <div className="p-4 text-center text-gray-500 dark:text-gray-400">Loading invitations...</div>;
  if (!invitations.length) return (
    <div className="p-6 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
      <UserPlus className="h-10 w-10 mb-2" />
      <div className="text-sm">No pending invitations</div>
    </div>
  );

  return (
    <div className="flex flex-col gap-3 p-4">
      <div className="flex items-center mb-2">
        <UserPlus className="h-5 w-5 text-indigo-500 dark:text-indigo-400 mr-2" />
        <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100">Pending Invitations</h3>
      </div>
      {invitations.map((inv) => (
        <div
          key={inv._id}
          className="flex flex-col items-center bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 shadow-sm hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all"
        >
          <img
            src={inv.requester?.picture || "https://i.pravatar.cc/150?img=1"}
            alt={inv.requester?.name}
            className="w-9 h-9 rounded-full object-cover border-2 border-indigo-400 dark:border-indigo-600 mb-1"
          />
          <div className="font-medium text-gray-900 dark:text-gray-100 truncate">{inv.requester?.name}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 truncate mb-2">wants to add you as a contact</div>
          <div className="flex gap-2 mt-2">
            <button
              className="px-3 py-1 rounded-md bg-green-500 hover:bg-green-600 text-white text-xs font-semibold shadow"
              onClick={() => dispatch(respondToInvitation({ contactId: inv._id, action: "accepted" }))}
            >
              Accept
            </button>
            <button
              className="px-3 py-1 rounded-md bg-red-500 hover:bg-red-600 text-white text-xs font-semibold shadow flex items-center gap-1"
              onClick={() => dispatch(respondToInvitation({ contactId: inv._id, action: "rejected" }))}
            >
              <XCircle className="h-4 w-4" /> Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InvitationsList;