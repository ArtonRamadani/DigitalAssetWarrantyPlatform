import { Container, Row, Col } from 'react-bootstrap';
import AdminQuotes from '../components/admin/AdminQuotes';

export default function Admin() {
  return (
    <Container fluid>
      <Row>
        <Col>
          <AdminQuotes />
        </Col>
      </Row>
    </Container>
  );
}