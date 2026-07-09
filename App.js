import React, { useState, useCallback, useEffect } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

const CHATBOT_USER_OBJ = {
  _id: 2,
  name: "React Native Chatbot",
  avatar: "https://loremflickr.com/140/140",
};

const game_db = [
  { question: "1 + 1", answer: "2" },
  { question: "2 + 2", answer: "4" },
  { question: "3 + 3", answer: "6" },
];

export default function App() {
  const [messages, setMessages] = useState([]);
  const [play, setPlay] = useState(false);
  const [gameIndex, setGameIndex] = useState(0);

  useEffect(() => {
    if (messages.length < 1) {
      // Add a "starting message" when chat UI first loads
      addBotMessage(
        "Hello, welcome to simple trivia! Say 'Yes' when you're ready to play!",
      );
    }
  }, []);

  const addNewMessage = (newMessages) => {
    setMessages((previousMessages) => {
      // console.log("PREVIOUS MESSAGES:", previousMessages);
      // console.log("NEW MESSAGE:", newMessages);
      return GiftedChat.append(previousMessages, newMessages);
    });
  };

  const addBotMessage = (text) => {
    addNewMessage([
      {
        _id: Math.round(Math.random() * 1000000),
        text: text,
        createdAt: new Date(),
        user: CHATBOT_USER_OBJ,
      },
    ]);
  };

  const respondToUser = (userMessages) => {
    console.log("Recent user msg:", userMessages[0].text);
    if (userMessages[0].text.toLowerCase() == "yes") {
      startGame();
    } else {
      addBotMessage(
        "Hello, welcome to simple trivia! Say 'Yes' when you're ready to play!",
      );
    }
  };

  const startGame = () => {
    setPlay(true);
    setGameIndex(0);
    addBotMessage(" Press 'r' to restart");
    addBotMessage(`What is ${game_db[0].question}`);
  };

  // this can be the game logic
  const game_responce = (userMessages) => {
    console.log("Recent user msg:", userMessages[0].text);

    let my_bool = true;

    const curr_problem = game_db[gameIndex];
    console.log(curr_problem.answer);

    if (userMessages[0].text == curr_problem.answer) {
      addBotMessage("Correct! Press 'r' to restart");
    } else if (userMessages[0].text.toLowerCase() == "r") {
      setPlay(false);
      addBotMessage("Thank you for playing");
      addBotMessage("Say 'yes' to play again.");
      my_bool = false;
    } else {
      addBotMessage("Incorrect. Press 'r' to restart");
    }

    if (my_bool) {
      if (gameIndex + 1 <= 2) {
        // let nextIndex = gameIndex + 1;
        setGameIndex(gameIndex + 1);
        addBotMessage(
          `Next question: What is ${game_db[gameIndex + 1].question}?`,
        );
      } else {
        addBotMessage("Game over. Say 'yes' to play again.");
        setPlay(false);
      }
    }
  };

  const onSend = useCallback((messages = []) => {
    addNewMessage(messages);
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        {play ? (
          <GiftedChat
            messages={messages}
            onSend={(messages) => {
              onSend(messages);
              // Wait a sec before responding
              setTimeout(() => game_responce(messages), 1000);
            }}
            user={{
              _id: 1,
              name: "Chilla",
            }}
            renderUsernameOnMessage={true}
          />
        ) : (
          <GiftedChat
            messages={messages}
            onSend={(messages) => {
              onSend(messages);
              // Wait a sec before responding
              setTimeout(() => respondToUser(messages), 1000);
            }}
            user={{
              _id: 1,
              name: "Chilla",
            }}
            renderUsernameOnMessage={true}
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

// Workaround to hide an unnessary warning about defaultProps
const error = console.error;
console.error = (...args) => {
  if (/defaultProps/.test(args[0])) return;
  error(...args);
};
