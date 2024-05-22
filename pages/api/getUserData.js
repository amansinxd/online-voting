import connectDb from "@/db";
import User from "@/models/User";

const handler = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const sessionID = req.query.sessionID;

    if (!sessionID) {
      return res.status(400).json({ message: "Invalid session" });
    }

    const user = await User.findOne(
      { sessionID },
      { password: 0, _id: 0, __v: 0}
    );

    if (!user) {
      return res.status(400).json({ message: "Unauthorized" });
    }

    res.status(200).json({ user: user});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export default connectDb(handler);
