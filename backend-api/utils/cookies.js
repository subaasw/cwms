export const TOKEN_KEY = "access_token";

export const setCookie = (res, token) => {
  res.cookie(TOKEN_KEY, token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  });
};

export const clearCookie = (res) => {
  res.cookie(TOKEN_KEY, "", {
    httpOnly: true,
    expires: new Date(0),
    secure: true,
    sameSite: "none",
  });
};
