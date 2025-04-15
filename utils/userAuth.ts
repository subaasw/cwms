import { UPLOAD_URL, USER_URL } from "./apiConstant";
import { ServerCall } from "./serverCall";

export default class UserAuthService {
  serverCall: ServerCall;
  constructor() {
    this.serverCall = new ServerCall();
  }

  login(credentials: { email: string; password: string }) {
    return this.serverCall.post<any>(USER_URL.AUTH.login, credentials);
  }

  register(userData: any) {
    return this.serverCall.post<any>(USER_URL.AUTH.register, userData);
  }

  logout() {
    return this.serverCall.delete<any>(USER_URL.AUTH.logout);
  }

  uploadImage(file: FormData) {
    return this.serverCall.post<any>(UPLOAD_URL, file);
  }

  updateProfile(userData: any) {
    return this.serverCall.put<any>(USER_URL.USER.profile, userData);
  }

  getProfile() {
    return this.serverCall.get<any>(USER_URL.USER.me);
  }

  pickupRequest(pickupData: any) {
    return this.serverCall.post<any>(USER_URL.USER.pickupRequest, pickupData);
  }

  pickupHistory(params?: any) {
    return this.serverCall.get<any>(USER_URL.USER.pickupRequest, params);
  }

  getNotifications(params?: any) {
    return this.serverCall.get<any>(USER_URL.USER.notifications, params);
  }

  postReportIssue(pickupData: any) {
    return this.serverCall.post<any>(USER_URL.USER.reportIssues, pickupData);
  }

  getCommunities() {
    return this.serverCall.get<any>(USER_URL.communities);
  }
}

export const userAuthService = new UserAuthService();
