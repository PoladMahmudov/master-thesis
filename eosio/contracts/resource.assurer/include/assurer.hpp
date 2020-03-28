#include <eosio/eosio.hpp>

using std::string;
using std::max;
using eosio::checksum256;
using eosio::name;
using eosio::check;
using eosio::multi_index;
using eosio::indexed_by;
using eosio::const_mem_fun;
using eosio::contract;

CONTRACT assurer : public contract {
  public:
    using contract::contract;

    ACTION publish(
      const checksum256 hash, 
      const name user, 
      const string& uri, 
      const string& repo_uri
    );

    ACTION post(
      const checksum256 resource_hash, 
      const name user, 
      const string& report_uri, 
      const string& description, 
      const bool& verdict
    );

  private:
    TABLE resources {
      uint64_t    id;
      checksum256 hash; // use secondary multi_index with eosio::checksum256
      name        user;
      string      uri;
      string      repo_uri;

      uint64_t    primary_key() const { return id; }
      checksum256 by_hash() const { return hash; }
    };

    TABLE reports {
      uint64_t    id;
      checksum256 resource_hash; // use secondary multi_index with eosio::checksum256
      name        user;
      string      report_uri;
      string      description;
      bool        verdict; // final verdict

      uint64_t    primary_key() const { return id; }
      checksum256 by_resource_hash() const { return resource_hash; }
    };

    typedef multi_index<
        "resources"_n, resources, 
        indexed_by<"by.hash"_n, const_mem_fun<resources, checksum256, &resources::by_hash>>
    > resources_index;

    typedef multi_index<
        "reports"_n, reports, 
        indexed_by<"by.res.hash"_n, const_mem_fun<reports, checksum256, &reports::by_resource_hash>>
    > reports_index;
};
