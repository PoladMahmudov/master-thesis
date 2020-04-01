<h1 class="contract">publish</h1>
---
spec-version: 0.0.2
title: Publish
summary: This action will publish new web resource entry to resources table. Hash of the resource, server URI and version control repository URI must be provided.
---

<h1 class="contract">post</h1>
---
spec-version: 0.0.2
title: Post
summary: This action will post a new audit report on web resource entry to reports table. Hash of the resource, full report URI, brief description of the report and final verdict on security level must be provided.
---

## Description

`post` creates a report on-chain with the intention of receiving
votes from any community members who wish to cast a `vote`.

Each report shall be identified with a unique `report_id`.

An expiry will be defined in `expires_on`, with {{ expires_on }}
being no later than 3 months in the future.

{{ user }} - reporter must pay for the RAM to store votes, which
will be returned to them once `clean` has been called.

<h1 class="contract">clean</h1>
---
spec-version: 0.0.2  
title: Clean  
summary: This action is used to clear the RAM being used to store all information related to report. All associated votes can be cleared from the RAM of reporter.  
---

## Description

This action is used to clear the RAM being used to store all information related to
{{ report_id }}. All associated votes can be cleared from the RAM of {{ user }} - reporter.

This action can be called by any user, requiring no authorization.

This action can only be called 72 hours after {{ expires_on }} has been reached.
{{ expires_on }} is set at the moment that {{ report_id }} is created, and can
only be updated by {{ user }}. This will allow time to compute a tally of all
associated votes before it can be cleared.

The user who calls `clean` will pay the CPU and NET bandwidth required
to process the action. They will need to specify `max_count` to ensure that the
action can be processed within a single block's maximum allowable limits.

<h1 class="contract">expire</h1>
---
spec-version: 0.0.2
title: Expire
summary: Expire report by finalyzing its validation.
---

## Description

`expire` can only be called by {{ user }} - reporter.

`expire` is used to modify the value of `expires_on` to the current time at which the action is called.
It also calculates the final vote ratio `positive / all` and store them inside {{ ratio }} of a report.  
Once `expire` has been called, no more `vote` actions will be accepted for {{ report_id }}. 
Votes can be cleared from RAM 72 hours after {{ user }} has called the `expire` action.

<h1 class="contract">unvote</h1>
---
spec-version: 0.0.2
title: Unvote
summary: Unvote the report, which was previously voted.
---

## Description

`unvote` allows a user to remove their vote of {{ vote }} they have previously
cast on {{ report_id }}.

`unvote` will not function during the 72 hour period after
{{ report_id }} has expired at {{ expires_on }}.

The RAM that was used to store the vote shall be freed-up immediately
after `unvote` has been called by {{ voter }}.

<h1 class="contract">vote</h1>
---
spec-version: 0.0.2
title: Vote
summary: Vote for the report while it hasn't expired.
---

## Description
The {{ voter }}s can cast a vote of {{ vote }} on {{ report_id }}. To change the vote, they may call another `vote` action, with only the most recent `vote` of {{ vote }} value being the `vote`, which {{ voter }} intend to be considered as valid. They acknowledge that using the `unvote` action after placing a `vote` will render the previous `vote` of {{ vote_value }} null and void. 
If {{ voter }}s, they are not the beneficial owner of these tokens, they stipulate that they have proof that they’ve been authorized to vote these tokens by their beneficial owner(s).

