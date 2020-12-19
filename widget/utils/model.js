import {Config} from './config.js';

class Model {
  constructor() {}
}

/*获取轮播图列表*/
Model.getbannersList = function(param, callback) {
  param.url = Config.getbannersList;
  this.request(param, callback);
}

/*获取轮播图详情*/
Model.getbannersInfo = function(param, callback) {
  param.url = Config.getbannersInfo;
  this.request(param, callback);
}

/*获取系统配置*/
Model.getProjectConfigssInfo = function(param, callback) {
  param.url = Config.getProjectConfigssInfo;
  this.request(param, callback);
}

/*获取案例列表*/
Model.getCasesList = function(param, callback) {
  param.url = Config.getCasesList;
  this.request(param, callback);
}

/*获取案例详情*/
Model.getCasesInfo = function(param, callback) {
  param.url = Config.getCasesInfo;
  this.request(param, callback);
}

  /*获取加盟代理内容列表*/
Model.getFranchiseList = function(param, callback) {
  param.url = Config.getFranchiseList;
  this.request(param, callback);
}

/*获取加盟代理内容详情*/
Model.getFranchiseDetail = function(param, callback) {
  param.url = Config.getFranchiseDetail;
  this.request(param, callback);
}

/*提交加盟请求*/
Model.postFranchiseAgentApplies = function(param, callback) {
  param.url = Config.postFranchiseAgentApplies;
  param.method = 'post';
  this.request(param, callback);
}

Model.request = function(p, callback) {
  var param = p;
  if (!param.headers) {
      param.headers = {};
  }
  param.headers['x-apicloud-mcm-key'] = 'SZRtDyzM6SwWCXpZ';
  if (param.data && param.data.body) {
      param.headers['Content-Type'] = 'application/json; charset=utf-8';
  }
  if (param.url) {
      param.url = Config.restUrl + param.url;
  }
  api.ajax(param, function(ret, err) {
      callback && callback(ret, err);
  });
}

export {Model};