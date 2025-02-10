import * as jose from "jose";

export const secretKey = new TextEncoder().encode(
  process.env.REACT_APP_JWT_SECRET
);

export const signJwt = async (subject: string, payload: jose.JWTPayload) => {
  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(subject)
    .setIssuedAt()
    .setIssuer(process.env.REACT_APP_BASE_URL as string)
    .setExpirationTime("1h")
    .sign(secretKey);
};
