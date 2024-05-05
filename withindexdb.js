let db;

// Create or open the database
const request = indexedDB.open('myDatabase', 1);

request.onupgradeneeded = (event) => {
  db = event.target.result;
  const sentencesStore = db.createObjectStore('sentences', { keyPath: 'id' });
  sentencesStore.createIndex('sentence', 'sentence', { unique: false });

  const solutionsStore = db.createObjectStore('solutions', { keyPath: 'id' });
  solutionsStore.createIndex('solution', 'solution', { unique: false });
};

request.onsuccess = (event) => {
  db = event.target.result;
  console.log('Database opened successfully');
};

request.onerror = (event) => {
  console.error('Error opening database:', event.target.errorCode);
};


document.getElementById('txtbtn').addEventListener('submit', (event) => {
   event.preventDefault();
 
   const t1 = document.getElementById('t1').value;
   const t2 = document.getElementById('t2').value;
   const t3 = document.getElementById('t3').value;
   const sentences = [t1, t2];
   const solution = [t3];
 
   // Add sentences to the database
   const transaction = db.transaction('sentences', 'readwrite');
   const sentencesStore = transaction.objectStore('sentences');
 
   sentences.forEach((sentence, index) => {
     sentencesStore.add({ id: index, sentence: sentence });
   });
 
   // Add solutions to the database
   const solutionsStore = transaction.objectStore('solutions');
   solution.forEach((solution, index) => {
     solutionsStore.add({ id: index, solution: solution });
   });
 
   transaction.oncomplete = () => {
     console.log('Data added to database successfully');
   };
 
   transaction.onerror = (event) => {
     console.error('Error adding data to database:', event.target.errorCode);
   };
 });
 
async function displ() {
   try {
     const transaction = db.transaction('sentences', 'readonly');
     const sentencesStore = transaction.objectStore('sentences');
     const sentencesRequest = sentencesStore.getAll();
 
     sentencesRequest.onsuccess = (event) => {
       const sentences = event.target.result;
       // Process the sentences data
       displayCards(sentences);
     };
 
     sentencesRequest.onerror = (event) => {
       console.error('Error reading sentences from database:', event.target.errorCode);
     };
   } catch (error) {
     console.error('Error reading file:', error);
   }
 }
 
 function displayCards(sentences) {
   // Your code to display the cards goes here
   // You can access the sentences data using sentences[i].sentence
 }
 

async function toggleCardContent(card, sentences) {
   const heading = card.firstElementChild;
   const paragraph = card.lastElementChild;
   const cardIndex = parseInt(card.id.split('-')[1]);
 
   heading.textContent = sentences[cardIndex].sentence;
 
   try {
     const transaction = db.transaction('solutions', 'readonly');
     const solutionsStore = transaction.objectStore('solutions');
     const solutionRequest = solutionsStore.get(cardIndex);
 
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
   } catch (error) {
     console.error('Error reading file:', error);
   }
 }
 

function remove() {
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
 