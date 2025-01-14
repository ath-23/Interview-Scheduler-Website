document.addEventListener("DOMContentLoaded", () => {
    const app = document.getElementById("app");
  
    // State
    const state = {
      linearQueue: [],
      priorityQueue: [],
      circularQueue: Array(5).fill([])
    };
  
    // Constants
    const maxLinearQueueSize = 50;
    const maxPriorityQueueSize = 50;
    const maxPanelQueueSize = 5;
  
    // Functions
    const render = () => {
      app.innerHTML = `
        <div class="container">
          ${renderInputForm()}
          <button onclick="moveAllToPriorityQueue()" class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded mt-4">Add All to Priority Queue</button>
          ${renderQueueTable("Linear Queue", state.linearQueue)}
          ${renderQueueTable("Priority Queue", state.priorityQueue)}
          <div class="flex justify-around mt-8 space-x-4">
            ${state.circularQueue.map((_, index) => renderPanel(index)).join("")}
          </div>
        </div>
      `;
    };
  
    const renderInputForm = () => `
      <form onsubmit="handleAddCandidate(event)" class="bg-blue-800 text-white p-4 rounded-lg shadow-md mb-6">
        <h2 class="text-2xl font-semibold text-center mb-4">Add Candidate</h2>
        <div class="flex flex-col gap-4">
          <input type="text" placeholder="Name" id="name" class="p-2 bg-blue-700 text-white rounded" required>
          <input type="number" placeholder="Age" id="age" class="p-2 bg-blue-700 text-white rounded" required>
          <input type="number" placeholder="Experience (Years)" id="experience" class="p-2 bg-blue-700 text-white rounded" required>
          <button type="submit" class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">Add Candidate</button>
        </div>
      </form>
    `;
  
    const renderQueueTable = (title, queue) => `
      <div class="p-4 bg-blue-900 text-white rounded-lg shadow-md">
        <h2 class="text-2xl font-semibold mb-4 text-center">${title}</h2>
        <table class="table-auto w-full text-center">
          <thead class="bg-blue-800">
            <tr>
              <th class="p-2">Index</th>
              <th class="p-2">Name</th>
              <th class="p-2">Age</th>
              <th class="p-2">Experience</th>
            </tr>
          </thead>
          <tbody class="bg-blue-700">
            ${queue.map((candidate, index) => `
              <tr class="hover:bg-blue-600">
                <td class="p-2">${index + 1}</td>
                <td class="p-2">${candidate.name}</td>
                <td class="p-2">${candidate.age}</td>
                <td class="p-2">${candidate.experience}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `;
  
    const renderPanel = (panelIndex) => `
      <div class="panel p-4 bg-blue-800 text-white rounded-lg shadow-md">
        <h3 class="text-xl font-bold text-blue-300">Panel ${panelIndex + 1}</h3>
        ${state.circularQueue[panelIndex].length > 0 ? `
          ${state.circularQueue[panelIndex].map((candidate, idx) => `
            <div class="mb-2 text-blue-200">
              <p>Name: ${candidate.name}</p>
              <p>Age: ${candidate.age}</p>
              <p>Experience: ${candidate.experience}</p>
              <p>Position in Queue: ${idx + 1}</p>
            </div>
          `).join("")}
          <button onclick="dequeueFromPanel(${panelIndex})" class="btn bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded mt-2">Dequeue</button>
        ` : `
          <p class="text-gray-400">No candidates assigned.</p>
        `}
        ${state.circularQueue[panelIndex].length < maxPanelQueueSize ? `
          <button onclick="assignToPanel(${panelIndex})" class="btn bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded mt-2">Assign Candidate</button>
        ` : ""}
      </div>
    `;
  
    // Event Handlers
    window.handleAddCandidate = (e) => {
      e.preventDefault();
      const name = document.getElementById("name").value;
      const age = document.getElementById("age").value;
      const experience = document.getElementById("experience").value;
      state.linearQueue.push({ name, age, experience });
      render();
    };
  
    window.moveAllToPriorityQueue = () => {
      const availableSpace = maxPriorityQueueSize - state.priorityQueue.length;
      if (availableSpace <= 0) {
        alert("Priority queue is full! Cannot add more candidates.");
        return;
      }
      const candidatesToMove = state.linearQueue.slice(0, availableSpace);
      state.priorityQueue = [...state.priorityQueue, ...candidatesToMove].sort((a, b) => b.experience - a.experience);
      state.linearQueue = state.linearQueue.slice(candidatesToMove.length);
      render();
    };
  
    window.assignToPanel = (panelIndex) => {
        if (state.priorityQueue.length === 0 || state.circularQueue[panelIndex].length >= maxPanelQueueSize) return;
        const candidate = state.priorityQueue.shift();
        if (confirm(`Verify documents for ${candidate.name}?`)) {
            state.circularQueue[panelIndex] = [...state.circularQueue[panelIndex], candidate];
        } else {
            state.priorityQueue.push(candidate);  // Add unverified candidate to the end of the priority queue
        }
        render();
    };
  
    window.dequeueFromPanel = (panelIndex) => {
      if (state.circularQueue[panelIndex].length === 0) return;
      const dequeuedCandidate = state.circularQueue[panelIndex].shift();
      alert(`${dequeuedCandidate.name} is dequeued from the queue and has gone for the interview.`);
      render();
    };
  
    render();
  });
  