// components/AddContactPopup.jsx

import { Search, Plus, Check } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  useContact,
  setSearchQuery,
  addToContacts,
  setShowAddContactPopup,
} from "../features/contact/contactSlice";
import { useEffect } from "react";

const AddContactPopup = ({}) => {
  const dispatch = useDispatch();
  const { searchQuery, users } = useSelector(useContact);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [searchQuery, dispatch]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Add New Contact
          </h2>
          <button
            onClick={() => dispatch(setShowAddContactPopup())}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl"
          >
            &times;
          </button>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-2 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            className="w-full p-2 pl-8 rounded-lg bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 text-gray-800 dark:text-gray-100"
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          />
        </div>

        <div className="max-h-60 overflow-y-auto">
          {users.length > 0 ? (
            users.map((user) => (
              <div
                key={user._id}
                className="flex items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer"
              >
                <img
                  src={
                     user.picture
                  }
                  alt={user.name}
                  className="w-10 h-10 rounded-full"
                />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {user.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user.status === "online"
                      ? "Online"
                      : user.status === "away"
                      ? "Away"
                      : "Offline"}
                  </p>
                </div>
                {user.added ? (
                  <div className="ml-auto flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Added
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={() => dispatch(addToContacts(user))}
                    className="ml-auto px-3 py-1 bg-blue-500 text-white rounded-full text-sm hover:bg-blue-600 transition-all duration-200 flex items-center"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add
                  </button>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-4">
              {searchQuery ? "No users found" : "Search for users to add"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddContactPopup;
