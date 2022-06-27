import { Col, Row } from "antd";

export default function SnapshotHeader() {
  const url = "https://itherunder.github.io/snapshot-explorer";
  const link = "https://github.com/itherunder"

  return (
    <div>
      <Row span={24}>
        <Col span={8}>
          <a href={url} style={{ fontSize: 40, color: "white" }}>
            <b>
              Project Snapshot☰
              <br/>
              Campaign Explorer
            </b>
          </a>
        </Col>
        <Col span={6} offset={10} style={{ textAlign: "right" }}>
          <Row span={6} style={{ height: '50%', padding: 5 }}>
            <p style={{ color: "white" }}>Made with ❤️ by Community</p>
            <a href={link} style={{ width: '100%', fontSize: 15, marginRight: 17, marginTop: -25 }}>@itherunder</a>
          </Row>
          <Row span={6} style={{ height: '50%', textAlign: "right" }}>
            <p style={{ color: "white" }}>Buy me a Coffee</p>
          </Row>
        </Col>
      </Row>
    </div>
  );
}