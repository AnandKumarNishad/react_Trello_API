import React, { useState } from "react";
import { changeCardData, addComment, createACheckList } from "../../AllApiCalls";
import Comment from "../Comments/Comments";
import SingleCheckList from "./SingleCheckList"
import "../Modal/Modal.css";


const Modal = ({ modal, showModal }) => {
  const [nameReadOnly, toggleNameReadOnly] = useState(true);
  const [descReadOnly, toggleDescReadOnly] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [readOnly, setReadOnly] = useState(true);
  const [checkListForm,showCheckListForm] = useState(false);
  const [checkListTitle,setCheckListTitle] = useState('');
  const { modalName, modalDesc, modalComments, modalId, modalCheckList } = modal;
 
  const handleChange = (e) => {
    showModal((prevModal) => ({
      ...prevModal,
      [e.target.name]: e.target.value,
    }));
  };

  const saveModalName = async (e) => {
    try {
      showModal({ ...modal, modalName: modalName.replace(/\n/g, "") });
      const { data } = await changeCardData(modalId, { name: modalName });
      toggleNameReadOnly(true);
    } catch (err) {
      console.log(err);
    }
  };
  
  const saveModalDesc = async (e) => {
    try {
      showModal({ ...modal, modalDesc: modalDesc.replace(/\n/g, "") });
      const { data } = await changeCardData(modalId, { desc: modalDesc });
      toggleDescReadOnly(true);
    }catch (err) {
      console.log(err);
    }
  };
  
  const addNewComment = async (e) => {
    try {
      const { data } = await addComment(modalId, newComment);
      if(data === "") {
          alert("Please Enter a comment ... ");
          return false;
      }
      const newCmnt = {
        id: data.id,
        text: data.data.text,
        fullName: data.memberCreator.fullName,
      };
      showModal({ ...modal, modalComments: [...modalComments, newCmnt] });
      setReadOnly(true);
      setNewComment("");
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit=async (e)=>{
    e.preventDefault();
    try{
      const {data}=await createACheckList(modalId,checkListTitle);
      if(data.name === "Checklist") {
          alert("Please Enter the name of Checklist...");
          return false;
      }
      showModal({...modal,modalCheckList:[...modal.modalCheckList,{checkListId:data.id,checkListItems:[],checkListName:data.name}]});
      setCheckListTitle('');
      showCheckListForm(false);
    }catch(err){
      console.log(err);
    }
  }

  return (
    <div className="modalContainer">
      <div className="modalContent">
        <div className="modalHeading">
          <textarea
            value={modalName}
            name="modalName"
            readOnly={nameReadOnly}
            onChange={handleChange}
            onClick={() => toggleNameReadOnly(false)}
          ></textarea>
          <button
            id="close"
            onClick={() => showModal({ ...modal, modalState: false })}
          >
            x
          </button>
        </div>
            <div className="modalMainDiv">
                <div className="modalCommentsDiv">
                    <div className="modalDescription">
                    <div className="modalDescriptionContainer">
                        <h4 style={{ marginRight: "5px" }}>Description</h4>
                        {modalDesc && descReadOnly && (
                        <button
                            style={{ marginLeft: "5px" }}
                            onClick={() => toggleDescReadOnly(false)}
                        >
                            Edit
                        </button>
                        )}
                    </div>
                    <textarea
                        value={modalDesc}
                        name="modalDesc"
                        readOnly={descReadOnly}
                        onChange={handleChange}
                        style={{ backgroundColor: !descReadOnly && "#fff" }}
                        placeholder="Add a more detailed description."
                        onClick={() => !modalDesc && toggleDescReadOnly(false)}
                    ></textarea>
                    {!descReadOnly && (
                        <div className="buttons">
                        <button className="save" id="save" onClick={saveModalDesc}>
                            Save
                        </button>
                        <button
                            className="close"
                            onClick={() => toggleDescReadOnly(true)}
                        >
                            x
                        </button>
                        </div>
                    )}
                    </div>
                    <div className="checkList" style={{}}>
                        {
                            checkListForm&&(
                        <div
                            className="checkListInput"
                            style={{ width: "50%", backgroundColor: "#fff", padding: "10px" }}
                        >
                            <div style={{ display: "flex", justifyContent: "space-between"}}>
                            <p style={{ color: "gray", fontSize: "15px" }}>Add a checklist</p>

                            <button id="close" style={{ fontSize: "15px" }} onClick={()=>showCheckListForm(false)}>
                                x
                            </button>
                            </div>
                            <form style={{ display: "flex", flexDirection: "column", backgroundColor: "#EAEDF0" }} onSubmit={handleSubmit}>
                            <label
                                style={{ fontSize: "12px", color: "gray", marginBottom: "5px" }}
                            >
                                <strong>Title</strong>
                            </label>
                            <input
                                id="checkListInput"
                                type="text"
                                name="checkList"
                                style={{
                                height: "35px",
                                border: "none",
                                marginBottom: "10px",
                                }}
                                value={checkListTitle}
                                onChange={(e)=>setCheckListTitle(e.target.value)}
                            />
                            <button id="add" type='submit'>Add</button>
                            </form>
                        </div>
                            )
                        }
                        {
                            modalCheckList.map((checkList)=><SingleCheckList checkList={checkList} modal={modal} showModal={showModal}/>)
                        }
                        </div>
                    <div className="activity">
                    <h4>Activity</h4>
                    <div className="putComment">
                        <textarea
                        placeholder="Write a comment."
                        onChange={(e) => setNewComment(e.target.value)}
                        
                        value={newComment}
                        onClick={() => setReadOnly(false)}
                        ></textarea>
                        {!readOnly && (
                        <button id="save" onClick={addNewComment}>
                            Save
                        </button>
                        )}
                    </div>
                    <div className="allComments">
                        {modalComments.map((modalComment, index) => (
                        <Comment
                            modalComment={modalComment}
                            key={index}
                            modalId={modal.modalId}
                        />
                        ))}
                    </div>
                </div>
            </div>
                <div className="modalCheckbox">
                    <button
                        style={{
                        width: "200px",
                        height: "40px",
                        fontFamily: "inherit",
                        border: "none",
                        fontSize: "16px",
                        color: "black",
                        fontFamily: "inherit",
                        backgroundColor: "#EAECF0",
                        borderRadius: "5px",
                        marginBottom: "10px",
                        }}
                        onClick={()=>showCheckListForm(prevState=>!prevState)}
                    >
                        <i className="fa-solid fa-check"></i> Checklist
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Modal;