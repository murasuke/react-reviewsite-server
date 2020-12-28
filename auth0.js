import fetch from "node-fetch";
import jwt from "express-jwt";
import jwksRsa from "jwks-rsa";

/**
 * 認証情報をチェックする(JSON Web Token)
 */
export const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://dev-06yb7-8k.jp.auth0.com/.well-known/jwks.json'
  }),
  audience: "http://localhost:3000",
  issuer: 'https://dev-06yb7-8k.jp.auth0.com/',
  algorithms: ["RS256"],
});

/**
 * ユーザ情報を取得する
 * @param {string} token 
 */
export async function getUser(token) {
  const auth0Request = await fetch(
    "https://dev-06yb7-8k.jp.auth0.com/userinfo",
    {
      headers: {
        Authorization: token,
      },
    }
  );
  return auth0Request.json();
}