import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import CreateMcqQuestionsContent from './CreateMcqQuestions/CreateMcqQuestionsContent';
import CreateCodeQuestionsContent from './CreateCodeQuestions/CreateCodeQuestionsContent';
import CreateEssayQuestionsContent from './CreateEssayQuestions/CreateEssayQuestionsContent';

export default function CreateQuestions() {
    
    const {examId, questionType} = useParams();
    const location = useLocation();                   
    const query = new URLSearchParams(location.search);
    const question_count = query.get('question_count');
    const navigate = useNavigate();


  return (
    <>
        { questionType === "mcq" ? (
            <CreateMcqQuestionsContent examId = {examId} question_count = {question_count} />) : (questionType === "code") ? 
                (<CreateCodeQuestionsContent examId = {examId} question_count = {question_count} />) : (questionType === "essay") ? 
                    (<CreateEssayQuestionsContent examId = {examId} question_count = {question_count} />) : null
        }
    </>  
  );
}
