import { Input } from "antd";

const { Search } = Input;


export default function SnapshotSearch() {
  return (
    <div style={{ width:'50%', textAlign:'center', height: '50%' }}>
      <Search
        placeholder="input your address"
        allowClear
        enterButton="Search"
        size="large"
        style={{ height: '50%' }}
      />
    </div>
  );
};