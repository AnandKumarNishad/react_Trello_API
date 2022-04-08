import axios from "axios";

const KEY = "ec220ca0f912754f4b53bf6b99985066";
const TOKEN = "0845a930eeeaa45f23bd8ab16cbcbbd2583d0439c6ab7255e15a05876bbc2e7d";
const idBoard = "623ae5d00fd3292eee19390f";

const fetchLists = () =>
  axios.get(
    `https://api.trello.com/1/boards/${idBoard}/lists?key=${KEY}&token=${TOKEN}`
  );

const fetchCardsOfAList = (listId) =>
  axios.get(
    `https://api.trello.com/1/lists/${listId}/cards?key=${KEY}&token=${TOKEN}`
  );

const updateCard = (cardId, body) =>
  axios.put(
    `https://api.trello.com/1/cards/${cardId}?key=${KEY}&token=${TOKEN}`,
    body
  );

const deleteAList = (listId) =>
  axios.put(
    `https://api.trello.com/1/lists/${listId}/closed?value=true&key=${KEY}&token=${TOKEN}`
  );

const changeListName = (listId, value) =>
  axios.put(
    `https://api.trello.com/1/lists/${listId}?key=${KEY}&token=${TOKEN}`,
    { name: value }
  );

const createNewCard = (listId, value) =>
  axios.post(
    `https://api.trello.com/1/cards?idList=${listId}&key=${KEY}&token=${TOKEN}`,
    value
  );

const fetchActionsOfACard = (cardId) =>
  axios.get(
    `https://api.trello.com/1/cards/${cardId}/actions?key=${KEY}&token=${TOKEN}`
  );

const changeCardData = (cardId, data) =>
  axios.put(
    `https://api.trello.com/1/cards/${cardId}?key=${KEY}&token=${TOKEN}`,
    data
  );

const editComment = (commentId, value) =>
  axios.put(
    `https://api.trello.com/1/actions/${commentId}/text?value=${value}&key=${KEY}&token=${TOKEN}`
  );

const addComment = (cardId, value) =>
  axios.post(
    `https://api.trello.com/1/cards/${cardId}/actions/comments?text=${value}&key=${KEY}&token=${TOKEN}`
  );

const fetchBoard = () =>
  axios.get(
    `https://api.trello.com/1/boards/${idBoard}?key=${KEY}&token=${TOKEN}`
  );

const addList = (boardId, value) =>
  axios.post(
    `https://api.trello.com/1/lists?idBoard=${boardId}&key=${KEY}&token=${TOKEN}`,
    value
  );

const deleteComment = (cardId, commentId) =>
  axios.delete(
    `https://api.trello.com/1/cards/${cardId}/actions/${commentId}/comments?key=${KEY}&token=${TOKEN}`
  );

const deleteACard = (cardId) =>
  axios.delete(
    `https://api.trello.com/1/cards/${cardId}?key=${KEY}&token=${TOKEN}`
  );

const swapCard = (cardId, listId,pos) =>
  axios.put(
    `https://api.trello.com/1/cards/${cardId}?pos=${pos}&idList=${listId}&key=${KEY}&token=${TOKEN}`
  );

  const getChecklist = (cardId) =>
  axios.get(
    `https://api.trello.com/1/cards/${cardId}/checklists?key=${KEY}&token=${TOKEN}`
  );

const addItemToCheckList = (checkListId, data) =>
  axios.post(
    `https://api.trello.com/1/checklists/${checkListId}/checkItems?name=${data}&key=${KEY}&token=${TOKEN}`
  );

const createACheckList = (cardId, value) =>
  axios.post(
    `https://api.trello.com/1/checklists?name=${value}&idCard=${cardId}&key=${KEY}&token=${TOKEN}`
  );

const deleteACheckList = (checkListId) =>
  axios.delete(
    `https://api.trello.com/1/checklists/${checkListId}?key=${KEY}&token=${TOKEN}`
  );

const updateItemOnCheckList = (cardId, itemId, value) =>
  axios.put(
    `https://api.trello.com/1/cards/${cardId}/checkItem/${itemId}?state=${value}&key=${KEY}&token=${TOKEN}`
  );

export {
  fetchLists,
  fetchCardsOfAList,
  updateCard,
  deleteAList,
  changeListName,
  createNewCard,
  fetchActionsOfACard,
  changeCardData,
  editComment,
  addComment,
  fetchBoard,
  addList,
  deleteComment,
  deleteACard,
  swapCard,
  getChecklist,
  addItemToCheckList,
  createACheckList,
  deleteACheckList,
  updateItemOnCheckList,
};
