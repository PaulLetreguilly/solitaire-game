import { useReducer, useState, useEffect, useMemo } from "react";
import "./App.css";
import "./assets/css/cards.css";
import Card from "./components/Card";

const ACTION = {
  DISTRIB: "card_distribution",
  NOMORECARD: "no_more_card_in_deck",
  DRAW: "draw_a_card",
  GENERATE_DECK: "generate_deck",
  SELECT: "select_card",
};

function reducer(state, action) {
  switch (action.type) {
    case ACTION.DISTRIB:
      const arr1 = [];
      const arr2 = [];
      const arr3 = [];
      const arr4 = [];
      const arr5 = [];
      const arr6 = [];
      const arr7 = [];
      for (let i = 0; i < 28; i++) {
        if (i === 0) {
          arr1.push(action.payload.arr.pop());
        }
        if (i > 0 && i < 3) {
          arr2.push(action.payload.arr.pop());
        }
        if (i > 2 && i < 6) {
          arr3.push(action.payload.arr.pop());
        }
        if (i > 5 && i < 10) {
          arr4.push(action.payload.arr.pop());
        }
        if (i > 9 && i < 15) {
          arr5.push(action.payload.arr.pop());
        }
        if (i > 14 && i < 21) {
          arr6.push(action.payload.arr.pop());
        }
        if (i > 20 && i < 28) {
          arr7.push(action.payload.arr.pop());
        }
      }
      return {
        ...state,
        a: arr1,
        b: arr2,
        c: arr3,
        d: arr4,
        e: arr5,
        f: arr6,
        g: arr7,
        deck: action.payload.arr,
      };
    case ACTION.NOMORECARD:
      return {
        ...state,
        bin: action.payload.arr,
        deck: action.payload.array.reverse(),
      };
    case ACTION.DRAW:
      return { ...state, bin: action.payload.array, deck: action.payload.arr };
    case ACTION.GENERATE_DECK:
      return { ...state, deck: action.payload.array };
    case ACTION.SELECT:
      const x = [...state[action.payload.position]];
      const y = [...state[action.payload.selected.position]];
      const z = [];
      let cardsToMove = [];
      for (let i = 0; i < y.length; i++) {
        if (y[i].id === action.payload.selected.card.id) {
          if (i !== y.length - 1) {
            cardsToMove = y.slice(i, y.length);
            i = y.length;
          } else if (i === y.length - 1) {
            cardsToMove.push(y[i]);
          }
        }
      }
      for (let j = 0; j < cardsToMove.length; j++) {
        cardsToMove[j].recto = true;
        x.push(cardsToMove[j]);
      }
      for (let k = 0; k < y.length; k++) {
        if (cardsToMove.indexOf(y[k]) === -1) {
          z.push(y[k]);
        }
      }
      console.log(cardsToMove);
      return {
        ...state,
        [action.payload.position]: x,
        [action.payload.selected.position]: z,
      };
    default:
      return;
  }
}

function App() {
  // backChange / backCard are used to change back of the cards (with button at bottom)
  const [backChange, setBackChange] = useState(0);
  const [backCard, setBackCard] = useState("");
  // used to select a card
  const [selected, setSelected] = useState(null);
  // principal state, used for card positioning
  const [cards, dispatch] = useReducer(reducer, {
    deck: [],
    bin: [],
    first: [],
    second: [],
    third: [],
    fourth: [],
    a: [],
    b: [],
    c: [],
    d: [],
    e: [],
    f: [],
    g: [],
  });
  const str = "abcdef";
  const back_card = "card_verso_" + str[backChange];

  const handleStart = () => {
    dispatch({
      type: ACTION.DISTRIB,
      payload: { arr: [...cards.deck] },
    });
  };
  useEffect(() => {
    handleStart();
  }, []);

  const handleBackCard = () => {
    if (backChange === str.length - 1) {
      setBackChange(0);
      return;
    }
    const a = backChange + 1;
    setBackChange(a);
  };

  const x = useMemo(() => {
    setBackCard(back_card);
  }, [backChange]);

  const generateDeck = () => {
    const arr = [];
    const a = "ABCD";
    const cardType = ["heart", "spade", "diamond", "club"];
    const cardColor = ["red", "black", "red", "black"];
    const cardNum = [
      "one",
      "two",
      "three",
      "four",
      "five",
      "six",
      "seven",
      "eight",
      "nine",
      "ten",
      "eleven",
      "twelve",
      "thirteen",
    ];

    for (let i = 0; i < 4; i++) {
      for (let j = 1; j <= 13; j++) {
        const card = {
          num: cardNum[j - 1],
          class: cardNum[j - 1] + "_" + a[i],
          type: cardType[i],
          color: cardColor[i],
          value: j,
          recto: false,
          id: j + a[i],
        };
        arr.push(card);
      }
    }
    return arr;
  };
  function changeCardPosition() {
    const arr = [...cards.deck];
    const array = [...cards.bin];
    const popped = arr.pop();
    array.push(popped);
    dispatch({ type: ACTION.DRAW, payload: { arr: arr, array: array } });
  }
  function handleClick() {
    const arr = [...cards.deck];
    const array = [...cards.bin];

    if (!arr.length) {
      dispatch({
        type: ACTION.NOMORECARD,
        payload: { arr: arr, array: array },
      });

      return;
    }
  }

  function shuffle(array) {
    let currentIndex = array.length,
      randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
    dispatch({ type: ACTION.GENERATE_DECK, payload: { array: array } });
    return array;
  }
  const gameStart = useMemo(() => {
    return shuffle(generateDeck());
  }, []);

  const handleClicks = ({ position }) => {
    if (selected) {
      if (
        (position === "first" && selected.card.type === "heart") ||
        (position === "second" && selected.card.type === "spade") ||
        (position === "third" && selected.card.type === "diamond") ||
        (position === "fourth" && selected.card.type === "club")
      ) {
        if (selected.card.value === 1) {
          dispatch({
            type: ACTION.SELECT,
            payload: { selected: selected, position: position },
          });
        }
      }
      if (
        position !== "first" &&
        position !== "second" &&
        position !== "third" &&
        position !== "fourth"
      ) {
        dispatch({
          type: ACTION.SELECT,
          payload: { selected: selected, position: position },
        });
      }
      setSelected(null);
    }
  };

  return (
    <div className="container">
      <header className="header">
        <button
          onClick={() => {
            window.location.reload();
          }}
        >
          restart
        </button>
        <button
          onClick={() => {
            handleBackCard();
          }}
        >
          change back of the cards
        </button>
        {/* to be continued ... */}
      </header>
      <section className="upper_part">
        <div className="upper_left">
          <div className="first card_spot">
            {!cards.first.length && (
              <div
                className="symbol heart"
                style={{ width: "100%", height: "100%" }}
                onClick={() => {
                  handleClicks({ position: "first" });
                }}
              ></div>
            )}
            {cards.first?.map((card, i) => {
              return (
                <Card
                  key={card.id}
                  card={card}
                  num={i}
                  length={cards.bin.length}
                  backCard={backCard}
                  fcn={changeCardPosition}
                  position="first"
                  dispatch={dispatch}
                  selected={selected}
                  setSelected={setSelected}
                ></Card>
              );
            })}
          </div>
          <div className="second card_spot">
            {!cards.second.length && (
              <div
                className="symbol spade"
                style={{ width: "100%", height: "100%" }}
                onClick={() => {
                  handleClicks({ position: "second" });
                }}
              ></div>
            )}
            {cards.second?.map((card, i) => {
              return (
                <Card
                  key={card.id}
                  card={card}
                  num={i}
                  length={cards.bin.length}
                  backCard={backCard}
                  fcn={changeCardPosition}
                  position="second"
                  dispatch={dispatch}
                  selected={selected}
                  setSelected={setSelected}
                ></Card>
              );
            })}
          </div>
          <div className="third card_spot">
            {!cards.third.length && (
              <div
                className="symbol diamond"
                style={{ width: "100%", height: "100%" }}
                onClick={() => {
                  handleClicks({ position: "third" });
                }}
              ></div>
            )}
            {cards.third?.map((card, i) => {
              return (
                <Card
                  key={card.id}
                  card={card}
                  num={i}
                  length={cards.bin.length}
                  backCard={backCard}
                  fcn={changeCardPosition}
                  position="third"
                  dispatch={dispatch}
                  selected={selected}
                  setSelected={setSelected}
                ></Card>
              );
            })}
          </div>
          <div className="fourth card_spot">
            {!cards.fourth.length && (
              <div
                className="symbol club"
                style={{ width: "100%", height: "100%" }}
                onClick={() => {
                  handleClicks({ position: "fourth" });
                }}
              ></div>
            )}
            {cards.fourth?.map((card, i) => {
              return (
                <Card
                  key={card.id}
                  card={card}
                  num={i}
                  length={cards.bin.length}
                  backCard={backCard}
                  fcn={changeCardPosition}
                  position="fourth"
                  dispatch={dispatch}
                  selected={selected}
                  setSelected={setSelected}
                ></Card>
              );
            })}
          </div>
        </div>
        <div className="upper_right">
          <div className="bin card_spot">
            {cards.bin.map((card, i) => {
              return (
                <Card
                  key={card.id}
                  card={card}
                  num={i}
                  length={cards.bin.length}
                  backCard={backCard}
                  fcn={changeCardPosition}
                  position="bin"
                  dispatch={dispatch}
                  selected={selected}
                  setSelected={setSelected}
                ></Card>
              );
            })}
          </div>
          <div
            className="deck card_spot"
            onClick={() => {
              handleClick();
            }}
          >
            {cards.deck.map((card, i) => {
              return (
                <Card
                  key={card.id}
                  card={card}
                  num={i}
                  length={cards.deck.length}
                  backCard={backCard}
                  fcn={changeCardPosition}
                  position="deck"
                  dispatch={dispatch}
                ></Card>
              );
              return;
            })}
          </div>
        </div>
      </section>
      <section className="lower_part">
        <div className="a card_spot">
          {!cards.a.length && (
            <div
              style={{ width: "100%", height: "100%" }}
              onClick={() => {
                handleClicks({ position: "a" });
              }}
            ></div>
          )}

          {cards.a.map((card, i) => {
            return (
              <Card
                key={card.id}
                card={card}
                num={i}
                length={cards.a.length}
                backCard={backCard}
                fcn={changeCardPosition}
                position="a"
                dispatch={dispatch}
                selected={selected}
                setSelected={setSelected}
              ></Card>
            );
          })}
        </div>
        <div className="b card_spot">
          {!cards.b.length && (
            <div
              style={{ width: "100%", height: "100%" }}
              onClick={() => {
                handleClicks({ position: "b" });
              }}
            ></div>
          )}

          {cards.b.map((card, i) => {
            return (
              <Card
                key={card.id}
                card={card}
                num={i}
                length={cards.b.length}
                backCard={backCard}
                fcn={changeCardPosition}
                position="b"
                dispatch={dispatch}
                selected={selected}
                setSelected={setSelected}
              ></Card>
            );
          })}
        </div>
        <div className="c card_spot">
          {!cards.c.length && (
            <div
              style={{ width: "100%", height: "100%" }}
              onClick={() => {
                handleClicks({ position: "c" });
              }}
            ></div>
          )}

          {cards.c.map((card, i) => {
            return (
              <Card
                key={card.id}
                card={card}
                num={i}
                length={cards.c.length}
                backCard={backCard}
                fcn={changeCardPosition}
                position="c"
                dispatch={dispatch}
                selected={selected}
                setSelected={setSelected}
              ></Card>
            );
          })}
        </div>
        <div className="d card_spot">
          {!cards.d.length && (
            <div
              style={{ width: "100%", height: "100%" }}
              onClick={() => {
                handleClicks({ position: "d" });
              }}
            ></div>
          )}

          {cards.d.map((card, i) => {
            return (
              <Card
                key={card.id}
                card={card}
                num={i}
                length={cards.d.length}
                backCard={backCard}
                fcn={changeCardPosition}
                position="d"
                dispatch={dispatch}
                selected={selected}
                setSelected={setSelected}
              ></Card>
            );
          })}
        </div>
        <div className="e card_spot">
          {!cards.e.length && (
            <div
              style={{ width: "100%", height: "100%" }}
              onClick={() => {
                handleClicks({ position: "e" });
              }}
            ></div>
          )}

          {cards.e.map((card, i) => {
            return (
              <Card
                key={card.id}
                card={card}
                num={i}
                length={cards.e.length}
                backCard={backCard}
                fcn={changeCardPosition}
                position="e"
                dispatch={dispatch}
                selected={selected}
                setSelected={setSelected}
              ></Card>
            );
          })}
        </div>
        <div className="f card_spot">
          {!cards.f.length && (
            <div
              style={{ width: "100%", height: "100%" }}
              onClick={() => {
                handleClicks({ position: "f" });
              }}
            ></div>
          )}

          {cards.f.map((card, i) => {
            return (
              <Card
                key={card.id}
                card={card}
                num={i}
                length={cards.f.length}
                backCard={backCard}
                fcn={changeCardPosition}
                position="f"
                dispatch={dispatch}
                selected={selected}
                setSelected={setSelected}
              ></Card>
            );
          })}
        </div>
        <div className="g card_spot">
          {!cards.g.length && (
            <div
              style={{ width: "100%", height: "100%" }}
              onClick={() => {
                handleClicks({ position: "g" });
              }}
            ></div>
          )}

          {cards.g.map((card, i) => {
            return (
              <Card
                key={card.id}
                card={card}
                num={i}
                length={cards.g.length}
                backCard={backCard}
                fcn={changeCardPosition}
                position="g"
                dispatch={dispatch}
                selected={selected}
                setSelected={setSelected}
              ></Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default App;
