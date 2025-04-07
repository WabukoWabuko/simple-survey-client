import React, { useState, useEffect, useCallback } from 'react'; // Add useCallback
import axios from 'axios';
import { Table, Button, Form, Pagination } from 'react-bootstrap';

function SurveyResponses() {
  const [responses, setResponses] = useState([]);
  const [page, setPage] = useState(1);
  const [emailFilter, setEmailFilter] = useState('');
  const [totalPages, setTotalPages] = useState(1);

  // Wrap fetchResponses in useCallback to make it stable
  const fetchResponses = useCallback(() => {
    axios
      .get(`http://127.0.0.1:8000/api/questions/responses/?page=${page}&email_address=${emailFilter}`)
      .then(response => {
        setResponses(response.data.question_responses);
        setTotalPages(response.data.last_page);
      })
      .catch(error => console.log(error));
  }, [page, emailFilter]); // Dependencies for fetchResponses

  useEffect(() => {
    fetchResponses();
  }, [fetchResponses]); // Now depends on fetchResponses

  const downloadCertificate = id => {
    axios
      .get(`http://127.0.0.1:8000/api/questions/responses/certificates/${id}/`, { responseType: 'blob' })
      .then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `certificate-${id}.pdf`);
        document.body.appendChild(link);
        link.click();
      })
      .catch(error => console.log(error));
  };

  return (
    <div>
      <Form.Group className="mb-3">
        <Form.Label>Filter by Email</Form.Label>
        <Form.Control
          type="email"
          value={emailFilter}
          onChange={e => setEmailFilter(e.target.value)}
        />
      </Form.Group>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Description</th>
            <th>Gender</th>
            <th>Programming Stack</th>
            <th>Certificates</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {responses.map(resp => (
            <tr key={resp.id}>
              <td>{resp.id}</td>
              <td>{resp.full_name}</td>
              <td>{resp.email_address}</td>
              <td>{resp.description}</td>
              <td>{resp.gender}</td>
              <td>{resp.programming_stack}</td>
              <td>
                {resp.certificates.map(cert => (
                  <Button key={cert.id} size="sm" onClick={() => downloadCertificate(cert.id)}>
                    Download
                  </Button>
                ))}
              </td>
              <td>{resp.date_responded}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Pagination>
        <Pagination.Prev onClick={() => setPage(page > 1 ? page - 1 : 1)} />
        <Pagination.Item>{page}</Pagination.Item>
        <Pagination.Next onClick={() => setPage(page < totalPages ? page + 1 : page)} />
      </Pagination>
    </div>
  );
}

export default SurveyResponses;
