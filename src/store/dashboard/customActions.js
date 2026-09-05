import { api } from "@controleonline/ui-common/src/api";
import * as types from "@controleonline/ui-default/src/store/default/mutation_types";

function hydrateMembers(payload) {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.member)) return payload.member;
  if (Array.isArray(payload["hydra:member"])) return payload["hydra:member"];
  return [];
}

function dateParams(data) {
  const params = { ...(data || {}) };
  if (params.date && typeof params.date === "object") {
    const after = params.date.after;
    const before = params.date.before;
    delete params.date;
    if (after) params["date[after]"] = after;
    if (before) params["date[before]"] = before;
  }
  return params;
}

function getCollection({ commit }, path, data) {
  commit(types.SET_ISLOADING);
  return api
    .fetch(path, { method: "GET", params: dateParams(data) })
    .then((payload) => {
      commit(types.SET_ISLOADING, false);
      return hydrateMembers(payload);
    })
    .catch((e) => {
      commit(types.SET_ISLOADING, false);
      commit(types.SET_ERROR, e.message);
      throw e;
    });
}

export function getHoursTicket({ commit }, data) {
  return getCollection({ commit }, "/order_hours", data);
}

export function getTicketValue({ commit }, data) {
  return getCollection({ commit }, "/qtd_vehicles", data);
}

export function getVehiclesValue({ commit }, data) {
  return getCollection({ commit }, "/qtd_vehicles", data);
}

export function getAttendance({ commit }, data) {
  return getCollection({ commit }, "/report/people/attendance", data);
}
