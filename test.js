const request = indexedDB.open('sentencesDB', 1);

request.onupgradeneeded = (event) => {
  const db = event.target.result;
  db.createObjectStore('sentences', { keyPath: 'id', autoIncrement: true });
};

request.onsuccess = (event) => {
  db = event.target.result;
  displaySolution();
};

request.onerror = (event) => {
  console.error('Error creating database:', event.target.errorCode);
};

function displaySolution() {
  const transaction = db.transaction('sentences', 'readonly');
  const sentencesStore = transaction.objectStore('sentences');
  const solutionRequest = sentencesStore.get(1);

  solutionRequest.onsuccess = (event) => {
    const solution = event.target.result;
    if (solution) {
      paragraph.textContent = solution.solution;
    } else {
      paragraph.textContent = '';
    }
  };

  solutionRequest.onerror = (event) => {
    console.error('Error reading solution from database:', event.target.errorCode);
  };
}

function removeData() {
  const transaction = db.transaction('sentences', 'readwrite');
  const sentencesStore = transaction.objectStore('sentences');
  sentencesStore.clear();

  transaction.oncomplete = () => {
    console.log('Data removed from database successfully');
  };

  transaction.onerror = (event) => {
    console.error('Error removing data from database:', event.target.errorCode);
  };
}