"use server";

export async function sendContactForm(data: {
  name: string;
  email: string;
  message: string;
}) {
  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        access_key: process.env.WEB3FORMS_ACCESS_KEY, 
        ...data,
      }),
    });

    const result = await res.json();

    if (!res.ok || result.success === false) {
      throw new Error(result.message || "Failed to send form");
    }

    return { success: true, message: "Message sent successfully!" };
  } catch (error) {
    console.error("Contact form error:", error);
    return { success: false, message: "Something went wrong. Try again later." };
  }
}
