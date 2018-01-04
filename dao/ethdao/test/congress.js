import {expect} from 'chai';
const Congress = artifacts.require('./Congress.sol');
const debug = false;
contract('Congress', (accounts) => {
    let owner = accounts[0];
    let congress;
    let totalGas = 0;
    let inc = (receipt) => {if (debug) console.log("gas used: "+receipt.gasUsed);totalGas += receipt.gasUsed;};
    let implementer = accounts[9];

    beforeEach(async () => {
        console.log("owner balance:",web3.eth.getBalance(owner));
    });

    describe('benchmark dao scenario',  () => {
        it('should run the benchmarks', async() => {

            congress = await Congress.new(20, 120, 10);

            // get the gas for the contract deploy
            let x = web3.eth.getTransactionReceipt(congress.transactionHash);
            if (debug) console.log("congress create: ",x);
            inc(x);


            let minimumQuorumForProposals = 2;
            let minutesForDebate = 0;
            let marginOfVotesForMajority = 0;

            x = await congress.changeVotingRules(minimumQuorumForProposals, minutesForDebate, marginOfVotesForMajority);
            if (debug) console.log("\nchangeVotingRules:",x);
            inc(x.receipt);

            let partyaMembers = 4;
            let partybMembers = 3;

            // add party a members
            for(let i=1;i<=partyaMembers;i++) {
                let x = await congress.addMember(accounts[i],"partyaMember"+parseInt(i));
                if (debug) console.log("\naddMember a: ",x);
                inc(x.receipt);
            }

            // add party b members
            for(let i=1;i<=partybMembers;i++) {
                let x = await congress.addMember(accounts[partyaMembers+i],"partybMember"+parseInt(i));
                if (debug) console.log("\naddMember b: ",x);
                inc(x.receipt);
            }

            let proposalSizeKBytes = 0;
            let proposalTxt = "";
            for(let i=1;i<=1024*proposalSizeKBytes;i++) {
                proposalTxt += "0";

            }

            // all members of party a make a proposal and fund it
            for(let i=1;i<=partyaMembers;i++) {
                let x = await congress.newProposal(implementer,1234,proposalTxt,[],{from:accounts[i]});
                if (debug) console.log("\nnewProposal: ",x);
                inc(x.receipt);

                console.log("congress balance:",web3.eth.getBalance(congress.address));
                x = await congress.send(1234,{from:accounts[i]});
                inc(x.receipt);
                console.log("congress balance:",web3.eth.getBalance(congress.address));
            }

            // party a members vote in favor of all the partya proposals
            for(let i=0;i<partyaMembers;i++) {
                for(let j=1;j<=partyaMembers;j++) {
                    x = await congress.vote(i,true,"I vote yes down the party line",{from:accounts[j]});
                    if (debug) console.log("\nvote: ",x);
                    inc(x.receipt);
                }
            }

            // party b members vote against of all the partya proposals
            for(let i=0;i<partyaMembers;i++) {
                for(let j=1;j<=partybMembers;j++) {
                    x = await congress.vote(i,false,"I vote no down the party line",{from:accounts[partyaMembers+j]});
                    if (debug) console.log("\nvote: ",x);
                    inc(x.receipt);
                }
            }

            // complete proposal
            for(let i=0;i<partyaMembers;i++) {
                x = await congress.executeProposal(i,[],{from:implementer});
                console.log("implementer balance:",web3.eth.getBalance(implementer));
                if (debug) console.log("\nexcecuteProposal: ",x);
                inc(x.receipt);
            }

            console.log("\n\nTotal Gas Used:"+parseInt(totalGas));

        });
    });


});
