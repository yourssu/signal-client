import { GA_ID, MIXPANEL_TOKEN } from "@/env";
import ReactGA4 from "react-ga4";
import mixpanel from "mixpanel-browser";
import type { MeetingMemberRequest } from "@/types/meeting";
import type { Gender } from "@/types/profile";

if (MIXPANEL_TOKEN) {
  mixpanel.init(MIXPANEL_TOKEN);
}

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

export const profileFeaturesSubmit = (features: string[]) =>
  track("profile_features_submit", {
    feature_count: features.length,
    // 시트가 정한 키는 feature1~3_content 셋뿐이다.
    ...Object.fromEntries(
      features
        .slice(0, 3)
        .map((content, index) => [`feature${index + 1}_content`, content]),
    ),
  });

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

/**
 * 궁합 라벨 문구. 서버가 boolean을 주지 않아 compatibilityLabel 문자열로 역산한다.
 * dev deck 남녀 139건에서 값은 이 셋(또는 없음)뿐이었다.
 * 서버가 문구를 바꾸면 에러 없이 셋 다 false로 떨어지므로 여기를 같이 고쳐야 한다.
 */
const COMPATIBILITY_LABELS = {
  appearance: "얼굴합 레전드 조합!",
  inner: "내면의 소울메이트예요",
  best: "시그널이 고른 운명의 상대",
} as const;

export const contactClick = (
  targetUserId: string | number,
  compatibilityLabel?: string,
) =>
  track("contact_click", {
    target_user_id: String(targetUserId),
    // apperance는 시트 원문의 오타지만 대시보드가 이 이름으로 잡혀 있다.
    is_good_apperance_couple:
      compatibilityLabel === COMPATIBILITY_LABELS.appearance,
    is_good_inner_couple: compatibilityLabel === COMPATIBILITY_LABELS.inner,
    is_best_couple: compatibilityLabel === COMPATIBILITY_LABELS.best,
  });

export const contactCheckClick = (
  hasTicket: boolean,
  targetUserId: string | number,
) =>
  track("contact_check_click", {
    has_ticket: hasTicket,
    target_user_id: String(targetUserId),
  });

export const contactCancelClick = () => track("contact_cancel_click");

export const contactAnotherSignalClick = (sourcePage: string) =>
  track("contact_another_signal_click", { source_page: sourcePage });

export const contactDetailClick = () => track("contact_detail_click");

export const contactListClick = (sourcePage: string) =>
  track("contact_list_click", { source_page: sourcePage });

export const chargeTicketView = (sourceCard: string) =>
  track("charge_ticket_view", { source_card: sourceCard });

export const chargeTicketClick = (selectPurchasingTicket: number | string) =>
  track("charge_ticket_click", {
    select_purchasing_ticket: selectPurchasingTicket,
  });

export const chargeAccountClick = () => track("charge_account_click");

export const chargeBackClick = () => track("charge_back_click");

export const chargeAccountConfirmClick = (
  isValid: boolean,
  purchasedTicket: number,
) =>
  track("charge_account_confirm_click", {
    is_valid: isValid,
    purchased_ticket: purchasedTicket,
  });

export const chargeAccountFaultClick = () =>
  track("charge_account_fault_click");

export const chargeTossClick = () => track("charge_toss_click");

export const chargeTossConfirmClick = (purchasedTicket: number) =>
  track("charge_toss_confirm_click", { purchased_ticket: purchasedTicket });

export const chargeKakaoConfirmClick = () =>
  track("charge_kakao_confirm_click");

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

export const mypageLoginClick = (sourceCard: string) =>
  track("mypage_login_click", { source_card: sourceCard });

export const mypageRankingClick = (data?: {
  profileViewCount: number;
  profileViewRank: number;
}) =>
  track(
    "mypage_ranking_click",
    data && {
      profile_view_count: data.profileViewCount,
      profile_view_rank: data.profileViewRank,
    },
  );

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

export const swipeStart = (direction: "left" | "right", profileId: number) =>
  track("swipe_start", { direction, profile_id: profileId });

export const swipeStop = (direction: "left" | "right", profileId: number) =>
  track("swipe_stop", { direction, profile_id: profileId });

export const lobbyViewed = () => track("lobby_viewed");

export const profileSimilarCelebClick = (celebrityName: string) =>
  track("profile_similar_celeb_click", { celebrity_name: celebrityName });

export const meetingSignalClick = (isRegistered: boolean) =>
  track("meeting_signal_click", { is_registered: isRegistered });

export const roomCreateClick = (isRegistered: boolean) =>
  track("room_create_click", { is_registered: isRegistered });

// profile_gender_submit이 소문자로 보내고 있어 같은 값으로 맞춘다.
const toGenderParam = (gender: Gender) =>
  gender === "MALE" ? "male" : "female";

const memberParams = (prefix: string, member: MeetingMemberRequest) => ({
  [`${prefix}_birth`]: member.birthYear,
  [`${prefix}_major`]: member.department,
  [`${prefix}_gender`]: toGenderParam(member.gender),
});

/**
 * 인원이 가변이라 person_1_birth처럼 순번을 키에 박아 펼친다.
 * 빈 순번을 null로 채우면 집계에 빈 값이 섞이므로 있는 사람 것만 넣는다.
 */
const membersParams = (members: MeetingMemberRequest[]) =>
  members.reduce<Record<string, unknown>>(
    (params, member, index) => ({
      ...params,
      ...memberParams(`person_${index + 1}`, member),
    }),
    {},
  );

export const roomOnboardingNextClick = (data: {
  members: MeetingMemberRequest[];
  leader: MeetingMemberRequest | null;
}) =>
  track("room_onboarding_next_click", {
    // 정원은 방장을 포함해 센다. 화면의 "N인 방 만들기"와 같은 수다.
    people_count: data.members.length + 1,
    ...membersParams(data.members),
    ...(data.leader ? memberParams("leader", data.leader) : {}),
  });

export const roomCreateCompleteClick = (roomIntro: string) =>
  track("room_create_complete_click", { room_intro: roomIntro });

export const roomDeleteClick = () => track("room_delete_click");

export const roomDeleteCompleteClick = (roomRunTime: number) =>
  track("room_delete_complete_click", { room_run_time: roomRunTime });

export const roomDetailClick = (data: {
  targetRoomIntro: string;
  targetRoomPeopleCount: number;
}) =>
  track("room_detail_click", {
    target_room_intro: data.targetRoomIntro,
    target_room_people_count: data.targetRoomPeopleCount,
  });

export const roomParticipateClick = (isRegistered: boolean) =>
  track("room_participate_click", { is_registered: isRegistered });

// onboardig는 택소노미 시트의 오타지만 대시보드가 이 이름으로 잡혀 있어 그대로 둔다.
export const roomParticipateOnboardingCompleteClick = (
  members: MeetingMemberRequest[],
) =>
  track("room_participate_onboardig_complete_click", {
    people_count: members.length,
    ...membersParams(members),
  });

export const roomContactClick = () => track("room_contact_click");

export const textContentsCopyClick = () => track("text_contents_copy_click");

export const meetingManualClick = () => track("meeting_manual_click");

export const meetingReferralClick = () => track("meeting_referral_click");
