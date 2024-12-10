import nodemailer from "nodemailer";

export const sendEmailController = async (req, res) => {
  const { name, phone, email, company, messege } = req.body;
  console.log(req.body);
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "saktimangandaralam@gmail.com",
        pass: "{man94nD4r4AL4m}",
      },
    });
    // opsi email
    const mailOption = {
      from: email,
      to: "saktimangandaralam@gmail.com",
      subject: `New email message form ${name}.`,
      text: `
      Name: ${name}
      Email: ${email}
      Phone number: ${phone}
      Company: ${company}
      Messege: ${messege}`,
    };

    // send email
    await transporter.sendMail(mailOption);
    res.status(201).json({
      status: "success",
      messege: "Email successfully sending!",
    });
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).send("Failed to send email.");
      }
      console.log("Email sent:", info.response);
      res.status(200).send("Email sent successfully.");
    });
  } catch (error) {
    console.error(
      `[server error] an error occurred: ${error},\n [DETAIL]: ${error.stack}`
    );
    res.status(500).json({
      status: "failed",
      messege: `Internal server error: ${error.messege}`,
    });
  }
};
