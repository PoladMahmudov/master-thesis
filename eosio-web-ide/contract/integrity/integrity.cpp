#include <eosio/eosio.hpp>

// file name and contract name must match
class[[eosio::contract("integrity")]] integrity : public eosio::contract {

  public:
    // using contract constructor
    using contract::contract;

    [[eosio::action]] void publish(eosio::checksum256 hash, eosio::name user, std::string uri, std::string repo_uri) {
        // asserts that the account executing
        // the transaction equals the provided value
        require_auth(user);

        // instantiate a table
        // get_self() function passes the name of this contract
        // get_first_receiver() ("scope") ensures the uniqueness of the table within this contract
        resource_index resources(get_self(), 0);

        // Check hash by searching secondary index
        // https://developers.eos.io/manuals/eosio.cdt/latest/group__multiindex/#function-get_index-1
        auto idx = resources.get_index<"by.hash"_n>();
        auto itr = idx.find(hash);
        eosio::check(itr == idx.end(), "Resource was already published!");

        // Check resource URI
        eosio::check(!uri.empty(), "Resource URI must be defined");

        // Check repo URI
        eosio::check(!repo_uri.empty(), "Code repository URI must be defined");

        // Create an ID
        uint64_t id = std::max(resources.available_primary_key(), 1'000'000'000ull);

        // Create a record in the table using the multi_index
        // get_self() the "payer" of this record who pays the storage usage
        // and callback fnc
        resources.emplace(get_self(), [&](auto& row) {
            row.id       = id;
            row.hash     = hash;
            row.user     = user;
            row.uri      = uri;
            row.repo_uri = repo_uri;
        });
    };

  private:
    struct [[eosio::table("resources")]] resource {
        uint64_t           id;
        eosio::checksum256 hash; // use secondary multi_index with eosio::checksum256
        eosio::name        user;
        std::string        uri;
        std::string        repo_uri;

        // https://eosio.stackexchange.com/questions/4116/how-to-use-checksum256-secondary-index-to-get-table-rows
        uint64_t           primary_key() const { return id; }
        eosio::checksum256 by_hash() const { return hash; }
    };

    typedef eosio::multi_index<
        "resources"_n, resource, eosio::indexed_by<"by.hash"_n, eosio::const_mem_fun<resource, eosio::checksum256, &resource::by_hash>>>
        resource_index;
};
