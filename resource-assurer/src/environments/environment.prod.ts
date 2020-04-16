export const environment = {
  production: true
};

export const init = () => { };

export const variables = {
  /** 
   * Time period after report creation 
   * until it can be expired
   * Period is a week
   */
  holdPeriod: 7 * 24 * 3600 * 1000,

  /** 
   * Time period after expiration
   * until it can be cleaned.
   * Period is 3 days
   */
  freezePeriod: 3 * 24 * 3600 * 1000
};