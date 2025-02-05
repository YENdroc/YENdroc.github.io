import fetch from "node-fetch";

export async function handler() {
    const FORM_NAME = "comment-form";
    const NETLIFY_API = `https://api.netlify.com/api/v1/forms?access_token=${process.env.NETLIFY_AUTH_TOKEN}`;

    try {
        let response = await fetch(NETLIFY_API);
        let forms = await response.json();

        let form = forms.find(f => f.name === FORM_NAME);
        if (!form) {
            return { statusCode: 404, body: JSON.stringify([]) }; // Always return an array
        }

        response = await fetch(`https://api.netlify.com/api/v1/forms/${form.id}/submissions?access_token=${process.env.NETLIFY_AUTH_TOKEN}`);
        let submissions = await response.json();

        if (!Array.isArray(submissions)) {
            return { statusCode: 200, body: JSON.stringify([]) }; // Ensure an array is returned
        }

        // Extract only the useful data
        const formattedComments = submissions.map(sub => ({
            name: sub.data.name || "Anonymous",
            comment: sub.data.comment || ""
        }));

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formattedComments),
        };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify([]) }; // Return an empty array on failure
    }
}