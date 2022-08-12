import { useState } from "react";

const Card = ({
  card,
  num,
  length,
  backCard,
  fcn,
  position,
  dispatch,
  selected,
  setSelected,
}) => {
  const [verso, setVerso] = useState(true);
  let lastCard = false;
  let checkPosition = false;
  let checkPosition2 = false;
  let multiply = 1;
  let checkSelection = false;
  if (card.recto && verso) {
    setVerso(false);
  }
  if (num === length - 1) {
    lastCard = true;
  }
  if (
    position === "a" ||
    position === "b" ||
    position === "c" ||
    position === "d" ||
    position === "e" ||
    position === "f" ||
    position === "g"
  ) {
    checkPosition = true;
    multiply = 50;
  }
  if (
    position === "first" ||
    position === "second" ||
    position === "third" ||
    position === "fourth"
  ) {
    checkPosition2 = true;
  }
  if (checkPosition && verso && lastCard) {
    setVerso(false);
  }

  if (!card) {
    card = {
      class: "",
    };
  }
  if (selected?.card.id === card.id) {
    checkSelection = true;
  }
  return (
    <div
      style={{
        position: "absolute",
        top: !checkPosition2 ? 1 * num * multiply : 0,
      }}
      className={`${checkPosition2 ? "card " : "card"} ${
        checkSelection ? "card_selected" : ""
      } ${verso ? backCard : card.class} ${
        position === "bin" && lastCard
          ? card.class
          : lastCard
          ? "last_card"
          : ""
      }`}
      onClick={() => {
        lastCard && !checkPosition && setVerso(!verso);
        position === "deck" &&
          setTimeout(() => {
            fcn();
          }, 200);
        if (position !== "deck") {
          if (selected?.card.id === card.id) {
            setSelected(null);
            return;
          }
          if (selected === null) {
            setSelected({ card: card, position: position });
            return;
          }
          if (selected !== null && selected.card.id !== card.id) {
            if (
              selected.card.color !== card.color &&
              selected.card.value === card.value - 1 &&
              checkPosition
            ) {
              dispatch({
                type: "select_card",
                payload: { selected: selected, position: position },
              });
              setSelected(null);
              return;
            } else if (
              selected.card.type === card.type &&
              selected.card.value === card.value + 1 &&
              checkPosition2
            ) {
              dispatch({
                type: "select_card",
                payload: { selected: selected, card: card, position: position },
              });
              setSelected(null);
            } else {
              setSelected(null);
            }
          }
        }
      }}
    >
      {" "}
    </div>
  );
};

export default Card;
