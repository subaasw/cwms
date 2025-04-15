import { EventEmitter } from "events";

export default class NotificationEvents extends EventEmitter {
  static ADMIN_EVENTS = {
    PICKUP: {
      APPROVED: "admin:pickup:approved",
      COMPLETED: "admin:pickup:completed",
      REJECTED: "admin:pickup:rejected",
    },
    ANNOUNCEMENT: {
      CREATED: "admin:announcement:created",
    },
    REPORT: {
      STATUS_UPDATED: "admin:report:status_updated",
      RESOLVED: "admin:report:resolved",
    },
    COMMUNITY: {
      CREATED: "admin:community:created",
      UPDATED: "admin:community:updated",
      MEMBER_ADDED: "admin:community:member_added",
    },
  };

  static USER_EVENTS = {
    PICKUP: {
      CREATED: "user:pickup:created",
      CANCELLED: "user:pickup:cancelled",
    },
    REPORT: {
      CREATED: "user:report:created",
      UPDATED: "user:report:updated",
    },
  };
}

export const notificationEvents = new NotificationEvents();
