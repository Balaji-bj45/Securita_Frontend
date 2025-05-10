import React, { useEffect, useState } from 'react';
import Navbar from '../Components/Navbar';
import { FiRefreshCw, FiTrash2, FiSearch, FiAlertTriangle } from 'react-icons/fi';
import { Tooltip } from 'react-tooltip';

function ActiveSessions() {
  const [sessions, setSessions] = useState([]);
  const [filter, setFilter] = useState('');
  const [selectedSessions, setSelectedSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefreshed, setLastRefreshed] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const fetchSessions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Replace with actual API call in production
      // const response = await fetch('/api/sessions');
      // const data = await response.json();
      // setSessions(data);
      
      const dummySessions = [
        { 
          id: 1, 
          username: 'john_doe', 
          activeSince: '2025-04-28 10:15', 
          remoteHost: '192.168.1.1', 
          connectionName: 'Chrome',
          location: 'New York, US',
          duration: '2h 15m',
          lastActivity: '2 minutes ago'
        },
        { 
          id: 2, 
          username: 'jane_smith', 
          activeSince: '2025-04-28 11:00', 
          remoteHost: '192.168.1.2', 
          connectionName: 'Firefox',
          location: 'London, UK',
          duration: '1h 30m',
          lastActivity: '15 minutes ago'
        },
        { 
          id: 3, 
          username: 'admin', 
          activeSince: '2025-04-28 09:30', 
          remoteHost: '192.168.1.3', 
          connectionName: 'Safari',
          location: 'San Francisco, US',
          duration: '4h 45m',
          lastActivity: 'Active now'
        }
      ];
      setSessions(dummySessions);
      setLastRefreshed(new Date());
    } catch (err) {
      setError('Failed to fetch sessions. Please try again.');
      console.error('Error fetching sessions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleSelect = (sessionId) => {
    setSelectedSessions((prev) =>
      prev.includes(sessionId)
        ? prev.filter(id => id !== sessionId)
        : [...prev, sessionId]
    );
  };

  const filteredSessions = sessions.filter((session) =>
    session.username.toLowerCase().includes(filter.toLowerCase()) ||
    session.connectionName.toLowerCase().includes(filter.toLowerCase()) ||
    session.remoteHost.includes(filter)
  );

  const handleKillSessions = () => {
    if (selectedSessions.length > 0) {
      const remaining = sessions.filter(session => !selectedSessions.includes(session.id));
      setSessions(remaining);
      setSelectedSessions([]);
      // In production, you would call an API here
      // await fetch('/api/sessions/kill', { method: 'POST', body: JSON.stringify({ sessionIds: selectedSessions }) });
    }
    setShowConfirmModal(false);
  };

  const selectAllFiltered = () => {
    if (filteredSessions.length > 0) {
      if (selectedSessions.length === filteredSessions.length) {
        setSelectedSessions([]);
      } else {
        setSelectedSessions(filteredSessions.map(session => session.id));
      }
    }
  };
  

  const formatTime = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleTimeString() + ' ' + date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Active Sessions</h1>
          <div className="flex items-center space-x-3">
            <button
              onClick={fetchSessions}
              disabled={isLoading}
              className={`flex items-center mt-10 px-3 py-2 rounded-md ${isLoading ? 'bg-gray-200 text-gray-500' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
              data-tooltip-id="refresh-tooltip"
            >
              <FiRefreshCw className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <Tooltip id="refresh-tooltip" place="top" effect="solid">
              Last refreshed: {lastRefreshed ? formatTime(lastRefreshed) : 'Never'}
            </Tooltip>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <p className="text-gray-600 mb-6">
            Manage currently active connections. Select sessions to terminate them. Killing a session will immediately disconnect the user.
          </p>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="relative flex-grow max-w-2xl">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Filter by username, connection or IP..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <button
              onClick={() => selectedSessions.length > 0 && setShowConfirmModal(true)}
              disabled={selectedSessions.length === 0}
              className={`flex items-center px-4 py-2 rounded-md ${selectedSessions.length === 0 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-red-600 text-white hover:bg-red-700'}`}
            >
              <FiTrash2 className="mr-2" />
              Terminate {selectedSessions.length > 0 ? `(${selectedSessions.length})` : ''}
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
              <div className="flex items-center">
                <FiAlertTriangle className="mr-2" />
                <p>{error}</p>
              </div>
            </div>
          )}

          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">
                    <input
                      type="checkbox"
                      onChange={selectAllFiltered}
                      checked={filteredSessions.length > 0 && selectedSessions.length === filteredSessions.length}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Connection
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Activity
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IP Address
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center">
                      <div className="flex justify-center items-center">
                        <FiRefreshCw className="animate-spin mr-2 text-blue-500" />
                        Loading sessions...
                      </div>
                    </td>
                  </tr>
                ) : filteredSessions.length > 0 ? (
                  filteredSessions.map(session => (
                    <tr key={session.id} className={selectedSessions.includes(session.id) ? 'bg-blue-50' : 'hover:bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedSessions.includes(session.id)}
                          onChange={() => handleSelect(session.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                            {session.username.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{session.username}</div>
                            <div className="text-sm text-gray-500">Since {session.activeSince}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-medium">{session.connectionName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {session.duration}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {session.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {session.lastActivity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                        {session.remoteHost}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                      {filter ? 'No matching sessions found' : 'No active sessions'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                <FiAlertTriangle className="h-5 w-5" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Terminate sessions</h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to terminate {selectedSessions.length} selected session{selectedSessions.length !== 1 ? 's' : ''}? 
                    This will immediately disconnect the user{selectedSessions.length !== 1 ? 's' : ''}.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleKillSessions}
                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
              >
                Terminate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ActiveSessions;