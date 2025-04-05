import React, { useState, useEffect } from 'react';

const FeministMemoryGame = () => {
  const [level, setLevel] = useState(1);
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [currentPair, setCurrentPair] = useState(null);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [collectedIcons, setCollectedIcons] = useState([]);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [loadingGame, setLoadingGame] = useState(true);
  
  // Game configuration per level
  const levelConfig = {
    1: { pairs: 10, rows: 5, cols: 4 },
    2: { pairs: 4, rows: 2, cols: 4 },
    3: { pairs: 6, rows: 3, cols: 4 },
    4: { pairs: 8, rows: 4, cols: 4 },
    5: { pairs: 10, rows: 4, cols: 5 }
  };
  
  // Feminist icons data for Level 1 as specified
  const feministIcons = [
    { id: 1, name: "Simone de Beauvoir", image: "simone", info: "Philosopher who wrote 'The Second Sex'" },
    { id: 2, name: "Frida Kahlo", image: "frida", info: "Mexican painter known for her self-portraits" },
    { id: 3, name: "Malala Yousafzai", image: "malala", info: "Nobel Prize laureate and education activist" },
    { id: 4, name: "Audre Lorde", image: "audre", info: "Writer and civil rights activist" },
    { id: 5, name: "Judith Butler", image: "judith", info: "Philosopher and gender theorist" },
    { id: 6, name: "Angela Davis", image: "angela", info: "Political activist, philosopher, and author" },
    { id: 7, name: "Ada Lovelace", image: "ada", info: "Mathematician and first computer programmer" },
    { id: 8, name: "bell hooks", image: "bell", info: "Author and social activist focusing on race, capitalism, and gender" },
    { id: 9, name: "Donna Haraway", image: "donna", info: "Scholar of science and technology studies" },
    { id: 10, name: "Virginia Woolf", image: "virginia", info: "Modernist writer and feminist" },
    { id: 11, name: "Ruth Bader Ginsburg", image: "rbg", info: "US Supreme Court Justice and gender equality advocate" },
    { id: 12, name: "Gloria Steinem", image: "gloria", info: "Journalist and political activist" },
    { id: 13, name: "Wangari Maathai", image: "wangari", info: "Environmentalist and Nobel Peace Prize winner" },
    { id: 14, name: "Chimamanda Ngozi Adichie", image: "chimamanda", info: "Writer and speaker on feminism" },
    { id: 15, name: "Marie Curie", image: "marie", info: "Physicist and chemist who conducted pioneering research on radioactivity" }
  ];
  
  // Level rewards - icon that will be added to hall of fame after completing a level
  const levelRewards = [
    { name: "Maya Angelou", image: "maya" },
    { name: "Eleanor Roosevelt", image: "eleanor" },
    { name: "Virginia Woolf", image: "virginia" },
    { name: "Harriet Tubman", image: "harriet" },
    { name: "Betty Friedan", image: "betty" }
  ];
  
  // Initialize game
  useEffect(() => {
    initializeLevel(level);
  }, [level]);
  
  const initializeLevel = (lvl) => {
    setLoadingGame(true);
    
    // Get configuration for current level
    const config = levelConfig[lvl];
    
    // Select random icons for this level
    const shuffledIcons = [...feministIcons].sort(() => 0.5 - Math.random());
    const selectedIcons = shuffledIcons.slice(0, config.pairs);
    
    // Create pairs of cards - one with name, one with picture
    let cardPairs = [];
    selectedIcons.forEach(icon => {
      // Create a name card and a picture card for each icon (a pair)
      cardPairs.push(
        { id: `${icon.id}-name`, iconId: icon.id, name: icon.name, image: icon.image, info: icon.info, flipped: false, matched: false, type: 'name' },
        { id: `${icon.id}-pic`, iconId: icon.id, name: icon.name, image: icon.image, info: icon.info, flipped: false, matched: false, type: 'picture' }
      );
    });
    
    // Shuffle cards
    const shuffledCards = [...cardPairs].sort(() => 0.5 - Math.random());
    
    setCards(shuffledCards);
    setFlippedIndices([]);
    setMatchedPairs([]);
    setShowInfoModal(false);
    setCurrentPair(null);
    setShowRewardModal(false);
    setLoadingGame(false);
  };
  
  // Handle card click
  const handleCardClick = (index) => {
    // Don't allow clicks if:
    // - Already two cards flipped and checking for a match
    // - Card is already flipped or matched
    // - Loading state is active
    if (
      flippedIndices.length === 2 || 
      cards[index].flipped || 
      cards[index].matched ||
      loadingGame
    ) {
      return;
    }
    
    // Flip the card
    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);
    
    // Add to flipped indices
    const newFlippedIndices = [...flippedIndices, index];
    setFlippedIndices(newFlippedIndices);
    
    // If we have flipped two cards, check for a match
    if (newFlippedIndices.length === 2) {
      const firstCardIndex = newFlippedIndices[0];
      const secondCardIndex = newFlippedIndices[1];
      
      if (cards[firstCardIndex].iconId === cards[secondCardIndex].iconId) {
        // It's a match!
        setTimeout(() => {
          const matchedCards = [...cards];
          matchedCards[firstCardIndex].matched = true;
          matchedCards[secondCardIndex].matched = true;
          setCards(matchedCards);
          
          const newMatchedPairs = [...matchedPairs, cards[firstCardIndex].iconId];
          setMatchedPairs(newMatchedPairs);
          
          // Show info modal about the matched pair
          setCurrentPair(cards[firstCardIndex]);
          setShowInfoModal(true);
          
          // Reset flipped indices
          setFlippedIndices([]);
          
          // Check if level is complete
          if (newMatchedPairs.length === levelConfig[level].pairs) {
            setTimeout(() => {
              setShowRewardModal(true);
              
              // Add reward to collection
              setCollectedIcons([...collectedIcons, levelRewards[level - 1]]);
              
              // Check if game is completely finished
              if (level === 5) {
                setGameCompleted(true);
              }
            }, 1000);
          }
        }, 500);
      } else {
        // Not a match, flip cards back
        setTimeout(() => {
          const unflippedCards = [...cards];
          unflippedCards[firstCardIndex].flipped = false;
          unflippedCards[secondCardIndex].flipped = false;
          setCards(unflippedCards);
          setFlippedIndices([]);
        }, 1000);
      }
    }
  };
  
  // Go to next level
  const goToNextLevel = () => {
    setShowRewardModal(false);
    setLevel(level + 1);
  };
  
  // Restart the game
  const restartGame = () => {
    setLevel(1);
    setCollectedIcons([]);
    setGameCompleted(false);
    setShowRewardModal(false);
  };
  
  // Create placeholder image URL for each card
  const getImageUrl = (name) => {
    return `/api/placeholder/100/100?text=${name}`;
  };
  
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-purple-50 min-h-screen">
      <h1 className="text-3xl font-bold text-purple-800 mb-4">Feminist Icons Memory Game</h1>
      
      {!gameCompleted ? (
        <>
          <div className="mb-4 flex items-center justify-between w-full max-w-4xl">
            <div className="text-xl font-semibold text-purple-600">Level {level}</div>
            <div className="text-lg text-purple-600">
              Pairs Found: {matchedPairs.length} / {levelConfig[level].pairs}
            </div>
          </div>
          
          {/* Game board */}
          <div 
            className="grid gap-4 p-4 bg-white rounded-lg shadow-lg w-full max-w-4xl"
            style={{ 
              gridTemplateRows: `repeat(${levelConfig[level].rows}, minmax(0, 1fr))`,
              gridTemplateColumns: `repeat(${levelConfig[level].cols}, minmax(0, 1fr))`
            }}
          >
            {cards.map((card, index) => (
              <div 
                key={card.id}
                className={`
                  relative h-24 w-full cursor-pointer transform transition-transform 
                  ${card.flipped ? 'rotate-y-180' : ''} 
                  ${card.matched ? 'opacity-70' : ''}
                `}
                onClick={() => handleCardClick(index)}
              >
                <div className={`
                  absolute inset-0 rounded-lg shadow-md flex items-center justify-center
                  ${card.flipped || card.matched ? 'hidden' : 'bg-purple-500'}
                `}>
                  <span className="text-white text-4xl">?</span>
                </div>
                
                <div className={`
                  absolute inset-0 rounded-lg shadow-md bg-white
                  ${card.flipped || card.matched ? '' : 'hidden'}
                `}>
                  {card.type === 'name' ? (
                    <div className="h-full w-full flex items-center justify-center p-2">
                      <div className="text-base font-medium text-purple-800 text-center">
                        {card.name}
                      </div>
                    </div>
                  ) : (
                    <div className="h-full w-full flex items-center justify-center p-2">
                      <img 
                        src={getImageUrl(card.name)} 
                        alt={card.name}
                        className="h-16 w-16 object-cover rounded-full"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        // Victory screen
        <div className="text-center p-8 bg-white rounded-lg shadow-lg w-full max-w-4xl">
          <h2 className="text-3xl font-bold text-purple-800 mb-4">🎉 Congratulations! 🎉</h2>
          <p className="text-xl text-purple-600 mb-6">You've completed all levels and abolished the patriarchy!</p>
          <button 
            className="px-6 py-3 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition-colors"
            onClick={restartGame}
          >
            Play Again
          </button>
        </div>
      )}
      
      {/* Hall of Fame */}
      {collectedIcons.length > 0 && (
        <div className="mt-8 w-full max-w-4xl">
          <h2 className="text-2xl font-bold text-purple-800 mb-4">Hall of Fame</h2>
          <div className="flex flex-wrap gap-4 p-4 bg-white rounded-lg shadow-lg">
            {collectedIcons.map((icon, index) => (
              <div key={index} className="flex flex-col items-center">
                <img 
                  src={getImageUrl(icon.name)} 
                  alt={icon.name}
                  className="h-20 w-20 object-cover rounded-full border-4 border-purple-300"
                />
                <div className="text-sm text-center mt-2 font-medium text-purple-800">
                  {icon.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Info Modal */}
      {showInfoModal && currentPair && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-purple-800 mb-2">{currentPair.name}</h3>
            <div className="flex items-center mb-4">
              <img 
                src={getImageUrl(currentPair.name)} 
                alt={currentPair.name}
                className="h-24 w-24 object-cover rounded-full mr-4"
              />
              <p className="text-gray-700">{currentPair.info}</p>
            </div>
            <button 
              className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition-colors"
              onClick={() => setShowInfoModal(false)}
            >
              Continue
            </button>
          </div>
        </div>
      )}
      
      {/* Reward Modal */}
      {showRewardModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full text-center">
            <h3 className="text-2xl font-bold text-purple-800 mb-4">Level {level} Completed!</h3>
            <p className="text-lg text-purple-600 mb-6">
              You've earned a new icon for your Hall of Fame:
            </p>
            <div className="flex flex-col items-center mb-6">
              <img 
                src={getImageUrl(levelRewards[level - 1].name)} 
                alt={levelRewards[level - 1].name}
                className="h-32 w-32 object-cover rounded-full border-4 border-purple-300 mb-2"
              />
              <p className="font-bold text-purple-800">{levelRewards[level - 1].name}</p>
            </div>
            <button 
              className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition-colors"
              onClick={level < 5 ? goToNextLevel : () => setGameCompleted(true)}
            >
              {level < 5 ? "Go to Level " + (level + 1) : "Finish Game"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeministMemoryGame;