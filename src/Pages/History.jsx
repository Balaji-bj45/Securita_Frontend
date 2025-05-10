import React, { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar';
import { FiSearch, FiDownload, FiFilter, FiClock, FiUser, FiHardDrive, FiExternalLink } from 'react-icons/fi';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

function History() {
  const [historyData, setHistoryData] = useState([]);
  const [filter, setFilter] = useState('');
  const [filtered, setFiltered] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'startTime', direction: 'desc' });
  const [selectedRows, setSelectedRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [timeRange, setTimeRange] = useState('all');

  useEffect(() => {
    // Simulate API fetch
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // In a real app, you would fetch from an API
        const dummyHistory = [
          {
            id: 1,
            username: 'guacadmin',
            startTime: '2025-04-29 15:28:45',
            endTime: '2025-04-29 15:29:20',
            duration: '34.7 seconds',
            connectionName: 'SQL Server Management Studio',
            remoteHost: '172.18.0.2',
            logsLink: '#',
            status: 'completed',
            protocol: 'RDP'
          },
          {
            id: 2,
            username: 'guacadmin',
            startTime: '2025-04-29 15:22:13',
            endTime: '2025-04-29 15:22:25',
            duration: '11.5 seconds',
            connectionName: 'DBSERVER',
            remoteHost: '172.18.0.2',
            logsLink: '#',
            status: 'failed',
            protocol: 'SSH'
          },
          {
            id: 3,
            username: 'devuser',
            startTime: '2025-04-28 10:15:00',
            endTime: '2025-04-28 11:45:30',
            duration: '1 hour 30 minutes',
            connectionName: 'Production Server',
            remoteHost: '192.168.1.100',
            logsLink: '#',
            status: 'completed',
            protocol: 'VNC'
          },
          {
            id: 4,
            username: 'testuser',
            startTime: '2025-04-27 09:30:00',
            endTime: '2025-04-27 10:00:00',
            duration: '30 minutes',
            connectionName: 'QA Environment',
            remoteHost: '192.168.1.101',
            logsLink: '#',
            status: 'completed',
            protocol: 'RDP'
          },
        ];
        
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
        
        setHistoryData(dummyHistory);
        setFiltered(dummyHistory);
      } catch (error) {
        console.error('Error fetching history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [activeTab, timeRange]);

  const handleSearch = () => {
    let results = [...historyData];
    
    // Apply text filter
    if (filter) {
      results = results.filter(record =>
        record.username.toLowerCase().includes(filter.toLowerCase()) ||
        record.connectionName.toLowerCase().includes(filter.toLowerCase()) ||
        record.remoteHost.includes(filter) ||
        record.protocol.toLowerCase().includes(filter.toLowerCase())
      );
    }
    
    // Apply status filter
    if (activeTab !== 'all') {
      results = results.filter(record => record.status === activeTab);
    }
    
    // Apply time range filter
    if (timeRange !== 'all') {
      const now = new Date();
      results = results.filter(record => {
        const recordDate = new Date(record.startTime);
        switch (timeRange) {
          case 'today':
            return recordDate.toDateString() === now.toDateString();
          case 'week':
            const oneWeekAgo = new Date(now);
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            return recordDate >= oneWeekAgo;
          case 'month':
            const oneMonthAgo = new Date(now);
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
            return recordDate >= oneMonthAgo;
          default:
            return true;
        }
      });
    }
    
    setFiltered(results);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sortedData = [...filtered].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'asc' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    setFiltered(sortedData);
  };

  const handleDownload = () => {
    const csvRows = [
      ['ID', 'Username', 'Start time', 'End time', 'Duration', 'Connection name', 'Remote host', 'Status', 'Protocol'],
      ...filtered.map(r => [
        r.id,
        r.username,
        r.startTime,
        r.endTime,
        r.duration,
        r.connectionName,
        r.remoteHost,
        r.status,
        r.protocol
      ])
    ];
    const csv = csvRows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'session_history.csv';
    a.click();
  };

  const handleRowSelect = (id) => {
    setSelectedRows(prev => 
      prev.includes(id) 
        ? prev.filter(rowId => rowId !== id) 
        : [...prev, id]
    );
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort className="ml-1 opacity-30" />;
    return sortConfig.direction === 'asc' 
      ? <FaSortUp className="ml-1" /> 
      : <FaSortDown className="ml-1" />;
  };

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return date.toLocaleString();
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      interrupted: 'bg-yellow-100 text-yellow-800'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Connection History</h1>
          <p className="text-gray-600">
            View and analyze past connection sessions. Filter, sort, and export data as needed.
          </p>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by username, connection, IP, or protocol..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <button 
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              <FiSearch /> Search
            </button>
            <button 
              onClick={handleDownload}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center justify-center gap-2 border border-gray-300"
            >
              <FiDownload /> Export
            </button>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <FiFilter className="text-gray-500" />
              <span className="text-sm text-gray-600">Status:</span>
              <div className="flex space-x-1">
                {['all', 'completed', 'failed'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1 text-sm rounded-full ${activeTab === tab ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <FiClock className="text-gray-500" />
              <span className="text-sm text-gray-600">Time range:</span>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 days</option>
                <option value="month">Last 30 days</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
            <div className="text-gray-500 text-sm">Total Sessions</div>
            <div className="text-2xl font-bold">{filtered.length}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
            <div className="text-gray-500 text-sm">Completed</div>
            <div className="text-2xl font-bold">
              {filtered.filter(r => r.status === 'completed').length}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-red-500">
            <div className="text-gray-500 text-sm">Failed</div>
            <div className="text-2xl font-bold">
              {filtered.filter(r => r.status === 'failed').length}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-purple-500">
            <div className="text-gray-500 text-sm">Unique Users</div>
            <div className="text-2xl font-bold">
              {[...new Set(filtered.map(r => r.username))].length}
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-8 flex justify-center items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          className="h-4 w-4 text-blue-600 rounded"
                          checked={selectedRows.length === filtered.length && filtered.length > 0}
                          onChange={() => {
                            if (selectedRows.length === filtered.length) {
                              setSelectedRows([]);
                            } else {
                              setSelectedRows(filtered.map(r => r.id));
                            }
                          }}
                        />
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('username')}
                    >
                      <div className="flex items-center">
                        <FiUser className="mr-1" /> User
                        {getSortIcon('username')}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('startTime')}
                    >
                      <div className="flex items-center">
                        Start Time
                        {getSortIcon('startTime')}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('connectionName')}
                    >
                      <div className="flex items-center">
                        <FiHardDrive className="mr-1" /> Connection
                        {getSortIcon('connectionName')}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Remote Host
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Protocol
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filtered.length > 0 ? (
                    filtered.map(record => (
                      <tr key={record.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input 
                            type="checkbox" 
                            className="h-4 w-4 text-blue-600 rounded"
                            checked={selectedRows.includes(record.id)}
                            onChange={() => handleRowSelect(record.id)}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{record.username}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatDateTime(record.startTime)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{record.duration}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{record.connectionName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{record.remoteHost}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                            {record.protocol}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(record.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <a 
                            href={record.logsLink} 
                            className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                          >
                            <FiExternalLink /> Details
                          </a>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="px-6 py-4 text-center text-gray-500">
                        No history records found matching your criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination (would be functional with real API) */}
        {filtered.length > 0 && (
          <div className="mt-4 flex items-center justify-between bg-white px-4 py-3 rounded-lg shadow-sm">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">{Math.min(10, filtered.length)}</span> of{' '}
                  <span className="font-medium">{filtered.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <a
                    href="#"
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Previous</span>
                    &larr;
                  </a>
                  <a
                    href="#"
                    aria-current="page"
                    className="z-10 bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                  >
                    1
                  </a>
                  <a
                    href="#"
                    className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                  >
                    2
                  </a>
                  <a
                    href="#"
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Next</span>
                    &rarr;
                  </a>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default History;