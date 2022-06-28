import { Input, List } from "antd";
import { useEffect, useState } from "react";
import snapshot from "@snapshot-labs/snapshot.js";
import {
  ApolloClient,
  InMemoryCache,
  gql
} from "@apollo/client";

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
    var exist = {};
    var validProposals = [];
    for (let i = 0; i < proposals.length; i++) {
      var space = proposals[i].space.id;
      if (space in exist) {
        validProposals.push(proposals[i]);
        continue;
      }
      var strategies = proposals[i].strategies;
      var network = proposals[i].network;
      var voters = [address];
      var scores = await snapshot.utils.getScores(space, strategies, network, voters);
      console.log(i, space, scores); // 500 error?
      if (scores[0] > 0) {
        exist[space] = true;
        validProposals.push(proposals[i]);
      }
    }
    setProposals(validProposals);
  }

  const handleSearch = async (value) => {
    setSearchLoading(true);
    var re = new RegExp(/^0x[0-9a-fA-F]{40}$/);
    if (!re.test(value)) {
      alert("address error!");
      setSearchLoading(false);
      return;
    }
    await checkScores(value);
    setSearchLoading(false);
  }

  const shortText = (str) => {
    if (str.length <= 100) return str;
    return str.substr(0, 97) + '...';
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
          <List.Item>
            <a href={`https://snapshot.org/#/${item?.space?.id}/proposal/${item?.id}`} target="_blank">
              {shortText(item?.title)}
            </a> By {item?.space?.id}
          </List.Item>
        )}
        loading={proposalsLoading}
      />
    </div>
  );
};