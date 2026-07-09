import React, { useState, useCallback, useEffect } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

const CHATBOT_USER_OBJ = {
  _id: 2,
  name: "Cat, the bot",
  avatar: "https://loremflickr.com/140/140",
};

const CHATBOT_USER_OBJ_1 = {
  _id: 3,
  name: "Dog, the bot",
  avatar: "https://loremflickr.com/320/240/dog",
};

const game_db = [
  {
    question: "What is so fragile that saying its name breaks it?",
    answer: "Silence",
  },
  {
    question:
      "What can run but never walks, has a mouth but never talks, has a head but never weeps, has a bed but never sleeps?",
    answer: "River",
  },
  { question: "What can fill a room but takes up no space?", answer: "Light" },
  {
    question:
      "If you drop me I’m sure to crack, but give me a smile and I’ll always smile back. What am I?",
    answer: "Mirror",
  },
  {
    question: "The more you take, the more you leave behind. What are they?",
    answer: "Footsteps",
  },
  {
    question:
      "I turn once, what is out will not get in. I turn again, what is in will not get out. What am I?",
    answer: "Key",
  },
  {
    question: "People make me, save me, change me, raise me. What am I?",
    answer: "Key",
  },
  {
    question:
      "I am always hungry and will die if not fed, but whatever I touch will soon turn red. What am I?",
    answer: "Fire",
  },
];

export default function App() {
  const [messages, setMessages] = useState([]);
  const [play, setPlay] = useState(false);
  const [gameIndex, setGameIndex] = useState(0);

  useEffect(() => {
    if (messages.length < 1) {
      // Add a "starting message" when chat UI first loads
      addBotMessage(
        "Hello, I'm a cat. Welcome to Shawn's riddle game! Say 'Yes' when you're ready to play!",
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

  const addBotMessageDog = (text) => {
    addNewMessage([
      {
        _id: Math.round(Math.random() * 1000000),
        text: text,
        createdAt: new Date(),
        user: CHATBOT_USER_OBJ_1,
      },
    ]);
  };

  const respondToUser = (userMessages) => {
    console.log("Recent user msg:", userMessages[0].text);
    if (userMessages[0].text.toLowerCase() == "yes") {
      startGame();
    } else {
      addBotMessage(
        "Hello, welcome to Shawn's riddle game! Say 'Yes' when you're ready to play!",
      );
    }
  };

  const startGame = () => {
    setPlay(true);
    setGameIndex(0);
    addBotMessageDog(
      "Hello I'm a dog. Only 1 word answers. Press 'r' to restart",
    );
    addBotMessageDog(`${game_db[0].question}`);
  };

  // this can be the game logic
  const game_responce = (userMessages) => {
    console.log("Recent user msg:", userMessages[0].text);

    let my_bool = true;

    const curr_problem = game_db[gameIndex];
    console.log(curr_problem.answer);

    if (userMessages[0].text == curr_problem.answer) {
      addBotMessageDog(
        `${curr_problem.answer} is correct! Only one word answers. Press 'r' to restart`,
      );
    } else if (userMessages[0].text.toLowerCase() == "r") {
      setPlay(false);
      addBotMessageDog("Bye Bye from dog. Thank you for playing");
      addBotMessage("Say 'yes' to play again.");
      my_bool = false;
    } else {
      addBotMessageDog(
        `Incorrect, it's ${curr_problem.answer}. Press 'r' to restart`,
      );
    }

    if (my_bool) {
      if (gameIndex + 1 <= game_db.length - 1) {
        setGameIndex(gameIndex + 1);
        addBotMessageDog(`Next question: ${game_db[gameIndex + 1].question}`);
      } else {
        addBotMessage("Hi I'm a cat. Game over. Say 'yes' to play again.");
        setPlay(false);
      }
    }
  };

  const onSend = useCallback((messages = []) => {
    addNewMessage(messages);
  }, []);

  return (
    <SafeAreaProvider>
      <Text>hello</Text>
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
