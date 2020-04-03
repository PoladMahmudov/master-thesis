import { UserAccount } from './user-accout';

export class AccountStorageHelper {

    /** Browser storage alias for account entry  */
    public static readonly ACCOUNT_ALIAS = 'user-account';

    /**
     * Stores given user account entry in browser storage.
     * Example of how it is represented in store given below.
     * 
     * @example 
     * {
     *     "user-account": {
     *         "name": "bob";
     *         "privateKey": "5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3";
     *     } 
     * } 
     * @param account 
     */
    public async store(account: UserAccount): Promise<void> {
        return browser.storage.local
            .set({ [AccountStorageHelper.ACCOUNT_ALIAS]: account });
    }

    /**
     * Retrieves currently logged user account
     * @returns user account
     */
    public async getCurrent(): Promise<UserAccount> {
        return browser.storage.local
            .get(AccountStorageHelper.ACCOUNT_ALIAS)
            .then(storage => storage[AccountStorageHelper.ACCOUNT_ALIAS]);
    }

    /**
     * Retrieves currently logged user account name
     * @returns user account name
     */
    public getCurrentName(): Promise<string> {
        return this.getCurrent()
            .then(account => account.name);
    }

    /**
     * Check any user account is set.
     */
    public async isSet(): Promise<boolean> {
        return this.getCurrent()
            .then(user => !!user);
    }

    /**
     * Removes user account info from browser storage
     */
    public async remove(): Promise<void> {
        return browser.storage.local
            .remove(AccountStorageHelper.ACCOUNT_ALIAS);
    }
}