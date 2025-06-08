import React from 'react';
import DigitalAssets from '../components/DigitalAssets';
import { Container, Row, Col } from 'react-bootstrap';

export default function Dashboard() {
  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <h1 className="display-4 mb-3">
            <span className="text-primary">Digital Assets</span>
          </h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <DigitalAssets />
        </Col>
      </Row>
    </Container>
  );
}