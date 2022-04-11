import React, { useState } from "react";
import { addItemToCheckList, deleteACheckList, updateItemOnCheckList, } from "../../AllApiCalls";

const SingleCheckList = ({ checkList, showModal, modal }) => {
  const [addItem, setAddItem] = useState(false);
  const [newItem, setNewItem] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await addItemToCheckList(checkList.checkListId, newItem);
      const newitem = {
        name: data.name,
        isCompleted: data.state === "incomplete" ? false : true,
      };
      let temp = modal?.modalCheckList;
      for (let index = 0; index < temp.length; index++) {
        if (temp[index].checkListId === checkList.checkListId) {
          temp[index].checkListItems.push(newitem);
        }
      }
      showModal({ ...modal, modalCheckList: temp });
      setNewItem("");
    }catch (err) {
      console.log(err);
    }
  };
  
  const handleCheckBox = (checkListItem) => {
    const { id, checkListId } = checkListItem;
    const currCheckList = modal.modalCheckList;
    for (let index = 0; index < currCheckList.length; index++) {
      let flag = false;
      if (currCheckList[index].checkListId === checkListId) {
        for (
          let idx = 0;
          idx < currCheckList[index].checkListItems?.length;
          idx++
        ) {
          if (currCheckList[index].checkListItems[idx].id === id) {
            currCheckList[index].checkListItems[idx].isCompleted =
              !currCheckList[index].checkListItems[idx].isCompleted;
            flag = true;
            break;
          }
        }
      }
      if (flag) break;
    }
    showModal({ ...modal, modalCheckList: currCheckList });
  };
  
  const handleChange = async (e, checkListItem) => {
    try {
      const { data } = await updateItemOnCheckList(
        modal.modalId,
        checkListItem.id,
        !checkListItem.isCompleted
      );
      handleCheckBox(checkListItem);
    } catch (err) {
      console.log(err);
    }
  };
  
  const handleDelete = async (e) => {
    try {
      const { data } = await deleteACheckList(checkList.checkListId);
      showModal({
        ...modal,
        modalCheckList: modal.modalCheckList.filter(
          (_checkList) => _checkList.checkListId !== checkList.checkListId
        ),
      });
    } catch (err) {
      console.log(err);
    }
  };
  
  return (
    <div
      className="checkListContainer"
      style={{ marginTop: "15px", marginBottom: "15px" }}
    >
      <div
        className="checkListHeader"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <h4>
          <i className="fa-solid fa-check" style={{ marginRight: "5px" }}></i>
          <strong>{checkList.checkListName}</strong>
        </h4>
        <button
          className="delete"
          style={{
            width: "70px",
            height: "30px",
            fontSize: "15px",
            fontFamily: "inherit",
            backgroundColor: "#EAECF0",
            border: "none",
            borderRadius: "5px",
          }}
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
      <div className="checkListItems">
        {checkList.checkListItems.map((checkListItem, index) => (
          <div
            className="checkListName"
            style={{ padding: "10px" }}
            key={index}
          >
            <input
              type="checkbox"
              checked={checkListItem.isCompleted}
              onChange={(e) => handleChange(e, checkListItem)}
            />
            <span
              style={{
                marginLeft: "20px",
                textDecoration: checkListItem.isCompleted && "line-through",
              }}
            >
              {checkListItem.name}
            </span>
          </div>
        ))}
        {!addItem ? (
          <button
            className="addItem"
            style={{
              width: "100px",
              height: "30px",
              fontSize: "15px",
              fontFamily: "inherit",
              backgroundColor: "#EAECF0",
              border: "none",
              borderRadius: "5px",
            }}
            onClick={() => setAddItem(true)}
          >
            Add an item
          </button>
        ) : (
          <form
            style={{ backgroundColor: "inherit", marginTop: "5px" }}
            onSubmit={handleSubmit}
          >
            <textarea
              placeholder="Add an item"
              style={{
                height: "50px",
                padding: "5px",
              }}
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
            ></textarea>
            <div className="button">
              <button id="add" type="submit">
                Add
              </button>
              <button id="close" onClick={() => setAddItem(false)}>
                x
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SingleCheckList;