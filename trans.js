async function toggleCardContent(card, sentences) {
   const heading = card.firstElementChild;
   const paragraph = card.lastElementChild;
  
   if (heading.textContent) {
   heading.textContent = '';
   paragraph.textContent = '';
   } else {
   const cardIndex = parseInt(card.id.split('-')[1]);
   heading.textContent = sentences[cardIndex];
  
   if (cardIndex + 1 < sentences.length) {
   try {
    const responseTranslate = await fetch('https://translation.googleapis.com/language/translate/v2?key=YOUR_API_KEY', { 
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ 
      q: sentences[cardIndex],
      source: 'SOURCE_LANGUAGE_CODE', // Replace with the source language code
      target: 'TARGET_LANGUAGE_CODE' // Replace with the target language code
     })
    });
    
    const translationData = await responseTranslate.json();
    const translatedText = translationData.data.translations[0].translatedText;
    
    paragraph.textContent = translatedText;
   } catch (error) {
    console.error('Error translating sentence:', error);
   }
   
   } else {
   paragraph.textContent = '';
   }
   }
  }