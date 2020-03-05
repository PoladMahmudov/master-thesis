#include <eosio/eosio.hpp>

// file name and contract name must match
class[[eosio::contract("reliability")]] reliability : public eosio::contract {

  public:
    // using contract constructor
    using contract::contract;

    // define publish action for report
    [[eosio::action]] void publish(eosio::checksum256 resource_hash, eosio::name user, std::string report_uri, std::string description, bool verdict) {
        // asserts that the account executing
        // the transaction equals the provided value
        require_auth(user);

        // instantiate a table
        // get_self() function passes the name of this contract
        // get_first_receiver() ("scope") ensures the uniqueness of the table within this contract
        report_index reports(get_self(), 0);

        // TODO: Check hash by searching secondary index
        // fail if resource doesn't exist

        // Check report URI
        eosio::check(!report_uri.empty(), "Report URI must be defined");

        // Check description
        eosio::check(!description.empty(), "Brief description of a report must be given");

        // Create an ID
        uint64_t id = std::max(reports.available_primary_key(), 1'000'000'000ull);

        // Create a record in the table using the multi_index
        // get_self() the "payer" of this record who pays the storage usage
        // and callback fnc
        reports.emplace(get_self(), [&](auto& row) {
            row.id            = id;
            row.resource_hash = resource_hash;
            row.user          = user;
            row.report_uri    = report_uri;
            row.description   = description;
            row.verdict       = verdict;
        });
    };

  private: 
    struct [[eosio::table("reports")]] report {
        uint64_t           id;
        eosio::checksum256 resource_hash; // use secondary multi_index with eosio::checksum256
        eosio::name        user;
        std::string        report_uri;
        std::string        description;
        bool               verdict; // final verdict

        uint64_t           primary_key() const { return id; }
        eosio::checksum256 by_resource_hash() const { return resource_hash; }
    };

    typedef eosio::multi_index<
        "reports"_n, report, eosio::indexed_by<"by.res.hash"_n, eosio::const_mem_fun<report, eosio::checksum256, &report::by_resource_hash>>>
        report_index;
};
