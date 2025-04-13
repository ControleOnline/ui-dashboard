import { api } from "@controleonline/ui-common/src/api";

import * as types from "@controleonline/ui-default/src/store/default/mutation_types";

export function getHoursTicket ({ commit }, data) {
  commit(types.SET_ISLOADING);

  const options = {
    method: "GET",
    params: data || {},
  };

  return api
    .fetch("/qtd_vehicles/", options)

    .then((data) => {
      commit(types.SET_ISLOADING, false);

      return data["member"] || null;
    })
    .catch((e) => {
      commit(types.SET_ISLOADING, false);

      commit(types.SET_ERROR, e.message);
      throw e;
    });
}

export function getTicketValue ({ commit }, data) {
  commit(types.SET_ISLOADING);

  const options = {
    method: "GET",
    params: data || {},
  };

  return api
    .fetch("/qtd_vehicles/", options)

    .then((data) => {
      commit(types.SET_ISLOADING, false);

      return data["member"] || null;
    })
    .catch((e) => {
      commit(types.SET_ISLOADING, false);

      commit(types.SET_ERROR, e.message);
      throw e;
    });
}
