import { GA_ID, TICKET_COST, TICKET_PACKAGES } from "@/env";
import { ProfileContactResponse } from "@/types/profile";
import { Package, ViewerResponse } from "@/types/viewer";
import ReactGA4 from "react-ga4";

export const purchaseTickets = (
  pkg: Package,
  verificationCode: number,
  discounted: boolean,
) => {
  if (!GA_ID) return;
  ReactGA4.event("purchase", {
    currency: "KRW",
    value: pkg.price[discounted ? 0 : 1],
    transaction_id: verificationCode.toString(),
    items: [
      {
        item_id: pkg.id,
        item_name: pkg.name,
        price: pkg.price[discounted ? 0 : 1],
        quantity: 1,
        discount: discounted ? pkg.price[1] - pkg.price[0] : 0,
        ticket_quantity: pkg.quantity[discounted ? 0 : 1],
      },
    ],
  });
  ReactGA4.event("earn_virtual_currency", {
    virtual_currency_name: "티켓",
    value: pkg.quantity[discounted ? 0 : 1],
  });
};

export const viewPackages = (discounted: boolean) =>
  GA_ID &&
  ReactGA4.event("view_item_list", {
    currency: "KRW",
    item_list_id: "tickets",
    item_list_name: "티켓 패키지",
    items: TICKET_PACKAGES.map((pkg) => ({
      item_id: pkg.id,
      item_name: pkg.name,
      price: pkg.price[discounted ? 0 : 1],
      quantity: 1,
      discount: discounted ? pkg.price[1] - pkg.price[0] : 0,
      ticket_quantity: pkg.quantity[discounted ? 0 : 1],
    })),
  });

export const selectPackage = (pkg: Package, discounted: boolean) =>
  GA_ID &&
  ReactGA4.event("select_item", {
    currency: "KRW",
    item_list_id: "tickets",
    item_list_name: "티켓 패키지",
    items: [
      {
        item_id: pkg.id,
        item_name: pkg.name,
        price: pkg.price[discounted ? 0 : 1],
        quantity: 1,
        discount: discounted ? pkg.price[1] - pkg.price[0] : 0,
        ticket_quantity: pkg.quantity[discounted ? 0 : 1],
      },
    ],
  });

export const viewProfile = (profileId: number) =>
  GA_ID &&
  ReactGA4.event("view_profile", {
    profile_id: profileId,
  });

export const viewContact = (
  profile: ProfileContactResponse,
  viewer: ViewerResponse,
) => {
  if (!GA_ID) return;
  ReactGA4.event("view_contact", {
    profile_id: profile.profileId,
    profile: {
      animal: profile.animal,
      birth_year: profile.birthYear,
      mbti: profile.mbti,
      department: profile.department,
      nickname: profile.nickname,
      intro_sentences: profile.introSentences,
    },
    viewer: {
      ticket: viewer.ticket,
      used_ticket: viewer.usedTicket,
    },
  });

  ReactGA4.event("spend_virtual_currency", {
    virtual_currency_name: "티켓",
    value: TICKET_COST,
  });
};

export const funnelStart = (id: string, name: string) =>
  GA_ID && ReactGA4.event("funnel_start", { id, name });

export const funnelStep = <T>(
  id: string,
  name: string,
  step: string,
  context: T,
) => GA_ID && ReactGA4.event("funnel_step", { id, name, step, context });

export const funnelComplete = <T>(id: string, name: string, context: T) =>
  GA_ID && ReactGA4.event("funnel_complete", { id, name, context });

export const buttonClick = (id: string, name: string) =>
  GA_ID && ReactGA4.event("button_click", { id, name });

export const swipeStart = (direction: "left" | "right", profileId: number) =>
  GA_ID && ReactGA4.event("swipe_start", { direction, profile_id: profileId });

export const swipeComplete = (direction: "left" | "right", profileId: number) =>
  GA_ID &&
  ReactGA4.event("swipe_complete", {
    direction,
    profile_id: profileId,
  });

export const swipeStop = (direction: "left" | "right", profileId: number) =>
  GA_ID &&
  ReactGA4.event("swipe_stop", {
    direction,
    profile_id: profileId,
  });
