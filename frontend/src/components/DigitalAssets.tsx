import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Container, Row, Col, Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaPlus, FaCalendar, FaMoneyBill, FaTag, FaInfoCircle, FaUser } from 'react-icons/fa';
import { DigitalAsset } from '../types/digitalAsset';
import { assetsApi } from '../api/client';

interface DigitalAssetsProps {
  assets: DigitalAsset[];
  onAddAsset: () => void;
  onEditAsset: (asset: DigitalAsset) => void;
  onDeleteAsset: (id: number) => void;
}

interface WarrantyQuote {
  assetId: number;
  quoteAmount: number;
  providerName: string;
  validUntil: string;
}

interface CreateAssetForm {
  name: string;
  category: string;
  value: string;
  purchaseDate: string;
  userEmail: string;
  userName?: string;
}

export default function DigitalAssets() {
  const [assets, setAssets] = useState<DigitalAsset[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<DigitalAsset | null>(null);
  const [quote, setQuote] = useState<WarrantyQuote | null>(null);
  const [form, setForm] = useState<CreateAssetForm>({
    name: '',
    category: '',
    value: '0',
    purchaseDate: new Date().toISOString(),
    userEmail: '',
    userName: ''
  });

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const response = await assetsApi.list();
      setAssets(response.data);
    } catch (error) {
      console.error('Error fetching assets:', error);
    }
  };

  const fetchWarrantyQuote = async (assetId: number) => {
    try {
      const response = await assetsApi.getQuote(assetId);
      setQuote(response.data);
      fetchAssets()
    } catch (error) {
      console.error('Error fetching warranty quote:', error);
      setQuote(null);
    }
  };

  useEffect(() => {
    if (selectedAsset) {
      fetchWarrantyQuote(selectedAsset.id);
    }
  }, [selectedAsset]);

  const handleCreateAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await assetsApi.create(form);
      setAssets([...assets, response.data]);
      setShowModal(false);
      setForm({
        name: '',
        category: '',
        value: '0',
        purchaseDate: new Date().toISOString(),
        userEmail: '',
        userName: ''
      });
    } catch (error) {
      console.error('Error creating asset:', error);
    }
  };



  return (
    <Container fluid>
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="d-flex align-items-center">
              <Button variant="primary" onClick={() => setShowModal(true)}>
                <FaPlus className="me-2" />
                Add New Asset
              </Button>
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <Table responsive hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Value</th>
                <th>Purchase Date</th>
                <th>Created At</th>
                <th>User</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset) => (
                <tr key={asset.id}>
                  <td>{asset.name}</td>
                  <td>
                    <Badge bg="primary" pill>
                      {asset.category}
                    </Badge>
                  </td>
                  <td>
                    <div className="d-flex align-items-center">
                      <FaMoneyBill className="me-2" />
                      <span>${parseFloat(asset.value).toFixed(2)}</span>
                    </div>
                  </td>
                  <td>{new Date(asset.purchaseDate).toLocaleDateString()}</td>
                  <td>{new Date(asset.createdAt).toLocaleString()}</td>
                  <td>
                    <div className="d-flex align-items-center">
                      <FaUser className="me-2" />
                      <span>{asset.user?.name || 'N/A'}</span>
                    </div>
                  </td>
                  <td>
                    {asset.warrantyQuotes?.length ? (
                      <div className="d-flex gap-2">
                        {asset.warrantyQuotes.map((quote) => (
                          <div key={quote.id} className="d-flex align-items-center">
                            <FaMoneyBill className="me-2" />
                            <div>
                              <div className="fw-bold">${quote.quoteAmount.toFixed(2)}</div>
                              <div className="text-muted">{new Date(quote.validUntil).toLocaleDateString()}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="d-flex gap-2">
                        <OverlayTrigger
                          overlay={
                            <Tooltip id={`tooltip-${asset.id}`}>
                              Get Warranty Quote
                            </Tooltip>
                          }
                        >
                          <Button
                            variant="outline-info"
                            size="sm"
                            onClick={() => {
                              setSelectedAsset(asset);
                              setShowQuoteModal(true);
                            }}
                          >
                            <FaInfoCircle />
                          </Button>
                        </OverlayTrigger>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Digital Asset</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreateAsset}>
          <Modal.Body>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group controlId="formCategory" className="mt-3">
              <Form.Label>Category</Form.Label>
              {/* <Form.Control
                type="text"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                required
              /> */}
              <Form.Select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                required
              >
                <option value="">-- Select Category --</option>
                {['electronics', 'watches', 'collectibles', 'other'].map((option, idx) => (
                  <option key={idx} value={option}>
                    {option}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="formValue" className="mt-3">
              <Form.Label>Value</Form.Label>
              <Form.Control
                type="number"
                value={form.value}
                onChange={(e) => setForm({ ...form, value: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group controlId="formPurchaseDate" className="mt-3">
              <Form.Label>Purchase Date</Form.Label>
              <Form.Control
                type="date"
                value={form.purchaseDate}
                onChange={(e) => setForm({ ...form, purchaseDate: e.target.value })}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Add Asset
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Quote Modal */}
      <Modal show={showQuoteModal} onHide={() => setShowQuoteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Warranty Quote</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAsset && !quote ? (
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : quote ? (
            <div>
              <p><strong>Asset:</strong> {selectedAsset?.name}</p>
              <p><strong>Category:</strong> {selectedAsset?.category}</p>
              <p><strong>Value:</strong> {selectedAsset?.value}</p>
              <hr />
              <h5>Warranty Quote Details</h5>
              <p><strong>Provider:</strong> {quote.providerName}</p>
              <p><strong>Quote Amount:</strong> ${quote.quoteAmount.toFixed(2)}</p>
              <p><strong>Valid Until:</strong> {new Date(quote.validUntil).toLocaleDateString()}</p>
            </div>
          ) : (
            <p>Select an asset to get a quote</p>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
}
