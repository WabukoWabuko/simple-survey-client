import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Form, Card, Col, Row } from 'react-bootstrap';

function SurveyForm() {
  const [questions, setQuestions] = useState([]);
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [files, setFiles] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/questions/')
      .then(response => setQuestions(response.data))
      .catch(error => console.log(error));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const nextStep = () => {
    if (questions[step].required === 'yes' && !formData[questions[step].name]) {
      alert('This field is required!');
      return;
    }
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const submitForm = () => {
    const data = new FormData();
    for (let key in formData) {
      data.append(key, formData[key]);
    }
    for (let file of files) {
      data.append('certificates', file);
    }
    axios.put('http://127.0.0.1:8000/api/responses/create/', data)
      .then(() => alert('Submitted!'))
      .catch(error => console.log(error));
  };

  if (questions.length === 0) return <p>Loading...</p>;

  if (step === questions.length) {
    return (
      <Card>
        <Card.Body>
          <h3>Preview</h3>
          {Object.keys(formData).map(key => (
            <p key={key}>{key}: {formData[key]}</p>
          ))}
          <p>Certificates: {files.length} files selected</p>
          <Button onClick={submitForm}>Submit</Button>
        </Card.Body>
      </Card>
    );
  }

  const question = questions[step];
  return (
    <Card>
      <Card.Body>
        <h3>Question {step + 1}/{questions.length}</h3>
        <Form>
          <Form.Group>
            <Form.Label>{question.text}</Form.Label>
            {question.type === 'short_text' || question.type === 'email' ? (
              <Form.Control
                type={question.type === 'email' ? 'email' : 'text'}
                name={question.name}
                onChange={handleChange}
                required={question.required === 'yes'}
              />
            ) : question.type === 'long_text' ? (
              <Form.Control
                as="textarea"
                name={question.name}
                onChange={handleChange}
                required={question.required === 'yes'}
              />
            ) : question.type === 'choice' ? (
              question.options.multiple === 'yes' ? (
                question.options.map(opt => (
                  <Form.Check
                    type="checkbox"
                    label={opt.value}
                    name={question.name}
                    value={opt.value}
                    onChange={e => {
                      const values = formData[question.name] ? formData[question.name].split(',') : [];
                      if (e.target.checked) values.push(e.target.value);
                      else values.splice(values.indexOf(e.target.value), 1);
                      setFormData({ ...formData, [question.name]: values.join(',') });
                    }}
                  />
                ))
              ) : (
                <Form.Select name={question.name} onChange={handleChange} required={question.required === 'yes'}>
                  <option value="">Select</option>
                  {question.options.map(opt => (
                    <option key={opt.id} value={opt.value}>{opt.value}</option>
                  ))}
                </Form.Select>
              )
            ) : question.type === 'file' ? (
              <Form.Control type="file" multiple onChange={handleFileChange} required={question.required === 'yes'} />
            ) : null}
          </Form.Group>
          <Row className="mt-3">
            <Col>
              {step > 0 && <Button onClick={prevStep}>Previous</Button>}
            </Col>
            <Col>
              <Button onClick={nextStep}>Next</Button>
            </Col>
          </Row>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default SurveyForm;
