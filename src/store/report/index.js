import * as actions from '@controleonline/ui-default/src/store/default/actions';
import * as getters from '@controleonline/ui-default/src/store/default/getters';
import mutations from '@controleonline/ui-default/src/store/default/mutations';
import * as customActions from './customActions';

export default {
  namespaced: true,
  state: {
    item: null,
    items: [],
    resourceEndpoint: '/report/orders/operational-insights',
    isLoading: false,
    isSaving: false,
    error: '',
    totalItems: 0,
    summary: {
      current: null,
      comparison: null,
      errors: {},
      meta: {},
    },
    filters: {},
    columns: [],
    messages: [],
    message: {},
    selections: {},
    selectorModalKey: '',
    activeRequestKey: '',
    lastCompletedRequest: null,
    loadedKey: '',
    loadedAt: 0,
    reload: false,
  },
  actions: {
    ...actions,
    ...customActions,
  },
  getters,
  mutations,
};

export * from './customActions';
