/**
 * User account entry that would be stored in 
 * browser storage. Contains user account name
 * and private key for authenticating given user
 * in both dApp and blockchain. 
 */
export class UserAccount {
    readonly name: string;
    readonly privateKey: string;
}

/** Browser storage alias for account entry  */
const accountAlias = 'user-account';

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
export async function storeAccount(account: UserAccount): Promise<void> {
    return browser.storage.local
        .set({ [accountAlias]: account });
}

/**
 * Retrieves currently logged user account
 * @returns user account
 */
export async function getCurrentAccount(): Promise<UserAccount> {
    return browser.storage.local
        .get(accountAlias)
        .then(storage => storage[accountAlias]);
}

/**
 * Retrieves currently logged user account name
 * @returns user account name
 */
export async function getCurrentAccountName(): Promise<string> {
    return getCurrentAccount()
        .then(account => account.name);
}

/**
 * Check any user account is set.
 */
export async function accountIsSet(): Promise<boolean> {
    return getCurrentAccount()
        .then(user => !!user);
}

/**
 * Removes user account info from browser storage
 */
export async function removeAccount(): Promise<void> {
    return browser.storage.local
        .remove(accountAlias);
}