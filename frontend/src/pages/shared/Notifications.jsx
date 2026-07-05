import { useCallback, useEffect, useState } from "react";
import { FiBell, FiCheck, FiCheckCircle, FiInfo, FiTrash2, FiXCircle } from "react-icons/fi";
import api from "../../services/api";
import Loader from "../../components/common/Loader";
import { EmptyState, PageHeader } from "../../components/common/Ui";
import { formatDate } from "../../utils/format";

const iconByType = {
  success: FiCheckCircle,
  error: FiXCircle,
  info: FiInfo,
  action: FiBell,
};

export default function Notifications() {
  const [notifications, setNotifications] = useState(null);
  const [error, setError] = useState("");
  const load = useCallback(() => {
    api.get("/notifications/my")
      .then(({ data }) => setNotifications(data.notifications))
      .catch((err) => setError(err.userMessage));
  }, []);
  useEffect(load, [load]);

  const read = async (notification) => {
    if (notification.isRead) return;
    await api.patch(`/notifications/${notification.id}/read`);
    setNotifications((items) => items.map((item) => item.id === notification.id ? { ...item, isRead: true } : item));
  };
  const readAll = async () => {
    await api.patch("/notifications/read-all");
    setNotifications((items) => items.map((item) => ({ ...item, isRead: true })));
  };
  const remove = async (id) => {
    await api.delete(`/notifications/${id}`);
    setNotifications((items) => items.filter((item) => item.id !== id));
  };

  if (!notifications) return <Loader label="Loading notifications" />;
  const unread = notifications.filter((item) => !item.isRead).length;
  return (
    <>
      <PageHeader
        eyebrow="Inbox"
        title="Notifications"
        description={`${unread} unread update${unread === 1 ? "" : "s"} about your leave workflow.`}
        actions={unread > 0 && <button className="button secondary" onClick={readAll}><FiCheck /> Mark all read</button>}
      />
      {error && <div className="form-alert error">{error}</div>}
      <section className="panel notification-list">
        {notifications.length ? notifications.map((notification) => {
          const Icon = iconByType[notification.type] || FiInfo;
          return (
            <article className={notification.isRead ? "" : "unread"} key={notification.id} onClick={() => read(notification)}>
              <span className={`notification-icon ${notification.type}`}><Icon /></span>
              <div><strong>{notification.title}</strong><p>{notification.message}</p><small>{formatDate(notification.createdAt, { hour: "2-digit", minute: "2-digit" })}</small></div>
              {!notification.isRead && <span className="unread-dot" />}
              <button className="icon-button small" onClick={(event) => { event.stopPropagation(); remove(notification.id); }}><FiTrash2 /></button>
            </article>
          );
        }) : <EmptyState icon="◌" title="You’re all caught up" description="Workflow updates will appear here." />}
      </section>
    </>
  );
}
