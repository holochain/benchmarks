'use strict';

/**
 * Called only once when the source chain is generated
 * @return {boolean} success
 */
function genesis () {
    // any genesis code here
    return true;
}

// -----------------------------------------------------------------
//  validation functions for every DHT entry change
// -----------------------------------------------------------------

function isWithinMyCreditLimit(entry) {
    var myBalance = getBalance();
    var me = getMe();
    if ((entry.from === me) && ((myBalance - entry.amount) < getCreditLimit())) {
        return false;
    }
    return true;
}

function getCompletion(proposalHash) {
    var links = getLinks(proposalHash,"completion",{Load:true});
    if (isErr(links)) return undefined;
    return links[0].Entry;
}

function getPreauth(preauthHash) {
    return get(preauthHash);
}

function validatePreauth(entry,balanceFunc,params) {

    // if this is a preauth cancel it will have the preauth in the payload
    if (entry.payload.hasOwnProperty("preauth")) {
        var preauth = getPreauth(entry.payload.preauth);
        if (isErr(preauth)) return false;
        if (preauth.amount != -entry.amount) {
            return false;
        }

        var completion = getCompletion(preauth.payload.proposal);
        if ((typeof(completion) === 'undefined')) return false;
        if (completion.passed === false) return true;
        return false;
    }

    // otherwise it's a initial preauth

    var exists = call('congress','proposalExists',entry.payload.proposal);
    if (exists !== "true") return false;
    var creditLimit = getCreditLimit();
    var balance = balanceFunc(creditLimit,params);
    if (balance < creditLimit) {
        return false;
    }
    balance -= entry.amount;
    if (balance < creditLimit) {
        return false;
    }
    return true;
}


function validateTransaction(entry,balanceFunc,params) {

    var isPreauthTransaction = entry.hasOwnProperty("preauth");

    // can't do a transaction with ourself unless we are paying ourself
    // back from a preauth (this is weird but the preauth validation should
    // be catching any cheating)
    if (!isPreauthTransaction && (entry.from == entry.to)) {
        return false;
    }

    if (isPreauthTransaction) {
        var preauth = getPreauth(entry.preauth);
        if (isErr(preauth)) return false;
    }

    var creditLimit = getCreditLimit();
    var balance = balanceFunc(creditLimit,params);
    if (balance < creditLimit) {
        return false;
    }
    if (entry.from === params.commiter) balance -= entry.amount;
    else balance += entry.amount;
    if (balance < creditLimit) {
        return false;
    }
    return true;
}

/**
 * Called to validate any changes to the DHT
 * @param {string} entryName - the name of entry being modified
 * @param {*} entry - the entry data to be set
 * @param {?} header - ?
 * @param {?} pkg - ?
 * @param {?} sources - ?
 * @return {boolean} is valid?
 */
function validateCommit (entryName, entry, header, pkg, sources) {
    switch (entryName) {
    case "transaction":
        return validateTransaction(entry,_getBalance,{commiter:getMe()});
    case "preauth":
        return validatePreauth(entry,_getBalance);
    default:
        // invalid entry name!!
        return false;
    }
}

// calculate balance from the chain returned in a validation package
function getChainBalance(creditLimit,params) {
    var balance = 0,
        commiter = params.commiter,
        headers = params.chain.Headers,
        entries = params.chain.Entries;
    for (var i=1;i<headers.length;i++) {
        var type = headers[i].Type;
        if (type==="preauth" || type=="transaction") {
            var entry = JSON.parse(entries[i].C);
            balance = adjustBalance(balance,headers[i].Type,entry,commiter);
        // don't validate if the balance every went lower than the credit limit
            if (balance < creditLimit) {
                break;
            }
        }
    }
    return balance;
}

/**
 * Called to validate any changes to the DHT
 * @pfaram {string} entryName - the name of entry being modified
 * @param {*} entry - the entry data to be set
 * @param {?} header - ?
 * @param {?} pkg - ?
 * @param {?} sources - ?
 * @return {boolean} is valid?
 */
function validatePut (entryName, entry, header, pkg, sources) {
    var commiter = sources[0];
    switch (entryName) {
    case "transaction":
        return validateTransaction(entry,getChainBalance,{chain:pkg.Chain,commiter:commiter});
    case "preauth":
        return validatePreauth(entry,getChainBalance,{chain:pkg.Chain,commiter:commiter});
    default:
        // invalid entry name!!
        return false;
    }
}

/**
 * Called to validate any changes to the DHT
 * @param {string} entryName - the name of entry being modified
 * @param {*} entry - the entry data to be set
 * @param {?} header - ?
 * @param {*} replaces - the old entry data
 * @param {?} pkg - ?
 * @param {?} sources - ?
 * @return {boolean} is valid?
 */
function validateMod (entryName, entry, header, replaces, pkg, sources) {
    switch (entryName) {
    case "transaction":
        // validation code here
        return false;
    default:
        // invalid entry name!!
        return false;
    }
}

/**
 * Called to validate any changes to the DHT
 * @param {string} entryName - the name of entry being modified
 * @param {string} hash - the hash of the entry to remove
 * @param {?} pkg - ?
 * @param {?} sources - ?
 * @return {boolean} is valid?
 */
function validateDel (entryName, hash, pkg, sources) {
    switch (entryName) {
    case "transaction":
        // validation code here
        return false;
    default:
        // invalid entry name!!
        return false;
    }
}

/**
 * Called to get the data needed to validate
 * @param {string} entryName - the name of entry to validate
 * @return {*} the data required for validation
 */
function validatePutPkg (entryName) {
    var req = {};
    req[HC.PkgReq.Chain]=HC.PkgReq.ChainOpt.Full;
    //req["types"]=["xxx"];
    return req;
}

/**
 * Called to get the data needed to validate
 * @param {string} entryName - the name of entry to validate
 * @return {*} the data required for validation
 */
function validateModPkg (entryName) {
    return null;
}

/**
 * Called to get the data needed to validate
 * @param {string} entryName - the name of entry to validate
 * @return {*} the data required for validation
 */
function validateDelPkg (entryName) {
    return null;
}

// exposed functions -----------------------------------------------

/**
 * commits a new transaction to the chain by communicating with
 * the node the
 * @param {object} parameters - An object with the following properties:
 *    {string} role - must be string 'spender' or 'receiver'
 *    {string} who - if role is 'spender' specifies address of funds receiver
 *    {float} amount - transaction amount
 *    {string} description - transaction notes/description
 *    {string} preauth - if role is 'receiver' preauth is the has of the preauth entry
 *    {string} from - if role is 'receiver' specifies address of funds spender
 * @return {string} the transaction hash
 */
function transactionCreate(params) {
    var from, to;
    // if the spender is creating the transaction
    // it gets confirmed by the receiver before commiting
    if (params.role === 'spender') {
        from = getMe();
        to = params.who;

        var potentialEntry = {
            from: from,
            to: to,
            amount: params.amount,
            description: params.description
        };

        var response = send(to, potentialEntry);
        if(response) {
            return commit('transaction', potentialEntry);
        }
    }

    // if the receiver is creating the transaction
    // there must have been a preauth, and it can be commited
    // directly
    if (params.role === 'receiver') {
        var entry = {
            from: params.from,
            to: getMe(),
            amount: params.amount,
            description: params.description,
            preauth:params.preauth
        };
        return commit('transaction', entry);
    }
    return null;
}

/**
 * this is the receive callback which commits the receivers half of the
 * transaction to their chain, and returns the the hash of that transaction
 * to the spender as confirmation.
*/
function receive(from, msg) {
    if (msg.to !== getMe()) {
        return null;
    }

    debug(getMe() + ' ' + JSON.stringify(msg, null, ''));

    return commit('transaction', msg);
}

/**
 * get a transaction from the DHT
 * @param {object} parameters - An object with the following properties:
 *    {string} transaction - hash of the transaction to read
 * @return {object} the transaction entry data
 */
function transactionRead(params) {
    var data = get(params.transaction);

    var transaction = null;
    if (typeof data === 'object') {
        transaction = data;
    } else {
        try {
            transaction = JSON.parse(data);
        } catch (e) {
            debug(e);
        }
    }
    return transaction;
}

/**
 * preauthorize spending on a particular proposal
 * @param {object} parameters - An object with the following properties:
 *    {string} proposal - hash of the proposal on which to preauth
 *    {float} amount - transaction amount
 * @return {string} the preauth entry hash
 */
function preauthCreate(params) {
    var entry = {
        amount: params.amount,
        payload: {proposal:params.proposal}
    };
    return commit('preauth', entry);
}

/**
 * cancel preauthorize spending on a particular proposal
 * this function will only validate if the propoal has completed and didn't pass
 * @param {object} parameters - An object with the following properties:
 *    {string} preauth - hash of the previous preauth
 * @return {string} the preauth cancel etry hash
 */
function preauthCancel(hash) {
    var preauth = get(hash,{Local:true});
    if (isErr(preauth)) return preauth;
    var entry = {
        amount: -preauth.amount,
        payload: {preauth:hash}
    };
    return commit('preauth', entry);
}

/**
 * calculate balance from history
 * @return {float} the node's balance
 */
function getBalance() {
    var me = getMe()
    , history = query({Constrain: {'EntryTypes': ["transaction","preauth"]}})
    , balance = 0;


    history.forEach(function(entry) {
        balance = adjustBalance(balance,entry.hasOwnProperty("payload")?"preauth":"transaction",entry,me);
    });

    return balance;
}

//  balance calculation functions -----------------------------------

// update balance given a preauth or transaction entry from the chain
function adjustBalance(balance,type,entry,commiter){
    switch(type) {
    case "transaction":
        var amount = entry.amount;
        var from = entry.from;
        if (entry.hasOwnProperty("preauth") && (from == entry.to)) {
            // special case for preauth funding ourselves
            balance += amount;
        } else {
            if (from === commiter) balance -= amount;
            else balance += amount;
        }
        break;
    case "preauth":
        balance -= entry.amount;
    }
    return balance;
}

function _getBalance(creditLimit) {
    var balance = 0,
        commiter = getMe(),
        entries = query({Constrain: {'EntryTypes': ["transaction","preauth"]}});
    for (var i=1;i<entries.length;i++) {
        var entry = entries[i];
        var type = entry.hasOwnProperty("payload")?"preauth":"transaction";
        balance = adjustBalance(balance,type,entry,commiter);
        if (balance < creditLimit) {
            break;
        }
    }
    return balance;
}

// utilities -----------------------------------------------

function getMe() {
    return App.Key.Hash;
}

function getCreditLimit() {
    var cl = property("creditLimit");
    return -parseInt(cl);
}

function isErr(result) {
    return ((typeof result === 'object') && result.name == "HolochainError");
}
