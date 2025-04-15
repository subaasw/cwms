import { UPLOAD_URL, ADMIN_URL } from "./apiConstant";
import { ServerCall } from "./serverCall";

export default class AdminAuthService {
  serverCall: ServerCall;
  constructor() {
    this.serverCall = new ServerCall();
  }

  login(credentials: { email: string; password: string }) {
    return this.serverCall.post<any>(ADMIN_URL.AUTH.login, credentials);
  }

  register(userData: any) {
    return this.serverCall.post<any>(ADMIN_URL.AUTH.register, userData);
  }

  logout() {
    return this.serverCall.delete<any>(ADMIN_URL.AUTH.logout);
  }

  uploadImage(file: FormData) {
    return this.serverCall.post<any>(UPLOAD_URL, file);
  }

  updateProfile(userData: any) {
    return this.serverCall.put<any>(ADMIN_URL.admin.profile, userData);
  }

  getProfile() {
    return this.serverCall.get<any>(ADMIN_URL.admin.me);
  }

  fetchCommunities() {
    return this.serverCall.get<any>(ADMIN_URL.admin.communities.all);
  }

  addNewCommunity(communityData: any) {
    return this.serverCall.post<any>(
      ADMIN_URL.admin.communities.DEFAULT,
      communityData
    );
  }

  updateCommunity(id: string, communityData: any) {
    return this.serverCall.put<any>(
      ADMIN_URL.admin.communities.single(id),
      communityData
    );
  }

  addUserToCommunity(id: string, userData: any) {
    return this.serverCall.put<any>(ADMIN_URL.admin.me);
  }
}

export const adminAuthService = new AdminAuthService();
