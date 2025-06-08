import { useState, useEffect } from "react";
import { getLanguages } from "../service/createCodeQuestionService";

const useFetchLanguages = (setGlobalError) => {
    const [languages, setLanguages] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);

        getLanguages()
            .then(data => {
                setLanguages(data);
            })
            .catch(error => {
                setGlobalError(error.message || "Failed to fetch languages");
            })
            .finally(() => setLoading(false));
    }, []);
    return { languages, loading };
}
export default useFetchLanguages;