import axios from "axios";

export const validateRecaptcha = async (token: string): Promise<boolean> => {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  if (!secretKey) throw new Error("RECAPTCHA_SECRET_KEY is not set");
  try {
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`
    );
    const data = response.data;
    // Accept only score >= 0.5 (human)
    return data.success && data.score >= 0.5;
  } catch (err) {
    console.error("Recaptcha verification error:", err);
    return false;
  }
};
