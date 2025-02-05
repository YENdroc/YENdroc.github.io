const fetch = require("node-fetch");

exports.handler = async () => {
    const FORM_NAME = "comment-form"; // Your Netlify form name
    const NETLIFY_API = `https://api.netlify.com/api/v1/forms?access_token=${process.env.NETLIFY_AUTH_TOKEN}`;

    try {
        // Fetch all forms
        let response = await fetch(NETLIFY_API);
        let forms = await response.json();

        // Find the correct form by name
        let form = forms.find(f => f.name === FORM_NAME);
        if (!form) {
            return { statusCode: 404, body: "Form not found" };
        }

        // Fetch submissions for this form
        response = await fetch(`https://api.netlify.com/api/v1/forms/${form.id}/submissions?access_token=${process.env.NETLIFY_AUTH_TOKEN}`);
        let submissions = await response.json();

        // Return comments as JSON
        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(submissions),
        };
    } catch (error) {
        return { statusCode: 500, body: error.toString() };
    }
};