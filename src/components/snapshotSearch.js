import { Input, List } from "antd";
import { useEffect, useState } from "react";
import snapshot from "@snapshot-labs/snapshot.js";
import {
  ApolloClient,
  InMemoryCache,
  gql
} from "@apollo/client";
import { ListConsumer } from "antd/lib/list";

const { Search } = Input;

export default function SnapshotSearch() {
  const [ searchLoading, setSearchLoading ] = useState(false);
  const [ proposalsLoading, setProposalsLoading ] = useState(true);
  const [ proposals, setProposals ] = useState([]);

  const endpoint = 'https://hub.snapshot.org/graphql';
  const client = new ApolloClient({
    uri: endpoint,
    cache: new InMemoryCache(),
  })

  useEffect(() => {
    if (proposals.length > 0) return;
    getProposals();
  }, []);

  const getProposals = async () => {
    var res, skip = 0
    var queryGql0 = `
      query Proposals {
        proposals(
          first: 1000,
          skip: `
    var queryGql1 = `,
          where: {
            state: "active"
          },
          orderBy: "created",
          orderDirection: desc
        ) {
          id
          title
          body
          choices
          start
          end
          snapshot
          state
          author
          network
          strategies{
            name
            params
          }
          space {
            id
            name
          }
        }
      }
    `
    setProposalsLoading(true);
    var proposals_ = [];
    do {
      res = await client.query({
        query: gql(queryGql0 + skip + queryGql1),
      });
      proposals_.push(...res?.data?.proposals);
      skip += 1000;
      console.log('length: ', res?.data?.proposals?.length);
    } while (res?.data?.proposals?.length === 1000);
    // console.log(proposals_);
    setProposals(proposals_);
    setProposalsLoading(false);
  }

  const checkScores = async (address) => {
    var valid = {};
    var validProposals = [];
    var proposals_dict = {};
    for (let i = 0; i < proposals.length; i++) {
      let space = proposals[i].space.id;
      if (space in proposals_dict) {
        proposals_dict[space].push(proposals[i]);
      } else {
        proposals_dict[space] = [proposals[i]];
      }
    }

    var getScores = (space, strategies, network, voters) => {
      return snapshot.utils.getScores(
        space, strategies, network, voters
      ).then(scores => {
        // console.log(space, scores); // 500 error?
        for (let j = 0; j < scores.length; j++) {
          if (Object.keys(scores[j]).length > 0) {
            valid[space] = true;
            break;
          }
        }
      }).catch(e => {
        console.log(e);
      });
    }

    var jobs = [];
    var spaces = Object.keys(proposals_dict);
    for (let i = 0; i < spaces.length; i++) {
      var space = spaces[i];
      var proposal = proposals_dict[space][0];
      var strategies = proposal.strategies;
      var network = proposal.network;
      var voters = [address];
      jobs.push(getScores(space, strategies, network, voters));
    }
    await Promise.all(jobs);

    // console.log('valid: ', valid);
    for (let space in valid) {
      validProposals = validProposals.concat(proposals_dict[space]);
    }
    setProposals(validProposals);
  }

  const handleSearch = async (value) => {
    setProposalsLoading(true);
    setSearchLoading(true);
    var re = new RegExp(/^0x[0-9a-fA-F]{40}$/);
    if (!re.test(value)) {
      alert("error: invalid address!");
      setSearchLoading(false);
      return;
    }
    await checkScores(value);
    setSearchLoading(false);
    setProposalsLoading(false);
  }

  const shortText = (str) => {
    if (str.length <= 30) return str;
    return str.substr(0, 27) + '...';
  }

  const tsToDatetime = (ts) => {
    var a = new Date(ts * 1000);
    var year = a.getFullYear();
    var month = '0' + (a.getMonth() + 1);
    var date = '0' + a.getDate();
    var hour = '0' + a.getHours();
    var min = '0' + a.getMinutes();
    return year + '-' + month.substr(-2) + '-' + date.substr(-2) + ' ' + hour.substr(-2) + ':' + min.substr(-2);
  }

  return (
    <div style={{ width: '100%', margin: '0 auto', textAlign:'center', height: '50%' }}>
      <Search
        placeholder="input your address"
        allowClear
        enterButton="Search"
        size="large"
        // style={{ height: '50%' }}
        onSearch={handleSearch}
        loading={searchLoading}
      />
      <List
        // bordered
        dataSource={proposals}
        renderItem={item => (
          // TODO: new a component to show list item
          // TODO: shadow voted proposals, show the scores of users
          <List.Item style={{ fontWeight: "bold", textAlign: "left" }}>
            <List.Item.Meta
              title={
                <div style={{ fontSize: '2vw' }}>
                  <a href={`https://snapshot.org/#/${item?.space?.id}/proposal/${item?.id}`} target="_blank">
                    {shortText(item?.title)}
                  </a> By {item?.space?.id}
                </div>
              }
              description={<p style={{ color: "red", fontSize: '1vw' }}>From {tsToDatetime(item?.start)} To {tsToDatetime(item?.end)}</p>}
            />
          </List.Item>
        )}
        loading={proposalsLoading}
      />
    </div>
  );
};