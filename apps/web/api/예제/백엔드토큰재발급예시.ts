// // Express 서버 예시 (server.ts)
// app.post("/auth/refresh", async (req, res) => {
//   const { refreshToken } = req.body;

//   // 1. Refresh Token이 없는 경우
//   if (!refreshToken) {
//     return res.status(400).json({ result: "fail", code: 400, data: null });
//   }

//   try {
//     // 2. Refresh Token 검증 (DB 조회 또는 JWT Verify)
//     const payload = verifyRefreshToken(refreshToken);

//     // 3. 새로운 Access Token 및 (선택) Refresh Token 생성
//     const newAccessToken = generateAccessToken(payload.userId);
//     const newRefreshToken = generateRefreshToken(payload.userId);

//     // 4. apiFetch 규격에 맞게 result: "success"와 함께 반환
//     return res.status(200).json({
//       result: "success",
//       code: 200,
//       data: {
//         accessToken: newAccessToken,
//         refreshToken: newRefreshToken, // Refresh Token Rotation 사용 시
//       },
//     });
//   } catch (error) {
//     // 5. 토큰이 만료되었거나 유효하지 않은 경우 401 반환 -> 클라이언트에서 자동 로그아웃됨
//     return res.status(401).json({
//       result: "fail",
//       code: 401,
//       data: null,
//       message: "Invalid or expired refresh token",
//     });
//   }
// });