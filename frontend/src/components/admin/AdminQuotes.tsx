import { useState, useEffect } from 'react';
import { Table, Container, Row, Col, Card, Badge, Pagination } from 'react-bootstrap';
import api from '../../api/client';

interface WarrantyQuote {
  id: number;
  assetId: number;
  quoteAmount: number;
  providerName: string;
  validUntil: string;
  createdAt: string;
  asset: {
    name: string;
    category: string;
    value: number;
    purchaseDate: string;
    user: {
      name: string;
      email: string;
    };
  };
}

export default function AdminQuotes() {
  const [quotes, setQuotes] = useState<WarrantyQuote[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const quotesPerPage = 10;

  const fetchQuotes = async () => {
    try {
      const response = await api.get(`/admin/quotes?page=${currentPage}&limit=${quotesPerPage}`);
      setQuotes(response.data.quotes);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching quotes:', error);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, [currentPage]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <Container fluid>
      <Row>
        <Col>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h2 className="mb-0 text-primary">Warranty Quotes</h2>
            </Card.Header>
            <Card.Body>
              <div className="table-responsive">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Asset</th>
                      <th>Category</th>
                      <th>Value</th>
                      <th>Quote Amount</th>
                      <th>Valid Until</th>
                      <th>User</th>
                      <th>Created At</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quotes.map((quote) => (
                      <tr key={quote.id}>
                        <td>{quote.asset.name}</td>
                        <td>
                          <Badge bg="primary" pill>
                            {quote.asset.category}
                          </Badge>
                        </td>
                        <td>{quote.asset.value ? `$${Number(quote.asset.value).toFixed(2)}` : ""}</td>
                        <td>{quote.quoteAmount ? `$${Number(quote.quoteAmount).toFixed(2)}` : ""}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            {quote.validUntil ? new Date(quote.validUntil).toLocaleDateString() : ""}
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div>
                              <div className="fw-bold">{quote.asset.user.name}</div>
                              <div className="text-muted">{quote.asset.user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            {quote.createdAt ? new Date(quote.createdAt).toLocaleString() : ""}
                          </div>
                        </td>
                        <td>
                          {quote.quoteAmount ?
                            <Badge bg="success" pill>
                              Valid quote
                            </Badge>
                            :
                            <Badge bg="warning" pill>
                              No valid quote
                            </Badge>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-3">
                  <Pagination>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Pagination.Item
                        key={page}
                        active={page === currentPage}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </Pagination.Item>
                    ))}
                  </Pagination>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
