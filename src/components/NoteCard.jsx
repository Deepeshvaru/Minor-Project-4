import { ArrowUpRight, Pencil, Trash2 } from "lucide-react";

const palettes = ["note-lilac", "note-amber", "note-mint", "note-blue"];
export default function NoteCard({ note, index, onEdit, onDelete }) {
  const date = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(note.updatedAt));
  return (
    <article className={`note-card ${palettes[index % palettes.length]}`}>
      <div className="note-card-top">
        <span className="note-category">{note.category || "Personal"}</span>
        <div className="note-card-actions">
          <button onClick={onEdit} aria-label="Edit note">
            <Pencil size={14} />
          </button>
          <button onClick={onDelete} aria-label="Delete note">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      <button className="note-open" onClick={onEdit}>
        <h3>{note.title || "Untitled note"}</h3>
        <p>{note.body || "An empty page, ready for an idea."}</p>
        <span className="note-read">
          OPEN NOTE <ArrowUpRight size={13} />
        </span>
      </button>
      <div className="note-card-footer">
        <span className="note-stamp">✳</span>
        <span>UPDATED {date.toUpperCase()}</span>
      </div>
    </article>
  );
}
