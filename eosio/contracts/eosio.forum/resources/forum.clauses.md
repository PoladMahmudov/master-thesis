<h1 class="clause">Vote Tallying Parameters</h1>

A `vote` cast through this contract shall have its weight determined by the staked value on the `voters` table. It shall not be subject to any vote strength calculation (as in `last_vote_weight` for example). 

A `vote` cast through a proxy shall have a weight equal to the sum of its staked value on the `voters` table, as well as all accounts proxying their `vote` towards said proxy. If one of the accounts proxying their weight towards a proxy's account should also cast a `vote` on the same proposal, then their weight shall be deducted from the proxy's weight. 

The weight of a `vote` shall be updated based on the changes to the staked value of the account on the `voters` table.

<h1 class="clause">Parameters</h1>
Implied parameters:

- _**name**_ (name of the party invoking and signing the contract)

<h1 class="clause">Intent</h1>
INTENT. The intention of the author and the invoker of this contract is to print output. It shall have no other effect.

<h1 class="clause">Term</h1>
TERM. This Contract expires at the conclusion of code execution.

<h1 class="clause">Warranty</h1>
WARRANTY. {{ name }} shall uphold its Obligations under this Contract in a timely and workmanlike manner, using knowledge and recommendations for performing the services which meet generally acceptable standards set forth by EOSIO Blockchain Block Producers.

<h1 class="clause">Default</h1>
DEFAULT. The occurrence of any of the following shall constitute a material default under this Contract:

<h1 class="clause">Remedies</h1>
REMEDIES. In addition to any and all other rights a party may have available according to law, if a party defaults by failing to substantially perform any provision, term or condition of this Contract, the other party may terminate the Contract by providing written notice to the defaulting party. This notice shall describe with sufficient detail the nature of the default. The party receiving such notice shall promptly be removed from being a Block Producer and this Contract shall be automatically terminated.

<h1 class="clause">Force Majeure</h1>
FORCE MAJEURE. If performance of this Contract or any obligation under this Contract is prevented, restricted, or interfered with by causes beyond either party's reasonable control ("Force Majeure"), and if the party unable to carry out its obligations gives the other party prompt written notice of such event, then the obligations of the party invoking this provision shall be suspended to the extent necessary by such event. The term Force Majeure shall include, without limitation, acts of God, fire, explosion, vandalism, storm or other similar occurrence, orders or acts of military or civil authority, or by national emergencies, insurrections, riots, or wars, or strikes, lock-outs, work stoppages, or supplier failures. The excused party shall use reasonable efforts under the circumstances to avoid or remove such causes of non-performance and shall proceed to perform with reasonable dispatch whenever such causes are removed or ceased. An act or omission shall be deemed within the reasonable control of a party if committed, omitted, or caused by such party, or its employees, officers, agents, or affiliates.

<h1 class="clause">Dispute Resolution</h1>
DISPUTE RESOLUTION. Any controversies or disputes arising out of or relating to this Contract will be resolved by binding arbitration under the default rules set forth by the EOSIO Blockchain. The arbitrator's award will be final, and judgment may be entered upon it by any court having proper jurisdiction.

<h1 class="clause">Entire Agreement</h1>
ENTIRE AGREEMENT. This Contract contains the entire agreement of the parties, and there are no other promises or conditions in any other agreement whether oral or written concerning the subject matter of this Contract. This Contract supersedes any prior written or oral agreements between the parties.

<h1 class="clause">Severability</h1>
SEVERABILITY. If any provision of this Contract will be held to be invalid or unenforceable for any reason, the remaining provisions will continue to be valid and enforceable. If a court finds that any provision of this Contract is invalid or unenforceable, but that by limiting such provision it would become valid and enforceable, then such provision will be deemed to be written, construed, and enforced as so limited.

<h1 class="clause">Amendment</h1>
AMENDMENT. This Contract may be modified or amended in writing by mutual agreement between the parties, if the writing is signed by the party obligated under the amendment.

<h1 class="clause">Governing Law</h1>
GOVERNING LAW. This Contract shall be construed in accordance with the Maxims of Equity.

<h1 class="clause">Notice</h1>
NOTICE. Any notice or communication required or permitted under this Contract shall be sufficiently given if delivered to a verifiable email address or to such other email address as one party may have publicly furnished in writing, or published on a broadcast contract provided by this blockchain for purposes of providing notices of this type.

<h1 class="clause">Waiver of Contractual Right</h1>
WAIVER OF CONTRACTUAL RIGHT. The failure of either party to enforce any provision of this Contract shall not be construed as a waiver or limitation of that party's right to subsequently enforce and compel strict compliance with every provision of this Contract.

<h1 class="clause">Arbitrator's Fees to Prevailing Party</h1>
ARBITRATOR’S FEES TO PREVAILING PARTY. In any action arising hereunder or any separate action pertaining to the validity of this Agreement, both sides shall pay half the initial cost of arbitration, and the prevailing party shall be awarded reasonable arbitrator's fees and costs.

<h1 class="clause">Construction and Interpretation</h1>
CONSTRUCTION AND INTERPRETATION. The rule requiring construction or interpretation against the drafter is waived. The document shall be deemed as if it were drafted by both parties in a mutual effort.

<h1 class="clause">In Witness Whereof</h1>
IN WITNESS WHEREOF, the parties hereto have caused this Agreement to be executed by themselves or their duly authorized representatives as of the date of execution, and authorized as proven by the cryptographic signature on the transaction that invokes this contract.
