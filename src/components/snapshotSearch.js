import { Input } from "antd";
import { useState } from "react";
import snapshot from "@snapshot-labs/snapshot.js";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql
} from "@apollo/client";

const { Search } = Input;

export default function SnapshotSearch() {
  const [ loading, setLoading ] = useState(false);
  const [ skip, setSkip ] = useState(0);
  const [ proposals, setProposals ] = useState([]);

  const endpoint = 'https://hub.snapshot.org/graphql';
  const client = new ApolloClient({
    uri: endpoint,
    cache: new InMemoryCache(),
  })
  const queryGql = gql`
    query Proposals {
      proposals(
        first: 1000,
        skip: ${skip},
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
        space {
          id
          name
        }
      }
    }
  `

  const getProposals = async () => {
    var res = await client.query({
      query: queryGql,
    });
    // console.log('query result: ', res);
    while (res.data["proposals"].length === 1000) { // no more active proposals
      setProposals([...proposals, ...res.data["proposals"]]);
      setSkip(skip + 1000);
    }
  }

  const handleSearch = async (value) => {
    setLoading(true);
    var re = new RegExp(/^0x[0-9a-fA-F]{40}$/);
    if (!re.test(value)) {
      alert("address error!");
      setLoading(false);
      return;
    }
    await getProposals();
    setLoading(false);
  }

  return (
    <div style={{ width:'50%', textAlign:'center', height: '50%' }}>
      <Search
        placeholder="input your address"
        allowClear
        enterButton="Search"
        size="large"
        style={{ height: '50%' }}
        onSearch={handleSearch}
        loading={loading}
      />
    </div>
  );
};