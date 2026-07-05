import { useState } from "react";
import { FiCalendar, FiPlus, FiTrash2 } from "react-icons/fi";
import api from "../../services/api";
import Loader from "../../components/common/Loader";
import { EmptyState, Modal, PageHeader } from "../../components/common/Ui";
import { formatDate } from "../../utils/format";
import useHolidays from "../../hooks/useHolidays";

export default function Holidays() {
  const { holidays, loading, error, refresh } = useHolidays();

  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    date: "",
    type: "Public holiday",
  });

  const [actionError, setActionError] = useState("");

  const add = async (event) => {
    event.preventDefault();

    try {
      setActionError("");

      await api.post("/holidays", form);

      setOpen(false);

      setForm({
        name: "",
        date: "",
        type: "Public holiday",
      });

      await refresh();
    } catch (err) {
      console.error(err);

      setActionError(
        err.response?.data?.message ||
          err.message ||
          "Unable to add holiday."
      );
    }
  };

  const remove = async (holiday) => {
    if (!window.confirm(`Remove ${holiday.name}?`)) return;

    try {
      setActionError("");

      await api.delete(`/holidays/${holiday.id}`);

      await refresh();
    } catch (err) {
      console.error(err);

      setActionError(
        err.response?.data?.message ||
          err.message ||
          "Unable to delete holiday."
      );
    }
  };

  if (loading) {
    return <Loader label="Loading holiday calendar..." />;
  }

  return (
    <>
      <PageHeader
        eyebrow="Calendar"
        title="Organisation Holidays"
        description="Published holidays are automatically excluded from leave duration."
        actions={
          <button
            className="button primary"
            onClick={() => setOpen(true)}
          >
            <FiPlus />
            Add Holiday
          </button>
        }
      />

      {(error || actionError) && (
        <div className="form-alert error">
          {error || actionError}
        </div>
      )}

      <section className="panel holiday-admin-list">
        {holidays.length > 0 ? (
          holidays.map((holiday) => (
            <article key={holiday.id}>
              <span className="date-tile large">
                <strong>
                  {new Date(`${holiday.date}T00:00:00`).getDate()}
                </strong>

                <small>
                  {new Date(`${holiday.date}T00:00:00`).toLocaleDateString(
                    "en-IN",
                    {
                      month: "short",
                    }
                  )}
                </small>
              </span>

              <div>
                <strong>{holiday.name}</strong>

                <p>
                  {holiday.date} • {holiday.type || "Public holiday"}
                </p>
              </div>

              <button
                className="icon-button danger-text"
                onClick={() => remove(holiday)}
              >
                <FiTrash2 />
              </button>
            </article>
          ))
        ) : (
          <EmptyState
            icon={<FiCalendar />}
            title="No holidays found"
            description="Add your first organisation holiday."
          />
        )}
      </section>

      {open && (
        <Modal
          title="Add Organisation Holiday"
          onClose={() => setOpen(false)}
          footer={
            <>
              <button
                className="button ghost"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>

              <button
                className="button primary"
                form="holiday-form"
              >
                Add Holiday
              </button>
            </>
          }
        >
          <form
            id="holiday-form"
            className="form-grid"
            onSubmit={add}
          >
            <label className="field">
              <span>Holiday Name</span>

              <input
                type="text"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
                placeholder="Republic Day"
                required
              />
            </label>

            <label className="field">
              <span>Date</span>

              <input
                type="date"
                value={form.date}
                onChange={(e) =>
                  setForm({
                    ...form,
                    date: e.target.value,
                  })
                }
                required
              />
            </label>

            <label className="field">
              <span>Type</span>

              <select
                value={form.type}
                onChange={(e) =>
                  setForm({
                    ...form,
                    type: e.target.value,
                  })
                }
              >
                <option>Public holiday</option>
                <option>Restricted holiday</option>
                <option>Organisation holiday</option>
              </select>
            </label>
          </form>
        </Modal>
      )}
    </>
  );
}