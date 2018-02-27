'use strict';

/**
 * Called only when your source chain is generated
 * @return {boolean} success
 */
function genesis() {
    var me = getMe();
    var owner = getOwner();

    // if the owner is me, then I am the progenitor so add me as the founding member
    if (owner == getMe()) {
        addMember({address:App.Key.Hash,name:"founder"});
        changeVotingRules(getInitialRules());
    }
  // any genesis code here
  return true;
}

// -----------------------------------------------------------------
//  validation functions for every DHT entry change
// -----------------------------------------------------------------

function validate(entryName, entry, header, pkg, sources) {
    switch(entryName) {
    case "member":
        // only the owner can add members
        var owner = getOwner();
        if (sources[0]!= owner) return false;
        return true;
    case "rules":
        // only the owner can change the rules
        var owner = getOwner();
        if (sources[0]!= owner) return false;
        return true;
    case "proposal":
        var member = isMember(sources[0]);
        if (member == null) return false;
        return true;
    case "completion":
        var rules = getVotingRules();
        var status = votingStatus(entry.proposal);
        return validateCompletion(status,rules,entry);
    case "vote":
        // voter can only vote on their own behalf
        var voter = sources[0];
        if (entry.voter != voter) return false;

        // only members can vote
        member = isMember(voter);
        if (member == null) return false;

        // proposal should exist and be a proposal
        if (!proposalExists(entry.proposal)) return false;

        // you can only vote once
        var links = getLinks(entry.proposal,"vote",{Load:true});
        if (isErr(links)) {
            links = [];
        }

        for(var i=0;i<links.length;i++) {
            if (links[i].Source == voter) return false;
        }
        return true;
    default:
        return false;
    }
}

function validateMemberLinks(links,sources) {
    // only owners can add members
    var owner = getOwner();
    if (sources[0]!= owner) return false;

    // TODO: more validation of the links here:
    return true;
}

function validateRulesLinks(links,sources) {
    // only owners can change the rules
    var owner = getOwner();
    if (sources[0]!= owner) return false;

    // TODO: more validation of the links here:
    return true;
}

function validateProposalLinks(links,sources) {
    // only members can make proposals
    var member = isMember(sources[0]);
    if (member == null) return false;

    // TODO: more validation of the links here:
    return true;
}


function validateVoteLinks(links,sources) {
    // only members can vote
    var member = isMember(sources[0]);
    if (member == null) return false;

    // TODO: more validation of the links here:
    return true;
}

function completionExists(proposalHash) {
    var lks = getLinks(proposalHash,"completion");
    if (!isErr(lks)) {
        return true;
    }
    return false;
}

function validateCompletionLinks(links,sources) {
    // only one link
    if (links.length != 1) return false;

    // tag must be completion
    if (links[0].Tag != "completion") return false;

    var proposalHash = links[0].Base;
    // you can only add a completion if it isn't already there
    if (completionExists(proposalHash)) return true;

    // proposal should exist and be a proposal
    if (!proposalExists(proposalHash)) return false;

    return true;
}

function validateFundingLinks(links,sources) {
    // only one link
    if (links.length != 1) return false;
    // tag must be fund
    if (links[0].Tag != "fund") return false;

    var proposalHash = links[0].Base;
    // proposal should exist and be a proposal
    if (!proposalExists(proposalHash)) return false;

    var preauthHash = links[0].Link;
    // link should be an existing preauth
    var preauth = get(preauthHash,{GetMask:HC.GetMask.All});
    if (isErr(preauth)) return false;
    if (preauth.EntryType != "preauth") return false;
    var entry = preauth.Entry;
    if (entry.payload.proposal!=proposalHash) return false;
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
    case "member_links":
        return validateMemberLinks(entry.Links,sources);
    case "rules_links":
        return validateRulesLinks(entry.Links,sources);
    case "proposal_links":
        return validateProposalLinks(entry.Links,sources);
    case "vote_links":
        return validateVoteLinks(entry.Links,sources);
    case "completion_links":
        return validateCompletionLinks(entry.Links,sources);
    case "funding_links":
        return validateFundingLinks(entry.Links,sources);
        return true;
    default:
        return validate(entryName,entry,header,pkg,sources);
    }
}

/**
 * Called to validate any changes to the DHT
 * @param {string} entryName - the name of entry being modified
 * @param {*}entry - the entry data to be set
 * @param {?} header - ?
 * @param {?} pkg - ?
 * @param {?} sources - ?
 * @return {boolean} is valid?
 */
function validatePut (entryName, entry, header, pkg, sources) {
    return validate(entryName,entry,header,pkg,sources);
}

/**
 * Called to validate any changes to the DHT
 * @param {string} entryName - the name of entry being modified
 * @param {*} entry- the entry data to be set
 * @param {?} header - ?
 * @param {*} replaces - the old entry data
 * @param {?} pkg - ?
 * @param {?} sources - ?
 * @return {boolean} is valid?
 */
function validateMod (entryName, entry, header, replaces, pkg, sources) {
  switch (entryName) {
    case "sampleEntry":
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
function validateDel (entryName,hash, pkg, sources) {
  switch (entryName) {
    case "sampleEntry":
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
  return null;
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

function validateLinkPkg(entry_type) { return null;}


function validateLink(linkEntryType,baseHash,links,pkg,sources){
    //   debug("validate link: "+linkEntryType);
    switch(linkEntryType) {
    case "member_links":
        if (!validateMemberLinks(links,sources)) return false;
        return true;
    case "proposal_links":
        if (!validateProposalLinks(links,sources)) return false;
        return true;
    case "vote_links":
        if (!validateVoteLinks(links,sources)) return false;
        return true;
    case "rules_links":
        if (!validateRulesLinks(links,sources)) return false;
        return true;
    case "completion_links":
        if (!validateCompletionLinks(links,sources)) return false;
        return true;
    case "funding_links":
        if (!validateFundingLinks(links,sources)) return false;
        return true;
    default:
        return false;
    }
}

/**
 * Check if a proposal exists
 * @param {string} hash - the hash of the proposal
 * @return {boolean} true if it exists, false if not
 */
function proposalExists(hash) {
    var proposal = get(hash,{GetMask:HC.GetMask.EntryType});
    if (isErr(proposal)) return false;
    if (proposal != "proposal") return false;
    return true;
}

/**
 * Check if a given agent public key hash is a member of this congress
 * @param {string} address - the hash of the public key of the agent in question
 * @return {boolean} true if yes, false if not
 */
function isMember(address) {
    var links = getLinks(getDirectoryBase(),"member",{Load:true});
    if (isErr(links)) {
        links = [];
    }
    for(var i=0;i<links.length;i++) {
        if (links[i].Entry.address == address) {
            return links[i].Hash;
        }
    }
    return null;
}

/**
 * Return a list of members of this congress
 * @return {Object[]} an array of member entries
 */
function getMembers() {
    return getLinksEntries(getDirectoryBase(),"member");
}

/**
 * Get the votes that have been made on a given proposal (or any other base)
 * @param {string} hash - the hash of the proposal (or other base)
 * @return {Object[]} an array of vote entires
 */
function getVotes(hash) {
    return getLinksEntries(hash,"vote");
}

/**
 * Get the voting rules for this congress
 * @return {Object[]} an array of rule entires
 */
function getVotingRules() {
    var rules = getLinksEntries(getRulesBase(),"rules");
    return rules[0];
}

/**
 * Get all the proposals
 * @return {Object[]} an array of rule entires
 */
function getProposals(base) {
    return getLinksEntries(getProposalBase(),"proposal",true);
}


/**
 * Add a member to the congress
 * @param {Object} parameters - An object with the following properties:
 *      {string} address - the hash of the public key of the new member
 *      {string} name - The member's display name
 * @return {string} hash of the member entry
 */
function addMember(params) {
    var memberEntry = {address:params.address,name:params.name,memberSince:new Date+""};
    var memberHash = commit("member",memberEntry);
    if (!isErr(memberHash)) {
        // create two link entries- one on the directory base for an easy way to get all members
        // another on the member entry for easy validation of their membership
        commit("member_links",{Links:[{Base:getDirectoryBase(),Link:memberHash,Tag:"member"},
                                      {Base:params.address,Link:memberHash,Tag:"member"}]});
    }
    return memberHash;
}

/**
 * Remove a member from the congress
 * @param {string} memberHash - the hash of the public key of the member to remove
 * @return {string} an array of vote entires
 */
function removeMember(memberHash) {
    // remove links from both the directory and the member entry
    return commit("member_links",{Links:[{Base:getDirectoryBase(),Link:memberHash,Tag:"member",LinkAction:HC.LinkAction.Del},
                                         {Base:memberHash,Link:memberHash,Tag:"member",LinkAction:HC.LinkAction.Del}]});
}

/**
 * Create a new proposal
 * @param {Object} parameters - An object with the following properties:
 *      {string} description - the description of the proposal that users will see
 *      {string=} recipient - optional recipient of currency
 *      {number=} amount - optional amount of currency
 * @return {string} hash of the member entry
 */
function newProposal(params) {
    var proposalsBaseHash = getProposalBase();
    var proposalEntry = {
        description:params.description,
        recipient:params.recipient,
        amount:params.amount,
        votingDeadline:params.votingDeadline /* TODO: get rid of this, and calculate based on rules */
    };

    var proposalHash = commit("proposal",proposalEntry);
    if (!isErr(proposalHash)) {
        commit("proposal_links",{Links:[{Base:proposalsBaseHash,Link:proposalHash,Tag:"proposal"},
                                        {Base:getMe(),Link:proposalHash,Tag:"proposal"}]});
    }
    return proposalHash;
}

/**
 * Submit a vote on a proposal
 * @param {Object} parameters - An object with the following properties:
 *      {string} proposal - the hash of the proposal entry
 *      {boolean} inSupport - is this an affirmative vote?
 *      {string=} justification - optional justification text
 * @return {string} hash of the member entry
 */
function vote(params) {
    var me = getMe();
    var voteEntry = {
        proposal:params.proposal,
        inSupport:params.inSupport,
        justification:params.justification,
        voter:me
    };
    var voteHash = commit("vote",voteEntry);
    if (!isErr(voteHash)) {
        // store two links to the vote - one on the proposal entry for easy counting,
        // another on the member entry for easy vote history retreival
        commit("vote_links",{Links:[{Base:params.proposal,Link:voteHash,Tag:"vote"},
                                    {Base:me,Link:voteHash,Tag:"vote"}]});
    }
    return voteHash;
}

function votingStatus(proposal) {
    var votes = getVotes(proposal);
    var numberOfVotes = votes.length;
    var currentResult = 0;
    for (var i=0;i<numberOfVotes;i++) {
        currentResult += votes[i].inSupport ? 1 : -1;
    }
    var status ={excecuted:completionExists(proposal),numberOfVotes:numberOfVotes,currentResult:currentResult};
    return status;
}

function changeVotingRules(param){
    var rulesEntry = {
        minimumQuorum:param.minimumQuorum,
        debatingPeriodInMinutes:param.debatingPeriodInMinutes,
        majorityMargin:param.majorityMargin
    };
    var rulesHash = commit("rules",rulesEntry);
    if (!isErr(rulesHash)) {
        var base = getRulesBase();
        var links = [{Base:base,Link:rulesHash,Tag:"rules"}];
        var current_rules = getLinks(base,"rules");
        if (!isErr(current_rules)) {
            links.push({Base:base,Link:current_rules[0].Hash,Tag:"rules",LinkAction:HC.LinkAction.Del});
        }
        var linkHash = commit("rules_links",{Links:links});
    }
    return rulesHash;
}

function validateCompletion(status,rules,entry) {
    if (status.numberOfVotes < rules.minimumQuorum) return false;
    if (status.excecuted) return false;
    return true;
}

function executeProposal(proposal) {
    var status = votingStatus(proposal);
    var rules = getVotingRules();

    var passed = status.currentResult > rules.majorityMargin;
    var fundingParams = [];

    if (passed) {
        var links = getLinks(proposal,"fund",{Load:true});
        if (!isErr(links) && links.length > 0) {
            for (var i=0;i<links.length;i++) {
                var funding = links[i].Entry;
                var params = {
                    role:"receiver",
                    amount: funding.amount,
                    from: links[i].Source,
                    description: "funding from proposal:"+proposal,
                    preauth: links[i].Hash
                };
                fundingParams.push(params);
            }
        }
    }

    var completionEntry = {
        passed:passed,
        proposal:proposal
    };

    if (!validateCompletion(status,rules,completionEntry)) {
        return {"message":"Completion Validation Failed","name":"HolochainError"};
    }

    var completionHash = commit("completion",completionEntry);
    if (!isErr(completionHash)) {
        commit("completion_links",{Links:[{Base:proposal,Link:completionHash,Tag:"completion"}]});

        // if the proposal passed and includes funding, execute the transactions
        if (passed) {
            for (var i=0;i<fundingParams.length;i++) {
                var preauthHash = call('transactions','transactionCreate',fundingParams[i]);
            }
        }
    }
    return completionHash;
}

function fundProposal(params) {
    var preauthHash = call('transactions','preauthCreate',params);
    preauthHash = JSON.parse(preauthHash);
    if (!isErr(preauthHash)) {
        commit("funding_links",{Links:[{Base:params.proposal,Link:preauthHash,Tag:"fund"}]});
    }
    return preauthHash;
}


// utilities -----------------------------------------------

function getDirectoryBase() {
    return App.DNA.Hash;
}

function getProposalBase() {
    return App.DNA.Hash;
}

function getRulesBase() {
    return App.DNA.Hash;
}

function getMe() {
    return App.Key.Hash;
}

function isErr(result) {
    return ((typeof result === 'object') && result.name == "HolochainError");
}

function getOwner() {
    var owner = JSON.parse(call("owned","getOwner",{}));
    return owner;
}

function getInitialRules() {
    return {minimumQuorum:100,debatingPeriodInMinutes:1000,majorityMargin:50};
}

function getLinksEntries(baseHash,tag,addHash) {
    var links = getLinks(baseHash,tag,{Load:true});
    if (isErr(links)) {
        links = [];
    }
    var entries = [];
    for (var i=0;i<links.length;i++) {
        var entry = links[i].Entry;
        if (addHash) {
            entry.hash = links[i].Hash;
        }
        entries.push(entry);
    }
    return entries;
}
