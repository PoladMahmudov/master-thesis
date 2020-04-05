#include <eosio/eosio.hpp>
#include <eosio/system.hpp>

using std::string;
using std::max;
using std::function;
using eosio::checksum256;
using eosio::name;
using eosio::check;
using eosio::current_time_point;
using eosio::multi_index;
using eosio::indexed_by;
using eosio::const_mem_fun;
using eosio::contract;

CONTRACT assurer : public contract {
  public:
    using contract::contract;

    ACTION publish(
      const checksum256 hash, 
      const name        user, 
      const string&     uri, 
      const string&     repo_uri
    );

    ACTION post(
      const checksum256 resource_hash, 
      const name        user, 
      const string&     report_uri, 
      const string&     title,
      const string&     description, 
      const bool&       verdict
    );

    ACTION vote(
      const uint64_t& report_id,
      const name      voter,
      const bool&     vote
    );

    ACTION unvote(
      const uint64_t& report_id,
      const name      voter
    );

    ACTION expire(
      const uint64_t& report_id
    );

    ACTION clean(
      const uint64_t& report_id, 
      const uint64_t& max_count
    );

  private:
    // 3 days in seconds (Computation: 3 days * 24 hours * 60 minutes * 60 seconds)
    constexpr static uint32_t FREEZE_PERIOD_IN_SECONDS = 3 * 24 * 60 * 60;
    // 3 months in seconds (Computatio: 3 months * average days per month * 24 hours * 60 minutes * 60 seconds)
    constexpr static uint32_t THREE_MONTHS_IN_SECONDS = (uint32_t) (3 * (365.25 / 12) * 24 * 60 * 60);
    // a week in seconds (Computatio: week * 7 days * 24 hours * 60 minutes * 60 seconds)
    constexpr static uint32_t WEEK_IN_SECONDS = (uint32_t) (7 * 24 * 60 * 60);

    static uint32_t now() {
      return current_time_point().sec_since_epoch();
    }

    static uint128_t compute_by_report_key(const uint64_t report_id, const name voter) {
        return ((uint128_t) voter.value) << 64 | report_id;
    }

    TABLE resources {
      uint64_t    id;
      checksum256 hash; // use secondary multi_index with eosio::checksum256
      name        user;
      string      uri;
      string      repo_uri;

      uint64_t    primary_key() const { return id; }
      checksum256 by_hash() const { return hash; }
    };

    typedef multi_index<
        "resources"_n, resources, 
        indexed_by<"by.hash"_n, const_mem_fun<resources, checksum256, &resources::by_hash>>
    > resources_index;

    TABLE reports {
      uint64_t    id;
      checksum256 resource_hash; // use secondary multi_index with eosio::checksum256
      name        user;
      string      report_uri;
      string      title;
      string      description;
      bool        verdict; // final verdict
      uint32_t    created_on; // timestamp
      uint32_t    expires_on; // timestamp
      float       ratio; // votes ration after exparation

      uint64_t    primary_key() const { return id; }
      checksum256 by_resource_hash() const { return resource_hash; }

      bool can_be_expired() const { return now() >= created_on + WEEK_IN_SECONDS; }
      bool is_expired() const { return now() >= expires_on; }
      bool can_be_cleaned_up() const { return now() > (expires_on + FREEZE_PERIOD_IN_SECONDS);  }
    };

    typedef multi_index<
        "reports"_n, reports, 
        indexed_by<"by.res.hash"_n, const_mem_fun<reports, checksum256, &reports::by_resource_hash>>
    > reports_index;

    TABLE votes {
      uint64_t id;
      uint64_t report_id;
      name     voter;
      bool     vote;
      uint32_t updated_at;

      uint64_t primary_key() const { return id; }
      uint64_t by_report() const { return report_id; }
      uint128_t by_report_voter() const { return assurer::compute_by_report_key(report_id, voter); }
    };

    typedef eosio::multi_index<
        "votes"_n, votes,
        indexed_by<"by.report"_n, const_mem_fun<votes, uint64_t, &votes::by_report>>,
        indexed_by<"by.rep.voter"_n, const_mem_fun<votes, uint128_t, &votes::by_report_voter>>
    > votes_index;

    void upsert_vote(
      votes_index& vote_table, 
      const uint64_t& report_id, 
      const name voter, 
      const function<void(votes&)> updater
    );

    float calc_ratio(
      votes_index& vote_table, 
      const uint64_t& report_id
    );
};
