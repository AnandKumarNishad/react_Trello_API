import React, { useEffect, useState } from "react";
import { updateCard, fetchActionsOfACard, swapCard,getChecklist } from "../../AllApiCalls";
import "../Cards/Cards.css";
const Card = ({
  cardId,
  title,
  description,
  showModal,
  pos,
  listId,
  setCards,
}) => {
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [showEditIcon, setShowEditIcon] = useState(false);
  const [cardTitle, setCardTitle] = useState(title);
  const [comments, setComments] = useState([]);
  const [checkList, setCheckList] = useState([]);

  const handleClick = (e) => {
    setShowSaveButton(!showSaveButton);
    e.target.previousElementSibling.readOnly = showSaveButton;
    // e.target.previousElementSibling.parentElement.parentElement
    console.log(e.target.previousElementSibling.parentElement.parentElement);
    e.target.previousElementSibling.focus();
  };
  const updateCardTitle = async () => {
    try {
      const { data } = await updateCard(cardId, { name: cardTitle });
      setCardTitle(data.name);
      setShowSaveButton(!showSaveButton);
    } catch (err) {
      console.log(err.message);
    }
  };

  function getCommentInfo(actions) {
    const commentInfo = [];
    for (let index = 0; index < actions.length; index++) {
      commentInfo.push({
        id: actions[index].id,
        text: actions[index].data.text,
        fullName: actions[index].memberCreator.fullName,
      });
    }
    return commentInfo;
  }
  const insertDataAtCorrectPos = (state, data, pos) => {
    state.pos = pos;
    state.push(data);
    state.sort((firstCard, secondCard) => {
      if (firstCard.pos < secondCard.pos) {
        return -1;
      }
      if (firstCard.pos > secondCard.pos) {
        return 1; 
      }
      return 0;
    });
    return state;
  };
  const getComments = async () => {
    try {
      const { data } = await fetchActionsOfACard(cardId);
      setComments(getCommentInfo(data));
    } catch (err) {
      console.log(err);
    }
  };
  const getRequiredDataFromCheckList = (data) => {
    return data?.reduce((acc, curr) => {
      return [
        ...acc,
        {
          checkListId: curr.id,
          checkListName: curr.name,
          checkListItems: curr.checkItems?.reduce((acc, Curr) => {
            return [
              ...acc,
              {
                id: Curr.id,
                name: Curr.name,
                isCompleted: Curr.state === "incomplete" ? false : true,
                checkListId: curr.id,
              },
            ];
          }, []),
        },
      ];
    }, []);
  };
  const getChecklistOfThisCard = async () => {
    try {
      const { data } = await getChecklist(cardId);
      const checkListData = getRequiredDataFromCheckList(data);
      setCheckList(checkListData);
    } catch (err) {
      console.log(err);
    }
  };
  const handleDragStart = (e) => {
    e.dataTransfer.setData("drag-item", e.target.id);
    e.dataTransfer.setData("drag-list", listId);
  };
  const handleDrop = async (e) => {
    const cardId = e.dataTransfer.getData("drag-item");
    const prevElem = e.target.previousElementSibling;
    const nextElem = e.target.nextElementSibling;
    const draggedListId = e.dataTransfer.getData("drag-list");
    let pos;
    if (!prevElem || prevElem.tagName != "LI") pos = "top";
    else if (!nextElem || nextElem.tagName != "LI") pos = "bottom";
    else {
      pos = parseInt(
        (parseInt(prevElem.closest("li").getAttribute("data-pos")) +
          parseInt(nextElem.closest("li").getAttribute("data-pos"))) /
          2
      );
    } 
    const { data } = await swapCard(cardId, listId, pos);
    setCards((prevState) => ({
      ...prevState,
      [listId]:
        pos === "bottom"
          ? [...prevState[listId], data]
          : pos === "top"
          ? [data, ...prevState[listId]]
          : insertDataAtCorrectPos(prevState[listId], data, pos),
      [draggedListId]: prevState[draggedListId]?.filter(
        (currCard) => currCard.id !== cardId
      ),
    }));
  };
  useEffect(() => {
    getComments();
    getChecklistOfThisCard();
  }, []);
  return (
    <li
      id={cardId}
      className="card"
      onMouseEnter={() => setShowEditIcon(true)}
      onMouseLeave={() => setShowEditIcon(false)}
      draggable
      onDragStart={handleDragStart}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      data-pos={pos}
    >
      <div className="input">
        <textarea
          name="cardTitle"
          value={cardTitle}
          onChange={(e) => setCardTitle(e.target.value)}
          onClick={() =>
            showModal({
              modalState: true,
              modalId: cardId,
              modalDesc: description,
              modalName: title,
              modalComments: comments,
              modalCheckList: checkList,
            })
          }
          readOnly
        ></textarea>
        {showEditIcon && (
          <i className="fa-solid fa-pen" onClick={handleClick}></i>
        )}
      {showSaveButton && (
        <button className="save" id="save" onClick={() => updateCardTitle()}>
          Save
        </button>
      )}
      </div>
    </li>
  );
};

export default Card;