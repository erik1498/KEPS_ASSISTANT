import * as api from '../helper/api.helper';

export const _shapeMethodGet = (url, tokenCancel, isMsgCatch = true) => {
  return api
    .get(url)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      // notify.error(err.message)
      console.log(err);
    });
};

export const _shapeMethodPost = (
  url,
  payload = {},
  isMsgSuccess = true,
  tokenCancel = '',
  isFormData = false,
) => {
  const newConfigHeads = {};
  if (isFormData) {
    newConfigHeads['Content-Type'] = 'multipart/form-data';
  }

  return api
    .post(
      url,
      payload,
      {},
      {
        ...newConfigHeads,
      },
    )
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      // notify.error(err.message)
      console.log(err);
    });
};

export const _shapeMethodPut = (
  url,
  payload = {},
  isMsgSuccess = true,
  tokenCancel = '',
  isFormData = false,
) => {
  const newConfigHeads = {};
  if (isFormData) {
    newConfigHeads['Content-Type'] = 'multipart/form-data';
  }

  return api
    .put(
      url,
      payload,
      {},
      {
        ...newConfigHeads,
      },
    )
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      // notify.error(err.message)
      console.log(err);
    });
};

export const _shapeMethodDel = (url, tokenCancel = '', isMsgSuccess = true) => {
  const others = tokenCancel ? {} : {};
  return api
    .del(url, others)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err
    });
};

export const _shapeMethodGetSearch = (
  url,
  search = {},
  tokenCancel = '',
  isMsgSuccess = true,
) => {
  return _shapeMethodGet(url, tokenCancel);
};

// === CONFIG SHAPE CRUD (CREATE, ADD, UPDATE, DELETE)
export const _shapeObjectMethodCRUD = (urlCURD = {}, tokenCancel = 'tc') => {
  return {
    list: (search = {}) =>
      _shapeMethodGetSearch(
        urlCURD.main,
        search,
        tokenCancel + 'list' + urlCURD.main,
      ),
    detail: (id) =>
      _shapeMethodGet(
        urlCURD.detail(id),
        tokenCancel + 'detail' + urlCURD.main,
      ),
    add: (formRequest = {}) => _shapeMethodPost(urlCURD.main, formRequest),
    update: (id, formRequest = {}) =>
      _shapeMethodPut(urlCURD.update(id), formRequest),
    delete: (id) => _shapeMethodDel(urlCURD.delete(id)),
    custom: (urlAdded, method, headers, others) => {
      return api
        .configMethod(method, urlCURD.main.concat(urlAdded), headers, others)
        .then((res) => {
          return res.data
        })
    },
    getUrlCRUD: () => {
      return urlCURD.main
    }
  };
};
