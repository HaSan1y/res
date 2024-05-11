
if (true == false) {
  const cards = document.querySelectorAll('[id^="card-"]');
  // [id^="card-"]
  // [id$="-\\d"]
  console.log(cards.children);
}
const cardHolder = document.getElementById('card-holder');

const request = window.indexedDB.open('myDatabase', 1);
request.onerror = (request) => {
  console.error('Error opening database:', request.errorCode);
};
request.onsuccess = (event) => {
  // db = DBOpenRequest.result;
  db = event.target.result;

  // event.target.parentNode.parentNode.removeChild(event.target.parentNode);
  // note.innerHTML += `<li> "${dataTask}" Database opened successfully.</li>`
  // note.appendChild(createListItem('App initialised.'));
  console.log('Database opened successfully');
  display();
};
request.onupgradeneeded = (event) => {
  const db = event.target.result;
  const sentencesStore = db.createObjectStore('sentences', { keyPath: 'id', autoIncrement: true });
  sentencesStore.createIndex('sentence', 'sentence', { unique: true });
  const solutionsStore = db.createObjectStore('solutions', { keyPath: 'id', autoIncrement: true });
  // creates outertable
  solutionsStore.createIndex('solution', 'solution', { unique: true });
// create inner table 
// console.log('4Databases created successfully');

  // const idStore = db.createObjectStore('ids', { keyPath: 'store' });
  // idStore.put({ store: 'sentences', id: 0 });
  // idStore.put({ store: 'solutions', id: 0 });
};


document.getElementById('txtbtn').addEventListener('submit', (event) => {
  event.preventDefault();
  const t1 = document.getElementById('t1').value;
  const t2 = document.getElementById('t2').value;
  const t3 = document.getElementById('t3').value;
  const sentences = [t1, t2];
  const solutions = [t3];
  // sentencesStore.put({ id: sentencesStore.indexNames.length, sentence: sentences[1] });
  const transaction = db.transaction(['sentences', 'solutions'], 'readwrite');
  const sentencesStore = transaction.objectStore('sentences');
  const solutionsStore = transaction.objectStore('solutions');
  sentences.forEach((sentence) => {
    sentencesStore.add({ sentence: sentence });
  });
  solutions.forEach((solution) => {
    solutionsStore.put({ solution: solutions[0] });
  });
  transaction.onsuccess = () => {
    console.log(`Data added to ${sentences}, ${solutions} store successfully`);
  };

  transaction.onerror = (event) => {
    console.error(`Error reading Data: ${sentences}, ${solutions} store:`, event.target.error);
  };
  location.reload();
});

async function display() {
      // First clear the content of the task list so that you don't get a huge long list of duplicate stuff each time
    // the display is updated.
    // while (taskList.firstChild) {
    //   taskList.removeChild(taskList.lastChild);
    // }

    const sentencesStore = db.transaction('sentences', 'readonly').objectStore('sentences');
    const sentencesRequest = sentencesStore.getAll();
    sentencesRequest.onsuccess = (event) => {
      // const cursor = event.target.result;
      const sentences = event.target.result;

      // Check if there are no (more) cursor items to iterate through
      // if (!cursor) {
      //   No more items to iterate through, we quit.
      // note.appendChild(createListItem('Entries all displayed.'));
      //   return;
      // }

        transaction = db.transaction('solutions', 'readonly');
        const solutionsStore = transaction.objectStore('solutions');
        const solutionsRequest = solutionsStore.getAll();
        solutionsRequest.onsuccess = (event) => {
          const solutions = event.target.result;
          console.log(solutions);
          console.log(sentences);
          displayCards(sentences, solutions);
        };
        solutionsRequest.onerror = (event) => {
          console.error('Error reading solution from database:', event.target.errorCode);
        };

    };
    sentencesStore.onerror = (event) => {
      console.error('Error reading sentences from database:', event.target.errorCode);
    };

}
// function display() {
//   const transaction = db.transaction('sentences', 'readonly');
//   const sentencesStore = transaction.objectStore('sentences');
//   const request = sentencesStore.openCursor();
//   request.onsuccess = (event) => {
//     const cursor = event.target.result;
//     if (cursor) {
//       const card = document.createElement('div');
//       card.classList.add('card');
//       card.innerHTML = `
//         <div class="card-body">
//           <h5 class="card-title">${cursor.value.sentence}</h5>
//           <p class="card-text">Solution goes here</p>
//           <button class="btn btn-primary">Edit</button>
//           <button class="btn btn-danger">Delete</button>
//         </div>
//       `;
//       cardHolder.appendChild(card);
//       cursor.continue();
//     }
//   };
// }
function displayCards(sen, sol) {
  let showmore = 6; // Initial number of cards to display
  let totalCards = sol.length; // 0Keep track of the total number of cards displayed
  if (totalCards + 10 < showmore) {//+10 never
    const showMoreButton = document.getElementById('showmore') || document.createElement('button');
    showMoreButton.textContent = 'Show More';
    showMoreButton.setAttribute('id', 'showmore');
    showMoreButton.setAttribute('class', 'btn-primary');
    showMoreButton.addEventListener('click', () => {
      showMoreCards(showMoreButton, sen, sol);
    });
    show.appendChild(showMoreButton);
  }
  for (let i = 0; i < sen.length && totalCards < showmore; i++) {
    const card = document.createElement('div');
    card.classList.add('card', 'bi', 'bi-hand-index-fill');
    card.id = `card-${i / 2}`;
    const heading = document.createElement('h2');
    heading.textContent = sen[i].sentence;
    const paragraph = document.createElement('p');
    if (i + 1 < sen.length) {
      paragraph.textContent = sen[i + 1].sentence;
      i++;
    }
    card.addEventListener('click', () => {
      toggleCardContent(card);
    });
    card.appendChild(heading);
    card.appendChild(paragraph);
    cardHolder.appendChild(card);
    totalCards++;
  }
}

async function toggleCardContent(card) {
  const [heading, paragraph] = [card.firstElementChild, card.lastElementChild];
  const cardIndex = parseInt(card.id.split('-')[1]);
  try {
    const dbTransaction = db.transaction('solutions', 'readonly');
    const solutionsStore = dbTransaction.objectStore('solutions');
    const solutionRequest = solutionsStore.get(cardIndex + 1);
    solutionRequest.onsuccess = ({ target: { result: solution } }) => {
      paragraph.textContent = solution ? solution.solution : '';
    };
    solutionRequest.onerror = ({ target: { errorCode } }) => {
      console.error(`Error reading solution from database: ${errorCode}`);
    };
  } catch (error) {
    console.error('Error reading file:', error);
  }
}

function createCard(sentences, index, displayviashowmore) {
  const card = document.createElement('div');
  card.classList.add('card', 'bi', 'bi-hand-index-fill');
  card.id = `card-${index}`;
  const heading = document.createElement('h2');
  if (!displayviashowmore) {
    heading.textContent = sentences[index];
  }
  const paragraph = document.createElement('p');
  if (index + 1 < sentences.length) {
    let k;
    if (!displayviashowmore) { k = 1 } else { k = 0; }
    paragraph.textContent = sentences[index + k];
  }
  card.addEventListener('click', () => {
    toggleCardContent(card);
  });
  card.appendChild(heading);
  card.appendChild(paragraph);
  displayviashowmore = false;

  return card;
}
// wipeData indexdb called via button onclick="wipeData()"
function wipeData() {
  const removeDataFromStore = (storeName) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);

    const clearRequest = store.clear();

    clearRequest.onsuccess = () => {
      console.log(`Data removed from ${storeName} store successfully`);
    };

    clearRequest.onerror = (event) => {
      console.error(`Error removing data from ${storeName} store:`, event.target.error);
    };
  };
  removeDataFromStore('sentences');
  removeDataFromStore('solutions');

  const idStore = db.transaction('ids', 'readwrite').objectStore('ids');
  idStore.put({ store: 'sentences', id: 0 });
  idStore.put({ store: 'solutions', id: 0 });
  document.querySelectorAll('#card').forEach(card => card.remove());

}
// showmore cards if indexdb is overloaded than page displays
function showMoreCards(showMoreBtn, sentences, solutions) {
  const totalCards = document.querySelectorAll('.card').length;
  console.log(solutions);

  const cardsToShow = solutions.length + 1;
  for (let i = totalCards; i < cardsToShow; i++) {
    const displayviashowmore = true;
    const card = createCard(sentences, i, displayviashowmore);
    cardHolder.appendChild(card);
    if (i + 1 < sentences.length) {
      i++; // Increment i to skip the next sentence
    }
  }
  toggleButton(showMoreBtn, cardsToShow, sentences.length);
}

function toggleButton(showMoreBtn, cardsToShow, sentencesLength) {
  if (cardsToShow >= sentencesLength) {
    showMoreBtn.classList.add('deactivated');
    showMoreBtn.disabled = true;
  } else {
    showMoreBtn.classList.remove('deactivated');
    showMoreBtn.disabled = false;
  }
}
// im unable to set ids from indexdb to 0 after a wipe
// somehow im unable select simple #card-*, logout all '#card-*' created with js 
