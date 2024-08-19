import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email }: { email: string } = body;

  // Create a transporter object using the SMTP transport
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT as string, 10), // Convert to number
    secure: parseInt(process.env.SMTP_PORT as string, 10) === 465, // Use SSL for port 465
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const userId = user.id;
    const info = await transporter.sendMail({
      from: process.env.SMTP_USER, // Sender emai
      to: user?.email, // Recipient email
      subject: "Password Reset Request", // Subject line
      html: ` <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #dddddd; border-radius: 10px;">
      <h2 style="text-align: center; color: #333;">Password Reset Request</h2>
      <p style="color: #555;">Hello,</p>
      <p style="color: #555;">
        We received a request to reset your password. Click the button below to reset your password. If you did not request this change, you can safely ignore this email.
      </p>
      <div style="text-align: center; margin: 20px 0;">
        <a href="${process.env.APP_URL}/en/reset-password?userid=${userId}" style="background-color: #007bff; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
      </div>
      <p style="color: #555;">
        If the button above doesn't work, you can also reset your password by clicking the link below:
      </p>
      
      <p style="color: #555;">Thank you,</p>
      <p style="color: #555;">The Bean Beats Team</p>
    </div>`, // HTML version of the email
    });

    return NextResponse.json({
      message: "Email sent successfully",
      messageId: info.messageId,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ message: "Error sending email" });
  }
}
