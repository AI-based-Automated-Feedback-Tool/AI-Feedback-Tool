import { Form } from 'react-bootstrap';

export default function CreateCourseForm() {
  return (
    <>
        <Form.Group className="mb-3">
            <Form.Label className='fw-bold  mb-1'>Course Name *</Form.Label>
            <Form.Control type="text" placeholder="Enter course name" />
        </Form.Group>

        <Form.Group className="mb-3">
            <Form.Label className='fw-bold  mb-1'>Course Description *</Form.Label>
            <Form.Control as="textarea" rows={3} placeholder="Enter course description" />
        </Form.Group>

        <Form.Group className="mb-3">
            <Form.Label className='fw-bold  mb-1'>Course Code *</Form.Label>
            <Form.Control type="text" placeholder="Enter course code (Ex: CS101)" />
        </Form.Group>
    </>
  )
}
