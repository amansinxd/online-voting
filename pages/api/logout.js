import connectDb from "@/db";
import User from "@/models/User";

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { sessionID } = req.body;

    if (!sessionID) {
      return res.status(400).json({ message: "Invalid session" });
    }

    await User.findOneAndUpdate(
      { sessionID },
      {
        $set: { sessionID: "" },
      }
    );

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export default connectDb(handler);
