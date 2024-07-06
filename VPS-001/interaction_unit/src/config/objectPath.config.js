import * as _ from 'lodash';

export const objectPathMenu = (name = '', detail = '/:id', edit = '/') => {
  const main = '/' + name;

  return {
    main,
    add: main + '/add',
    detail: (id = ':id') => main + '/' + id + '/detail',
    edit: (id = ':id') => main + '/' + id + '/edit',
  };
};

export const objectPathEndPointAPI = (menu = '', addFeatures = []) => {
  const _configWithId = (menuId, name) => menu + '/' + menuId + name;

  const features = {};
  if(addFeatures.length > 0) {
    addFeatures.map((vm) => {
      const { name, path, isMenuId = false } = vm;

      if (!_.isEmpty(name)) {
        features[name] = isMenuId
          ? (menuId) => _configWithId(menuId, path)
          : menu + path;
      }
    });
  }

  return {
    main: menu,
    detail: (menuId) => _configWithId(menuId, ''),
    update: (menuId) => _configWithId(menuId, ''),
    delete: (menuId) => _configWithId(menuId, ''),
    ...features,
  };
};
