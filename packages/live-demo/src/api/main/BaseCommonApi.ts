import { request, getAuthorization } from '../utils';
import {
  GetAccountInfoAccountIdParams, GetAccountInfoAccountIdResult,
  GetSmsCodeParams,
  GetSmsCodeResult,
  SignUpOrInParams,
  SignUpOrInResult
} from '../types';

const PREFIX = `v1`;

export class BaseCommonApi {
  /**
   * 注册&登录
   * @param params
   */
  static signUpOrIn(params: SignUpOrInParams) {
    return request.post<SignUpOrInResult['data'], SignUpOrInResult['data']>(`${PREFIX}/signUpOrIn`, params);
  }

  /**
   * 获取短信验证码
   * @param params
   */
  static getSmsCode(params: GetSmsCodeParams) {
    return request.post<GetSmsCodeResult['data'], GetSmsCodeResult['data']>(`${PREFIX}/getSmsCode`, params);
  }

  /**
   * 用户信息获取
   * @param params
   */
  static getAccountInfo(params?: GetAccountInfoAccountIdParams) {
    const url = params?.accountId ? `${PREFIX}/accountInfo/${params.accountId}` : `${PREFIX}/accountInfo`;
    return request.get<GetAccountInfoAccountIdResult['data'], GetAccountInfoAccountIdResult['data']>(url, {
      headers: {
        Authorization: getAuthorization()
      }
    });
  }
}
