import { useState, useEffect } from 'react';
import { uploadAttachment } from "../service/createEssayQuestionService"; 
import { useRef } from 'react';
import { supabase } from "../../../../SupabaseAuth/supabaseClient"; 
import { createEssayQuestion } from "../service/createEssayQuestionService"; 
import { useNavigate} from 'react-router-dom';
import { generateEssayQuestion } from '../service/createEssayQuestionService';

export default function useEssayQuestionCreation(examId, question_count) {
    const [userId, setUserId] = useState(null);
    const [question, setQuestion] = useState([]);
    const [questionText, setQuestionText] = useState("");
    const [attachments, setAttachments] = useState(null);
    const [wordLimit, setWordLimit] = useState("");
    const [points, setPoints] = useState("");
    const [gradingNotes, setGradingNotes] = useState("");
    const [error, setError] = useState({});
    const [showEditQuestion, setShowEditQuestion] = useState(false);
    const [editQuestionIndex, setEditQuestionIndex] = useState(null);
    const [loading, setLoading] = useState(false);
    const [warning, setWarning] = useState(null)

    //Ai question generation states 
    const [topic, setTopic] = useState("");
    const [difficultyLevel, setDifficultyLevel] = useState("Easy");
    const [guidance, setGuidance] = useState("");
    const [keyConcepts, setKeyConcepts] = useState("");
    const [doNotInclude, setDoNotInclude] = useState("");
    const [wordLimitAI, setWordLimitAI] = useState("");
    const [pointsAI, setPointsAI] = useState("");
    const [noOfQuestion, setNoOfQuestion] = useState("");
    const [gradingNotesAI, setGradingNotesAI] = useState("");

    const fileInputRef = useRef(null);

    const navigate = useNavigate();

    useEffect(() => {
            const getUserId = async () => {
                const { data, error } = await supabase.auth.getUser();
                if (error) {
                    setErrors("Failed to get user ID");
                } else {
                    setUserId(data.user.id);
                }
            }
            getUserId();
        }, []);

    //To check allowed file type attached
    const allowedFileTypes = ['image/png', 'image/jpeg', 'application/pdf', 'application/msword', 'video/mp4', 'audio/mpeg'];

    // Validate the question text
    const validate = () => {
        const newError = {}
        if (!questionText.trim()) {
            newError.questionText = "Question is required.";
        }
        if(!points || isNaN(points) || points <= 0) {
            newError.points = "Points are required and must be a positive number.";
        }
        if(!gradingNotes.trim()) {
            newError.gradingNotes = "Grading notes are required.";
        }
        if(isNaN(wordLimit) || wordLimit <= 0) {
            newError.wordLimit = "Word limit must be a positive number.";
        }
        if (attachments && !allowedFileTypes.includes(attachments.type)) {
            newError.attachments = "Invalid file type. Please upload a valid file.";
        }
        if (Object.keys(newError).length > 0){
            setError(newError);
            return false;
        }
        // Clear errors if everything is valid
        setError({});
        return true;
    }
    // Reset the form fields
    const resetForm = () => {
        setQuestionText("");
        setAttachments(null);
        setWordLimit("");
        setPoints("");
        setGradingNotes("");
        setError({});
        if (fileInputRef.current) {
            fileInputRef.current.value = null;
        }
    }

    // Function to handle saving the question
    const onSaveQuestion = async() => {
        const isValid = validate();
        if (!isValid) {
            return; // Don't proceed if there are validation errors
        }

        if (question.length >= parseInt(question_count)) {
            setWarning(`You can only add ${question_count} questions.`);
            return false;
        }
        let uploadedUrl = null;
        if(attachments) {
            try {
                const result = await uploadAttachment(attachments);

                if (result?.url?.publicUrl) {
                    uploadedUrl = result.url.publicUrl;
                } else {
                    throw new Error(result.message || "Invalid upload response");
                }

            } catch (err) {
                setError(prevError => ({
                    ...prevError,
                    attachments: "Failed to upload attachment. Please try again."
                }));
                return;
            }            
        }
        
        const newQuestion = {
            question_text: questionText,
            attachment_url: uploadedUrl,
            word_limit: wordLimit,
            points: points,
            grading_note: gradingNotes,
        }
        
        const newQuestionsList = [...question, newQuestion]
        setQuestion(newQuestionsList);
        // Show warning if limit reached now
        if (newQuestionsList.length === parseInt(question_count)) {
            setWarning(`You have reached the limit of ${question_count} questions.`);
        } else {
            setWarning(null);
        }
        resetForm();
        return true;
    }

    // Function to handle deleting a question
    const handleDeleteQuestion = (index) => {
        const updatedQuestions = [...question];
        updatedQuestions.splice(index, 1);
        setQuestion(updatedQuestions);
    };

    // Function to handle editing a question
    const handleEditQuestion = (index) => {
        setEditQuestionIndex(index);
        setShowEditQuestion(true);
    };

    // Function to save changes after editing a question
    const handleSaveChanges = (updatedQuestion) => {
        const updatedQuestions = [...question];
        updatedQuestions[editQuestionIndex] = updatedQuestion;
        setQuestion(updatedQuestions);
        setShowEditQuestion(false);
        setEditQuestionIndex(null);
    };

    const saveAllQuestions = async () => {
        setLoading(true);
        setError({});
        try {
            for (const q of question) {
                const payload = {
                    question_text: q.question_text,
                    attachment_url: q.attachment_url,
                    word_limit: Number(q.word_limit),
                    points: Number(q.points),
                    grading_note: q.grading_note,
                    exam_id: examId,
                    user_id: userId
                };
                await createEssayQuestion(payload);
            }
            setQuestion([]);
            resetForm();
            //setWarning("");
            alert("All questions saved successfully!");
            navigate("/teacher"); // Redirect to teacher dashboard
        } catch (error) {
            console.error("Error saving questions:", error);
            setError(
                {message: "Failed to connect to server. Please check your connection and try again."}
            );
        } finally {
            setLoading(false);
        }
    }


    const isDisabled = () =>{
        if (question.length >= parseInt(question_count)) {
            return true
        }
        return false
    }

    // Function to generate questions using AI
    const generateQuestion = async () => {
        try {
            const params = {
                topic: topic,
                difficultyLevel: difficultyLevel,
                guidance: guidance,
                keyConcepts: keyConcepts,
                doNotInclude: doNotInclude,
                wordLimitAI: wordLimitAI,
                pointsAI: pointsAI,
                noOfQuestion: noOfQuestion,
                gradingNotesAI: gradingNotesAI
            };
            const data = await generateEssayQuestion(params);
            console.log("Generated Essay Questions:", data);
        } catch (error) {
            console.error("Error generating essay questions:", error);
        }
    }
    return {
        question,
        examId,
        questionText,
        attachments,
        wordLimit,
        points,
        gradingNotes,
        setQuestionText,
        setAttachments, 
        setWordLimit,
        setPoints,
        setGradingNotes,
        error,
        onSaveQuestion ,
        fileInputRef,
        handleDeleteQuestion,
        handleEditQuestion,
        editQuestionIndex,
        showEditQuestion,
        setShowEditQuestion,
        handleSaveChanges,
        validate,
        resetForm,
        setError,
        saveAllQuestions,
        loading,
        warning,
        isDisabled,
        topic,
        setTopic,
        difficultyLevel,
        setDifficultyLevel,
        guidance,
        setGuidance,
        keyConcepts,
        setKeyConcepts,
        doNotInclude,
        setDoNotInclude,
        wordLimitAI,
        setWordLimitAI,
        pointsAI,
        setPointsAI,
        noOfQuestion,
        setNoOfQuestion,
        gradingNotesAI,
        setGradingNotesAI,
        generateQuestion
    };
}
