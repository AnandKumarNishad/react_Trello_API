import React, { useEffect, useState } from "react";
import Card from "../Cards/Cards";
import { fetchCardsOfAList, changeListName, createNewCard } from "../../AllApiCalls";
import "../Lists/List.css";
const List = ({
  listId,
  listName,
  handleDeleteList,
  showModal,
  cards,
  setCards
}) => {
  const [editListName, setEditListName] = useState(false);
  const [currListName, setCurrListName] = useState(listName);
  const [showNewCardForm, setShowNewCardForm] = useState(false);
  const [newCardName, setNewCardName] = useState("");
  const getCardsOfAList = async () => {
    try {
      const { data } = await fetchCardsOfAList(listId);
      setCards(prevState=>({...prevState,[listId]:data}));
    } catch (err) {
      console.log(err);
    }
  };
  const saveListName = async (e) => {
    try {
      
      setEditListName(!editListName);
      
      setCurrListName(() => {
        let tempListName = "";
        for (let i = 0; i < currListName.length - 1; i++) {
          tempListName += currListName[i];
        }
        return tempListName;
      });
      const { data } = await changeListName(listId, currListName);
    } catch (err) {
      console.log(err);
    }
  };
  const addNewCard = async (e) => {
    try {
      e.preventDefault();
      
      console.log("hi")
        if (newCardName === "")
        {
            alert("Enter the card title...")
            return false;
        }
      const { data } = await createNewCard(listId, { name: newCardName });
      setCards((prevState)=>({...prevState,[listId]:[...prevState[listId],data]}));
      setShowNewCardForm(!showNewCardForm);
      setNewCardName("");
    }catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getCardsOfAList(listId);
  }, []);

  return (
    <div className="list" id={listId}>
      <div className="heading">
        <textarea
          value={currListName}
          onChange={(e) => setCurrListName(e.target.value)}
          onClick={() => setEditListName(!editListName)}
          onKeyUp={saveListName}
          readOnly={!editListName}
        ></textarea>
        <i
          className="fa fa-minus"
          onClick={() => handleDeleteList(listId)}
        ></i>
      </div>
      {cards[listId]?.map((card, index) => (
        <Card
          key={card.id}
          cardId={card.id}
          title={card.name}
          description={card.desc}
          showModal={showModal}
          pos={card.pos}
          listId={card.idList}
          setCards={setCards}
        />
      ))}

      {!showNewCardForm ? (
        <button
          className="addCard"
          onClick={() => setShowNewCardForm(!showNewCardForm)}
        >
          <i className="fa-solid fa-plus"></i> Add a card
        </button>
      ) : (
          <form>
          <textarea
            value={newCardName}
            onChange={(e) => setNewCardName(e.target.value)}
          ></textarea>
          <div className="buttons">
            <button
              style={{ width: "70px", height: "30px" }}
              id="add"
              onClick={addNewCard}
            >
              Add Card
            </button>
            <button
              style={closeButtonStyle}
              id="close"
              onClick={() => setShowNewCardForm(!showNewCardForm)}
            >
              X
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default List;

const closeButtonStyle = {
  marginLeft: "10px",
  border: "none",
  background: "inherit",
  color: "grey",
  fontSize: "20px",
};
