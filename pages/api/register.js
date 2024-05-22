import connectDb from "@/db";
import User from "@/models/User";

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    console.log(req.body);
    const { name, phone, password, photo } = req.body;

    if (!name || !phone || !password || !photo) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (phone.length !== 10) {
      return res
        .status(400)
        .json({ message: "Phone number must be 10 digits" });
    }

    const user = await User.findOne({ phone });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    await User.create({
      name,
      phone,
      password,
      photo,
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export default connectDb(handler);
