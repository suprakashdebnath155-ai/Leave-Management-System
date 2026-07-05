const { db } = require("../config/firebase");

const writeAuditLog = async ({
  actorId,
  action,
  entityType,
  entityId,
  details = {},
}) => {
  await db.collection("auditLogs").add({
    actorId,
    action,
    entityType,
    entityId,
    details,
    createdAt: new Date(),
  });
};

module.exports = { writeAuditLog };
