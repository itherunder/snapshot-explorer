import { Col, Row } from "antd";

export default function SnapshotHeader() {
  const url = "https://itherunder.github.io/snapshot-explorer";
  const link = "https://github.com/itherunder"

  return (
    <div>
      {/* <Row span={24} style={{ height: "25vh" }}> */}
      <Row span={24}>
        <Col span={10}>
          {/* <a href={url} style={{ fontSize: 40, color: "white" }}> */}
          <a href={url} style={{ width: '100%', fontSize: '3vw', color: "black", fontWeight: "bold", textAlign: 'left' }}>
            <p>
              Project Snapshot☰
              <br/>
              Campaign Explorer
            </p>
          </a>
        </Col>
        <Col span={8} offset={6}>
          {/* <Row span={8} style={{ width: '100%', textAlign: 'right', fontWeight: "bold" }}> */}
          <div style={{ textAlign: "right" }}>
            <p style={{ width: '100%', fontSize: '1.5vw', fontWeight: "bold" }}>
              Made with ❤️ by Community
              <br/>
              <a href={link} style={{ width: '100%', fontSize: '1vw', textAlign: "right" }}>
                @itherunder
              </a>
              <p style={{ width: '100%', color: "black", textAlign: 'right', fontSize: "2vw", fontWeight: "bold" }}>
                Buy me a Coffee☕
              </p>
            </p>
          </div>
        </Col>
      </Row>
    </div>
  );
}