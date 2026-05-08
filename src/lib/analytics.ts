import { GA_ID, MIXPANEL_TOKEN } from "@/env";
import ReactGA4 from "react-ga4";
import mixpanel from "mixpanel-browser";

const track = (eventName: string, params?: Record<string, unknown>) => {
  if (GA_ID) ReactGA4.event(eventName, params);
  if (MIXPANEL_TOKEN) mixpanel.track(eventName, params);
};

export const startPageViewed = () => track("start_page_viewed");

export const profileRegisterClick = () => track("profile_register_click");

export const profileGenderSubmit = (selectedGender: string) =>
  track("profile_gender_submit", { selected_gender: selectedGender });

export const profileInfoSubmit = (data: {
  enteredMbti: string;
  selectedType: string;
  anotherSchool: boolean;
  enteredMajor: string;
  enteredAge: number;
}) =>
  track("profile_info_submit", {
    entered_mbti: data.enteredMbti,
    selected_type: data.selectedType,
    another_school: data.anotherSchool,
    entered_major: data.enteredMajor,
    entered_age: data.enteredAge,
  });

export const profileAnimalSubmit = (selectedAnimal: string) =>
  track("profile_animal_submit", { selected_animal: selectedAnimal });

export const profileFeaturesSubmit = (featureCount: number) =>
  track("profile_features_submit", { feature_count: featureCount });

export const profileAiNicknameClick = () => track("profile_ai_nickname_click");

export const profileNicknameSubmit = (generatedNickname: string) =>
  track("profile_nickname_submit", { generated_nickname: generatedNickname });

export const profileContactDetailSubmit = (data: {
  contactInformation: string;
  totalTimeSpent: number;
}) =>
  track("profile_contact_detail_submit", {
    contact_information: data.contactInformation,
    total_time_spent: data.totalTimeSpent,
  });

export const profileGoogleLoginClick = () =>
  track("profile_google_login_click");

export const signalSendClick = (isRegistered: boolean) =>
  track("signal_send_click", { is_registered: isRegistered });

export const contactClick = (targetUserId: string | number) =>
  track("contact_click", { target_user_id: String(targetUserId) });

export const contactCheckClick = (hasTicket: boolean) =>
  track("contact_check_click", { has_ticket: hasTicket });

export const contactCancelClick = () => track("contact_cancel_click");

export const contactAnotherSignalClick = (sourcePage: string) =>
  track("contact_another_signal_click", { source_page: sourcePage });

export const chargeTicketView = (sourceCard: string) =>
  track("charge_ticket_view", { source_card: sourceCard });

export const chargeTicketClick = (selectPurchasingTicket: number | string) =>
  track("charge_ticket_click", {
    select_purchasing_ticket: selectPurchasingTicket,
  });

export const chargeAccountClick = () => track("charge_account_click");

export const chargeBackClick = () => track("charge_back_click");

export const chargeAccountConfirmClick = (isValid: boolean) =>
  track("charge_account_confirm_click", { is_valid: isValid });

export const chargeAccountFaultClick = () =>
  track("charge_account_fault_click");

export const chargeTossClick = () => track("charge_toss_click");

export const chargeTossConfirmClick = () => track("charge_toss_confirm_click");

export const chargeKakaoConfirmClick = () => track("charge_kakao_confirm_click");

export const mypageView = (userStatus: string) =>
  track("mypage_view", { user_status: userStatus });

export const rankingShareClick = (data: {
  profileViewCount: number;
  profileViewRank: number;
}) =>
  track("ranking_share_click", {
    profile_view_count: data.profileViewCount,
    profile_view_rank: data.profileViewRank,
  });

export const mypageRegisterClick = (sourceCard: string) =>
  track("mypage_register_click", { source_card: sourceCard });

export const mypageAccountConnectClick = () =>
  track("mypage_account_connect_click");

export const myprofileView = (sourcePage: string) =>
  track("myprofile_view", { source_page: sourcePage });

export const myprofileEditView = (sourcePage: string) =>
  track("myprofile_edit_view", { source_page: sourcePage });

export const myprofileEditCompleteClick = (data: {
  edittedNickname: string;
  edittedContactAdress: string;
}) =>
  track("myprofile_edit_complete_click", {
    editted_nickname: data.edittedNickname,
    editted_contact_adress: data.edittedContactAdress,
  });

export const myprofileLockClick = () => track("myprofile_lock_click");

export const myprofileLockCheckClick = (lockedUserId: string | number) =>
  track("myprofile_lock_check_click", { locked_user_id: String(lockedUserId) });

export const viewProfile = (profileId: number) =>
  track("view_profile", { profile_id: profileId });

export const swipeStart = (direction: "left" | "right", profileId: number) =>
  track("swipe_start", { direction, profile_id: profileId });

export const swipeComplete = (
  direction: "left" | "right",
  profileId: number,
) => track("swipe_complete", { direction, profile_id: profileId });

export const swipeStop = (direction: "left" | "right", profileId: number) =>
  track("swipe_stop", { direction, profile_id: profileId });
