// import React, { useState, useEffect } from "react";
// import "./Notepad.css";

// export default function Notepad() {
//   const [notes, setNotes] = useState([]);
//   const [input, setInput] = useState("");
//   const [currentPage, setCurrentPage] = useState(0);

//   // Load notes from localStorage
//   useEffect(() => {
//     const savedNotes = JSON.parse(localStorage.getItem("notes")) || [];
//     setNotes(savedNotes);
//   }, []);

//   // Save notes whenever updated
//   useEffect(() => {
//     localStorage.setItem("notes", JSON.stringify(notes));
//   }, [notes]);

//   const addNote = () => {
//     if (input.trim() === "") return;
//     setNotes([...notes, input]);
//     setInput("");
//     setCurrentPage(notes.length); // go to the new note page
//   };

//   const deleteNote = (index) => {
//     const updatedNotes = notes.filter((_, i) => i !== index);
//     setNotes(updatedNotes);
//     setCurrentPage(Math.min(currentPage, updatedNotes.length - 1));
//   };

//   const prevPage = () => {
//     setCurrentPage(Math.max(currentPage - 1, 0));
//   };

//   const nextPage = () => {
//     setCurrentPage(Math.min(currentPage + 1, notes.length - 1));
//   };

//   return (
//     <div className="notepad-container">
//       <h2>📖 My Notebook</h2>

//       <div className="notepad-input">
//         <textarea
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="Write your note here..."
//         />
//         <button onClick={addNote}>Add Note</button>
//       </div>

//       <div className="notepad-book">
//         {notes.length === 0 && <p className="empty-note">No notes yet.</p>}

//         {notes.length > 0 && (
//           <div className="notepad-page">
//             <div className="page-content">{notes[currentPage]}</div>
//             <div className="page-footer">
//               Page {currentPage + 1} of {notes.length}
//             </div>
//           </div>
//         )}
//       </div>

//       {notes.length > 1 && (
//         <div className="page-controls">
//           <button onClick={prevPage} disabled={currentPage === 0}>
//             ◀ Previous
//           </button>
//           <button
//             onClick={nextPage}
//             disabled={currentPage === notes.length - 1}
//           >
//             Next ▶
//           </button>
//         </div>
//       )}

//       <div className="notes-list">
//         <h3>All Notes</h3>
//         <ul>
//           {notes.map((note, index) => (
//             <li key={index}>
//               {note.substring(0, 50)}...
//               <button onClick={() => deleteNote(index)}>❌ Delete</button>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// }
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Notepad.css";

const API_URL = "http://localhost:5000/api/notes"; // backend endpoint

export default function Notepad() {
  const [notes, setNotes] = useState([]);
  const [input, setInput] = useState("");
  const [currentPage, setCurrentPage] = useState(0);

  // Load notes from backend
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await axios.get(API_URL);
        setNotes(res.data);
      } catch (err) {
        console.error("Error fetching notes:", err);
      }
    };
    fetchNotes();
  }, []);

  const addNote = async () => {
    if (input.trim() === "") return;

    try {
      const res = await axios.post(API_URL, { content: input });
      setNotes([res.data, ...notes]);
      setInput("");
      setCurrentPage(0); // go to the new note
    } catch (err) {
      console.error("Error adding note:", err);
    }
  };

  const deleteNote = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      const updatedNotes = notes.filter((note) => note._id !== id);
      setNotes(updatedNotes);
      setCurrentPage(Math.min(currentPage, updatedNotes.length - 1));
    } catch (err) {
      console.error("Error deleting note:", err);
    }
  };

  const prevPage = () => setCurrentPage(Math.max(currentPage - 1, 0));
  const nextPage = () =>
    setCurrentPage(Math.min(currentPage + 1, notes.length - 1));

  return (
    <div className="notepad-container">
      <h2>📖 My Notebook</h2>

      <div className="notepad-input">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Write your note here..."
        />
        <button onClick={addNote}>Add Note</button>
      </div>

      <div className="notepad-book">
        {notes.length === 0 && <p className="empty-note">No notes yet.</p>}

        {notes.length > 0 && (
          <div className="notepad-page">
            <div className="page-content">{notes[currentPage]?.content}</div>
            <div className="page-footer">
              Page {currentPage + 1} of {notes.length}
            </div>
          </div>
        )}
      </div>

      {notes.length > 1 && (
        <div className="page-controls">
          <button onClick={prevPage} disabled={currentPage === 0}>
            ◀ Previous
          </button>
          <button
            onClick={nextPage}
            disabled={currentPage === notes.length - 1}
          >
            Next ▶
          </button>
        </div>
      )}

      <div className="notes-list">
        <h3>All Notes</h3>
        <ul>
          {notes.map((note, index) => (
            <li key={note._id}>
              {note.content.substring(0, 50)}...
              <button onClick={() => deleteNote(note._id)}>❌ Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}




