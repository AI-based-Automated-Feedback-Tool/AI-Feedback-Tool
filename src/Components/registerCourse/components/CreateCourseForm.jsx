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
    <div className="space-y-6">

        {/* ERROR ALERT */}
        {error && (
            <Alert variant="danger" className="mb-4">
            <p className="mb-0">{error}</p>
            </Alert>
        )}

        <div className="form-group">
            <label className="form-label">Course Name *</label>
            <input
                type="text"
                className="form-input"
                placeholder="e.g., Advanced JavaScript"
                value={courseName}
                onChange={e => setCourseName(e.target.value)}
            />
        </div>

        <div className="form-group">
            <label className="form-label">Course Description *</label>
            <textarea
                className="form-textarea"
                rows="4"
                placeholder="Brief overview of the course content and goals..."
                value={courseDescription}
                onChange={e => setCourseDescription(e.target.value)}
            />
        </div>

        <div className="form-group">
            <label className="form-label">Course Code *</label>
            <input
                type="text"
                className="form-input"
                placeholder="e.g., CS201"
                value={courseCode}
                onChange={e => setCourseCode(e.target.value)}
            />
        </div>

        <div className="text-end">
            <button
                className="action-btn"
                onClick={() => registerCourse(userId)}
                disabled={loading}
            >
                {loading ? (
                    <>
                    <span className="spinner"></span>
                    Registering...
                    </>
                ) : (
                    <>Register Course</>
                )}
            </button>
        </div>
    </div>
  )
}
