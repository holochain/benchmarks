'use strict';

// -----------------------------------------------------------------
//  This stub Zome code file was auto-generated
// -----------------------------------------------------------------

/**
 * Called only when your source chain is generated
 * @return {boolean} success
 */
function genesis() {
  // any genesis code here
  return true;
}

// -----------------------------------------------------------------
//  validation functions for every DHT entry change
// -----------------------------------------------------------------

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
  case "owner_links":
      return validateOwnerLinks(entry.Links,sources);
      // validation code here
    default:
      // invalid entry name!!
      return false;
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


function validateOwnerLinks(links,sources) {

    // the source is the current owner
    var ownerHash = getOwner();
    if (sources[0] != ownerHash) {
        return false;
    }

    var length = links.length;
    // there should just be one or two links only
    if (length==2) {
        // if this is a modify it will have two links the first of which
        // will be the del and the second the new link.
        if (links[0].LinkAction != HC.LinkAction.Del) return false;
        if ((links[1].LinkAction != HC.LinkAction.Add)/* TODO: test for undefined only until fixed in core */&&(links[1].LinkAction !=undefined)) return false;
    } else if (length==1) {
        // if this is a new handle, there will just be one Add link
        if ((links[0].LinkAction != HC.LinkAction.Add)/* TODO: test for undefined only until fixed in core */&&(links[0].LinkAction != undefined)) return false;
    } else {return false;}
    var ownerBaseHash = ownerBase();
    for (var i=0;i<length;i++) {
        var link = links[i];
        // the base must be the ownerBase
        if (link.Base != ownerBaseHash) return false;
        // The tag name should be "owner"
        if (link.Tag != "owner") return false;
    }
    return true;
}

function validateLink(linkEntryType,baseHash,links,pkg,sources){
 //   debug("validate link: "+linkEntryType);
    if (linkEntryType=="owner_links") {
        // a valid owner is when:
        // the ownerlinks entry is correct
        if (!validateOwnerLinks(links,sources)) return false;

        // the baseHash passed in is the the baseHash in the links
        var length = links.length;
        for (var i=0;i<length;i++) {
            var link = links[i];
            // the base must be this base
            if (link.Base != baseHash) return false;
        }
        return true;
    }
    return false;
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


function transferOwnership(param) {
    var base = ownerBase();
    var linksHash = commit("owner_links",{Links:[{Base:base,Link:param.to,Tag:"owner"}]});
    return linksHash;
}

// utilities

function ownerBase() {
    return App.DNA.Hash;
}

function getMe() {
    return App.Key.Hash;
}

function isErr(result) {
    return ((typeof result === 'object') && result.name == "HolochainError");
}

function getProgenitorHash() {
    return property("progenitorHash");
}

function getProgenitorIdenity() {
    return property("progenitorIdentity");
}

function getOwner() {
    var ownerBaseHash = ownerBase();
    var links = getLinks(ownerBaseHash,"owner");
    var owner;
    if (isErr(links)) {
        links = [];
        owner = getProgenitorHash();
    } else {
        owner = links[0].Hash;
    }
    return owner;
}
