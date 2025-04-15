const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const UPLOAD_URL = BASE_URL + "/image/upload";

const USER_URL = {
  AUTH: {
    login: "/auth/user/login",
    register: "/auth/user/register",
    logout: "/auth/user/logout",
  },
  USER: {
    me: "/user/me",
    profile: "/user/profile",
    pickupRequest: "/user/pickup-requests",
    reportIssues: "/user/report-issues",
    notifications: "/user/notifications",
  },
  communities: "/communities",
};

const ADMIN_URL = {
  AUTH: {
    login: "/auth/admin/login",
    register: "/auth/admin/register",
    logout: "/auth/admin/logout",
  },
  admin: {
    me: "/admin/me",
    profile: "/admin/me",

    communities: {
      all: "/communities",
      DEFAULT: "/admin/communities",
      add: "/admin/communities/add",
      single: (id: string) => `/admin/communities/${id}`,
    },
  },
};

export { BASE_URL, USER_URL, UPLOAD_URL, ADMIN_URL };
