import connectDb from "@/db";
import User from "@/models/User";
import crypto from "crypto";

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ $and: [{ phone }, { password }] });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = crypto.randomBytes(64).toString("hex");

    await User.findOneAndUpdate(
      {
        phone
      },
      {
        $set: {
          sessionID: token,
        },
      }
    );

    
    res.setHeader("Set-Cookie", `sessionID=${token}; HttpOnly; Path=/`);
    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export default connectDb(handler);
