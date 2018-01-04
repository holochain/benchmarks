import Promise from 'bluebird'
require('coffee-script/register')
process.env.NODE_ENV = 'test'

global.Promise = Promise

export const contractShouldThrow = (description, functionToCall, options, expectedErrorMessage = null) => {
  contractIt(description, (done) => {
    Promise.resolve().then(functionToCall
    ).then(() => {
      throw new Error('Expected solidity error to be thrown from contract, but was not')
    }).catch((error) => {
      expectedErrorMessage = expectedErrorMessage || /VM Exception while processing transaction: revert|VM Exception while processing transaction: invalid opcode/
      if (!error.message || error.message.search(expectedErrorMessage) < 0) throw error
    }).then(done).catch(done)
  }, options)
}

export const contractShouldThrowOnly = (description, functionToCall) => {
  contractShouldThrow(description, functionToCall, {only: true})
}

export const contractShouldThrowIfEtherSent = (functionToCall, opts) => {
  contractShouldThrow('should throw an error if ether is sent', functionToCall, opts,
    /Cannot send value to non-payable function|VM Exception while processing transaction: invalid opcode|VM Exception while processing transaction: revert/)
}

export const contractShouldThrowIfEtherSentOnly = (functionToCall) => {
  contractShouldThrowIfEtherSent(functionToCall, {only: true})
}

export const contractShouldThrowForNonOwner = (functionToCall, opts) => {
  contractShouldThrow('should throw an error for non-owner', () => {
    return functionToCall()
  }, opts)
}

export const contractShouldThrowForNonOwnerOnly = (functionToCall) => {
  contractShouldThrowForNonOwner(functionToCall, {only: true})
}

export const contractItOnly = (name, func) => {
  contractIt(name, func, {only: true})
}

export const contractIt = (name, func, options) => {
  options = options || {}
  contract('', () => {
    describe('Contract:', function() {
      this.timeout(3000)
      if (options.only) {
        it.only(name, func)
      } else if (options.pending) {
        xit(name, func)
      } else {
        it(name, func)
      }
    })
  })
}

export const firstEvent = (events) => {
  return new Promise((resolve, reject) => {
    events.watch((error, log) => {
      if (error) {
        reject(error)
      } else {
        events.stopWatching()
        resolve(log)
      }
    })
  })
}
