//API service to fetch programming languages
export const getLanguages = async () => {
    const res = await fetch(`http://localhost:5000/api/createCodeQuestions/languages`);
    const data = await res.json();
    if (res.ok) {
        return data.languages;
    } else {
        throw new Error(data.message || "Failed to fetch languages");
    }
}