import { Button, Form, Alert} from 'react-bootstrap';

export default function CreateCourseForm({ formState}) {
    const {
        courseName,
        setCourseName,
        courseDescription,
        setCourseDescription,
        courseCode,
        setCourseCode,
        loading,
        registerCourse,
        userId,
        error,
    } = formState
  return (
    <>
        { error && (
            <Alert variant="info">
                <p className="mb-0">
                    {error}
                </p>
            </Alert>
        )}
        <Form.Group className="mb-3">
            <Form.Label className='fw-bold  mb-1'>Course Name *</Form.Label>
            <Form.Control 
                type="text" 
                placeholder="Enter course name" 
                value={courseName} 
                onChange={(e) => setCourseName(e.target.value)} 
            />
        </Form.Group>

        <Form.Group className="mb-3">
            <Form.Label className='fw-bold  mb-1'>Course Description *</Form.Label>
            <Form.Control 
                as="textarea" 
                rows={3} 
                placeholder="Enter course description" 
                value={courseDescription} 
                onChange={(e) => setCourseDescription(e.target.value)} 
            />
        </Form.Group>

        <Form.Group className="mb-3">
            <Form.Label className='fw-bold  mb-1'>Course Code *</Form.Label>
            <Form.Control 
                type="text" 
                placeholder="Enter course code (Ex: CS101)" 
                value={courseCode} 
                onChange={(e) => setCourseCode(e.target.value)} 
            />
        </Form.Group>

        <div className='d-flex justify-content-end'>
            <Button 
                onClick={() => registerCourse(userId)}
                disabled={loading}
                variant='primary'
                size='lg'
            >
                Register Course
            </Button>
        </div>

    </>
  )
}
