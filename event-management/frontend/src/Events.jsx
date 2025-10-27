import { useEffect, useState } from "react";
import api from "./api";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    id: null,
    name: "",
    description: "",
    start_time: "",
    end_time: "",
  });
  const [loading, setLoading] = useState(false);

  // 🟢 Зареждане на всички events
  const loadEvents = async () => {
    setLoading(true);
    try {
      const res = await api.get("/events");
      setEvents(res.data);
    } catch (err) {
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  // 🟢 Добавяне или ъпдейт
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (form.id) {
        // update
        await api.put(`/events/${form.id}`, form);
        alert("Event updated!");
      } else {
        // create
        await api.post("/events", form);
        alert("Event created!");
      }
      setForm({ id: null, name: "", description: "", start_time: "", end_time: "" });
      loadEvents();
    } catch (err) {
      console.error(err);
      alert("Error saving event");
    }
  };

  // 🟢 Попълване на формата при редакция
  const handleEdit = (event) => {
    setForm({
      id: event.id,
      name: event.name,
      description: event.description || "",
      start_time: event.start_time || "",
      end_time: event.end_time || "",
    });
  };

  // 🟢 Изтриване
  const handleDelete = async (id) => {
    if (!confirm("Delete this event?")) return;
    try {
      await api.delete(`/events/${id}`);
      alert("Event deleted!");
      loadEvents();
    } catch (err) {
      console.error(err);
      alert("Error deleting event");
    }
  };

  return (
    <section className="section theme-dark">
        <div className="container">
        <h1 className="heading-accent section__title">🎟️Events</h1>
              <p class="section__subtitle">Кратко подзаглавие</p>
        {/* Форма */}
       <form onSubmit={handleSubmit} className="form surface">
  <div className="form__group">
    <label htmlFor="name" className="form__label">Event name</label>
    <input
      id="name"
      type="text"
      className="form__control"
      placeholder="Event name"
      value={form.name}
      onChange={(e) => setForm({ ...form, name: e.target.value })}
      required
    />
  </div>

  <div className="form__group">
    <label htmlFor="description" className="form__label">Description</label>
    <textarea
      id="description"
      className="form__control"
      placeholder="Description"
      value={form.description}
      onChange={(e) => setForm({ ...form, description: e.target.value })}
    />
  </div>

  <div className="form__group">
    <label htmlFor="start_time" className="form__label">Start time</label>
    <input
      id="start_time"
      type="datetime-local"
      className="form__control"
      value={form.start_time}
      onChange={(e) => setForm({ ...form, start_time: e.target.value })}
      required
    />
  </div>

  <div className="form__group">
    <label htmlFor="end_time" className="form__label">End time</label>
    <input
      id="end_time"
      type="datetime-local"
      className="form__control"
      value={form.end_time}
      onChange={(e) => setForm({ ...form, end_time: e.target.value })}
      required
    />
  </div>

  <button type="submit" className="form__submit">
    {form.id ? "Update Event" : "Add Event"}
  </button>
</form>


        {/* Таблица */}
     {loading ? (
  <p className="text-center muted">Loading events...</p>
) : events.length === 0 ? (
  <p className="text-center muted">No events yet.</p>
) : (
  <div className="table-wrapper surface">
    <table className="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Start</th>
          <th>End</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {events.map((e) => (
          <tr key={e.id}>
            <td>{e.id}</td>
            <td>{e.name}</td>
            <td>{e.start_time}</td>
            <td>{e.end_time}</td>
            <td className="table__actions">
              <button
                className="btn btn--icon"
                onClick={() => handleEdit(e)}
                title="Edit"
              >
                ✏️
              </button>
              <button
                className="btn btn--icon btn--danger"
                onClick={() => handleDelete(e.id)}
                title="Delete"
              >
                🗑️
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

        </div>
    </section>
  );
}
