#include <assurer.hpp>

/**
 *  Resource publish action
 */
ACTION assurer::publish(const checksum256 hash, const name user, const string& uri, const string& repo_uri) {
  // asserts that the account executing
  // the transaction equals the provided value
  require_auth(user);

  // instantiate a table
  // get_self() function passes the name of this contract
  // get_self().value ensures the uniqueness of the table within this contract
  resources_index resource_table(get_self(), get_self().value);

  // Check hash by searching secondary index
  // https://developers.eos.io/manuals/eosio.cdt/latest/group__multiindex/#function-get_index-1
  auto idx = resource_table.get_index<"by.hash"_n>();
  auto itr = idx.find(hash);
  check(itr == idx.end(), "Resource was already published!");

  // Check resource URI
  check(!uri.empty(), "Resource URI must be defined");
  check(uri.size() <= 2048, "Resource URI size must be less than 2048 characters");

  // Check repo URI
  check(!repo_uri.empty(), "Code repository URI must be defined");
  check(repo_uri.size() <= 2048, "Code repository URI must be less than 2048 characters");

  // Create an ID
  const uint64_t id = max(resource_table.available_primary_key(), 1'000'000'000ull);

  // Create a record in the table using the multi_index
  // get_self() the "payer" of this record who pays the storage usage
  // and callback fnc
  resource_table.emplace(get_self(), [&](auto& row) {
    row.id       = id;
    row.hash     = hash;
    row.user     = user;
    row.uri      = uri;
    row.repo_uri = repo_uri;
  });
}

/**
 *  Report post action
 */
ACTION assurer::post(const checksum256 resource_hash, const name user, const string& report_uri, const string& title, const string& description, const bool& verdict) {
  // asserts that the account executing
  // the transaction equals the provided value
  require_auth(user);

  // Check hash by searching secondary index
  // fail if resource doesn't exist
  resources_index resource_table(get_self(), get_self().value);
  auto idx = resource_table.get_index<"by.hash"_n>();
  idx.get(resource_hash, "Resource wasn't published yet!");

  // Check report URI
  check(!report_uri.empty(), "Report URI must be defined");
  check(report_uri.size() <= 2048, "Report URI must be less than 2048 characters");

  // Check title
  check(!title.empty(), "Title of a report must be given");
  check(title.size() <= 1024, "Title of a report must be less than 1024 characters");

  // Check description
  check(!description.empty(), "Brief description of a report must be given");
  check(description.size() <= 4000, "Brief description of a report must be less than 4000 characters");

  // instantiate a table
  // get_self() function passes the name of this contract
  // get_self().value ensures the uniqueness of the table within this contract
  reports_index report_table(get_self(), get_self().value);

  // Create a record in the table using the multi_index
  // get_self() the "payer" of this record who pays the storage usage
  // and callback fnc
  report_table.emplace(get_self(), [&](auto& row) {
    row.id            = report_table.available_primary_key();
    row.resource_hash = resource_hash;
    row.user          = user;
    row.report_uri    = report_uri;
    row.title         = title;
    row.description   = description;
    row.verdict       = verdict;
    row.created_on    = now();
    row.expires_on    = now() + THREE_MONTHS_IN_SECONDS;
    row.ratio         = 0.0f;
  });
};

ACTION assurer::vote(const uint64_t& report_id, const name voter, const bool& vote) {
  // authenticate user - voter
  require_auth(voter);

  // check report exist
  reports_index report_table(get_self(), get_self().value);
  auto& report = report_table.get(report_id, "Report doesn't exist");

  // Check still possible to vote
  check(!report.is_expired(), "Cannot vote on an expired report");

  // insert vote
  votes_index vote_table(get_self(), get_self().value);
  upsert_vote(vote_table, report_id, voter, [&](auto& row) {
    row.vote = vote;
  });
}

ACTION assurer::unvote(const uint64_t& report_id, const name voter) {
  // authenticate user
  require_auth(voter);

  // check report exist
  reports_index report_table(get_self(), get_self().value);
  auto& report = report_table.get(report_id, "Report doesn't exist");

  if (report.is_expired()) {
    check(report.can_be_cleaned_up(), "Cannot unvote on an report review within its freeze period");
  }

  // check vote exist
  votes_index vote_table(get_self(), get_self().value);
  auto idx = vote_table.get_index<"by.report"_n>();
  auto vote_key = compute_by_report_key(report_id, voter);
  auto itr = idx.find(vote_key);
  check(itr != idx.end(), "No vote exists for given report_id/voter pair");

  // remove vote
  vote_table.erase(*itr);
}

ACTION assurer::clean(const uint64_t& report_id, const uint64_t& max_count) {
  reports_index report_table(get_self(), get_self().value);
  auto& report = report_table.get(report_id, "Report doesn't exist");
  check(report.can_be_cleaned_up(), "Report must be approved and expired for at least 3 days prior to running clean");
  
  votes_index vote_table(get_self(), get_self().value);
  auto idx = vote_table.get_index<"by.report"_n>();

  auto vote_key_lower_bound = compute_by_report_key(report_id, name(0x0000000000000000));
  auto vote_key_upper_bound = compute_by_report_key(report_id, name(0xFFFFFFFFFFFFFFFF));

  auto lower_itr = idx.lower_bound(vote_key_lower_bound);
  auto upper_itr = idx.upper_bound(vote_key_upper_bound);

  uint64_t count = 0;
  while (count < max_count && lower_itr != upper_itr) {
    lower_itr = idx.erase(lower_itr);
    count++;
  }
}

ACTION assurer::expire(const uint64_t& report_id) {
  reports_index report_table(get_self(), get_self().value);
  auto& report = report_table.get(report_id, "Report doesn't exist");

  check(!report.is_expired(), "Report is already expired");
  check(report.can_be_expired(), "Report can't be expired within a week after creation");

  auto reporter = report.user;
  require_auth(reporter);

  votes_index vote_table(get_self(), get_self().value);
  float ratio = calc_ratio(vote_table, report.id);

  report_table.modify(report, reporter, [&](auto& row) {
    row.expires_on = now();
    row.ratio      = ratio;
  });
}

// Helper
void assurer::upsert_vote(votes_index& vote_table, const uint64_t& report_id, const name voter, const function<void(votes&)> updater) {
  auto idx = vote_table.get_index<"by.report"_n>();
  auto vote_key = compute_by_report_key(report_id, voter);

  auto itr = idx.find(vote_key);
  if (itr == idx.end()) {
    vote_table.emplace(voter, [&](auto& row) {
      row.id = vote_table.available_primary_key();
      row.report_id = report_id;
      row.voter = voter;
      row.updated_at = now();
      updater(row);
    });
  } else {
    idx.modify(itr, voter, [&](auto& row) {
      row.updated_at = now();
      updater(row);
    });
  }
}

float assurer::calc_ratio(votes_index& vote_table, const uint64_t& report_id) {
  auto idx = vote_table.get_index<"by.report"_n>();

  auto vote_key_lower_bound = compute_by_report_key(report_id, name(0x0000000000000000));
  auto vote_key_upper_bound = compute_by_report_key(report_id, name(0xFFFFFFFFFFFFFFFF));

  auto lower_itr = idx.lower_bound(vote_key_lower_bound);
  auto upper_itr = idx.upper_bound(vote_key_upper_bound);

  int32_t positives = 0;
  int32_t negatives = 0;

  while (lower_itr != upper_itr) {
    lower_itr->vote ? positives++ : negatives++;
    lower_itr++;
  }

  return positives / (positives + negatives);
}

EOSIO_DISPATCH(assurer, (publish)(post))
