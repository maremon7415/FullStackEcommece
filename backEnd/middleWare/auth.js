import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  // Handle both header formats
  let token = req.headers.token || req.headers.authorization;

  // Extract token from "Bearer token" format
  if (token && token.startsWith("Bearer ")) {
    token = token.slice(7);
  }

  if (!token) {
    return res.json({
      success: false,
      message: "Not Authorized, Please login again",
    });
  }

  try {
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    req.body.userId = token_decode.id;
    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export default userAuth;
