import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'; 
import SurveyForm from './components/SurveyForm';
import SurveyResponses from './components/SurveyResponses';
import { Navbar, Nav, Container } from 'react-bootstrap';

function App() {
  return (
    <Router>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand>Survey App</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Survey Form</Nav.Link>
            <Nav.Link as={Link} to="/responses">Responses</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Container className="mt-4">
        <Routes>
          <Route exact path="/" element={<SurveyForm />} />
          <Route path="/responses" element={<SurveyResponses />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
