import { useEffect, useState } from 'react'

interface Ilist {
  description: string
  location: string
  startedAt: Date | null
  finishedAt: Date | null
}

const date = new Date()

const fakeData: Ilist[] = [
  { startedAt: date, finishedAt: date, description: "Meeting with client", location: "Conference Room A" },
  { startedAt: date, finishedAt: null, description: "Code review", location: "Home Office" }
]

const getStoredTasks = (): Ilist[] => {
  if (!localStorage.list) return fakeData;
  
  try {
    const storedData = JSON.parse(localStorage.list);
    return storedData.map((item: Ilist) => ({
      ...item,
      startedAt: item.startedAt ? new Date(item.startedAt) : null,
      finishedAt: item.finishedAt ? new Date(item.finishedAt) : null
    }));
  } catch (error) {
    console.error('Error parsing stored data:', error);
    return fakeData;
  }
};

const defaultTasks: Ilist[] = getStoredTasks();

function App() {
  const [list, setList] = useState<Ilist[]>(defaultTasks)

  useEffect(()=>{
    localStorage.setItem('list', JSON.stringify(list));
  },
  [list])

  const formatDate = (date: Date | null): string => {
    if (!date) return '-'
    
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    
    return `${hours}:${minutes}`
  }

  function startNewActivity() {
    const startedAt = new Date()
    const newActivity = { startedAt, finishedAt: null, description: "", location: "" }
    setList(prevList => [...prevList, newActivity])
  }

  function updateLocation(index: number, value: string) {
    setList(prevList => 
      prevList.map((item, i) => 
        i === index ? { ...item, location: value } : item
      )
    )
  }

  function updateDescription(index: number, value: string) {
    setList(prevList => 
      prevList.map((item, i) => 
        i === index ? { ...item, description: value } : item
      )
    )
  }

  function stopActivity(index: number) {
    setList(prevList => 
      prevList.map((item, i) => 
        i === index ? { ...item, finishedAt: new Date() } : item
      )
    )
  }

  const calculateDuration = (start: Date | null, end: Date | null): string => {
  if (!start || !end) return '-';
  
  const durationMs = end.getTime() - start.getTime();
  const durationMinutes = Math.round(durationMs / 60000);
  
  return `${durationMinutes} min`;
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              Activity Tracker
            </h2>
            <p className="text-gray-600 mt-1">Manage your daily activities</p>
          </div>
          <button
            onClick={startNewActivity}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 flex items-center space-x-2"
          >
            <span>+</span>
            <span>Start New Activity</span>
          </button>

          <button
            onClick={() => setList([])}
            className="bg-red-500 p-4 rounded-2xl font-bold  hover:bg-red-600 text-black shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <span>Clear activities</span>
          </button>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Started At
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Finished At
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Duration
                  </th>
                  <th>
                    Text
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {list.map((item, i) => (
                  <tr
                    key={i}
                    className={`transition-colors duration-150 ${
                      item.finishedAt
                        ? 'bg-green-50 hover:bg-green-100'
                        : 'bg-white hover:bg-gray-50'
                    }`}
                  >
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        value={item.location}
                        onChange={(e) => updateLocation(i, e.target.value)}
                        onBlur={(e) => updateLocation(i, e.target.value)}
                        onKeyUp={(e) => {
                          const input = e.target as HTMLInputElement; // 👈 type assertion
                          setTimeout(() => {
                            const pos = input.selectionStart ?? 0;
                            input.setSelectionRange(pos, pos);
                          }, 0);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter location..."
                      />
                    </td>
                    <td>
                      <textarea
                        onChange={(e) => updateDescription(i, e.target.value)}
                        placeholder="Enter description..."
                        className="overflow-scroll px-2 border border-gray-300 rounded-md"
                      >
                        {item.description}
                      </textarea>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => stopActivity(i)}
                        disabled={!!item.finishedAt}
                        className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                          item.finishedAt
                            ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                            : 'bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                        }`}
                      >
                        {item.finishedAt ? 'Completed' : 'Stop Activity'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        {formatDate(item.startedAt)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`text-sm font-medium ${
                          item.finishedAt ? 'text-green-600' : 'text-gray-400'
                        }`}
                      >
                        {formatDate(item.finishedAt)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`text-sm font-medium ${
                          item.finishedAt ? 'text-green-600' : 'text-gray-400'
                        }`}
                      >
                        {calculateDuration(item.startedAt, item.finishedAt)}
                      </span>
                    </td>
                    <td>
                      <span>{item.description}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {list.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-600">
                No activities yet
              </h3>
              <p className="text-gray-500 mt-1">
                Start your first activity to begin tracking!
              </p>
            </div>
          )}
        </div>

        {/* Stats Footer */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-md">
            <div className="text-2xl font-bold text-blue-600">
              {list.length}
            </div>
            <div className="text-sm text-gray-600">Total Activities</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-md">
            <div className="text-2xl font-bold text-green-600">
              {list.filter((item) => item.finishedAt).length}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-md">
            <div className="text-2xl font-bold text-orange-600">
              {list.filter((item) => !item.finishedAt).length}
            </div>
            <div className="text-sm text-gray-600">In Progress</div>
          </div>
        </div>

        {/* Pre resume */}
        <div className="bg-black my-4 rounded-2xl p-4">
          <pre className="bg-black text-white overflow-scroll">
            {JSON.stringify(list, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default App