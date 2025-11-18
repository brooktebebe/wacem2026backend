import { Request, Response } from "express";
import { validateRecaptcha } from "../utils/recaptcha";
import { sendContactEmail } from "../services/mailService";
import { z, ZodError } from "zod";

const contactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(255),
  subject: z.string().min(1).max(200),
  message: z.string().min(10).max(2000),
  token: z.string(),
});

export const handleContact = async (req: Request, res: Response) => {
  try {
    const { name, email, subject, message, token } = contactSchema.parse(req.body);
    // Verify reCAPTCHA
    const recaptchaValid = await validateRecaptcha(token);
    if (!recaptchaValid) {
      return res.status(400).json({ success: false, message: "reCAPTCHA verification failed" });
    }

    // Send email
    await sendContactEmail({ name, email, subject, message });

    res.status(200).json({ success: true });
  } catch (err: unknown) {
    if (err instanceof ZodError) {
      const formattedErrors = err.format();
      return res.status(400).json({ 
        success: false, 
        message: "Invalid form data", 
        errors: formattedErrors 
      });
    }
    console.error("Contact Controller Error:", err);
    res.status(500).json({ success: false, message: "Failed to send message. Please try again later." });
  }
};
