// Database operations
const dbPromise = new Promise((resolve, reject) => {
   const request = window.indexedDB.open('myDatabase', 1);
 
   request.onupgradeneeded = (event) => {
     const db = event.target.result;
     const sentencesStore = db.createObjectStore('sentences', { keyPath: 'id', autoIncrement: true });
     sentencesStore.createIndex('sentence', 'sentence', { unique: true });
     const solutionsStore = db.createObjectStore('solutions', { keyPath: 'id', autoIncrement: true });
     solutionsStore.createIndex('solution', 'solution', { unique: true });
   };
 
   request.onsuccess = (event) => {
     resolve(event.target.result);
   };
 
   request.onerror = (event) => {
     reject(event.target.errorCode);
   };
 });
 
 async function addData(sentences, solutions) {
   const db = await dbPromise;
   const transaction = db.transaction(['sentences', 'solutions'], 'readwrite');
   const sentencesStore = transaction.objectStore('sentences');
   const solutionsStore = transaction.objectStore('solutions');
 
   sentences.forEach((sentence) => {
     sentencesStore.add({ sentence });
   });
 
   solutions.forEach((solution) => {
     solutionsStore.add({ solution });
   });
 
   await new Promise((resolve, reject) => {
     transaction.oncomplete = resolve;
     transaction.onerror = reject;
   });
 }
 
 async function getData() {
   const db = await dbPromise;
   const transaction = db.transaction(['sentences', 'solutions'], 'readonly');
   const sentencesStore = transaction.objectStore('sentences');
   const solutionsStore = transaction.objectStore('solutions');
 
   const sentences = await new Promise((resolve, reject) => {
     const request = sentencesStore.getAll();
     request.onsuccess = () => resolve(request.result);
     request.onerror = reject;
   });
 
   const solutions = await new Promise((resolve, reject) => {
     const request = solutionsStore.getAll();
     request.onsuccess = () => resolve(request.result);
     request.onerror = reject;
   });
 
   return { sentences, solutions };
 }
 
 // DOM manipulation and event handling
 const cardHolder = document.getElementById('card-holder');
 const showMoreButton = document.createElement('button');
 showMoreButton.textContent = 'Show More';
 showMoreButton.setAttribute('id', 'showmore');
 showMoreButton.setAttribute('class', 'btn-primary');
 
 const showMoreLimit = 8;
 let totalCardsDisplayed = 0;
 
 function createCard(sentence, solution) {
   const card = document.createElement('div');
   card.classList.add('card', 'bi', 'bi-hand-index-fill');
   card.id = `card-${totalCardsDisplayed}`;
 
   const heading = document.createElement('h2');
   heading.textContent = sentence;
 
   const paragraph = document.createElement('p');
   paragraph.textContent = solution || '';
 
   card.appendChild(heading);
   card.appendChild(paragraph);
 
   totalCardsDisplayed++;
 
   return card;
 }
 
 function displayCards(sentences, solutions) {
   const fragment = document.createDocumentFragment();
 
   for (let i = 0; i < showMoreLimit && i < sentences.length; i++) {
     const card = createCard(sentences[i].sentence, solutions[i]?.solution);
     fragment.appendChild(card);
   }
 
   cardHolder.appendChild(fragment);
 
   if (sentences.length > showMoreLimit) {
     showMoreButton.addEventListener('click', () => showMoreCards(sentences, solutions));
     cardHolder.appendChild(showMoreButton);
   }
 }
 
 function showMoreCards(sentences, solutions) {
   const fragment = document.createDocumentFragment();
   const cardsToShow = totalCardsDisplayed + showMoreLimit;
 
   for (let i = totalCardsDisplayed; i < cardsToShow && i < sentences.length; i++) {
     const card = createCard(sentences[i].sentence, solutions[i]?.solution);
     fragment.appendChild(card);
   }
 
   cardHolder.appendChild(fragment);
 
   if (totalCardsDisplayed >= sentences.length) {
     showMoreButton.removeEventListener('click', showMoreCards);
     showMoreButton.classList.add('deactivated');
   }
 }
 
 // Event listener for form submission
 document.getElementById('txtbtn').addEventListener('submit', async (event) => {
   event.preventDefault();
   const t1 = document.getElementById('t1').value;
   const t2 = document.getElementById('t2').value;
   const t3 = document.getElementById('t3').value;
   const sentences = [t1, t2];
   const solutions = [t3];
 
   try {
     await addData(sentences, solutions);
     console.log('Data added to database successfully');
     const { sentences: storedSentences, solutions: storedSolutions } = await getData();
     displayCards(storedSentences, storedSolutions);
   } catch (error) {
     console.error('Error adding data to database:', error);
   }
 });
 
 // Initial data display
 getData().then(({ sentences, solutions }) => {
   displayCards(sentences, solutions);
 }).catch((error) => {
   console.error('Error reading data from database:', error);
 });
 