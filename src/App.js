import React, { useEffect, useState } from "react";
import List from "./Components/Lists/List";
import { fetchLists, deleteAList, fetchBoard, addList } from "./AllApiCalls";
import Modal from "./Components/Modal/Modal";
import "./App.css"

const App = () => {
  const [lists, setLists] = useState();
  const [cards, setCards] = useState({});
  const [form, toggleForm] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [modal, showModal] = useState({
    modalState: false,
    modalId: "",
    modalName: "",
    modalDesc: "",
    modalComments: [],
  });
  const getLists = async () => {
    try {
      const { data } = await fetchLists();
      setLists(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteList = async (listId) => {
    try {
      const { data } = await deleteAList(listId);
      setLists((prevLists)=>prevLists.filter(list=>list.id!==data.id));
    } catch (err) {
      console.log(err.message);
    }
  };

  const addNewList = async (e) => {
    try {
      e.preventDefault();
      const { data } = await fetchBoard();
      const boardId = data.id;
      const res = await addList(boardId, { name: newListName });
      setLists([...lists, res.data]);
      setNewListName("");
      toggleForm(false);
    } catch (err) {
      console.log(err.message);
    }
  };
  
  useEffect(() => {
    getLists();
  }, []);
  
  return (
    <div className="Board">
      {lists?.map((list, index) => (
        <List
          key={list.id}
          listId={list.id}
          listName={list.name}
          handleDeleteList={handleDeleteList}
          showModal={showModal}
          cards={cards}
          setCards={setCards}
        />
      ))}
      <div className="addNewList">
        {!form ? (
          <button
            className="addList"
            onClick={() => toggleForm(true)}
          >
            + Add another list
          </button>
        ) : (
          <form style={{ width: "272px", backgroundColor: "#EAEDF0" }}>
            <input
              className="listTitle"
              placeholder="Enter list title"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
            />
            <div className="buttons">
              <button id="add" style={{ width: "80px" }} onClick={addNewList}>
                Add list
              </button>
              <button id="close" onClick={() => toggleForm(false)}>
                x
              </button>
            </div>
          </form>
        )}
      </div>
      {modal.modalState && <Modal modal={modal} showModal={showModal} />}
    </div>
  );
};

export default App;