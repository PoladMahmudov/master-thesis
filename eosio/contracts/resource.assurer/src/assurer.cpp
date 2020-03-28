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
ACTION assurer::post(const checksum256 resource_hash, const name user, const string& report_uri, const string& description, const bool& verdict) {
  // asserts that the account executing
  // the transaction equals the provided value
  require_auth(user);

  // Check hash by searching secondary index
  // fail if resource doesn't exist
  resources_index resource_table(get_self(), get_self().value);
  auto idx = resource_table.get_index<"by.hash"_n>();
  auto itr = idx.find(resource_hash);
  check(itr != idx.end(), "Resource wasn't published yet!");

  // Check report URI
  check(!report_uri.empty(), "Report URI must be defined");
  check(report_uri.size() <= 2048, "Report URI must be less than 2048 characters");

  // Check description
  check(!description.empty(), "Brief description of a report must be given");
  check(description.size() <= 4000, "Brief description of a report must be less than 4000 characters");

  // instantiate a table
  // get_self() function passes the name of this contract
  // get_self().value ensures the uniqueness of the table within this contract
  reports_index report_table(get_self(), get_self().value);

  // Create an ID
  uint64_t id = max(report_table.available_primary_key(), 1'000'000'000ull);

  // Create a record in the table using the multi_index
  // get_self() the "payer" of this record who pays the storage usage
  // and callback fnc
  report_table.emplace(get_self(), [&](auto& row) {
      row.id            = id;
      row.resource_hash = resource_hash;
      row.user          = user;
      row.report_uri    = report_uri;
      row.description   = description;
      row.verdict       = verdict;
  });
};

EOSIO_DISPATCH(assurer, (publish)(post))
